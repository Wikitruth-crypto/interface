"use client"
import React from 'react';
// import { Typography } from 'antd';

import { BoxStatus } from '@/dapp/types/contracts/truthBox';

import PriceLabel from '@/dapp/components/base/priceLabel';
import Paragraph from '@/components/base/paragraph';
import { SUPPORTED_TOKENS, TokenMetadata } from '@/dapp/contractsConfig';

interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceContainer: React.FC<Props> = ({ price, token, status, }) => {
    const tokenMetadata = SUPPORTED_TOKENS.find((tokens: TokenMetadata) => tokens.address === token as `0x${string}`);

    const isDisplay = status !== 'Published' && status !== 'Blacklisted';
    return (
        <>
            {isDisplay && (
                <div className="flex items-baseline">
                    <Paragraph color="gray-3" size="sm" className="mr-2">Price:</Paragraph>
                    <PriceLabel
                        price={price}
                        symbol={tokenMetadata?.symbol}
                        // decimals={tokenDecimals}
                        token={token}
                        fontSize={22}
                        fontSizeSuffix={14}
                        
                    />
                </div>
            )}
        </>
    );
}

export default PriceContainer;
