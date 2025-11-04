"use client"
import React from 'react';
import { Typography } from 'antd';

import { BoxStatus } from '@/dapp/types/contracts/truthBox';
// import { officeToken } from '@/dapp/constants/token';
// import { ethers, parseUnits } from 'ethers';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import PriceLabel from '@/dapp/components/base/priceLabel';
import Paragraph from '@/components/base/paragraph';
import { useBoxContext } from '../contexts/BoxContext';

interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceContainer: React.FC<Props> = ({ price, token, status, }) => {
    // const decimals = officeToken.decimals;
    const supportedTokens = useSupportedTokens();
    const { box } = useBoxContext();

    if (!box) {
        return <div>loading...</div>;
    }

    const Status = status || box.status as BoxStatus;

    const isDisplay = Status !== 'Published' && Status !== 'Blacklisted';

    return (
        <>
            {isDisplay && (
                <div className="flex items-baseline">
                    <Paragraph color="gray-3" size="sm" className="mr-2">Price:</Paragraph>
                    <PriceLabel
                        price={price}
                        // symbol={tokenSymbol}
                        // decimals={tokenDecimals}
                        token={token}
                        tokens={supportedTokens}
                        fontSize={22}
                        fontSizeSuffix={14}
                        
                    />
                </div>
            )}
        </>
    );
}

export default PriceContainer;
