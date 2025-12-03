import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Space, Typography, Select, Tabs, Row, Col, Alert } from 'antd';
import { useWriteContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { TokenInfo } from './erc20Token';
import { formatBalance } from '@dapp/utils/formatBalance';
import { useAllContractConfigs, useSupportedTokens, ContractName } from '@/dapp/contractsConfig';

const { Text } = Typography;
const { Option } = Select;

type ActiveButton = 'wrap' | 'unwrap' | 'deposit' | 'withdraw' | null;

export interface SecretTokenWrapProps {
    tokens: TokenInfo[];
}

interface TokenPair {
    erc20: TokenInfo;
    secret: TokenInfo | null;
    secretContractAddress: `0x${string}` | null;
    isNativeROSE: boolean; // 是否为原生 ROSE -> wROSE.S
}

/**
 * Secret Token Wrap Component
 * 
 * 1. 普通的ERC20 Token -> Secret Token （包含了wROSE的wrap和unwrap功能）
 * function wrap(uint256 amount) external
 * function unwrap(uint256 amount) external
 * 
 * 2. 原生的ROSE代币 -> wROSE.S, 比普通的ERC20 Token多一个deposit和withdraw功能，因为原生代币需要先转换为wROSE，然后才能转换为wROSE.S
 * function deposit() external payable
 * function withdraw(uint256 amount) external
 */
const SecretTokenWrap: React.FC<SecretTokenWrapProps> = ({ tokens }) => {
    const { writeContract, status, isPending } = useWriteContract();
    const { address } = useAccount();
    const allContracts = useAllContractConfigs();
    const supportedTokens = useSupportedTokens();

    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    const [wrapAmount, setWrapAmount] = useState<string>('');
    const [unwrapAmount, setUnwrapAmount] = useState<string>('');
    const [depositAmount, setDepositAmount] = useState<string>('');
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<string>('wrap');

    // 筛选出 ERC20 代币和对应的 Secret 代币对
    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];
        
        // 获取所有代币（不包含 .S 结尾的），包括原生代币和 ERC20 代币
        const erc20Tokens = tokens.filter(token => !token.symbol.endsWith('.S'));
        
        erc20Tokens.forEach(erc20Token => {
            // 判断是否为原生代币（地址为零地址）
            const isNativeToken = erc20Token.address === '0x0000000000000000000000000000000000000000';
            
            // 判断是否为原生 ROSE/TEST -> wROSE.S
            // 原生代币的 symbol 是 ROSE 或 TEST，需要转换为 wROSE.S
            const isNativeROSE = isNativeToken && (
                erc20Token.symbol.toUpperCase() === 'ROSE' || 
                erc20Token.symbol.toUpperCase() === 'TEST'
            );
            
            let secretSymbol: string;
            let secretToken: TokenInfo | null = null;
            let secretContractAddress: `0x${string}` | null = null;
            
            if (isNativeROSE) {
                // 原生 ROSE/TEST -> wROSE.S
                secretSymbol = 'wROSE.S';
                secretToken = tokens.find(t => t.symbol === secretSymbol) || null;
                
                // 从 supportedTokens 中查找 wROSE_Secret 合约地址
                const secretTokenConfig = supportedTokens.find(
                    t => t.symbol === secretSymbol && t.types === 'Secret'
                );
                secretContractAddress = secretTokenConfig 
                    ? (secretTokenConfig.address as `0x${string}`)
                    : null;
            } else {
                // 普通 ERC20 -> Secret Token
                secretSymbol = `${erc20Token.symbol}.S`;
                secretToken = tokens.find(t => t.symbol === secretSymbol) || null;
                
                // 从 supportedTokens 中查找 Secret 合约地址
                const secretTokenConfig = supportedTokens.find(
                    t => t.symbol === secretSymbol && t.types === 'Secret'
                );
                secretContractAddress = secretTokenConfig 
                    ? (secretTokenConfig.address as `0x${string}`)
                    : null;
            }
            
            pairs.push({
                erc20: erc20Token,
                secret: secretToken || null,
                secretContractAddress,
                isNativeROSE,
            });
        });
        
        return pairs;
    }, [tokens, supportedTokens]);

    // 当 tokenPairs 变化时，重置 selectedPairIndex 和 activeTab
    useEffect(() => {
        if (tokenPairs.length > 0 && selectedPairIndex >= tokenPairs.length) {
            setSelectedPairIndex(0);
        }
        // 根据选中的代币对类型设置默认 tab
        const currentPair = tokenPairs[selectedPairIndex];
        if (currentPair?.isNativeROSE) {
            setActiveTab('deposit');
        } else if (currentPair && !currentPair.isNativeROSE) {
            setActiveTab('wrap');
        }
    }, [tokenPairs, selectedPairIndex]);

    // 当前选中的代币对
    const selectedPair: TokenPair | null = useMemo(() => {
        return tokenPairs[selectedPairIndex] || null;
    }, [tokenPairs, selectedPairIndex]);

    // 当 selectedPair 变化时，更新 activeTab
    useEffect(() => {
        if (selectedPair?.isNativeROSE) {
            setActiveTab('deposit');
        } else if (selectedPair && !selectedPair.isNativeROSE) {
            setActiveTab('wrap');
        }
    }, [selectedPair]);

    // 获取 Secret 合约配置
    const secretContract = useMemo(() => {
        if (!selectedPair) return null;
        
        console.log('Finding secret contract for:', {
            isNativeROSE: selectedPair.isNativeROSE,
            secretContractAddress: selectedPair.secretContractAddress,
            erc20Symbol: selectedPair.erc20.symbol,
            allContractsKeys: Object.keys(allContracts),
        });
        
        // 如果是原生 ROSE，优先使用 wROSE_Secret 合约
        if (selectedPair.isNativeROSE) {
            // 首先尝试使用 secretContractAddress（从 supportedTokens 中获取）
            if (selectedPair.secretContractAddress) {
                const contractByAddress = Object.values(allContracts).find(
                    (c) => c && c.address && c.address.toLowerCase() === selectedPair.secretContractAddress!.toLowerCase()
                );
                if (contractByAddress) {
                    console.log('Found wROSE_Secret contract by address:', contractByAddress.address);
                    return contractByAddress;
                }
            }
            
            // 如果没有找到，尝试根据合约名称查找
            const contract = allContracts[ContractName.WROSE_SECRET];
            if (contract) {
                console.log('Found wROSE_Secret contract by name:', contract.address);
                return contract;
            }
            console.warn('wROSE_Secret contract not found in allContracts. Available contracts:', Object.keys(allContracts));
            return null;
        } else {
            // 普通 ERC20 -> Secret Token
            // 优先使用 secretContractAddress
            if (selectedPair.secretContractAddress) {
                const contractByAddress = Object.values(allContracts).find(
                    (c) => c && c.address && c.address.toLowerCase() === selectedPair.secretContractAddress!.toLowerCase()
                );
                if (contractByAddress) {
                    console.log('Found Secret contract by address:', contractByAddress.address);
                    return contractByAddress;
                }
            }
            
            // 如果没有找到，尝试使用 OfficialTokenSecret
            const contract = allContracts.OfficialTokenSecret;
            if (contract) {
                console.log('Found OfficialTokenSecret contract:', contract.address);
                return contract;
            }
            console.warn('OfficialTokenSecret contract not found in allContracts');
            return null;
        }
    }, [selectedPair, allContracts]);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            setActiveButton(null);
            // 成功后清空输入
            if (status === 'success') {
                setWrapAmount('');
                setUnwrapAmount('');
                setDepositAmount('');
                setWithdrawAmount('');
            }
        }
    }, [status]);

    // 输入处理函数
    const handleAmountInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value: string) => void
    ) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setter(value);
        }
    };

    const handleWrapAll = () => {
        if (selectedPair?.erc20 && selectedPair.erc20.balance) {
            setWrapAmount(formatBalance(selectedPair.erc20.balance));
        }
    };

    const handleUnwrapAll = () => {
        if (selectedPair?.secret && selectedPair.secret.balance) {
            setUnwrapAmount(formatBalance(selectedPair.secret.balance));
        }
    };

    const handleWithdrawAll = () => {
        if (selectedPair?.secret && selectedPair.secret.balance) {
            setWithdrawAmount(formatBalance(selectedPair.secret.balance));
        }
    };

    // Wrap 操作：ERC20 -> Secret Token
    const handleWrap = () => {
        if (!wrapAmount || !address || !secretContract || !selectedPair) return;

        try {
            const amount = parseUnits(wrapAmount, selectedPair.erc20.decimals);
            setActiveButton('wrap');
            writeContract({
                ...secretContract,
                functionName: 'wrap',
                args: [amount],
            });
        } catch (error) {
            console.error('Wrap error:', error);
        }
    };

    // Unwrap 操作：Secret Token -> ERC20
    const handleUnwrap = () => {
        if (!unwrapAmount || !address || !secretContract || !selectedPair) return;

        try {
            const amount = parseUnits(unwrapAmount, selectedPair.erc20.decimals);
            setActiveButton('unwrap');
            writeContract({
                ...secretContract,
                functionName: 'unwrap',
                args: [amount],
            });
        } catch (error) {
            console.error('Unwrap error:', error);
        }
    };

    // Deposit 操作：原生 ROSE -> wROSE.S
    const handleDeposit = () => {
        if (!depositAmount || !address || !secretContract || !selectedPair) {
            console.error('Deposit validation failed:', {
                depositAmount,
                address,
                secretContract: !!secretContract,
                selectedPair: !!selectedPair,
            });
            return;
        }

        try {
            // deposit 函数接收 payable，需要发送原生代币
            // deposit() external payable - 不需要参数，只需要 value
            const amount = parseUnits(depositAmount, selectedPair.erc20.decimals);
            setActiveButton('deposit');
            writeContract({
                address: secretContract.address,
                abi: secretContract.abi,
                functionName: 'deposit',
                args: [], // deposit 函数不需要参数
                value: amount,
            });
        } catch (error) {
            console.error('Deposit error:', error);
            setActiveButton(null);
        }
    };

    // Withdraw 操作：wROSE.S -> 原生 ROSE
    const handleWithdraw = () => {
        if (!withdrawAmount || !address || !secretContract || !selectedPair) {
            console.error('Withdraw validation failed:', {
                withdrawAmount,
                address,
                secretContract: !!secretContract,
                selectedPair: !!selectedPair,
            });
            return;
        }

        try {
            const amount = parseUnits(withdrawAmount, selectedPair.erc20.decimals);
            setActiveButton('withdraw');
            writeContract({
                address: secretContract.address,
                abi: secretContract.abi,
                functionName: 'withdraw',
                args: [amount],
            });
        } catch (error) {
            console.error('Withdraw error:', error);
            setActiveButton(null);
        }
    };

    const isLoading = isPending || activeButton !== null;

    if (tokenPairs.length === 0) {
        return null;
    }

    // 构建 Tab 项
    const tabItems = [];

    // 如果没有选中的代币对，不显示 tabs
    if (!selectedPair) {
        return (
            <Card style={{ marginTop: '24px' }}>
                <Alert
                    type="info"
                    message="Please select a token pair to perform operations."
                    showIcon
                />
            </Card>
        );
    }

    // 如果不是原生 ROSE，添加 Wrap/Unwrap Tab
    if (!selectedPair.isNativeROSE) {
        tabItems.push(
            {
                key: 'wrap',
                label: 'Wrap',
                children: (
                    <Space direction="vertical" size="middle">
                        <Input
                            placeholder="Amount"
                            value={wrapAmount}
                            onChange={(e) => handleAmountInput(e, setWrapAmount)}
                            addonAfter={selectedPair?.erc20.symbol || ''}
                            disabled={isLoading || !address || !selectedPair}
                        />
                        <Space.Compact style={{ width: '100%' }}>
                            <Button
                                onClick={handleWrapAll}
                                disabled={!address || !selectedPair?.erc20.balance || isLoading || !selectedPair}
                            >
                                All
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleWrap}
                                loading={isLoading && activeButton === 'wrap'}
                                disabled={!address || !wrapAmount || isLoading || !selectedPair || !secretContract}
                                block
                            >
                                Wrap to {selectedPair?.secret?.symbol || 'Secret Token'}
                            </Button>
                        </Space.Compact>
                        {selectedPair?.erc20 && (
                            <Text type="secondary">
                                Balance: {formatBalance(selectedPair.erc20.balance)} {selectedPair.erc20.symbol}
                            </Text>
                        )}
                    </Space>
                ),
            },
            {
                key: 'unwrap',
                label: 'Unwrap',
                children: (
                    <Space direction="vertical" size="middle">
                        <Input
                            placeholder="Amount"
                            value={unwrapAmount}
                            onChange={(e) => handleAmountInput(e, setUnwrapAmount)}
                            addonAfter={selectedPair?.secret?.symbol || ''}
                            disabled={isLoading || !address || !selectedPair}
                        />
                        <Space.Compact style={{ width: '100%' }}>
                            <Button
                                onClick={handleUnwrapAll}
                                disabled={!address || !selectedPair?.secret?.balance || isLoading || !selectedPair}
                            >
                                All
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleUnwrap}
                                loading={isLoading && activeButton === 'unwrap'}
                                disabled={!address || !unwrapAmount || isLoading || !selectedPair || !secretContract}
                                block
                            >
                                Unwrap to {selectedPair?.erc20.symbol}
                            </Button>
                        </Space.Compact>
                        {selectedPair?.secret && (
                            <Text type="secondary">
                                Balance: {formatBalance(selectedPair.secret.balance)} {selectedPair.secret.symbol}
                            </Text>
                        )}
                    </Space>
                ),
            }
        );
    } else {
        // 原生 ROSE -> wROSE.S，添加 Deposit/Withdraw Tab
        tabItems.push(
            {
                key: 'deposit',
                label: 'Deposit',
                children: (
                    <Space direction="vertical" size="middle">
                        <Input
                            placeholder="ROSE Amount"
                            value={depositAmount}
                            onChange={(e) => handleAmountInput(e, setDepositAmount)}
                            addonAfter="ROSE"
                            disabled={isLoading || !address || !selectedPair}
                        />
                        <Button
                            type="primary"
                            onClick={handleDeposit}
                            loading={isLoading && activeButton === 'deposit'}
                            disabled={!address || !depositAmount || isLoading || !selectedPair || !secretContract}
                            block
                        >
                            Deposit ROSE to {selectedPair?.secret?.symbol || 'wROSE.S'}
                        </Button>
                        <Alert
                            type="info"
                            message="Deposit will convert native ROSE to wROSE.S"
                            showIcon
                        />
                    </Space>
                ),
            },
            {
                key: 'withdraw',
                label: 'Withdraw',
                children: (
                    <Space direction="vertical" size="middle">
                        <Input
                            placeholder="Amount"
                            value={withdrawAmount}
                            onChange={(e) => handleAmountInput(e, setWithdrawAmount)}
                            addonAfter={selectedPair?.secret?.symbol || ''}
                            disabled={isLoading || !address || !selectedPair}
                        />
                        <Space.Compact style={{ width: '100%' }}>
                            <Button
                                onClick={handleWithdrawAll}
                                disabled={!address || !selectedPair?.secret?.balance || isLoading || !selectedPair}
                            >
                                All
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleWithdraw}
                                loading={isLoading && activeButton === 'withdraw'}
                                disabled={!address || !withdrawAmount || isLoading || !selectedPair || !secretContract}
                                block
                            >
                                Withdraw to Native ROSE
                            </Button>
                        </Space.Compact>
                        {selectedPair?.secret && (
                            <Text type="secondary">
                                Balance: {formatBalance(selectedPair.secret.balance)} {selectedPair.secret.symbol}
                            </Text>
                        )}
                    </Space>
                ),
            }
        );
    }

    return (
        <Card style={{ marginTop: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 代币对选择器 */}
                <Col>
                    <Row>
                        <Text strong style={{ marginRight: '8px' }}>Select Token Pair: </Text>
                        <Select
                            value={selectedPairIndex}
                            onChange={setSelectedPairIndex}
                            style={{ width: '100%', maxWidth: '400px' }}
                            disabled={isLoading}
                        >
                            {tokenPairs.map((pair, index) => (
                                <Option key={index} value={index}>
                                    {pair.erc20.symbol} ↔ {pair.secret?.symbol || `${pair.erc20.symbol}.S`}
                                    {pair.isNativeROSE && ' (Native ROSE)'}
                                </Option>
                            ))}
                        </Select>
                    </Row>
                    {selectedPair && (
                        <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
                            <Text strong>
                                {selectedPair.erc20.name} ({selectedPair.erc20.symbol})
                                {selectedPair.secret && ` ↔ ${selectedPair.secret.name} (${selectedPair.secret.symbol})`}
                            </Text>
                            {selectedPair.secretContractAddress && (
                                <Text type="secondary" copyable>
                                    Secret Contract: {selectedPair.secretContractAddress}
                                </Text>
                            )}
                        </Space>
                    )}
                </Col>

                {/* 操作 Tabs */}
                {selectedPair && (
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                    />
                )}

                {selectedPair && !secretContract && (
                    <Alert
                        type="warning"
                        message="Secret contract configuration not found for this token pair. Please check contract configuration."
                        showIcon
                    />
                )}
            </Space>
        </Card>
    );
};

export default SecretTokenWrap;
