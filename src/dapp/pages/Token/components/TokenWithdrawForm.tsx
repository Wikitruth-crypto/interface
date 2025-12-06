import React, { useState, useCallback } from 'react';
import { Button, Input, Space, Typography, Select, Alert } from 'antd';
import { formatBalance } from '@dapp/utils/formatBalance';
import { TokenPair } from '../types';
import { useUnWrapSteps } from '../hooks/useUnWrapSteps';

const { Text } = Typography;
const { Option } = Select;

export interface TokenWithdrawFormProps {
    selectedPair: TokenPair; 
    onWithdraw: (tokenAddress: `0x${string}`, amount: string) => void;
    isLoading: boolean;
}

/**
 * Component for Withdraw operation form (with filtering)
 * Withdraw 操作表单（包含筛选）
 */
const TokenWithdrawForm: React.FC<TokenWithdrawFormProps> = ({
    selectedPair,
    onWithdraw,
    isLoading,
}) => {
    const { currentStep, handleEIP712Permit, isLoading: isReadBalanceLoading, balance, isEnough } = useUnWrapSteps(selectedPair);
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setWithdrawAmount(value);
        }
    }, []);

    const handleWithdrawAll = useCallback(() => {
        if (selectedPair?.secret && selectedPair.secret.balance) {
            setWithdrawAmount(formatBalance(selectedPair.secret.balance));
        }
    }, [selectedPair]);

    const handleWithdraw = useCallback(() => {
        if (!withdrawAmount || !selectedPair || !selectedPair.secretContractAddress) return;
        onWithdraw(selectedPair.secretContractAddress, withdrawAmount);
    }, [withdrawAmount, selectedPair, onWithdraw]);

    return (
        <Space direction="vertical" size="middle">
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Amount"
                    value={withdrawAmount}
                    suffix={selectedPair?.secret?.symbol || ''}
                    onChange={handleAmountInput}
                    disabled={isLoading || !selectedPair}
                    style={{ flex: 1 }}
                />
            </Space.Compact>
            <Space.Compact style={{ width: '100%' }}>
                <Button
                    onClick={handleWithdrawAll}
                    disabled={!selectedPair?.secret?.balance || isLoading || !selectedPair}
                >
                    All
                </Button>
                <Button
                    type="primary"
                    onClick={handleWithdraw}
                    loading={isLoading}
                    disabled={!withdrawAmount || isLoading || !selectedPair || !selectedPair.secretContractAddress}
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
    );
};

export default TokenWithdrawForm;

