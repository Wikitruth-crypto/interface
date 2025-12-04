import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Steps, Button, Space, Typography, Alert } from 'antd';
import { TokenPair } from '../types';
import { useTokenOperations } from '../hooks/useTokenOperations';
import { useReadAllowance } from '@/dapp/hooks/readContracts2/token/useReadAllowance';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';

const { Text } = Typography;

export interface TokenWrapModalProps {
    open: boolean;
    onClose: () => void;
    tokenPair: TokenPair;
    amount: string;
    wrapLoading: boolean;
    approveLoading: boolean;
    wrapStatus: 'idle' | 'error' | 'loading' | 'success';
    approveStatus: 'idle' | 'error' | 'loading' | 'success';
}

type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/**
 * Component for Wrap operation modal with workflow steps
 * Wrap 操作弹窗组件（包含流程步骤）
 */
const TokenWrapModal: React.FC<TokenWrapModalProps> = ({
    open,
    onClose,
    tokenPair,
    amount,
    wrapLoading,
    approveLoading,
    wrapStatus,
    approveStatus,
}) => {
    const { address } = useAccount();
    const { 
        readAllowance,
        allowanceAmount,
        isEnough,
        } = useReadAllowance();
        const {
            wrap,
            unwrap,
            deposit,
            withdraw,
            approve,
            isLoading,
            status,
            activeButton,
        } = useTokenOperations();
    const [steps, setSteps] = useState<Array<{ title: string; description: string; status: StepStatus }>>([
        {
            title: 'Checking allowance...',
            description: 'Checking allowance...',
            status: 'wait',
        },
        {
            title: 'Approve (if needed)',
            description: 'Allowance is not enough, need to approve',
            status: 'wait',
        },
        {
            title: 'Wrap',
            description: 'Executing Wrap operation',
            status: 'wait',
        },
    ]);
    // const [isEnough, setIsEnough] = useState<boolean>(false);
    // const [allowanceAmount, setAllowanceAmount] = useState<number>(0);

    // 重置步骤状态当弹窗打开
    useEffect(() => {
        if (open) {
            setSteps([
                {
                    title: 'Checking allowance...',
                    description: 'Checking allowance...',
                    status: 'wait',
                },
                {
                    title: 'Approve (if needed)',
                    description: 'Allowance is not enough, need to approve',
                    status: 'wait',
                },
                {
                    title: 'Wrap',
                    description: 'Executing Wrap operation',
                    status: 'wait',
                },
            ]);
            // setIsEnough(false);
            // setAllowanceAmount(0);
            // 自动开始检查授权额度
            if (tokenPair && amount && parseFloat(amount) > 0 && tokenPair.secretContractAddress) {
                // 使用 setTimeout 确保状态已重置
                setTimeout(() => {
                    handleCheckAllowance();
                }, 100);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // 检查授权额度（初始检查）
    const handleCheckAllowance = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;

        setSteps(prev => {
            const newSteps = [...prev];
            newSteps[0].status = 'process';
            newSteps[0].description = 'Checking allowance...';
            return newSteps;
        });

        if (!address || !tokenPair.erc20.address || !tokenPair.secretContractAddress) return;

        const amountInWei = parseUnits(amount, tokenPair.erc20.decimals);

        try {
            const result = await readAllowance(
                tokenPair.erc20.address,
                address,
                tokenPair.secretContractAddress,
                amountInWei,
                
            );

            // setIsEnough(result.isEnough);
            // setAllowanceAmount(result.allowanceAmount);

            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[0].status = 'finish';
                newSteps[0].description = result.isEnough
                    ? 'Allowance is enough'
                    : `Current allowance: ${formatUnits(BigInt(result.allowanceAmount.toString()), tokenPair.erc20.decimals)}`;

                if (result.isEnough) {
                    // 授权足够，跳过步骤2，激活步骤3
                    newSteps[1].status = 'wait';
                    newSteps[2].status = 'wait';
                } else {
                    // 授权不足，激活步骤2
                    newSteps[1].status = 'wait';
                    newSteps[2].status = 'wait';
                }
                return newSteps;
            });
        } catch (error) {
            console.error('Check allowance error:', error);
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[0].status = 'error';
                newSteps[0].description = 'Checking allowance failed';
                return newSteps;
            });
        }
    }, [tokenPair, amount, readAllowance, address]);

    // 检查授权额度（Approve 成功后重新检查）
    const handleCheckAllowanceAfterApprove = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;

        // 不改变步骤状态，只更新描述和 isEnough
        setSteps(prev => {
            const newSteps = [...prev];
            newSteps[0].description = 'Rechecking allowance...';
            return newSteps;
        });
        if (!address || !tokenPair.erc20.address || !tokenPair.secretContractAddress) return;

        const amountInWei = parseUnits(amount, tokenPair.erc20.decimals);

        try {
            const result = await readAllowance(
                tokenPair.erc20.address,
                address,
                tokenPair.secretContractAddress,
                amountInWei,
            );

            // setIsEnough(result.isEnough);
            // setAllowanceAmount(result.allowanceAmount);

            setSteps(prev => {
                const newSteps = [...prev];
                // 保持步骤1为 finish，只更新描述
                newSteps[0].status = 'finish';
                newSteps[0].description = result.isEnough
                    ? 'Allowance is enough'
                    : `Current allowance: ${formatUnits(BigInt(result.allowanceAmount.toString()), tokenPair.erc20.decimals)}`;

                // 保持步骤2为 finish（因为已经授权成功）
                if (newSteps[1].status !== 'finish') {
                    newSteps[1].status = 'finish';
                }

                if (result.isEnough) {
                    // 授权足够，激活步骤3
                    newSteps[2].status = 'wait';
                } else {
                    // 授权仍然不足（理论上不应该发生，但处理一下）
                    newSteps[2].status = 'wait';
                }
                return newSteps;
            });
        } catch (error) {
            console.error('Recheck allowance error:', error);
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[0].description = 'Rechecking allowance failed';
                return newSteps;
            });
        }
    }, [tokenPair, amount, readAllowance, address]);

    // 监听 approveStatus 变化
    useEffect(() => {
        if (approveStatus === 'loading') {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[1].status = 'process';
                newSteps[1].description = 'Approving...';
                return newSteps;
            });
        } else if (approveStatus === 'success') {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[1].status = 'finish';
                newSteps[1].description = 'Approve success';
                // 保持步骤1为 finish 状态，不要重置
                if (newSteps[0].status !== 'finish') {
                    newSteps[0].status = 'finish';
                }
                return newSteps;
            });
            // 授权成功后，重新检查授权额度
            setTimeout(() => {
                // 重新检查时，只更新步骤1的描述和 isEnough 状态，不改变步骤1的状态
                handleCheckAllowanceAfterApprove();
            }, 2000); // 等待2秒后重新检查，确保链上状态已更新
        } else if (approveStatus === 'error') {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[1].status = 'error';
                newSteps[1].description = 'Approve failed';
                return newSteps;
            });
        }
    }, [approveStatus, handleCheckAllowanceAfterApprove]);

    // 监听 wrapStatus 变化
    useEffect(() => {
        if (wrapStatus === 'loading') {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[2].status = 'process';
                newSteps[2].description = 'Executing Wrap operation...';
                return newSteps;
            });
        } else if (wrapStatus === 'success') {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[2].status = 'finish';
                newSteps[2].description = 'Wrap operation success';
                return newSteps;
            });
        } else if (wrapStatus === 'error') {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[2].status = 'error';
                newSteps[2].description = 'Wrap operation failed';
                return newSteps;
            });
        }
    }, [wrapStatus]);

    // 处理授权按钮点击
    const handleApproveClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;
        await approve(
            tokenPair.erc20.address, 
            tokenPair.secretContractAddress, 
            amount, 
            tokenPair.erc20.decimals
        );
    }, [tokenPair, amount, approve]);


    // 处理 Wrap 按钮点击
    const handleWrapClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;
        await wrap(
            tokenPair.secretContractAddress, 
            amount, 
            tokenPair.erc20.decimals
        );
    }, [tokenPair, amount, wrap]);

    // 处理关闭弹窗
    const handleClose = useCallback(() => {
        if (wrapStatus === 'loading' || approveStatus === 'loading') {
            // 如果正在执行操作，不允许关闭
            return;
        }
        onClose();
    }, [wrapStatus, approveStatus, onClose]);

    const canApprove = steps[1].status === 'wait' && !isEnough && !approveLoading;
    const canWrap = steps[0].status === 'finish' && isEnough && steps[2].status === 'wait' && !wrapLoading;
    const canClose = wrapStatus === 'success' || (wrapStatus !== 'loading' && approveStatus !== 'loading');

    return (
        <Modal
            title="Wrap operation process"
            open={open}
            onCancel={handleClose}
            closable={canClose}
            maskClosable={canClose}
            footer={[
                <Button key="close" onClick={handleClose} disabled={!canClose}>
                    {wrapStatus === 'success' ? 'Complete' : 'Cancel'}
                </Button>,
            ]}
            width={600}
            centered
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 显示代币信息 */}
                <Alert
                    type="info"
                    message={
                        <Space direction="vertical" size="small">
                            <Text strong>
                                {tokenPair.erc20.symbol} → {tokenPair.secret?.symbol || `${tokenPair.erc20.symbol}.S`}
                            </Text>
                            <Text>Amount: {amount} {tokenPair.erc20.symbol}</Text>
                        </Space>
                    }
                    showIcon
                />

                {/* 步骤显示 */}
                <Steps
                    direction="vertical"
                    items={steps}
                    size="small"
                />

                {/* 步骤2：授权按钮 */}
                {steps[1].status === 'wait' && !isEnough && steps[0].status === 'finish' && (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Alert
                            type="warning"
                            message={
                                <Space direction="vertical" size="small">
                                    <Text>
                                        Allowance is not enough. Current: {formatUnits(BigInt(allowanceAmount.toString()), tokenPair.erc20.decimals)}, Required: {amount}
                                    </Text>
                                </Space>
                            }
                            showIcon
                        />
                        <Button
                            type="primary"
                            onClick={handleApproveClick}
                            loading={approveLoading}
                            disabled={!canApprove}
                            block
                        >
                            Approve {amount} {tokenPair.erc20.symbol}
                        </Button>
                    </Space>
                )}

                {/* 步骤2：授权进行中或完成 */}
                {steps[1].status === 'process' && (
                    <Alert
                        type="info"
                        message="Approving token..."
                        showIcon
                    />
                )}

                {/* 步骤2：授权完成，等待重新检查 */}
                {steps[1].status === 'finish' && !isEnough && steps[0].description.includes('Rechecking') && (
                    <Alert
                        type="info"
                        message="Approve successful, rechecking allowance..."
                        showIcon
                    />
                )}

                {/* 步骤3：Wrap 按钮 */}
                {canWrap && (
                    <Button
                        type="primary"
                        onClick={handleWrapClick}
                        loading={wrapLoading}
                        disabled={!canWrap}
                        block
                    >
                        Wrap {amount} {tokenPair.erc20.symbol} to {tokenPair.secret?.symbol || 'Secret Token'}
                    </Button>
                )}

                {/* 错误提示 */}
                {steps.some(step => step.status === 'error') && (
                    <Alert
                        type="error"
                        message="Operation failed"
                        description="Please check network connection and wallet status, then try again."
                        showIcon
                    />
                )}

                {/* 成功提示 */}
                {wrapStatus === 'success' && (
                    <Alert
                        type="success"
                        message="Wrap operation completed successfully"
                        showIcon
                    />
                )}
            </Space>
        </Modal>
    );
};

export default TokenWrapModal;

