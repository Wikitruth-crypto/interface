"use client";

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useCallback, useEffect, useRef } from 'react';
import { queryMarketplaceBoxes, countMarketplaceBoxes } from '@dapp/services/supabase/marketplace';
import { convertSearchResultToMarketplaceBoxData } from '@dapp/services/supabase/types';
import { useMarketplaceStore } from '../store/marketplaceStore';
import type { MarketplaceBoxData } from '../types/marketplace.types';

/**
 * Marketplace Boxes Hook (based on Supabase)
 * 
 * Responsibilities:
 * - Get Box data from Supabase database
 * - Handle filter conditions
 * - Handle pagination logic (flip mode)
 * - Return unified data format
 */
export const useMarketplaceBoxesSupabase = () => {
    const filters = useMarketplaceStore(state => state.filters);
    const paginationConfig = useMarketplaceStore(state => state.paginationConfig);
    const setPageSize = useMarketplaceStore(state => state.setPageSize);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = paginationConfig.pageSize;
    
    // Use ref to track the previous filters, to detect changes in filters
    const prevFiltersRef = useRef(filters);
    
    // When filters change, reset pagination state
    // This ensures that when the user applies new filter conditions, pagination starts from the first page
    useEffect(() => {
        // Deep compare filters to see if they really changed
        // Note: use JSON.stringify for deep comparison, suitable for MarketplaceFilters type (only contains basic types)
        const prevFiltersStr = JSON.stringify(prevFiltersRef.current);
        const currentFiltersStr = JSON.stringify(filters);
        const filtersChanged = prevFiltersStr !== currentFiltersStr;
        
        if (filtersChanged) {
            // When filters change, reset pagination state to the first page
            setCurrentPage(1);
            prevFiltersRef.current = filters;
        }
    }, [filters]);

    // Query total count (for pagination calculation)
    const { data: totalCountData, error: countError } = useQuery({
        queryKey: ['marketplace-boxes-count', filters],
        queryFn: async () => {
            const result = await countMarketplaceBoxes(filters);
            if (result.error) {
                console.error('[useMarketplaceBoxesSupabase] Count error:', result.error);
            }
            return result;
        },
        // staleTime: 5 * 60 * 1000, // Not needed, because it is already configured in defaultQueryClient
    });

    if (countError) {
        console.error('[useMarketplaceBoxesSupabase] Count query error:', countError);
    }

    const totalCount = totalCountData?.count ?? 0;
    const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

    // Use normal query for pagination
    // Use default cache configuration (5 minutes), combined with placeholderData to achieve smooth page switching
    const marketplaceQuery = useQuery<MarketplaceBoxData[]>({
        queryKey: ['marketplace-boxes', filters, pageSize, currentPage],
        queryFn: async () => {
            const offset = (currentPage - 1) * pageSize;
            const result = await queryMarketplaceBoxes(filters, pageSize, offset);

            if (result.error) {
                console.error('[useMarketplaceBoxesSupabase] Query error:', result.error);
                throw result.error;
            }

            // Convert data format
            const convertedData = (result.data || []).map(convertSearchResultToMarketplaceBoxData);
            
            // Debug log: record query result
            if (import.meta.env.DEV) {
                console.log(
                    `[useMarketplaceBoxesSupabase] Query result: ` +
                    `offset=${offset}, limit=${pageSize}, ` +
                    `returned=${convertedData.length} items`
                );
            }
            
            return convertedData;
        },
        placeholderData: keepPreviousData, // Keep previous page data, to achieve smooth switching
    });

    // Get data
    const marketplaceBoxes = marketplaceQuery.data ?? [];
    if(import.meta.env.DEV) {
        console.log('marketplaceBoxes length:', marketplaceBoxes.length);
    }
    const isLoading = marketplaceQuery.isLoading;
    const isFetching = marketplaceQuery.isFetching;
    const error = marketplaceQuery.error;
    const hasError = !!error;

    // Calculate next page state
    const hasNextPage = currentPage < totalPages;

    // Page switching
    const onPageChange = useCallback((page: number, newPageSize: number) => {
        setCurrentPage(page);
        if (newPageSize !== pageSize && setPageSize) {
            setPageSize(newPageSize);
        }
    }, [pageSize, setPageSize]);

    // Reset pagination
    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    // Return result
    const hasVisibleItems = marketplaceBoxes.length > 0;

    const isInitialLoading = !hasVisibleItems && isLoading;

    return {
        flatData: marketplaceBoxes, // Return current page data
        data: {
            pages: [],
            totalPages,
            totalItems: totalCount,
        },
        totalItems: totalCount,
        pageSize,
        pageCount: currentPage,
        hasNextPage,
        fetchNextPage: () => {
            // Compatible interface, actually not used
            if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
            }
        },
        resetPagination,
        isFetchingNextPage: false,
        isLoading: isInitialLoading,
        isFetching,
        isError: hasError,
        error: error || null,
        isSuccess: !hasError,
        // Pagination related (for pagination UI)
        currentPage,
        totalPages,
        onPageChange,
    };
};

