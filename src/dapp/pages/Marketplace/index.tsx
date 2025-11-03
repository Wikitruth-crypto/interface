"use client";

import React from 'react';
import TruthBoxEventsSynchronizer from '@/dapp/store_sapphire/query/TruthBoxEventsSynchronizer';
import Marketplace from './containers/Marketplace';

const MarketplacePage = () => {
    return (
        <>
            <TruthBoxEventsSynchronizer debug={true}/>
            <Marketplace />
        </>
    );
};

export default MarketplacePage;

