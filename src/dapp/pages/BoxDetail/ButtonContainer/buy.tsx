"use client"
import React, { useState } from 'react';
import BaseButton from '@/dapp/components/base/baseButton';
import { cn } from '@/lib/utils';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useAllowance_BoxDetail } from '@/dapp/pages/BoxDetail/hooks/useAllowanceBoxDetail';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import ApproveButton from './approve';
import Paragraph from '@/components/base/paragraph';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BuyButton: React.FC<Props> = ({ onClick, className }) => {
    const allConfigs = useAllContractConfigs();
    const { box , boxId } = useBoxDetailContext();
    const { checkAllowance_BoxDetail, isEnough } = useAllowance_BoxDetail();
    const { write_BoxDetail, error } = useWrite_BoxDetail();
    const { roles } = useBoxDetailStore(state => state.userState);
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
    
    // 使用集中的按钮交互状态
    const { currentActionFunction, isPending } = useButtonInteractionStore();

    const needAllowanceCheck = !roles.includes('Buyer');

    const handleBuy = async () => {
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
            functionName: 'buy',
            args: [boxId],
        });
    };

    // 计算按钮状态
    const isLoading = isCheckingAllowance || (currentActionFunction === 'buy' && isPending);
    const isDisabled = isCheckingAllowance || (currentActionFunction !== null && currentActionFunction !== 'buy');

    // 如果需要授权，显示授权按钮
    if (needAllowanceCheck && !isEnough) {
        return <ApproveButton className={className} />;
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
