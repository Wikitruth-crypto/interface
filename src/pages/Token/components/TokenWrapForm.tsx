import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Space, Typography, Select, Alert } from 'antd';
import { formatBalance } from '@dapp/utils/formatBalance';
import { TokenPair } from '../types';
import TokenWrapModal from './TokenWrapModal';
// import { useTokenPage } from '../context/TokenPageContext';

const { Text } = Typography;
const { Option } = Select;

export interface TokenWrapFormProps {
    tokenPairs: TokenPair[];
    selectedPairIndex?: number;
    onPairChange?: (index: number) => void;
    isLoading: boolean;
}

const TokenWrapForm: React.FC<TokenWrapFormProps> = ({
    tokenPairs,
    selectedPairIndex = 0,
    onPairChange,
    isLoading,
}) => {
    const [wrapAmount, setWrapAmount] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);

    const selectedPair = tokenPairs[selectedPairIndex] || tokenPairs[0];

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setWrapAmount(value);
        }
    }, []);

    const handleWrapAll = useCallback(() => {
        if (selectedPair?.erc20 && selectedPair.erc20.balance) {
            setWrapAmount(formatBalance(selectedPair.erc20.balance));
        }
    }, [selectedPair]);

    const handleWrapClick = useCallback(() => {
        if (!wrapAmount || !selectedPair || !selectedPair.secret?.address) return;
        setModalOpen(true);
    }, [wrapAmount, selectedPair]);

    if (!selectedPair) {
        return <Alert type="info" message="Please select a token pair" showIcon />;
    }

    return (
        <>
            <Space direction="vertical" size="middle">
                {tokenPairs.length > 1 && (
                    <Select
                        value={selectedPairIndex}
                        onChange={onPairChange}
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {tokenPairs.map((pair, index) => (
                            <Option key={index} value={index}>
                                {pair.erc20.symbol} - {pair.secret?.symbol || `${pair.erc20.symbol}.S`}
                            </Option>
                        ))}
                    </Select>
                )}
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Amount"
                        value={wrapAmount}
                        suffix={selectedPair?.erc20.symbol || ''}
                        onChange={handleAmountInput}
                        disabled={isLoading || !selectedPair}
                        style={{ flex: 1 }}
                    />
                    
                </Space.Compact>
                <Space.Compact style={{ width: '100%' }}>
                    <Button
                        onClick={handleWrapAll}
                        disabled={!selectedPair?.erc20.balance || isLoading || !selectedPair}
                    >
                        All
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleWrapClick}
                        loading={isLoading}
                        disabled={
                            !wrapAmount ||
                            isLoading ||
                            !selectedPair ||
                            !selectedPair.secret?.address
                        }
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
            <TokenWrapModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                tokenPair={selectedPair}
                amount={wrapAmount}
            />
        </>
    );
};

export default TokenWrapForm;
