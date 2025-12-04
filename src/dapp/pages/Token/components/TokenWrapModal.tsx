import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Modal, Button, Space, Typography, Alert, Steps } from 'antd';
import { TokenPair } from '../types';
import { useTokenOperations } from '../hooks/useTokenOperations';
import { useReadAllowance } from '@/dapp/hooks/readContracts2/token/useReadAllowance';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useWrapSteps } from '../hooks/useWrapSteps';

const { Text } = Typography;

export interface TokenWrapModalProps {
    open: boolean;
    onClose: () => void;
    tokenPair: TokenPair;
    amount: string;
}

const TokenWrapModal: React.FC<TokenWrapModalProps> = ({
    open,
    onClose,
    tokenPair,
    amount,
}) => {
    const { address } = useAccount();
    const [hasInitialized, setHasInitialized] = useState(false);
    const { readAllowance, allowanceAmount, isEnough } = useReadAllowance();
    const { wrap, approve, status, isLoading, isSuccessed, activeButton } = useTokenOperations();

    const {
        steps,
        initializeSteps,
        updateStepStatus,
    } = useWrapSteps();

    const allowanceStep = steps.find(step => step.stepKey === 'allowance');
    const approveStep = steps.find(step => step.stepKey === 'approve');
    const wrapStep = steps.find(step => step.stepKey === 'wrap');
    const allowChecked = allowanceStep?.status === 'finish';

    const displaySteps = useMemo(() => steps.map(({ stepKey, ...rest }) => rest), [steps]);

    const checkAllowance = useCallback(async () => {
        if (!address || !tokenPair.erc20.address || !amount || !tokenPair.secretContractAddress) {
            return;
        }
        updateStepStatus('allowance', 'pending');

        const amountInWei = parseUnits(amount, tokenPair.erc20.decimals);

        try {
            const result = await readAllowance(
                tokenPair.erc20.address,
                address,
                tokenPair.secretContractAddress,
                amountInWei,
            );
            initializeSteps(result.isEnough);
            updateStepStatus('allowance', 'success');
            setHasInitialized(true);
        } catch (error) {
            console.error('Check allowance error:', error);
            updateStepStatus('allowance', 'error');
        }
    }, [tokenPair, amount, readAllowance, address, initializeSteps, updateStepStatus]);

    useEffect(() => {
        if (!open) {
            setHasInitialized(false);
            return;
        }
        if (!hasInitialized) {
            checkAllowance();
        }
    }, [open, hasInitialized, checkAllowance]);

    useEffect(() => {
        if (!open) return;

        if (activeButton === 'approve') {
            if (status === 'success') {
                updateStepStatus('approve', status);
                setTimeout(() => {
                    checkAllowance();
                }, 2000);
            } else if (status !== 'idle') {
                updateStepStatus('approve', status);
            }
        } else if (activeButton === 'wrap') {
            if (status !== 'idle') {
                updateStepStatus('wrap', status);
            }
        }
    }, [activeButton, status, open, updateStepStatus, checkAllowance]);

    const handleApproveClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;
        await approve(
            tokenPair.erc20.address,
            tokenPair.secretContractAddress,
            amount,
            tokenPair.erc20.decimals,
        );
    }, [tokenPair, amount, approve]);

    const handleWrapClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;
        await wrap(
            tokenPair.secretContractAddress,
            amount,
            tokenPair.erc20.decimals,
        );
    }, [tokenPair, amount, wrap]);

    const handleClose = () => {
        onClose();
    };

    const canApprove = !!approveStep && !isEnough && allowChecked && !isLoading;
    const canWrap = !!wrapStep && isEnough && !isLoading;
    const canClose = !isLoading;

    return (
        <Modal
            title="Wrap operation process"
            open={open}
            onCancel={handleClose}
            closable={canClose}
            maskClosable={canClose}
            footer={[
                <Button 
                key="close" 
                onClick={handleClose} 
                disabled={status === 'pending'}>
                    {isSuccessed ? 'Complete' : 'Cancel'}
                </Button>,
            ]}
            width={450}
            centered
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Alert
                    type="info"
                    message={
                        <Space direction="vertical" size="small">
                            <Text strong>
                                {tokenPair.erc20.symbol} - {tokenPair.secret?.symbol || `${tokenPair.erc20.symbol}.S`}
                            </Text>
                            <Text>Amount: {amount} {tokenPair.erc20.symbol}</Text>
                        </Space>
                    }
                    showIcon
                />

                <Steps
                    direction="vertical"
                    items={displaySteps}
                    size="small"
                />

                {!isEnough && allowChecked && (
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
                            loading={isLoading}
                            disabled={!canApprove}
                            block
                        >
                            Approve {amount} {tokenPair.erc20.symbol}
                        </Button>
                    </Space>
                )}

                {approveStep?.status === 'process' && (
                    <Alert type="info" message="Approving token..." showIcon />
                )}

                {canWrap && (
                    <Button
                        type="primary"
                        onClick={handleWrapClick}
                        loading={isLoading}
                        disabled={!canWrap}
                        block
                    >
                        Wrap {amount} {tokenPair.erc20.symbol} to {tokenPair.secret?.symbol || 'Secret Token'}
                    </Button>
                )}

                {steps.some(step => step.status === 'error') && (
                    <Alert
                        type="error"
                        message="Operation failed"
                        description="Please check network connection and wallet status, then try again."
                        showIcon
                    />
                )}

                {isSuccessed && (
                    <Alert type="success" message="Wrap operation completed successfully" showIcon />
                )}
            </Space>
        </Modal>
    );
};

export default TokenWrapModal;
