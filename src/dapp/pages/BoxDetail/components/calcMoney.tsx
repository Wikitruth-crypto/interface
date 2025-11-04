"use client"

import React, { useState, useEffect, useContext } from 'react';
import { ContractContext } from '@/dapp/context/contractContext';
// import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
import { useBoxContext } from '../contexts/BoxContext';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import PriceLabel from '@/dapp/components/base/priceLabel';
import { useSupportedTokens } from '@/dapp/contractsConfig';

interface Props {
    tokenId?: string,
    address?: string,
}

const CalcMoney: React.FC<Props> = () => {
    // const tokenId = useBoxDetailStore(state => state.tokenId);
    const { box , boxId } = useBoxContext();
    const supportedTokens = useSupportedTokens();
    // const roles = useBoxDetailStore(state => state.userState.roles);

    if (!box) {
        return <div>loading...</div>;
    }

    const {
        calcPayMoney,
    } = useContext(ContractContext);

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

    return (
        <>
            {
                oldMoney > 0 &&
                <div style={{ marginBottom: '5px' }}>
                    {/* <p>In the Auction, you have:</p> */}
                    <PriceLabel
                        prefix='In the Auction, you paid:'
                        price={oldMoney}
                        // symbol={tokenSymbol}
                        // decimals={tokenDecimals}
                        token={box.acceptedToken?.id}
                        tokens={supportedTokens}
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
                    // symbol={tokenSymbol}
                    // decimals={tokenDecimals}
                    token={box.acceptedToken?.id}
                    tokens={supportedTokens}
                    fontSize={14}
                    fontSizeSuffix={12}
                />
            </div>
        </>

    );
}

export default CalcMoney;