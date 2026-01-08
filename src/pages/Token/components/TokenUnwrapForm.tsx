import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Space, Typography, Alert } from 'antd';
import { formatBalance } from '@dapp/utils/formatBalance';
import { formatAddress } from '@dapp/utils/formatAddress';
import { formatUnits } from 'viem';
import { TokenPair } from '../types';
import { useUnWrapSteps } from '../hooks/useUnWrapSteps';

const { Text, } = Typography;

export interface TokenUnwrapFormProps {
    selectedPair: TokenPair; 
    onUnwrap: (tokenAddress: `0x${string}`, amount: string) => void;
    isLoading: boolean;
}

/**
 * Component for Unwrap operation form (with filtering)
 * Unwrap operation form (with filtering)
 */
const TokenUnwrapForm: React.FC<TokenUnwrapFormProps> = ({
    selectedPair,
    onUnwrap,
    isLoading,
}) => {
    const { 
        handleEIP712Permit, 
        currentStep, 
        isLoading: isReadBalanceLoading, 
        balance, 
        error: signError,
    } = useUnWrapSteps(selectedPair);

    // useEffect(() => {
    //     console.log('TokenUnwrapForm - balance:', balance, 'type:', typeof balance, 'currentStep:', currentStep, 'isReadBalanceLoading:', isReadBalanceLoading);
    //     if (balance && balance > BigInt(0)) {
    //         const decimals = selectedPair?.secret?.decimals || selectedPair?.erc20?.decimals || 18;
    //         console.log('TokenUnwrapForm - formatted balance:', formatBalance(formatUnits(balance, decimals)));
    //     }
    // }, [balance, currentStep, isReadBalanceLoading, selectedPair]);

    const [unwrapAmount, setUnwrapAmount] = useState<string>('');

    // When switching token pair, reset input amount
    useEffect(() => {
        setUnwrapAmount('');
    }, [selectedPair?.secret?.address]);

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow input numbers and decimal points
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setUnwrapAmount(value);
        }
    }, []);

    const handleUnwrapAll = useCallback(() => {
        if (balance && balance > BigInt(0)) {
            const decimals = selectedPair?.secret?.decimals || selectedPair?.erc20?.decimals || 18;
            const formatted = formatBalance(formatUnits(balance, decimals));
            setUnwrapAmount(formatted);
        } 
    }, [balance, selectedPair]);

    const handleUnwrap = useCallback(() => {
        if (!unwrapAmount || !selectedPair || !selectedPair.secret?.address) return;
        onUnwrap(selectedPair.secret?.address, unwrapAmount);
    }, [unwrapAmount, selectedPair, onUnwrap]);

    // If current step is EIP712Permit, display signature UI
    if (currentStep === 'EIP712Permit') {
        return (
            <Space direction="vertical" size="middle">
                <Alert
                    type="warning"
                    showIcon
                    message="EIP-712 Signature Required"
                    description={
                        <Space direction="vertical" size="middle" style={{marginTop: 8 }}>
                            <div>
                                <Text strong>Type: View Permission</Text>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        Contract: {selectedPair?.secret?.address ? formatAddress(selectedPair.secret?.address) : 'N/A'}
                                    </Text>
                                </div>
                            </div>

                            {signError && (
                                <Alert
                                    type="error"
                                    showIcon
                                    message="Signature failed!"
                                    description={signError.message}
                                    style={{ marginTop: 8 }}
                                />
                            )}

                            <Button
                                type="primary"
                                block
                                onClick={handleEIP712Permit}
                                loading={isReadBalanceLoading}
                                disabled={!selectedPair?.secret?.address || !selectedPair?.erc20.address}
                            >
                                Sign EIP-712 Permit
                            </Button>
                        </Space>
                    }
                />
            </Space>
        );
    }

    // If current step is checkBalance, display different UI based on balance state
    if (currentStep === 'checkBalance') {
        // Reading balance
        if (isReadBalanceLoading) {
            return (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Alert
                        type="info"
                        showIcon
                        message="Reading balance..."
                        description="Please wait while we check your token balance."
                    />
                </Space>
            );
        }

        // Balance is 0 or undefined, display提示信息
        if (!balance || balance === BigInt(0)) {
            return (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Alert
                        type="info"
                        showIcon
                        message="No balance"
                        description={
                            <Text type="secondary">
                                You don't have any {selectedPair?.secret?.symbol || 'Secret Token'} balance to unwrap.
                            </Text>
                        }
                    />
                </Space>
            );
        }

        // Balance > 0, display input box UI
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
                        disabled={!balance || balance === BigInt(0) || isLoading || !selectedPair}
                    >
                        All
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleUnwrap}
                        loading={isLoading}
                        disabled={!unwrapAmount || isLoading || !selectedPair || !selectedPair.secret?.address}
                        block
                    >
                        Unwrap to {selectedPair?.erc20.symbol}
                    </Button>
                </Space.Compact>
                {balance && balance > BigInt(0) && (
                    <Text type="secondary">
                        Balance: {selectedPair?.secret 
                            ? formatBalance(formatUnits(balance, selectedPair.secret.decimals)) + ' ' + selectedPair.secret.symbol
                            : formatBalance(formatUnits(balance, selectedPair?.erc20?.decimals || 18)) + ' ' + (selectedPair?.secret?.symbol || 'Secret Token')
                        }
                    </Text>
                )}
            </Space>
        );
    }

    // Default case (should not reach here)
    return null;
};

export default TokenUnwrapForm;

