"use client"
import React, { useEffect, useState } from 'react';
import BaseButton from '@/dapp/components/base/baseButton';
import { cn } from '@/lib/utils';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useAllowance_BoxDetail } from '@/dapp/pages/BoxDetail/hooks/useAllowanceBoxDetail';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
// import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import ApproveButton from './approve';
import Paragraph from '@/components/base/paragraph';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useCurrentBox } from '../hooks/useCurrentBox';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BuyButton: React.FC<Props> = ({ onClick, className }) => {
    const allConfigs = useAllContractConfigs();
    const disabled = useButtonDisabled('buyDisabled');
    // const { address } = useWalletContext();
    const { box , boxId } = useCurrentBox()
    const { checkAllowance_BoxDetail, isEnough } = useAllowance_BoxDetail();
    const { write_BoxDetail, error } = useWrite_BoxDetail();
    const { roles } = useBoxDetailStore(state => state.userState);
    
    // 使用集中的按钮交互状态
    const { currentAction, isPending } = useButtonInteractionStore();


    const handleBuy = async () => {
        if (disabled) return;
        onClick?.();
        await write_BoxDetail({
            contract: allConfigs.Exchange,
            functionName: 'buy',
            args: [boxId],
        });
    }

    // 检查是否需要授权
    useEffect(() => {
        if (!roles.includes('Admin') && !roles.includes('Minter') && !roles.includes('Buyer')) {
            checkAllowance_BoxDetail(
                box?.acceptedToken?.id || '',
                box?.price || 0
            )
        }
    }, [box?.price, roles, checkAllowance_BoxDetail]);

    // 计算按钮状态
    const isLoading = currentAction === 'buy' && isPending;
    const isDisabled = disabled || (currentAction !== null && currentAction !== 'buy');

    // 如果需要授权，显示授权按钮
    if (!isEnough) {
        return <ApproveButton className={className} />;
    }

    // 如果按钮被禁用，不显示
    if (disabled) {
        return null;
    }

    return (
        <div className={cn('w-full', className)}>
            <div className={cn('flex flex-col md:flex-row w-full items-center gap-2')}>
                <BaseButton
                    onClick={handleBuy}
                    loading={isLoading}
                    disabled={isDisabled}
                >
                    Buy
                </BaseButton>
                {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
                <div className={'flex flex-col items-center'}>
                    <Paragraph color="muted-foreground" size="sm">You can purchase this box.</Paragraph>
                </div>
            </div>
        </div>
    );
};

export default React.memo(BuyButton); 