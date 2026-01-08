"use client"
import React, { useMemo, useState } from 'react';
import CalcMoney from '@BoxDetail/components/calcMoney';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import { useBoxDetailContext } from '@BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@BoxDetail/Modal/modalBuyBidPay';
import BoxActionButton from '@BoxDetail/components/boxActionButton';

interface Props {
    onClick?: () => void;
    className?: string;
}

const BidButton: React.FC<Props> = ({ onClick, className }) => {
    const controller = useBoxActionController(boxActionConfigs.bid);
    const { box } = useBoxDetailContext();
    const [open, setOpen] = useState(false);
    const handleBid = () => {
        onClick?.();
        setOpen(true);
    };

    const tokenAddress = box?.acceptedToken as `0x${string}` | undefined;
    const amount = useMemo(() => {
        const price = box?.price;
        return price ? price.toString() : '0';
    }, [box?.price]);

    // const disabled = controller.isDisabled || !tokenAddress;

    return (
        <BoxActionButton controller={controller} className={className} onClick={handleBid}>
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
                Bid
            </Button> */}

            <div className='w-full mt-2 flex-col'>
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

        </BoxActionButton>
    );
};

export default React.memo(BidButton);
