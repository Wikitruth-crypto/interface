"use client"
import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import CalcMoney from '@/dapp/pages/BoxDetail/components/calcMoney';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';
import { useBoxDetailContext } from '@/dapp/pages/BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@/dapp/pages/BoxDetail/Modal/modalBuyBidPay';
import { cn } from '@/lib/utils';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BidButton: React.FC<Props> = ({ onClick, className }) => {
    const controller = useBoxActionController(boxActionConfigs.bid);
    const { box } = useBoxDetailContext();
    const [open, setOpen] = useState(false);

    const tokenAddress = box?.acceptedToken as `0x${string}` | undefined;
    const amount = useMemo(() => {
        const price = box?.price;
        return price ? price.toString() : '0';
    }, [box?.price]);

    const disabled = controller.isDisabled || !tokenAddress;

    return (
        <>
            <Button
                type="primary"
                disabled={disabled}
                loading={controller.isLoading}
                className={className}
                onClick={() => {
                    onClick?.();
                    setOpen(true);
                }}
                block
            >
                Bid
            </Button>

            <div className={cn('mt-2')}>
                <CalcMoney />
            </div>

            {tokenAddress && (
                <ModalBuyBidPay
                    open={open}
                    onClose={() => setOpen(false)}
                    boxId={box?.id?.toString() || ''}
                    tokenAddress={tokenAddress}
                    amount={amount}
                    functionName="bid"
                />
            )}
        </>
    );
};

export default React.memo(BidButton);
