"use client"

import React, { useMemo } from 'react';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import PriceLabel from '@/components/base/priceLabel';
import { getTokenMetadata } from '@dapp/config/contractsConfig';
import type { BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import TextP from '@/components/base/text_p';

interface Props {
    tokenId?: string,
    address?: string,
}

const CalcMoney: React.FC<Props> = () => {
    const { box, orderAmountsData } = useBoxDetailContext();
    const { address } = useWalletContext();

    if (!box || !address) {
        return <div>loading...</div>;
    }

    const orderAmountData = orderAmountsData?.find((item: BoxUserOrderAmountData) => item.token === box.acceptedToken);

    // Directly calculate the amount paid and the amount to be paid
    const oldMoney = useMemo(() => {
        return orderAmountData ? Number(orderAmountData.amount) : 0;
    }, [orderAmountData]);

    const newMoney = useMemo(() => {
        if (!box.price) return 0;
        return Math.max(0, Number(box.price) - oldMoney);
    }, [box.price, oldMoney]);

    const tokenMetadata = getTokenMetadata(box.acceptedToken as `0x${string}`);

    return (
        <>
            {oldMoney > 0 && (
                <div style={{ marginBottom: '5px' }}>
                    <TextP>In the Auction, you paid:</TextP>
                    <PriceLabel
                        price={oldMoney}
                        symbol={tokenMetadata?.symbol}
                        decimals={tokenMetadata?.decimals}
                    />
                </div>
            )}
            {newMoney > 0 && (
                <div>
                    <TextP>You need to pay:</TextP>
                    <PriceLabel
                        price={newMoney}
                        symbol={tokenMetadata?.symbol}
                        decimals={tokenMetadata?.decimals}
                    />
                </div>
            )}
        </>
    );
}

export default CalcMoney;