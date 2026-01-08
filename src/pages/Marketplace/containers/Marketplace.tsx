"use client"

import React from 'react';
import { Container } from '@/components/Container';
import MarketplaceList from '../components/MarketplaceList';
import StatisticalDataMarket from '../components/statisticalDataMarket';
// import Filter from '../components/filter';
import { useMarketplaceBoxesSupabase } from '../hooks/useMarketplaceBoxesSupabase';
// import { useMarketplaceStore } from '../store/marketplaceStore';

const Marketplace: React.FC = () => {
    const marketplaceQuery = useMarketplaceBoxesSupabase();

    return (
        <Container className="p-6">
            <StatisticalDataMarket />
            {/* <Filter totalItems={marketplaceQuery.totalItems} /> */}
            <MarketplaceList
                items={marketplaceQuery.flatData}
                totalItems={marketplaceQuery.totalItems}
                pageSize={marketplaceQuery.pageSize}
                currentPage={marketplaceQuery.currentPage}
                // totalPages={marketplaceQuery.totalPages}
                // hasNextPage={marketplaceQuery.hasNextPage}
                onPageChange={marketplaceQuery.onPageChange}
                isLoading={marketplaceQuery.isLoading}
            />
        </Container>
    );
};

export default Marketplace; 
