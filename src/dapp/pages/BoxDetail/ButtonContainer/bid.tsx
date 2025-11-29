'use client'
import React, { useState } from 'react';
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
    const { box , boxId } = useBoxDetailContext();
    const { checkAllowance_BoxDetail, isEnough } = useAllowance_BoxDetail();
    const { write_BoxDetail, error } = useWrite_BoxDetail();
    const { roles } = useBoxDetailStore(state => state.userState);
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
    
    // 使用集中的按钮交互状态
    const { currentActionFunction, isPending } = useButtonInteractionStore();
    
    const needAllowanceCheck = !roles.includes('Buyer');

    const handleBid = async () => {
        if (!box) return;

        if (needAllowanceCheck && box?.acceptedToken && box?.price) {
            setIsCheckingAllowance(true);
            const allowanceResult = await checkAllowance_BoxDetail(
                box?.acceptedToken as `0x${string}`,
                box?.price
            );
            setIsCheckingAllowance(false);

            if (!allowanceResult?.isEnough) {
                return;
            }
        }

        onClick?.();
        await write_BoxDetail({
            contract: allConfigs.Exchange,
            functionName: 'Bid',
            args: [boxId],
        });
    };

    // 计算按钮状态
    const isLoading = isCheckingAllowance || (currentActionFunction === 'bid' && isPending);
    const isDisabled = isCheckingAllowance || (currentActionFunction !== null && currentActionFunction !== 'bid');

    // 如果额度不足，则需要授权
    if (needAllowanceCheck && !isEnough) {
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
