import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Space, Typography, Select, Tabs, Row, Col, Alert } from 'antd';
import { useAllContractConfigs, ContractName } from '@/dapp/contractsConfig';
import { TokenInfo } from './types';
import { useTokenPairs } from './hooks/useTokenPairs';
import { useTokenOperations } from './hooks/useTokenOperations';
import TokenWrapForm from './components/TokenWrapForm';
import TokenUnwrapForm from './components/TokenUnwrapForm';
import TokenDepositForm from './components/TokenDepositForm';
import TokenWithdrawForm from './components/TokenWithdrawForm';

const { Text } = Typography;
const { Option } = Select;

export interface SecretTokenWrapProps {
    tokens: TokenInfo[];
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
    const allContracts = useAllContractConfigs();
    const [activeTab, setActiveTab] = useState<string>('wrap');

    const {
        tokenPairs,
        selectedPair,
        selectedPairIndex,
        setSelectedPairIndex,
        pairsWithSecretBalance,
    } = useTokenPairs(tokens);

    const {
        wrap,
        unwrap,
        deposit,
        withdraw,
        approve,
        isLoading,
        status,
        activeButton,
    } = useTokenOperations();

    // 分别跟踪 wrap 和 approve 的状态
    const getStatus = (button: 'wrap' | 'approve' | null): 'idle' | 'error' | 'loading' | 'success' => {
        if (activeButton !== button) {
            return 'idle';
        }
        if (status === 'pending') {
            return 'loading';
        }
        return status as 'idle' | 'error' | 'loading' | 'success';
    };

    const wrapStatus = getStatus('wrap');
    const approveStatus = getStatus('approve');

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
        
        // 如果是原生 ROSE，优先使用 wROSE_Secret 合约
        if (selectedPair.isNativeROSE) {
            // 首先尝试使用 secretContractAddress（从 supportedTokens 中获取）
            if (selectedPair.secretContractAddress) {
                const contractByAddress = Object.values(allContracts).find(
                    (c) => c && c.address && c.address.toLowerCase() === selectedPair.secretContractAddress!.toLowerCase()
                );
                if (contractByAddress) {
                    return contractByAddress;
                }
            }
            
            // 如果没有找到，尝试根据合约名称查找
            const contract = allContracts[ContractName.WROSE_SECRET];
            if (contract) {
                return contract;
            }
            return null;
        } else {
            // 普通 ERC20 -> Secret Token
            // 优先使用 secretContractAddress
            if (selectedPair.secretContractAddress) {
                const contractByAddress = Object.values(allContracts).find(
                    (c) => c && c.address && c.address.toLowerCase() === selectedPair.secretContractAddress!.toLowerCase()
                );
                if (contractByAddress) {
                    return contractByAddress;
                }
            }
            
            // 如果没有找到，尝试使用 OfficialTokenSecret
            const contract = allContracts.OfficialTokenSecret;
            if (contract) {
                return contract;
            }
            return null;
        }
    }, [selectedPair, allContracts]);

    // 操作处理函数
    const handleWrap = useCallback(async (
        tokenAddress: `0x${string}`,
        amount: string
    ) => {
        if (!selectedPair) return;
        try {
            await wrap(tokenAddress, amount, selectedPair.erc20.decimals);
        } catch (error) {
            console.error('Wrap error:', error);
        }
    }, [wrap, selectedPair]);

    const handleUnwrap = useCallback(async (
        tokenAddress: `0x${string}`,
        amount: string
    ) => {
        if (!selectedPair) return;
        try {
            await unwrap(tokenAddress, amount, selectedPair.erc20.decimals);
        } catch (error) {
            console.error('Unwrap error:', error);
        }
    }, [unwrap, selectedPair]);

    const handleDeposit = useCallback(async (amount: string) => {
        if (!selectedPair || !selectedPair.secretContractAddress) return;
        try {
            await deposit(selectedPair.secretContractAddress, amount, selectedPair.erc20.decimals);
        } catch (error) {
            console.error('Deposit error:', error);
        }
    }, [deposit, selectedPair]);

    const handleWithdraw = useCallback(async (
        tokenAddress: `0x${string}`,
        amount: string
    ) => {
        if (!selectedPair) return;
        try {
            await withdraw(tokenAddress, amount, selectedPair.erc20.decimals);
        } catch (error) {
            console.error('Withdraw error:', error);
        }
    }, [withdraw, selectedPair]);

    const handleApprove = useCallback(async (
        tokenAddress: `0x${string}`,
        spender: `0x${string}`,
        amount: string
    ) => {
        if (!selectedPair) return;
        try {
            await approve(tokenAddress, spender, amount, selectedPair.erc20.decimals);
        } catch (error) {
            console.error('Approve error:', error);
        }
    }, [approve, selectedPair]);

    // 成功后清空输入（由子组件管理）
    useEffect(() => {
        if (status === 'success') {
            // 输入清空由子组件管理
        }
    }, [status]);

    if (tokenPairs.length === 0) {
        return null;
    }

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

    // 构建 Tab 项
    const tabItems = [];

    // 如果不是原生 ROSE，添加 Wrap/Unwrap Tab
    if (!selectedPair.isNativeROSE) {
        tabItems.push(
            {
                key: 'wrap',
                label: 'Wrap',
                children: (
                    <TokenWrapForm
                        tokenPairs={tokenPairs}
                        selectedPairIndex={selectedPairIndex}
                        onPairChange={setSelectedPairIndex}
                        isLoading={isLoading}
                        wrapStatus={wrapStatus}
                        approveStatus={approveStatus}
                        wrapLoading={isLoading && activeButton === 'wrap'}
                        approveLoading={isLoading && activeButton === 'approve'}
                    />
                ),
            },
            {
                key: 'unwrap',
                label: 'Unwrap',
                children: (
                    <TokenUnwrapForm
                        tokenPairs={pairsWithSecretBalance}
                        selectedPairIndex={pairsWithSecretBalance.findIndex(p => 
                            p.erc20.address === selectedPair.erc20.address
                        )}
                        onPairChange={(index) => {
                            const pair = pairsWithSecretBalance[index];
                            const originalIndex = tokenPairs.findIndex(p => 
                                p.erc20.address === pair.erc20.address
                            );
                            if (originalIndex >= 0) {
                                setSelectedPairIndex(originalIndex);
                            }
                        }}
                        onUnwrap={handleUnwrap}
                        isLoading={isLoading}
                    />
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
                    <TokenDepositForm
                        selectedPair={selectedPair}
                        onDeposit={handleDeposit}
                        isLoading={isLoading}
                    />
                ),
            },
            {
                key: 'withdraw',
                label: 'Withdraw',
                children: (
                    <TokenWithdrawForm
                        tokenPairs={pairsWithSecretBalance.filter(p => p.isNativeROSE)}
                        selectedPairIndex={0}
                        onPairChange={() => {}}
                        onWithdraw={handleWithdraw}
                        isLoading={isLoading}
                    />
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
