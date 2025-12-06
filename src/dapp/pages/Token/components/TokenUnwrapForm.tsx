import React, { useState, useCallback } from 'react';
import { Button, Input, Space, Typography, Select, Alert } from 'antd';
import { formatBalance } from '@dapp/utils/formatBalance';
import { TokenPair } from '../types';
import { useUnWrapSteps } from '../hooks/useUnWrapSteps';

const { Text } = Typography;
const { Option } = Select;

export interface TokenUnwrapFormProps {
    selectedPair: TokenPair; 
    onUnwrap: (tokenAddress: `0x${string}`, amount: string) => void;
    isLoading: boolean;
}

/**
 * Component for Unwrap operation form (with filtering)
 * Unwrap 操作表单（包含筛选）
 */
const TokenUnwrapForm: React.FC<TokenUnwrapFormProps> = ({
    selectedPair,
    onUnwrap,
    isLoading,
}) => {
    const { currentStep, handleEIP712Permit, isLoading: isReadBalanceLoading, balance, isEnough } = useUnWrapSteps(selectedPair);

    const [unwrapAmount, setUnwrapAmount] = useState<string>('');

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setUnwrapAmount(value);
        }
    }, []);

    const handleUnwrapAll = useCallback(() => {
        if (selectedPair?.secret && selectedPair.secret.balance) {
            setUnwrapAmount(formatBalance(selectedPair.secret.balance));
        }
    }, [selectedPair]);

    const handleUnwrap = useCallback(() => {
        if (!unwrapAmount || !selectedPair || !selectedPair.secretContractAddress) return;
        onUnwrap(selectedPair.secretContractAddress, unwrapAmount);
    }, [unwrapAmount, selectedPair, onUnwrap]);

    return (
        <Space direction="vertical" size="middle">
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Amount"
                    value={unwrapAmount}
                    suffix={selectedPair?.secret?.symbol || ''}
                    onChange={handleAmountInput}
                    disabled={isLoading || !selectedPair}
                    style={{ flex: 1 }}
                />
            </Space.Compact>
            <Space.Compact style={{ width: '100%' }}>
                <Button
                    onClick={handleUnwrapAll}
                    disabled={!selectedPair?.secret?.balance || isLoading || !selectedPair}
                >
                    All
                </Button>
                <Button
                    type="primary"
                    onClick={handleUnwrap}
                    loading={isLoading}
                    disabled={!unwrapAmount || isLoading || !selectedPair || !selectedPair.secretContractAddress}
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
    );
};

export default TokenUnwrapForm;

