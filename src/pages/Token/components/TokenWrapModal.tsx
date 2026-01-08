import React, { useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, Space, Typography, Alert, Steps } from 'antd';
import { TokenPair } from '../types';
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

    const {
        steps,
        checkAllowance,
        handleApproveClick,
        handleApproveMaxClick,
        handleWrapClick,
        // isPending,
        isLoading,
        isSuccessed,
        status,
        // activeButton,
        currentStepItem,
        allowanceAmount,
    } = useWrapSteps(tokenPair, amount);

    const canApprove = currentStepItem.stepKey === 'approve' && currentStepItem.status !== 'finish';
    const canWrap = currentStepItem.stepKey === 'wrap' && currentStepItem.status !== 'finish';
    // const canClose = !isLoading;

    const displaySteps = useMemo(
        () => steps.map(({ stepKey, ...rest }) => ({ key: stepKey, ...rest })),
        [steps],
    );

    useEffect(() => {
        if (!open) {
            return;
        } else {
            checkAllowance('init');
        }
    }, [open]);

    const handleClose = () => {
        onClose();
    };
    return (
        <Modal
            title="Wrap operation process"
            open={open}
            onCancel={handleClose}
            closable={status !== 'pending'}
            maskClosable={status !== 'pending'}
            footer={[
                <Button 
                key="close" 
                onClick={handleClose} 
                disabled={status === 'pending' || isLoading}>
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

                {canApprove && (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Alert
                            type="warning"
                            message={
                                <Space direction="vertical" size="small">
                                    <Text>
                                        Allowance is not enough. Current: {formatUnits(allowanceAmount, tokenPair.erc20.decimals)}, Required: {amount}
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
                            {isLoading ? 'Waiting...' : `Approve ${amount} ${tokenPair.erc20.symbol}...`}
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleApproveMaxClick}
                            loading={isLoading}
                            disabled={!canApprove}
                            block
                        >
                            {isLoading ? 'Waiting...' : 'Approve Max(uint256)'}
                        </Button>
                    </Space>
                )}

                {currentStepItem.stepKey === 'approve' && currentStepItem.status === 'process' && (
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
                        {isLoading ? 'Waiting...' : `Wrap ${amount} ${tokenPair.erc20.symbol} to ${tokenPair.secret?.symbol || 'Secret Token'}...`}
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
