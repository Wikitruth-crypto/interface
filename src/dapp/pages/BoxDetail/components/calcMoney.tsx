"use client"

import React, { useState, useEffect, useContext } from 'react';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import PriceLabel from '@/dapp/components/base/priceLabel';
// import { useSupportedTokens } from '@/dapp/contractsConfig';
import { useExchange } from '@/dapp/hooks/readContracts/useExchange';
import { SUPPORTED_TOKENS, TokenMetadata } from '@/dapp/contractsConfig';

interface Props {
    tokenId?: string,
    address?: string,
}

const CalcMoney: React.FC<Props> = () => {
    const { box , boxId } = useBoxDetailContext();
    const { calcPayMoney } = useExchange();

    if (!box) {
        return <div>loading...</div>;
    }

    const [newMoney, setNewMoney] = useState<number>(0)
    const [oldMoney, setOldMoney] = useState<number>(0)

    useEffect(() => {
        if (
            box.price 
        ) {
            const fetchCalcMoney = async () => {
                const money = await calcPayMoney(Number(boxId));
                setNewMoney(money);
                const oldMoney = Number(box.price) - money;
                setOldMoney(oldMoney);
            }
            fetchCalcMoney();
        }
    }, [box.price]);

    const tokenSymbol = SUPPORTED_TOKENS.find((token: TokenMetadata) => token.address === box.acceptedToken)?.symbol;

    return (
        <>
            {
                oldMoney > 0 &&
                <div style={{ marginBottom: '5px' }}>
                    {/* <p>In the Auction, you have:</p> */}
                    <PriceLabel
                        prefix='In the Auction, you paid:'
                        price={oldMoney}
                        symbol={tokenSymbol}
                        // decimals={tokenDecimals}
                        token={box.acceptedToken}
                        fontSize={14}
                        fontSizeSuffix={12}
                    />
                </div>
            }

            <div>
                {/* <p>You need to pay:</p> */}
                <PriceLabel
                    prefix='You need to pay:'
                    price={newMoney}
                    symbol={tokenSymbol}
                    // decimals={tokenDecimals}
                    token={box.acceptedToken}
                    fontSize={14}
                    fontSizeSuffix={12}
                />
            </div>
        </>

    );
}

export default CalcMoney;