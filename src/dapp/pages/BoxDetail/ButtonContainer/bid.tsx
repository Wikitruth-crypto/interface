'use client'
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import CalcMoney from '@/dapp/pages/BoxDetail/components/calcMoney';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useAllowance_BoxDetail } from '@/dapp/pages/BoxDetail/hooks/useAllowanceBoxDetail';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import ApproveButton from './approve';
import BaseButton from '@/dapp/components/base/baseButton';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BidButton: React.FC<Props> = ({ onClick, className }) => {
    const allConfigs = useAllContractConfigs();
    const { box , boxId } = useBoxDetailContext()
    const { checkAllowance_BoxDetail, isEnough } = useAllowance_BoxDetail();
    const { write_BoxDetail, error } = useWrite_BoxDetail();
    const { roles } = useBoxDetailStore(state => state.userState);
    
    // 使用集中的按钮交互状态
    const { currentActionFunction, isPending } = useButtonInteractionStore();
    
    const handleBid = async () => {
        onClick?.();
        await write_BoxDetail({
            contract: allConfigs.Exchange,
            functionName: 'Bid',
            args: [boxId],
        });
    }

    // 检查是否需要授权
    useEffect(() => {
        if (!roles.includes('Admin') && !roles.includes('Minter') && !roles.includes('Buyer')) {
            checkAllowance_BoxDetail(
                box?.acceptedToken as `0x${string}` || '',
                box?.price || 0
            )
        }
    }, [box, roles, checkAllowance_BoxDetail]);

    // 计算按钮状态
    const isLoading = currentActionFunction === 'bid' && isPending;
    const isDisabled = (currentActionFunction !== null && currentActionFunction !== 'bid');

    // 如果额度不足，则需要授权
    if (!isEnough) {
        return <ApproveButton className={className} />;
    }

    return (
        <div className={cn('w-full', className)}>
            <div className={'flex flex-col md:flex-row w-full items-start'}>
                <BaseButton
                    onClick={handleBid}
                    loading={isLoading}
                    disabled={isDisabled}
                >
                    Bid
                </BaseButton>
                {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
                <div className={'flex flex-col items-start '}>
                    <CalcMoney />
                </div>
            </div>
        </div>
    );
};

export default React.memo(BidButton); 