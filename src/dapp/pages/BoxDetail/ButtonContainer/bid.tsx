'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import CalcMoney from '@/dapp/pages/BoxDetail/components/calcMoney';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BidButton: React.FC<Props> = ({ onClick, className }) => {
    const controller = useBoxActionController(boxActionConfigs.bid);

    return (
        <BoxActionButton controller={controller} className={className} onClick={onClick}>
            <div className={cn('flex flex-col items-start w-full')}>
                <CalcMoney />
            </div>
        </BoxActionButton>
    );
};

export default React.memo(BidButton);
