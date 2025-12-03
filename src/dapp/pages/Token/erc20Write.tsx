import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Space, Typography, Select, Tabs, Row, Col } from 'antd';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { formatBalance } from '@dapp/utils/formatBalance';
import { TokenInfo } from './erc20Token';

const { Text } = Typography;
const { Option } = Select;

type ActiveButton = 'burn' | 'transfer' | null;

export interface ERC20WriteProps {
    tokens: TokenInfo[];
}

const ERC20Write: React.FC<ERC20WriteProps> = ({ tokens }) => {
    const { writeContract, status, isPending } = useWriteContract();
    const { address } = useAccount();
    const allContracts = useAllContractConfigs();

    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    const [transferAmount, setTransferAmount] = useState<string>('');
    const [transferAddress, setTransferAddress] = useState<string>('');
    const [burnAmount, setBurnAmount] = useState<string>('');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('transfer');

    // 选中的代币信息
    const selectedToken: TokenInfo | null = useMemo(() => {
        if (!selectedTokenAddress && tokens.length > 0) {
            // 默认选择第一个代币
            return tokens[0];
        }

        const token = tokens.find(
            (t) => t.address.toLowerCase() === selectedTokenAddress.toLowerCase()
        );

        return token || null;
    }, [selectedTokenAddress, tokens]);

    // 当默认选择第一个代币时，更新 selectedTokenAddress
    useEffect(() => {
        if (!selectedTokenAddress && tokens.length > 0) {
            setSelectedTokenAddress(tokens[0].address);
        }
    }, [tokens, selectedTokenAddress]);

    // 获取代币合约配置
    const tokenContract = useMemo(() => {
        if (!selectedToken) return null;
        // 尝试从 allContracts 中找到匹配的合约
        const contract = Object.values(allContracts).find(
            (c) => c.address.toLowerCase() === selectedToken.address.toLowerCase()
        );
        if (contract) return contract;
        // 如果没有找到，创建一个基本配置
        return {
            address: selectedToken.address,
            abi: allContracts.OfficialToken.abi, // 使用默认 ABI
        };
    }, [selectedToken, allContracts]);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            setActiveButton(null);
            // 成功后清空输入（余额会通过 useAccountQuery 自动刷新）
            if (status === 'success') {
                setTransferAmount('');
                setTransferAddress('');
                setBurnAmount('');
            }
        }
    }, [status]);

    const handleTransferAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setTransferAmount(value);
        }
    };

    const handleTransferAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransferAddress(e.target.value);
    };

    const handleAll = () => {
        if (selectedToken && selectedToken.balance) {
            // 余额已经是格式化后的字符串，直接使用
            setBurnAmount(formatBalance(selectedToken.balance));
        }
    };

    const handleBurnAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setBurnAmount(value);
        }
    };

    const handleTransfer = () => {
        if (!transferAmount || !transferAddress || !address || !tokenContract || !selectedToken) return;

        try {
            const amount = parseUnits(transferAmount, selectedToken.decimals);
            setActiveButton('transfer');
            writeContract({
                ...tokenContract,
                functionName: 'transfer',
                args: [transferAddress as `0x${string}`, amount],
            });
        } catch (error) {
            console.error('Transfer error:', error);
        }
    };

    const handleBurn = () => {
        if (!burnAmount || !tokenContract || !selectedToken) return;

        try {
            const amount = parseUnits(burnAmount, selectedToken.decimals);
            setActiveButton('burn');
            writeContract({
                ...tokenContract,
                functionName: 'burn',
                args: [amount],
            });
        } catch (error) {
            console.error('Burn error:', error);
        }
    };

    const isLoading = isPending || activeButton !== null;
    const formattedBalance = selectedToken
        ? formatBalance(selectedToken.balance)
        : '0.000';

    if (tokens.length === 0) {
        return null;
    }

    const tabItems = [
        {
            key: 'transfer',
            label: 'Transfer',
            children: (
                <Space direction="vertical" size="middle">
                    <Input
                        placeholder="Amount"
                        value={transferAmount}
                        onChange={handleTransferAmount}
                        addonAfter={selectedToken?.symbol || ''}
                        disabled={isLoading || !address || !selectedToken}
                    />
                    <Input
                        placeholder="Recipient Address"
                        value={transferAddress}
                        onChange={handleTransferAddress}
                        disabled={isLoading || !address || !selectedToken}
                    />
                    <Button
                        type="primary"
                        onClick={handleTransfer}
                        loading={isLoading && activeButton === 'transfer'}
                        disabled={!address || !transferAmount || !transferAddress || isLoading || !selectedToken}
                        block
                    >
                        Transfer
                    </Button>
                </Space>
            ),
        },
        {
            key: 'burn',
            label: 'Burn',
            children: (
                <Space direction="vertical" size="middle">
                    <Space.Compact>
                        <Input
                            placeholder="Amount"
                            value={burnAmount}
                            onChange={handleBurnAmount}
                            addonAfter={selectedToken?.symbol || ''}
                            disabled={isLoading || !address || !selectedToken}
                            style={{ flex: 1 }}
                        />
                        <Button
                            onClick={handleAll}
                            disabled={!address || !selectedToken?.balance || isLoading || !selectedToken}
                        >
                            All
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={handleBurn}
                            loading={isLoading && activeButton === 'burn'}
                            disabled={!address || !burnAmount || isLoading || !selectedToken}
                        >
                            Burn
                        </Button>
                    </Space.Compact>
                </Space>
            ),
        },
    ];

    return (
        <Card style={{ marginTop: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 代币选择器 */}
                <Col>
                    <Row>
                        <Text strong style={{ marginRight: '8px' }}>Select Token: </Text>
                        <Select
                            value={selectedTokenAddress}
                            onChange={setSelectedTokenAddress}
                            style={{ width: '100%', maxWidth: '400px' }}
                            disabled={isLoading}
                        >
                            {tokens.map((token) => (
                                <Option
                                    key={token.address}
                                    value={token.address}
                                >
                                    {token.symbol} ({token.name})
                                </Option>
                            ))}
                        </Select>
                    </Row>
                    {selectedToken && (
                        <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
                            <Text strong>
                                {selectedToken.name} ({selectedToken.symbol})
                            </Text>
                            <Text type="secondary" copyable>
                                {selectedToken.address}
                            </Text>
                            <Text>
                                Balance: {formattedBalance} {selectedToken.symbol}
                            </Text>
                        </Space>
                    )}
                </Col>

                {/* 操作 Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />
            </Space>
        </Card>
    );
};

export default ERC20Write;
