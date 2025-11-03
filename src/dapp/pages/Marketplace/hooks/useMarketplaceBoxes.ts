"use client";

import { useMemo } from 'react';
import { selectors } from '@/dapp/store_sapphire/selectors';
import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';
import { useMetadataStore } from '@/dapp/store_sapphire/useMetadataStore';
import { useMarketplaceStore } from '../store/marketplaceStore';
import type { MarketplaceBoxData } from '../types/marketplace.types';
import { useMetadataLoader } from './useMetadataLoader';
import { useMarketplaceFilter } from './useMarketplaceFilter';
import { useMarketplacePagination } from './useMarketplacePagination';
import { useShallow } from 'zustand/react/shallow';

const NOOP = () => {};

/**
 * Marketplace Boxes Hook
 * 
 * 职责：
 * - 从 store 获取原始 Box 数据
 * - 加载元数据
 * - 筛选和排序
 * - 组装元数据
 * - 转换为 MarketplaceBoxData 格式
 * 
 * 特点：
 * - 自动加载元数据
 * - 支持完整筛选功能
 */
export const useMarketplaceBoxes = () => {
  // 1. 获取原始数据和筛选条件
  const allBoxes = useQueryStore(selectors.selectAllBoxes());
  const hasBoxes = allBoxes.length > 0;

  const filters = useMarketplaceStore(state => state.filters);
  const paginationConfig = useMarketplaceStore(state => state.paginationConfig);
  const setPageSize = useMarketplaceStore(state => state.setPageSize);

  // 2. 获取元数据
  const { boxesMetadata, errorListMetadata } = useMetadataStore(
    useShallow(state => ({
      boxesMetadata: state.boxesMetadata,
      errorListMetadata: state.errorListMetadata,
    }))
  );

  // 3. 筛选和排序（在组装元数据之前）
  const filteredBoxes = useMarketplaceFilter(allBoxes, filters, boxesMetadata);

  // 4. 加载元数据（使用筛选后的 boxes，自动加载）
  const { isLoading: isMetadataLoading } = useMetadataLoader({
    boxes: filteredBoxes,
    batchSize: 12,
    autoLoad: true,
  });

  // 5. 组装元数据
  const metadataErrorSet = useMemo(() => new Set(errorListMetadata), [errorListMetadata]);

  const marketplaceBoxes: MarketplaceBoxData[] = useMemo(() => {
    if (!hasBoxes) return [];
    return filteredBoxes.map(box => {
      const tokenId = box.tokenId?.toString() ?? '';
      const metadata = tokenId ? boxesMetadata[tokenId] : undefined;

      return {
        ...box,
        title: metadata?.title,
        description: metadata?.description,
        nftImage: metadata?.nftImage,
        boxImage: metadata?.boxImage,
        country: metadata?.country,
        state: metadata?.state,
        eventDate: metadata?.eventDate,
        typeOfCrime: metadata?.typeOfCrime,
        hasError: tokenId ? metadataErrorSet.has(tokenId) : false,
      };
    });
  }, [filteredBoxes, boxesMetadata, metadataErrorSet, hasBoxes]);

  // 6. 分页处理
  const pagination = useMarketplacePagination({
    items: marketplaceBoxes,
    loadBatchSize: paginationConfig.loadBatchSize,
    pageSize: paginationConfig.pageSize,
    mode: paginationConfig.mode,
    onPageSizeChange: setPageSize,
  });

  // 7. 返回结果
  const hasVisibleItems = pagination.visibleItems.length > 0;
  const isInitialLoading = !hasVisibleItems && isMetadataLoading;

  return {
    flatData: pagination.visibleItems, // 返回分页后的数据
    data: {
      pages: [],
      totalPages: pagination.totalPages,
      totalItems: marketplaceBoxes.length,
    },
    totalItems: marketplaceBoxes.length,
    pageSize: pagination.pageSize,
    pageCount: pagination.currentPage,
    hasNextPage: pagination.hasNextPage,
    fetchNextPage: pagination.fetchNextPage,
    resetPagination: pagination.resetPagination,
    isFetchingNextPage: pagination.isFetchingNextPage,
    isLoading: isInitialLoading,
    isFetching: isMetadataLoading,
    isError: false,
    error: null,
    isSuccess: true,
    // 分页相关（供分页UI使用）
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    onPageChange: pagination.onPageChange,
  };
};
