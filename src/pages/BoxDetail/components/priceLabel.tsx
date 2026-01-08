"use client"
import React, { useState, useEffect } from 'react';
// import { Typography } from 'antd';
import TextP from '@/components/base/text_p';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import useGetTokenPrice from '@dapp/config/contractsConfig/useGetTokenPrice';
import PriceLabel from '@/components/base/priceLabel';
import { getTokenMetadata } from '@dapp/config/contractsConfig';

interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceContainer: React.FC<Props> = ({ price, token, status, }) => {

    const { getTokenPrice } = useGetTokenPrice();

    const [priceUSD, setPriceUSD] = useState<number>(0);
    const tokenMetadata = getTokenMetadata(token);
    useEffect(() => {
        if (tokenMetadata) {
            getTokenPrice(tokenMetadata.address, Number(price)).then((priceUSD) => {
                setPriceUSD(priceUSD);
            });
        }
    }, [tokenMetadata, price]);

    const isDisplay = status !== 'Published' && status !== 'Blacklisted';
    return (
        <>
            {isDisplay && (
                <div className="flex items-baseline flex-row gap-2">
                    <TextP>Price:</TextP>
                    <PriceLabel
                        size="xl"
                        price={price}
                        symbol={tokenMetadata?.symbol}
                        decimals={tokenMetadata?.decimals}
                    />
                    {priceUSD > 0 && (
                        <span className="flex items-baseline flex-row gap-2">
                            <TextP>≈</TextP>
                            <PriceLabel
                                size="lg"
                                price={priceUSD}
                                symbol="USD"
                            />
                        </span>
                    )}
                </div>
            )}
        </>
    );
}

export default PriceContainer;
