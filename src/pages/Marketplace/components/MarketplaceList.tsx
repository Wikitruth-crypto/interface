"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TruthBoxCard from '@/components/truthBoxCard';
import MarketplacePagination from './MarketplacePagination';
import { cn } from '@/lib/utils';
import type { MarketplaceBoxData } from '../types/marketplace.types';
import SkeletonCard from '@/components/base/skeletonCard';
import { 
    ProgressiveRevealCard,
    useProgressiveReveal 
} from '@dapp/components/progressiveRevealCard';

interface MarketplaceListProps {
    className?: string;
    items: MarketplaceBoxData[];
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange?: (page: number, pageSize: number) => void;
    isLoading: boolean;
}

const MarketplaceList: React.FC<MarketplaceListProps> = ({
    className,
    items,
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
    isLoading,
}) => {
    const navigate = useNavigate();

    const handleCardClick = (tokenId: string | number) => {
        navigate(`/boxDetail/${tokenId.toString()}`);
    };

    const visibleItems = items ?? [];
    const handlePageChange =
        onPageChange ?? ((page: number, size: number) => {
            // Placeholder when there is no pagination callback, to avoid Pagination component warning
        });

    // Use useRef to track the previous items, to avoid unnecessary resets
    const prevItemsRef = useRef<MarketplaceBoxData[]>([]);
    const itemsKeyRef = useRef<string>('');

    // Generate unique identifier for items (based on length and id of the first/last item)
    const currentItemsKey = useMemo(() => {
        if (visibleItems.length === 0) return '';
        const firstId = visibleItems[0]?.id || visibleItems[0]?.tokenId || '';
        const lastId = visibleItems[visibleItems.length - 1]?.id || visibleItems[visibleItems.length - 1]?.tokenId || '';
        return `${visibleItems.length}-${firstId}-${lastId}`;
    }, [visibleItems]);

    // Use progressive loading hook (enable image loading wait mode)
    const {
        items: progressiveItems,
        startReveal,
        appendReveal,
        reset,
        notifyCompleted,
    } = useProgressiveReveal<MarketplaceBoxData>({
        initialCount: visibleItems.length || 0,
        waitForImageLoad: true, // Enable image loading wait mode
        transitionDuration: 300,
    });

    // When the items data really changes, start progressive display (to avoid repeated resets)
    useEffect(() => {
        // If itemsKey does not change, it means the data has not really changed, so no need to reset
        if (itemsKeyRef.current === currentItemsKey) {
            return;
        }

        // Update reference
        itemsKeyRef.current = currentItemsKey;
        prevItemsRef.current = visibleItems;

        if (visibleItems.length > 0) {
            startReveal(visibleItems);
        } else {
            reset();
        }
    }, [currentItemsKey, visibleItems, startReveal, reset]);

    return (
        <div className={cn('w-full', className)}>

            {isLoading && visibleItems.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-white/50">Loading...</div>
                </div>
            ) : visibleItems.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-white/50">No boxes found</div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {progressiveItems.map((progressiveItem) => (
                            <ProgressiveRevealCard
                                key={progressiveItem.index}
                                item={progressiveItem}
                                skeletonComponent={SkeletonCard}
                                contentComponent={TruthBoxCard}
                                contentProps={{
                                    onClick: () => {
                                        const itemId = progressiveItem.data?.id ?? progressiveItem.data?.tokenId;
                                        if (itemId !== undefined && itemId !== null) {
                                            handleCardClick(itemId);
                                        }
                                    },
                                }}
                                onCompleted={notifyCompleted} // Pass image loading callback
                                animationType="fade-scale"
                                transitionDuration={300}
                            />
                        ))}
                    </div>

                    {totalItems > 0 && (
                        <MarketplacePagination
                            total={totalItems}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            className="mt-4"
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MarketplaceList;




