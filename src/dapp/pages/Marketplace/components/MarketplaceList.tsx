"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TruthBoxCard from '@/dapp/components/truthBoxCard';
import { useMarketplaceBoxes } from '../hooks/useMarketplaceBoxes';
import MarketplacePagination from './MarketplacePagination';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { cn } from '@/lib/utils';

interface MarketplaceListProps {
    className?: string;
    showDebug?: boolean;
}

const MarketplaceList: React.FC<MarketplaceListProps> = ({
    className,
    showDebug = false,
}) => {
    const navigate = useNavigate();

    const {
        flatData,
        isLoading,
        totalItems,
        pageSize,
        currentPage,
        totalPages,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        onPageChange,
    } = useMarketplaceBoxes();

    const paginationMode = useMarketplaceStore(state => state.paginationConfig.mode);

    const handleCardClick = (tokenId: string | number) => {
        navigate(`/app/boxDetail/${tokenId.toString()}`);
    };

    return (
        <div className={cn('w-full', className)}>
            {showDebug && (
                <div className="mb-6 rounded-lg border border-dashed border-white/10 bg-black/30 p-4 text-xs text-white/70 space-y-1">
                    <div className="font-semibold text-white">MarketplaceList Debug</div>
                    <div>Total Items: {totalItems}</div>
                    <div>Display Items: {flatData.length}</div>
                    <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                </div>
            )}

            {isLoading && flatData.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-white/50">Loading...</div>
                </div>
            ) : flatData.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-white/50">No boxes found</div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {flatData.map((box) => (
                            <TruthBoxCard
                                key={box.id}
                                data={box}
                                onClick={() => handleCardClick(box.id)}
                            />
                        ))}
                    </div>

                    

                    {/* 分页UI */}
                    {totalItems > 0 && (
                        <MarketplacePagination
                            total={totalItems}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={onPageChange}
                            mode={paginationMode}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MarketplaceList;
