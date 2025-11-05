"use client";

import React, { } from 'react';
import TruthBoxEventsSynchronizer from '@/dapp/store_sapphire/query/TruthBoxEventsSynchronizer';
import Marketplace from './containers/Marketplace';
// import { useReadContract } from '@dapp/hooks/readContracts/useReadContract';
// import { ContractName } from '@dapp/contractsConfig';
import HooksTest from './hooksTest';

const MarketplacePage = () => {

    return (
        <>
            <HooksTest />
            <TruthBoxEventsSynchronizer debug={true}/>
            <Marketplace />
        </>
    );
};

export default MarketplacePage;

