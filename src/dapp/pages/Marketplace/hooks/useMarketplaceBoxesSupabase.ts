"use client";

import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { queryMarketplaceBoxes, countMarketplaceBoxes } from '@/dapp/services/supabase/marketplace';
import { convertSearchResultToMarketplaceBoxData } from '@/dapp/services/supabase/types';
import { useMarketplaceStore } from '../store/marketplaceStore';
import type { MarketplaceBoxData } from '../types/marketplace.types';

/**
 * Marketplace Boxes Hook (基于 Supabase)
 * 
 * 职责：
 * - 从 Supabase 数据库获取 Box 数据
 * - 处理筛选条件
 * - 处理分页逻辑（支持 Paginator 和 Load More 模式）
 * - 返回统一的数据格式
 */
export const useMarketplaceBoxesSupabase = () => {
    const filters = useMarketplaceStore(state => state.filters);
    const paginationConfig = useMarketplaceStore(state => state.paginationConfig);
    const setPageSize = useMarketplaceStore(state => state.setPageSize);

    // 分页状态（Paginator 模式）
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = paginationConfig.pageSize;

    // 查询总数（用于分页计算）
    const { data: totalCountData, error: countError } = useQuery({
        queryKey: ['marketplace-boxes-count', filters],
        queryFn: async () => {
            const result = await countMarketplaceBoxes(filters);
            if (result.error) {
                console.error('[useMarketplaceBoxesSupabase] Count error:', result.error);
            }
            return result;
        },
        // staleTime: 5 * 60 * 1000, // 不需要，因为已经在defaultQueryClient中配置了
    });

    if (countError) {
        console.error('[useMarketplaceBoxesSupabase] Count query error:', countError);
    }

    const totalCount = totalCountData?.count ?? 0;
    const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

    // Paginator 模式：使用普通查询
    // 使用默认缓存配置（5分钟），配合 placeholderData 实现平滑的页面切换
    const paginatorQuery = useQuery<MarketplaceBoxData[]>({
        queryKey: ['marketplace-boxes', filters, pageSize, currentPage],
        queryFn: async () => {
            const offset = (currentPage - 1) * pageSize;
            const result = await queryMarketplaceBoxes(filters, pageSize, offset);

            if (result.error) {
                console.error('[useMarketplaceBoxesSupabase] Paginator query error:', result.error);
                throw result.error;
            }

            // 转换数据格式
            const convertedData = (result.data || []).map(convertSearchResultToMarketplaceBoxData);
            
            return convertedData;
        },
        placeholderData: keepPreviousData, // 保持上一页数据，实现平滑切换
        enabled: paginationConfig.mode === 'paginator',
    });

    // Load More 模式：使用无限查询
    // 使用默认缓存配置（5分钟），已加载的页面数据会被缓存
    const loadMoreQuery = useInfiniteQuery<MarketplaceBoxData[], Error, MarketplaceBoxData[], (string | number | typeof filters)[], number>({
        queryKey: ['marketplace-boxes-infinite', filters, paginationConfig.loadBatchSize],
        queryFn: async ({ pageParam }) => {
            const offset = pageParam as number;
            const result = await queryMarketplaceBoxes(
                filters,
                paginationConfig.loadBatchSize,
                offset
            );

            if (result.error) {
                throw result.error;
            }

            // 转换数据格式
            return (result.data || []).map(convertSearchResultToMarketplaceBoxData);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((sum, page) => sum + page.length, 0);
            if (loadedCount >= totalCount) {
                return undefined; // 没有更多数据
            }
            return loadedCount; // 返回下一个 offset
        },
        enabled: paginationConfig.mode === 'loadMore',
    });

    // 根据模式选择查询结果
    const isPaginatorMode = paginationConfig.mode === 'paginator';
    const activeQuery = isPaginatorMode ? paginatorQuery : loadMoreQuery;

    // 获取数据
    let marketplaceBoxes: MarketplaceBoxData[] = [];
    if (isPaginatorMode) {
        marketplaceBoxes = paginatorQuery.data ?? [];
    } else {
        // useInfiniteQuery 返回的 data 类型是 InfiniteData<MarketplaceBoxData[]>
        const infiniteData = loadMoreQuery.data;
        if (infiniteData) {
            const dataWithPages = infiniteData as unknown as { pages: MarketplaceBoxData[] };
            marketplaceBoxes = dataWithPages.pages.flat();
        }
    }

    const isLoading = activeQuery.isLoading;
    const isFetching = activeQuery.isFetching;
    const isFetchingNextPage = loadMoreQuery.isFetchingNextPage || false;
    const error = activeQuery.error;
    const hasError = !!error;

    // 计算下一页状态
    const hasNextPage = isPaginatorMode
        ? currentPage < totalPages
        : loadMoreQuery.hasNextPage || false;

    // 加载下一页（Load More 模式）
    const fetchNextPage = useCallback(() => {
        if (isPaginatorMode) {
            if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
            }
        } else {
            loadMoreQuery.fetchNextPage();
        }
    }, [isPaginatorMode, currentPage, totalPages, loadMoreQuery]);

    // 页面切换（Paginator 模式）
    const onPageChange = useCallback((page: number, newPageSize: number) => {
        setCurrentPage(page);
        if (newPageSize !== pageSize && setPageSize) {
            setPageSize(newPageSize);
        }
    }, [pageSize, setPageSize]);

    // 重置分页
    const resetPagination = useCallback(() => {
        setCurrentPage(1);
        if (!isPaginatorMode) {
            loadMoreQuery.refetch();
        }
    }, [isPaginatorMode, loadMoreQuery]);

    // 返回结果
    const hasVisibleItems = marketplaceBoxes.length > 0;
    const isInitialLoading = !hasVisibleItems && isLoading;

    return {
        flatData: marketplaceBoxes, // 返回所有已加载的数据
        data: {
            pages: isPaginatorMode 
                ? [] 
                : (loadMoreQuery.data 
                    ? (loadMoreQuery.data as unknown as { pages: MarketplaceBoxData[] }).pages 
                    : []),
            totalPages,
            totalItems: totalCount,
        },
        totalItems: totalCount,
        pageSize,
        pageCount: currentPage,
        hasNextPage,
        fetchNextPage,
        resetPagination,
        isFetchingNextPage,
        isLoading: isInitialLoading,
        isFetching,
        isError: hasError,
        error: error || null,
        isSuccess: !hasError,
        // 分页相关（供分页UI使用）
        currentPage: isPaginatorMode ? currentPage : 1,
        totalPages,
        onPageChange: isPaginatorMode ? onPageChange : undefined,
    };
};

