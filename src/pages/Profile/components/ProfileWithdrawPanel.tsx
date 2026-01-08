import React, { useEffect } from 'react';
import WithdrawCard from '@/components/witrhdrawCard';
import { formatAmount } from '@dapp/utils/formatAmount';
import { useWithdrawStore } from '../store/withdrawStore';
import { useWithdraw } from '../hooks/useWithdraw';
// import { cn } from '@/lib/utils';

export interface ProfileWithdrawPanelProps {
    className?: string;
}

const WITHDRAW_METHODS = ['withdrawOrderAmounts', 'withdrawRefundAmounts'] as const;

type SupportedMethod = (typeof WITHDRAW_METHODS)[number];

const getWithdrawLabel = (type: string | null) => {
    if (type === 'Refund') {
        return 'Refund Amount';
    }
    return 'Order Amount';
};

const ProfileWithdrawPanel: React.FC<ProfileWithdrawPanelProps> = () => {
    const { withdraw, isLoading, isSuccessed, error } = useWithdraw();
    const { withdrawData, canClaim, totalAmount , resetWithdrawData} = useWithdrawStore();

    // Reset withdraw data when withdrawal succeeds (delay a bit for UI feedback)
    useEffect(() => {
        if (isSuccessed) {
            const timer = setTimeout(() => {
                resetWithdrawData();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccessed, resetWithdrawData]);

    const hasSelection = canClaim();
    const method = withdrawData.selectedClaimMethod as SupportedMethod | null;
    const shouldDisplay = hasSelection && !!method && WITHDRAW_METHODS.includes(method);

    const rawAmount = shouldDisplay ? totalAmount() : BigInt(0);
    const decimals = withdrawData.selectedTokenDecimals ?? 18;
    const tokenSymbol = withdrawData.selectedTokenSymbol ?? '';
    const formattedAmount = shouldDisplay ? formatAmount(rawAmount, decimals, 4) : '0.0000';
    const selectedCount = withdrawData.selectedBoxes?.length ?? 0;
    const label = getWithdrawLabel(withdrawData.selectedType ?? null);
    const message = shouldDisplay
        ? `Selected ${selectedCount} boxes, ready to withdraw ${label}${tokenSymbol ? `（${tokenSymbol}）` : ''}`
        : 'Please select the funds to withdraw';

    const handleWithdraw = () => {
        withdraw().catch((err) => console.error('withdraw failed', err));
    };

    const handleCancel = () => {
        resetWithdrawData();
    };

    if (!shouldDisplay) {
        return null;
    }

    return (
            <WithdrawCard
                formattedAmount={formattedAmount}
                tokenSymbol={tokenSymbol}
                message={message}
                buttonText={`Withdraw ${label}`}
                disabled={!shouldDisplay || isLoading}
                isLoading={isLoading}
                isSuccess={isSuccessed}
                error={error?.message}
                submit={handleWithdraw}
                cancel={handleCancel}
                className='mb-3!'
            />
    );
};

export default ProfileWithdrawPanel;
