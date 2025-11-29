"use client"
import React from 'react';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BuyButton: React.FC<Props> = ({ onClick, className }) => {
    const controller = useBoxActionController(boxActionConfigs.buy);

    return (
        <BoxActionButton controller={controller} className={className} onClick={onClick} />
    );
};

export default React.memo(BuyButton);
