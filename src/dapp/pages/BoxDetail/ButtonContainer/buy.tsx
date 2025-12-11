"use client"
import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';
import { useBoxDetailContext } from '@/dapp/pages/BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@/dapp/pages/BoxDetail/Modal/modalBuyBidPay';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BuyButton: React.FC<Props> = ({ onClick, className }) => {
    const controller = useBoxActionController(boxActionConfigs.buy);
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
                Buy
            </Button>

            {tokenAddress && (
                <ModalBuyBidPay
                    open={open}
                    onClose={() => setOpen(false)}
                    boxId={box?.id?.toString() || ''}
                    tokenAddress={tokenAddress}
                    amount={amount}
                    functionName="buy"
                />
            )}
        </>
    );
};

export default React.memo(BuyButton);
