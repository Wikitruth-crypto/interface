"use client"
import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import { useBoxDetailContext } from '@BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@BoxDetail/Modal/modalBuyBidPay';
// import { ButtonContainer } from './buttonContainer';
import BoxActionButton from '@BoxDetail/components/boxActionButton';

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

    // const disabled = controller.isDisabled || !tokenAddress;
    const handleBuy = () => {
        onClick?.();
        setOpen(true);
    };

    return (
        <BoxActionButton controller={controller} className={className} onClick={handleBuy}>
            {/* <Button
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
            </Button> */}

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
        </BoxActionButton>
    );
};

export default React.memo(BuyButton);
