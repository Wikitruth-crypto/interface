"use client"

import React, { useState, useEffect} from 'react';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import PriceLabel from '@/dapp/components/base/priceLabel';
// import { useExchange } from '@/dapp/hooks/readContracts/useExchange';
import { SUPPORTED_TOKENS, TokenMetadata } from '@/dapp/contractsConfig';
import { useButtonActive } from '../hooks/useButtonActive';
// import { Typography } from 'antd';
import { BoxUserOrderAmountData } from '../types/boxDetailData';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';

interface Props {
    tokenId?: string,
    address?: string,
}

const CalcMoney: React.FC<Props> = () => {
    const { box, boxId, orderAmountsData } = useBoxDetailContext();
    const { address } = useWalletContext();
    // const { calcPayMoney } = useExchange();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [newMoney, setNewMoney] = useState<number>(0)
    const [orderAmount, setOrderAmount] = useState<number>(0)

    if (!box || !address) {
        return <div>loading...</div>;
    } else {
        let isActive = false;
        if (box.status === 'Auctioning') {
            isActive = useButtonActive('bidActive') || false;

        } else if (box.status === 'Selling') {
            isActive = useButtonActive('sellActive') || false;
        }
        setIsActive(isActive);
    }

    const orderAmountData = orderAmountsData?.find((item: BoxUserOrderAmountData) => item.token === box.acceptedToken);

    useEffect(() => {
        if (
            box.price
            && isActive
            && orderAmountData
        ) {
            // const fetchCalcMoney = async () => {
                // const money = await calcPayMoney(Number(boxId), address);
                // setNewMoney(money);
                // const oldMoney = Number(box.price) - money;
                // setOldMoney(oldMoney);
            // }
            // fetchCalcMoney();
            setOrderAmount(Number(orderAmountData?.amount));
            setNewMoney(Number(box.price) - Number(orderAmountData?.amount));
        } 
    }, [box.price, isActive, orderAmountData]);

    const tokenSymbol = SUPPORTED_TOKENS.find((token: TokenMetadata) => token.address === box.acceptedToken)?.symbol;

    return (
        <>
            {
                (orderAmount > 0) && (
                    <div style={{ marginBottom: '5px' }}>
                        {/* <Typography.Paragraph>In the Auction, you paid:</Typography.Paragraph> */}
                        <PriceLabel
                            prefix='In the Auction, you paid:'
                            price={orderAmount}
                            symbol={tokenSymbol}
                            token={box.acceptedToken}
                            fontSize={14}
                            fontSizeSuffix={12}
                        />
                    </div>
                )}
            {isActive ? (
                <div>
                    {/* <Typography.Paragraph>You need to pay:</Typography.Paragraph> */}
                    <PriceLabel
                        prefix='You need to pay:'
                        price={newMoney}
                        symbol={tokenSymbol}
                        token={box.acceptedToken}
                        fontSize={14}
                        fontSizeSuffix={12}
                    />
                </div>
            ) : null}
        </>

    );
}

export default CalcMoney;