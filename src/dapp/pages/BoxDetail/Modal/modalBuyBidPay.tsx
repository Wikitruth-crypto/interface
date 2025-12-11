

/**
 * 购买、竞拍、支付保密费
 * 1. 检查授权
 * 2. 如果不足，则授权
 * 3. 授权成功后不需要再检查授权，直接默认授权足够。
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, Space, Typography, Alert, Steps } from 'antd';
import { formatUnits, parseUnits } from 'viem';
import { useBuyBidSteps } from '../hooks/useBuyBidSteps';
import { useTokenMetadata } from '@/dapp/contractsConfig';

const { Text } = Typography;

export interface ModalBuyBidPayProps {
    open: boolean;
    onClose: () => void;
    boxId: string;
    tokenAddress: `0x${string}`;
    amount: string;
    functionName: 'buy' | 'bid' | 'payConfiFee';
}

const ModalBuyBidPay: React.FC<ModalBuyBidPayProps> = ({
    open,
    onClose,
    boxId,
    tokenAddress,
    amount,
    functionName,
}) => {
    const tokenMetadata = useTokenMetadata(tokenAddress);

    const {
        steps,
        checkAllowance,
        handleApproveClick,
        handleBuyBidClick,
        isLoading,
        isSuccessed,
        status,
        currentStepItem,
        allowanceAmount,
    } = useBuyBidSteps(boxId, tokenMetadata, amount, functionName);


    if (!tokenMetadata) {
        return null;
    }

    const canApprove = currentStepItem.stepKey === 'approve' && currentStepItem.status !== 'finish';
    const canBuyBid = currentStepItem.stepKey === 'buy' || currentStepItem.stepKey === 'bid' || currentStepItem.stepKey === 'payConfiFee';


    const displaySteps = useMemo(
        () => steps.map(({ stepKey, ...rest }) => ({ key: stepKey, ...rest })),
        [steps],
    );

    useEffect(() => {
        if (!open) return;
        checkAllowance('init');
    }, [open, tokenAddress]);

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
                                You are about to {functionName} this box.
                            </Text>
                            <Text>Price: {amount} {tokenMetadata?.symbol}</Text>
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
                                        Allowance is not enough. Current: {formatUnits(allowanceAmount, tokenMetadata.decimals)}, Required: {amount}
                                    </Text>
                                </Space>
                            }
                            showIcon
                        />
                        <Button
                            type="primary"
                            onClick={() => handleApproveClick(false)}
                            loading={isLoading}
                            disabled={!canApprove}
                            block
                        >
                            Approve {amount} {tokenMetadata?.symbol}
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => handleApproveClick(true)}
                            loading={isLoading}
                            disabled={!canApprove}
                            block
                        >
                            Approve Max(uint256)
                        </Button>
                    </Space>
                )}

                {currentStepItem.stepKey === 'approve' && currentStepItem.status === 'process' && (
                    <Alert type="info" message="Approving token..." showIcon />
                )}

                {canBuyBid && (
                    <Button
                        type="primary"
                        onClick={handleBuyBidClick}
                        loading={isLoading}
                        disabled={!canBuyBid}
                        block
                    >
                        {functionName}
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

export default ModalBuyBidPay;
