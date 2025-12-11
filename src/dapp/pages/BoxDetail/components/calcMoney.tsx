"use client"

import React, { useMemo } from 'react';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import PriceLabel from '@/dapp/components/base/priceLabel';
import { getTokenMetadata } from '@/dapp/contractsConfig';
import type { BoxUserOrderAmountData } from '@/dapp/services/supabase/fundsBox';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';

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

    // 直接计算已支付金额和需要支付金额
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
                    {/* <Typography.Paragraph>In the Auction, you paid:</Typography.Paragraph> */}
                    <PriceLabel
                        prefix='In the Auction, you paid:'
                        price={oldMoney}
                        symbol={tokenMetadata?.symbol}
                        decimals={tokenMetadata?.decimals}
                    />
                </div>
            )}
            {newMoney > 0 && (
                <div>
                    <PriceLabel
                        prefix='You need to pay:'
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