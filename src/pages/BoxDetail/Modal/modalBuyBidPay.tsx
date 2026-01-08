

/**
 * Buy, Bid, Pay Confidentiality Fee
 * 1. Check allowance
 * 2. If insufficient, approve
 * 3. After approval success, no need to check again, assume sufficient.
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, Space, Alert, Steps } from 'antd';
import { formatUnits, parseUnits } from 'viem';
import { useBuyBidSteps } from '../hooks/useBuyBidSteps';
import { useTokenMetadata } from '@dapp/config/contractsConfig';
import { parseAmountToBigInt } from '@/utils/parseAmountToBigInt';
import TextP from '@/components/base/text_p';


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
        // allowanceAmount,
        formattedAllowanceAmount,
    } = useBuyBidSteps(boxId, tokenMetadata, amount, functionName);


    if (!tokenMetadata || !amount) {
        return null;
    }

    // Use helper function to safely convert amount string to BigInt
    // This handles scientific notation strings (e.g. "2.8377840380332334e+22")
    const amountBigInt = parseAmountToBigInt(amount);
    const formattedAmount = formatUnits(amountBigInt, tokenMetadata.decimals);

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
                            <TextP type="info">
                                You are about to {functionName} this box.
                            </TextP>
                            <TextP>Price: {formattedAmount} {tokenMetadata?.symbol}</TextP>
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
                                    <TextP>
                                        Allowance is not enough. Current: {formattedAllowanceAmount}, Required: {amount}
                                    </TextP>
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
                            Approve {formattedAmount} {tokenMetadata?.symbol}
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
