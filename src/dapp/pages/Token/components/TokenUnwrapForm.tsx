import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Space, Typography, Alert } from 'antd';
import { formatBalance } from '@dapp/utils/formatBalance';
import { formatAddress } from '@dapp/utils/formatAddress';
import { formatUnits } from 'viem';
import { TokenPair } from '../types';
import { useUnWrapSteps } from '../hooks/useUnWrapSteps';

const { Text, Paragraph } = Typography;

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
    const { 
        initSteps,
        handleEIP712Permit, 
        currentStep, 
        isLoading: isReadBalanceLoading, 
        balance, 
        isEnough,
        error: signError,
    } = useUnWrapSteps(selectedPair);

    // 初始化检查，当 selectedPair 变化时重新初始化
    useEffect(() => {
        if (selectedPair?.secretContractAddress) {
            initSteps();
        }
    }, [selectedPair?.secretContractAddress, initSteps]);

    useEffect(() => {
        console.log('balance:', balance, 'type:', typeof balance, 'selectedPair:', selectedPair);
        if (balance && balance > BigInt(0)) {
            const decimals = selectedPair?.secret?.decimals || selectedPair?.erc20?.decimals || 18;
            console.log('formatted balance:', formatBalance(formatUnits(balance, decimals)));
        }
    }, [balance, selectedPair]);

    const [unwrapAmount, setUnwrapAmount] = useState<string>('');

    // 当切换代币对时，重置输入金额
    useEffect(() => {
        setUnwrapAmount('');
    }, [selectedPair?.secretContractAddress]);

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setUnwrapAmount(value);
        }
    }, []);

    const handleUnwrapAll = useCallback(() => {
        console.log('handleUnwrapAll called, balance:', balance, 'selectedPair?.secret:', selectedPair?.secret);
        if (balance && balance > BigInt(0)) {
            // 使用 secret 的 decimals，如果没有则使用 erc20 的 decimals
            const decimals = selectedPair?.secret?.decimals || selectedPair?.erc20?.decimals || 18;
            const formatted = formatBalance(formatUnits(balance, decimals));
            console.log('Setting unwrapAmount to:', formatted);
            setUnwrapAmount(formatted);
        } else {
            console.log('handleUnwrapAll: conditions not met', {
                hasBalance: !!balance,
                balanceGreaterThanZero: balance ? balance > BigInt(0) : false,
            });
        }
    }, [balance, selectedPair]);

    const handleUnwrap = useCallback(() => {
        if (!unwrapAmount || !selectedPair || !selectedPair.secretContractAddress) return;
        onUnwrap(selectedPair.secretContractAddress, unwrapAmount);
    }, [unwrapAmount, selectedPair, onUnwrap]);

    // 如果当前步骤是 EIP712Permit，显示签名 UI
    if (currentStep === 'EIP712Permit') {
        return (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Alert
                    type="warning"
                    showIcon
                    message="EIP-712 Signature Required"
                    description={
                        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 8 }}>
                            <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 13 }}>
                                To complete the unwrap operation, you need to complete the EIP-712 authorization signature.
                            </Paragraph>

                            <div>
                                <Text strong>Type: View Permission</Text>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        Contract: {selectedPair?.secretContractAddress ? formatAddress(selectedPair.secretContractAddress) : 'N/A'}
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
                                disabled={!selectedPair?.secretContractAddress || !selectedPair?.erc20.address}
                            >
                                Sign EIP-712 Permit
                            </Button>
                        </Space>
                    }
                />
            </Space>
        );
    }

    // 如果当前步骤是 checkBalance，根据余额状态显示不同 UI
    if (currentStep === 'checkBalance') {
        // 正在读取余额
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

        // 余额为 0 或未定义，显示提示信息
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

        // 余额 > 0，显示输入框 UI
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
                        disabled={!unwrapAmount || isLoading || !selectedPair || !selectedPair.secretContractAddress}
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

    // 默认情况（不应该到达这里）
    return null;
};

export default TokenUnwrapForm;

