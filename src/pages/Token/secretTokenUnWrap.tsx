import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Space, Typography, Select, Tabs, Row, Col, Alert } from 'antd';
import { useAllContractConfigs, ContractName } from '@dapp/config/contractsConfig';
import TokenUnwrapForm from './components/TokenUnwrapForm';
import TokenWithdrawForm from './components/TokenWithdrawForm';
import { useTokenOperations } from './hooks/useTokenOperations';
import { useTokenPairs2 } from './hooks/useTokenPairs2';
import { TokenPair } from './types';

const { Text } = Typography;
const { Option } = Select;

const SecretTokenUnWrap: React.FC = () => {
    const allContracts = useAllContractConfigs();
    const [activeTab, setActiveTab] = useState<string>('unwrap');
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

    const { tokenPairs } = useTokenPairs2();
    const { withdraw, unwrap, isLoading } = useTokenOperations();

    // Current selected token pair
    const selectedPair: TokenPair | null = useMemo(() => {
        return tokenPairs[selectedPairIndex] || null;
    }, [tokenPairs, selectedPairIndex]);

    // When tokenPairs changes, reset selectedPairIndex
    useEffect(() => {
        if (tokenPairs.length > 0 && selectedPairIndex >= tokenPairs.length) {
            setSelectedPairIndex(0);
        }
    }, [tokenPairs, selectedPairIndex]);

    // Set default tab based on selected token pair
    useEffect(() => {
        if (selectedPair?.isNativeROSE) {
            setActiveTab('withdraw');
        } else {
            setActiveTab('unwrap');
        }
    }, [selectedPair]);

    // Get Secret contract configuration
    const secretContract = useMemo(() => {
        if (!selectedPair || !selectedPair.secret?.address) return null;

        const contractByAddress = Object.values(allContracts).find(
            (c) => c && c.address && c.address.toLowerCase() === selectedPair.secret!.address.toLowerCase()
        );
        if (contractByAddress) {
            return contractByAddress;
        }

        if (selectedPair.isNativeROSE) {
            return allContracts[ContractName.WROSE_SECRET] || null;
        } else {
            return allContracts.OfficialTokenSecret || null;
        }
    }, [selectedPair, allContracts]);

    // Withdraw operation: wROSE.S -> Native ROSE
    const handleWithdraw = useCallback(
        async (tokenAddress: `0x${string}`, amount: string) => {
            if (!selectedPair || !selectedPair.secret?.address) return;
            try {
                await withdraw(selectedPair.secret.address, amount, selectedPair.secret.decimals);
            } catch (error) {
                console.error('Withdraw error:', error);
            }
        },
        [withdraw, selectedPair]
    );

    // Unwrap operation: Secret Token -> ERC20
    const handleUnwrap = useCallback(
        async (tokenAddress: `0x${string}`, amount: string) => {
            if (!selectedPair || !selectedPair.secret?.address) return;
            try {
                await unwrap(selectedPair.secret.address, amount, selectedPair.secret.decimals);
            } catch (error) {
                console.error('Unwrap error:', error);
            }
        },
        [unwrap, selectedPair]
    );

    if (!selectedPair || tokenPairs.length === 0) {
        return (
            <Card style={{ marginTop: '24px' }}>
                <Alert type="info" message="Please select a token pair to perform operations." showIcon />
            </Card>
        );
    }

    // Build Tab items
    const tabItems: { key: string; label: string; children: React.ReactNode }[] = [];

    if (!selectedPair.isNativeROSE) {
        // Non-native ROSE: only Unwrap option (Secret Token -> ERC20)
        tabItems.push({
            key: 'unwrap',
            label: 'Unwrap',
            children: (
                <TokenUnwrapForm
                    selectedPair={selectedPair}
                    onUnwrap={handleUnwrap}
                    isLoading={isLoading}
                />
            ),
        });
    } else {
        // Native ROSE: has Unwrap and Withdraw two options
        tabItems.push(
            {
                key: 'withdraw',
                label: 'Withdraw',
                children: (
                    <TokenWithdrawForm
                        selectedPair={selectedPair}
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
                                    {pair.secret?.symbol || `${pair.erc20.symbol}.S`} - {pair.erc20.symbol}
                                    {pair.isNativeROSE && ' (Native ROSE)'}
                                </Option>
                            ))}
                        </Select>
                    </Row>
                    <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
                        <Text strong>
                            {selectedPair.secret && selectedPair.secret.name }
                            {` ---> ${selectedPair.erc20.name}`}
                            
                        </Text>
                        {selectedPair.secret?.address && (
                            <Text type="secondary" copyable>
                                Secret: {selectedPair.secret.address}
                            </Text>
                        )}
                        {selectedPair.erc20?.address && (
                            <Text type="secondary" copyable>
                                ERC20: {selectedPair.erc20.address}
                            </Text>
                        )}
                    </Space>
                </Col>

                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

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

export default SecretTokenUnWrap;
