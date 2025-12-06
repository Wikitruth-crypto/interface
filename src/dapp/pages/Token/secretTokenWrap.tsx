import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Space, Typography, Select, Tabs, Row, Col, Alert } from 'antd';
import { useAllContractConfigs, ContractName } from '@/dapp/contractsConfig';
import { useTokenPageContext } from './context/TokenPageContext';
import TokenWrapForm from './components/TokenWrapForm';
import TokenUnwrapForm from './components/TokenUnwrapForm';
import TokenDepositForm from './components/TokenDepositForm';
import TokenWithdrawForm from './components/TokenWithdrawForm';
import { useTokenOperations } from './hooks/useTokenOperations';

const { Text } = Typography;
const { Option } = Select;

const SecretTokenWrap: React.FC = () => {
    const allContracts = useAllContractConfigs();
    const [activeTab, setActiveTab] = useState<string>('wrap');

    const {
        tokenPairs,
        selectedPair,
        selectedPairIndex,
        setSelectedPairIndex,
        pairsWithSecretBalance,
    } = useTokenPageContext();

    const { deposit, isLoading } = useTokenOperations();

    useEffect(() => {
        if (selectedPair?.isNativeROSE) {
            setActiveTab('deposit');
        } else if (selectedPair && !selectedPair.isNativeROSE) {
            setActiveTab('wrap');
        }
    }, [selectedPair]);

    const secretContract = useMemo(() => {
        if (!selectedPair) return null;

        if (selectedPair.isNativeROSE) {
            if (selectedPair.secretContractAddress) {
                const contractByAddress = Object.values(allContracts).find(
                    (c) => c && c.address && c.address.toLowerCase() === selectedPair.secretContractAddress!.toLowerCase()
                );
                if (contractByAddress) {
                    return contractByAddress;
                }
            }

            return allContracts[ContractName.WROSE_SECRET] || null;
        } else {
            if (selectedPair.secretContractAddress) {
                const contractByAddress = Object.values(allContracts).find(
                    (c) => c && c.address && c.address.toLowerCase() === selectedPair.secretContractAddress!.toLowerCase()
                );
                if (contractByAddress) {
                    return contractByAddress;
                }
            }

            return allContracts.OfficialTokenSecret || null;
        }
    }, [selectedPair, allContracts]);

    const handleDeposit = useCallback(
        async (amount: string) => {
            if (!selectedPair || !selectedPair.secretContractAddress) return;
            try {
                await deposit(selectedPair.secretContractAddress, amount, selectedPair.erc20.decimals);
            } catch (error) {
                console.error('Deposit error:', error);
            }
        },
        [deposit, selectedPair]
    );

    const handleUnwrap = useCallback(
        async (tokenAddress: `0x${string}`, amount: string) => {
        }, []);

    if (!selectedPair) {
        return (
            <Card style={{ marginTop: '24px' }}>
                <Alert type="info" message="Please select a token pair to perform operations." showIcon />
            </Card>
        );
    }

    const tabItems: { key: string; label: string; children: React.ReactNode }[] = [];

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
                    />
                ),
            },
            {
                key: 'unwrap',
                label: 'Unwrap',
                children: (
                    <TokenUnwrapForm
                    selectedPair={selectedPair}
                    onUnwrap={handleUnwrap}

                        isLoading={isLoading}
                    />
                ),
            }
        );
    } else {
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
                        selectedPair={selectedPair}
                        onWithdraw={handleUnwrap}
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
                                    {pair.erc20.symbol} - {pair.secret?.symbol || `${pair.erc20.symbol}.S`}
                                    {pair.isNativeROSE && ' (Native ROSE)'}
                                </Option>
                            ))}
                        </Select>
                    </Row>
                    <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
                        <Text strong>
                            {selectedPair.erc20.name} ({selectedPair.erc20.symbol})
                            {selectedPair.secret && ` -> ${selectedPair.secret.name} (${selectedPair.secret.symbol})`}
                        </Text>
                        {selectedPair.secretContractAddress && (
                            <Text type="secondary" copyable>
                                Secret Contract: {selectedPair.secretContractAddress}
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

export default SecretTokenWrap;
