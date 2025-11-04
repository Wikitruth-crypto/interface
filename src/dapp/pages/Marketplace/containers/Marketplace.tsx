"use client"

import React from 'react';
import { Container } from '@/components/Container';
import MarketplaceList from '../components/MarketplaceList';
import GlobalDataMarket from '../components/globalDataMarket';
import Filter from '../components/filter';

const Marketplace: React.FC = () => {

    return (
        <Container className="p-6">
            <GlobalDataMarket />
            <Filter />
            <MarketplaceList
                showDebug={true}
            />
        </Container>
    );
};

export default Marketplace; 