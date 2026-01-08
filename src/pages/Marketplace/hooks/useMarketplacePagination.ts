"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MarketplaceBoxData } from '../types/marketplace.types';

/**
 * Split array into fixed size groups
 */
const chunkItems = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) return [items];
  const pages: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }
  return pages;
};

/**
 * Pagination configuration
 */
export interface UseMarketplacePaginationConfig {
  items: MarketplaceBoxData[];
  loadBatchSize: number;
  /** Paginator page size (20, 40, 80, 160), use 8,16,32,64 for testing */
  pageSize: number;
  mode: 'loadMore' | 'paginator';
  onPageSizeChange?: (size: number) => void;
}

/**
 * Pagination return value
 */
export interface UseMarketplacePaginationReturn {
  visibleItems: MarketplaceBoxData[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  resetPagination: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number, pageSize: number) => void; // Modify: receive two parameters
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  isFetchingNextPage: boolean;
}

/**
  * Marketplace pagination control Hook
 * 
 * Responsibilities:
 * - Manage pagination state (current page, page size, load batch size)
 * - Support dual mode: Load More and traditional paginator
 * - Provide pagination data slicing
 * - Manage loading more state
 * 
 * Key fixes:
 * - Remove redundant setPageCount logic
 * - Optimize useEffect dependencies, avoid loop triggering
 */
export const useMarketplacePagination = (
  config: UseMarketplacePaginationConfig
): UseMarketplacePaginationReturn => {
  const { items, loadBatchSize, pageSize, mode, onPageSizeChange: externalOnPageSizeChange } = config;

  // Load More mode: pageCount represents the number of loaded batches
  const [pageCount, setPageCount] = useState(1);
  // Paginator mode: currentPage represents the current page number
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Generate pagination data
  const paginatedItems = useMemo(() => chunkItems(items, pageSize), [items, pageSize]);
  const totalPages = paginatedItems.length;

  // Load More mode: visibleItems represents the accumulated loaded batches
  // Paginator mode: visibleItems represents the data of the current page
  const visibleItems = useMemo(() => {
    if (mode === 'loadMore') {
      const visiblePages = paginatedItems.slice(0, pageCount);
      return visiblePages.flat();
    } else {
      // Paginator mode
      const pageIndex = Math.max(1, Math.min(currentPage, totalPages)) - 1;
      return paginatedItems[pageIndex] || [];
    }
  }, [mode, paginatedItems, pageCount, currentPage, totalPages]);

  const hasNextPage = mode === 'loadMore' ? pageCount < totalPages : currentPage < totalPages;

  // Load More mode: increase load batch
  // Paginator mode: modify current page number
  const fetchNextPage = useCallback(() => {
    if (!hasNextPage) return;
    
    if (mode === 'loadMore') {
      setIsFetchingNextPage(true);
      setPageCount(current => Math.min(current + 1, totalPages));
    } else {
      setCurrentPage(current => Math.min(current + 1, totalPages));
    }
  }, [hasNextPage, totalPages, mode]);

  // Reset pagination state
  const resetPagination = useCallback(() => {
    setPageCount(1);
    setCurrentPage(1);
  }, []);

  // Paginator mode: page switching
  const onPageChange = useCallback((page: number, newPageSize: number) => {
    setCurrentPage(page);
    // If page size changes, notify external
    if (newPageSize !== pageSize && externalOnPageSizeChange) {
      externalOnPageSizeChange(newPageSize);
    }
  }, [pageSize, externalOnPageSizeChange]);

  // Load More mode: delay reset isFetchingNextPage state
  useEffect(() => {
    if (mode === 'loadMore' && isFetchingNextPage) {
      const timeoutId = setTimeout(() => {
        setIsFetchingNextPage(false);
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isFetchingNextPage, mode, visibleItems.length]);

  // Ensure currentPage does not exceed range
  useEffect(() => {
    if (mode === 'paginator' && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [mode, currentPage, totalPages]);

  return {
    visibleItems,
    hasNextPage,
    fetchNextPage,
    resetPagination,
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange: externalOnPageSizeChange || (() => {}), // Compatible old interface
    pageSize,
    isFetchingNextPage,
  };
};

