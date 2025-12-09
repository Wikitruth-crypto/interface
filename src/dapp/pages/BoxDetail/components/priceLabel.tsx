"use client"
import React, { useState, useEffect } from 'react';
// import { Typography } from 'antd';

import { BoxStatus } from '@/dapp/types/contracts/truthBox';
import useGetTokenPrice from '@/dapp/contractsConfig/useGetTokenPrice';
import PriceLabel from '@/dapp/components/base/priceLabel';
import Paragraph from '@/components/base/paragraph';
import { SUPPORTED_TOKENS, TokenMetadata } from '@/dapp/contractsConfig';

interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceContainer: React.FC<Props> = ({ price, token, status, }) => {

    const { getTokenPrice } = useGetTokenPrice();

    const [priceUSD, setPriceUSD] = useState<number>(0);
    const tokenMetadata = SUPPORTED_TOKENS.find((tokens: TokenMetadata) => tokens.address === token as `0x${string}`);
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
                <div className="flex items-baseline">
                    <Paragraph color="gray-3" size="sm" className="mr-2">Price:</Paragraph>
                    <PriceLabel
                        price={price}
                        variant="large"
                        symbol={tokenMetadata?.symbol}
                        decimals={tokenMetadata?.decimals}
                    />
                    {priceUSD > 0 && (
                        <PriceLabel
                            variant="large"
                            prefix={`≈`}
                            price={priceUSD}
                            symbol="USD"
                        />)}
                </div>
            )}
        </>
    );
}

export default PriceContainer;
