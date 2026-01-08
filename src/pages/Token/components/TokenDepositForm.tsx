import React, { useState, useCallback } from 'react';
import { Button, Input, Space, Typography, Alert } from 'antd';
import { TokenPair } from '../types';

/**
 * Component for Deposit operation form (Native ROSE -> wROSE.S)
 * Deposit operation form (Native ROSE -> wROSE.S)
 */
export interface TokenDepositFormProps {
    selectedPair: TokenPair; // Must be isNativeROSE = true
    onDeposit: (amount: string) => void;
    isLoading: boolean;
}

const TokenDepositForm: React.FC<TokenDepositFormProps> = ({
    selectedPair,
    onDeposit,
    isLoading,
}) => {
    const [depositAmount, setDepositAmount] = useState<string>('');

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow input numbers and decimal points
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setDepositAmount(value);
        }
    }, []);

    const handleDeposit = useCallback(() => {
        if (!depositAmount) return;
        onDeposit(depositAmount);
    }, [depositAmount, onDeposit]);

    return (
        <Space direction="vertical" size="middle">
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Amount"
                    value={depositAmount}
                    suffix={selectedPair.erc20.symbol}
                    onChange={handleAmountInput}
                    disabled={isLoading || !selectedPair}
                    style={{ flex: 1 }}
                />
            </Space.Compact>
            <Button
                type="primary"
                onClick={handleDeposit}
                loading={isLoading}
                disabled={!depositAmount || isLoading || !selectedPair || !selectedPair.secret?.address}
                block
            >
                Deposit {selectedPair.erc20.symbol} to {selectedPair?.secret?.symbol}
            </Button>
            <Alert
                type="info"
                message={`Deposit will convert ${selectedPair.erc20.symbol} to ${selectedPair?.secret?.symbol}`}
                showIcon
            />
        </Space>
    );
};

export default TokenDepositForm;

