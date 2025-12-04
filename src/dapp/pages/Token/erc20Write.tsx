import React, { useState, useEffect, useCallback } from 'react';
import { Card, Space, Typography, Select, Tabs, Row, Col } from 'antd';
import { TokenInfo } from './types';
import { useTokenOperations } from './hooks/useTokenOperations';
import TokenTransferForm from './components/TokenTransferForm';
import TokenBurnForm from './components/TokenBurnForm';

const { Text } = Typography;
const { Option } = Select;

export interface ERC20WriteProps {
    tokens: TokenInfo[];
}

const ERC20Write: React.FC<ERC20WriteProps> = ({ tokens }) => {
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('transfer');
    const { transfer, burn, isLoading, status } = useTokenOperations();

    // 当默认选择第一个代币时，更新 selectedTokenAddress
    useEffect(() => {
        if (!selectedTokenAddress && tokens.length > 0) {
            setSelectedTokenAddress(tokens[0].address);
        }
    }, [tokens, selectedTokenAddress]);

    // 选中的代币信息
    const selectedToken = tokens.find(
        (t) => t.address.toLowerCase() === (selectedTokenAddress || tokens[0]?.address || '').toLowerCase()
    ) || tokens[0];

    const handleTransfer = useCallback(async (
        tokenAddress: `0x${string}`,
        to: `0x${string}`,
        amount: string
    ) => {
        if (!selectedToken) return;
        try {
            await transfer(tokenAddress, to, amount, selectedToken.decimals);
        } catch (error) {
            console.error('Transfer error:', error);
        }
    }, [transfer, selectedToken]);

    const handleBurn = useCallback(async (
        tokenAddress: `0x${string}`,
        amount: string
    ) => {
        if (!selectedToken) return;
        try {
            await burn(tokenAddress, amount, selectedToken.decimals);
        } catch (error) {
            console.error('Burn error:', error);
        }
    }, [burn, selectedToken]);

    // 成功后清空输入（余额会通过 useAccountQuery 自动刷新）
    useEffect(() => {
        if (status === 'success') {
            // 输入清空由子组件管理
        }
    }, [status]);

    if (tokens.length === 0) {
        return null;
    }

    const tabItems = [
        {
            key: 'transfer',
            label: 'Transfer',
            children: (
                <TokenTransferForm
                    tokens={tokens}
                    selectedTokenAddress={selectedTokenAddress}
                    onTokenChange={setSelectedTokenAddress}
                    onTransfer={handleTransfer}
                    isLoading={isLoading}
                />
            ),
        },
        {
            key: 'burn',
            label: 'Burn',
            children: (
                <TokenBurnForm
                    tokens={tokens}
                    selectedTokenAddress={selectedTokenAddress}
                    onTokenChange={setSelectedTokenAddress}
                    onBurn={handleBurn}
                    isLoading={isLoading}
                />
            ),
        },
    ];

    return (
        <Card style={{ marginTop: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 代币选择器 */}
                {tokens.length > 1 && (
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
                            </Space>
                        )}
                    </Col>
                )}

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
