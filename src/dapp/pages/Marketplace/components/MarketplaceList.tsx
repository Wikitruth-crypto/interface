"use client";

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TruthBoxCard from '@/dapp/components/truthBoxCard';
import MarketplacePagination from './MarketplacePagination';
import { useInfiniteScroll } from '@/dapp/hooks/useInfiniteScroll';
import { cn } from '@/lib/utils';
import type { MarketplaceBoxData, PaginationMode } from '../types/marketplace.types';
import SkeletonCard from '@/dapp/components/base/skeletonCard';
import { 
    ProgressiveRevealCard,
    useProgressiveReveal 
} from '@/dapp/components/progressiveRevealCard';

interface MarketplaceListProps {
    className?: string;
    showDebug?: boolean;
    items: MarketplaceBoxData[];
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    paginationMode: PaginationMode;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    onPageChange?: (page: number, pageSize: number) => void;
    isLoading: boolean;
}

const MarketplaceList: React.FC<MarketplaceListProps> = ({
    className,
    showDebug = false,
    items,
    totalItems,
    pageSize,
    currentPage,
    totalPages,
    paginationMode,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    onPageChange,
    isLoading,
}) => {
    const navigate = useNavigate();
    const activeMode: PaginationMode = paginationMode ?? 'paginator';

    const listContainerRef = useRef<HTMLDivElement>(null);

    useInfiniteScroll(listContainerRef, {
        threshold: 100,
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        isLoading: isFetchingNextPage,
        enabled: activeMode === 'loadMore',
    });

    const handleCardClick = (tokenId: string | number) => {
        navigate(`/app/boxDetail/${tokenId.toString()}`);
    };

    const visibleItems = items ?? [];
    const handlePageChange =
        onPageChange ?? ((page: number, size: number) => {
            // 无分页回调时的占位，避免 Pagination 组件告警
        });

    // 使用 useRef 来跟踪上一次的 items，避免不必要的重置
    const prevItemsRef = useRef<MarketplaceBoxData[]>([]);
    const itemsKeyRef = useRef<string>('');

    // 生成 items 的唯一标识（基于长度和第一个/最后一个项目的 id）
    const currentItemsKey = useMemo(() => {
        if (visibleItems.length === 0) return '';
        const firstId = visibleItems[0]?.id || visibleItems[0]?.tokenId || '';
        const lastId = visibleItems[visibleItems.length - 1]?.id || visibleItems[visibleItems.length - 1]?.tokenId || '';
        return `${visibleItems.length}-${firstId}-${lastId}`;
    }, [visibleItems]);

    // 使用渐进式加载 hook（启用图片加载等待模式）
    const {
        items: progressiveItems,
        startReveal,
        appendReveal,
        reset,
        notifyCompleted,
    } = useProgressiveReveal<MarketplaceBoxData>({
        initialCount: visibleItems.length || 0,
        waitForImageLoad: true, // 启用图片加载等待模式
        transitionDuration: 300,
    });

    // 当 items 数据真正变化时，才开始渐进式显示（避免重复重置）
    useEffect(() => {
        // 如果 itemsKey 没有变化，说明数据没有真正改变，不需要重置
        if (itemsKeyRef.current === currentItemsKey) {
            return;
        }

        // 更新引用
        itemsKeyRef.current = currentItemsKey;
        prevItemsRef.current = visibleItems;

        if (visibleItems.length > 0) {
            startReveal(visibleItems);
        } else {
            reset();
        }
    }, [currentItemsKey, visibleItems, startReveal, reset]);

    return (
        <div ref={listContainerRef} className={cn('w-full', className)}>
            {showDebug && (
                <div className="mb-6 rounded-lg border border-dashed border-white/10 bg-black/30 p-4 text-xs text-white/70 space-y-1">
                    <div className="font-semibold text-white">MarketplaceList Debug</div>
                    <div>Total Items: {totalItems}</div>
                    <div>Display Items: {visibleItems.length}</div>
                    <div>Total Pages: {totalPages}</div>
                    <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                    <div>Pagination Mode: {activeMode}</div>
                </div>
            )}

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
                                onCompleted={notifyCompleted} // 传递图片加载回调
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
                            mode={activeMode}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            className="mt-4"
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MarketplaceList;




