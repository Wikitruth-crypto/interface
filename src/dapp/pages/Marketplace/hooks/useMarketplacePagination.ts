"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MarketplaceBoxData } from '../types/marketplace.types';

/**
 * 将数组切分为固定大小的组
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
 * 分页配置
 */
export interface UseMarketplacePaginationConfig {
  items: MarketplaceBoxData[];
  loadBatchSize: number;
  /** 分页器每页数量（20, 40, 80, 160）, 测试数据使用8,16,32,64 */
  pageSize: number;
  mode: 'loadMore' | 'paginator';
  onPageSizeChange?: (size: number) => void;
}

/**
 * 分页返回值
 */
export interface UseMarketplacePaginationReturn {
  visibleItems: MarketplaceBoxData[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  resetPagination: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number, pageSize: number) => void; // 修改：接收两个参数
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  isFetchingNextPage: boolean;
}

/**
 * Marketplace 分页控制 Hook
 * 
 * 职责：
 * - 管理分页状态（当前页、每页数量、加载批次大小）
 * - 支持双模式：Load More 与传统分页器
 * - 提供分页数据切片
 * - 管理加载更多的状态
 * 
 * 关键修复：
 * - 移除冗余的 setPageCount 逻辑
 * - 优化 useEffect 依赖，避免循环触发
 */
export const useMarketplacePagination = (
  config: UseMarketplacePaginationConfig
): UseMarketplacePaginationReturn => {
  const { items, loadBatchSize, pageSize, mode, onPageSizeChange: externalOnPageSizeChange } = config;

  // Load More 模式：pageCount 表示加载的批次数量
  const [pageCount, setPageCount] = useState(1);
  // 分页器模式：currentPage 表示当前页码
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // 生成分页数据
  const paginatedItems = useMemo(() => chunkItems(items, pageSize), [items, pageSize]);
  const totalPages = paginatedItems.length;

  // Load More 模式：visibleItems 是累积加载的所有批次
  // 分页器模式：visibleItems 是当前页的数据
  const visibleItems = useMemo(() => {
    if (mode === 'loadMore') {
      const visiblePages = paginatedItems.slice(0, pageCount);
      return visiblePages.flat();
    } else {
      // 分页器模式
      const pageIndex = Math.max(1, Math.min(currentPage, totalPages)) - 1;
      return paginatedItems[pageIndex] || [];
    }
  }, [mode, paginatedItems, pageCount, currentPage, totalPages]);

  const hasNextPage = mode === 'loadMore' ? pageCount < totalPages : currentPage < totalPages;

  // Load More 模式：增加加载批次
  // 分页器模式：修改当前页码
  const fetchNextPage = useCallback(() => {
    if (!hasNextPage) return;
    
    if (mode === 'loadMore') {
      setIsFetchingNextPage(true);
      setPageCount(current => Math.min(current + 1, totalPages));
    } else {
      setCurrentPage(current => Math.min(current + 1, totalPages));
    }
  }, [hasNextPage, totalPages, mode]);

  // 重置分页状态
  const resetPagination = useCallback(() => {
    setPageCount(1);
    setCurrentPage(1);
  }, []);

  // 分页器模式：页面切换
  const onPageChange = useCallback((page: number, newPageSize: number) => {
    setCurrentPage(page);
    // 如果页面大小变化，通知外部
    if (newPageSize !== pageSize && externalOnPageSizeChange) {
      externalOnPageSizeChange(newPageSize);
    }
  }, [pageSize, externalOnPageSizeChange]);

  // Load More 模式：延迟重置 isFetchingNextPage 状态
  useEffect(() => {
    if (mode === 'loadMore' && isFetchingNextPage) {
      const timeoutId = setTimeout(() => {
        setIsFetchingNextPage(false);
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isFetchingNextPage, mode, visibleItems.length]);

  // 确保 currentPage 不超出范围
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
    onPageSizeChange: externalOnPageSizeChange || (() => {}), // 兼容旧接口
    pageSize,
    isFetchingNextPage,
  };
};

