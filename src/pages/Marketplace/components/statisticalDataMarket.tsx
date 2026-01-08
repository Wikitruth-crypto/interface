"use client"

import React, { useMemo } from 'react';
import { useMarketplaceStats } from '../hooks/useMarketplaceStats';
import DataLabel, { DataType } from '@/components/base/dataLabel';
import { cn } from '@/lib/utils';

const defaultStats = {
    totalSupply: 0,
    totalStoring: 0,
    totalOnSale: 0,
    totalSwaping: 0,
    totalInSecrecy: 0,
    totalPublished: 0,
    totalGTV: 0,
};

const StatisticalDataMarket: React.FC = () => {
    const { data, isLoading, isError } = useMarketplaceStats();
    const stats = data || defaultStats;

    const metricCards: DataType[] = useMemo(() => ([
        { label: 'Supply', value: stats.totalSupply },
        { label: 'Storing', value: stats.totalStoring },
        { label: 'OnSale', value: stats.totalOnSale },
        { label: 'Swaping', value: stats.totalSwaping },
        { label: 'InSecrecy', value: stats.totalInSecrecy },
        { label: 'Published', value: stats.totalPublished },
        { label: 'Volume', value: stats.totalGTV, suffix: '$' },
    ]), [stats]);

    return (
        <div className={cn('flex flex-wrap lg:flex-nowrap gap-1 sm:gap-2')}>
            {metricCards.map((item, index) => (
                <DataLabel
                    key={`statistical-card-${index}`}
                    data={{
                        ...item,
                        value: isLoading ? 0 : item.value,
                    }}
                    variant="outline"
                    size="sm"
                    minWidth="120px"
                    className="flex-1 lg:min-w-[120px] w-[calc(50%-0.125rem)] sm:w-[calc(25%-0.375rem)] md:w-[calc(33.33%-0.33rem)] lg:w-auto"
                />
            ))}
        </div>
    );
};

export default StatisticalDataMarket;
