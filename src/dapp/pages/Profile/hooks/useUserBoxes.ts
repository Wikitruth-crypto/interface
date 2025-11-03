"use client"

import { useMemo } from 'react';
import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';
import { selectors } from '@/dapp/store_sapphire/selectors';
import { FilterState, BoxListResponse, BoxData } from '../types/profile.types';
import { Box } from '@/dapp/store_sapphire/types';

/**
 * 根据tab筛选Box列表
 *
 * 重构说明：
 * - 使用新的 Box 类型（从 event_sapphire）
 * - 保持原有的筛选逻辑
 */
const filterBoxesByTab = (
  allBoxes: Box[],
  tab: FilterState['selectedTab'],
  userAddress: string
): Box[] => {
  console.log(`🔧 filterBoxesByTab: Begin filtering`, {
    tab,
    totalBoxes: allBoxes.length,
    userAddress: userAddress?.slice(0, 8) + '...'
  });

  // 对于"all"标签，直接返回所有数据，不进行筛选
  if (tab === 'all') {
    return allBoxes;
  }

  const filtered = allBoxes.filter(box => {
    switch (tab) {
      case 'owned':
        return box.owner.id.toLowerCase() === userAddress.toLowerCase();
      case 'minted':
        return box.minter.id.toLowerCase() === userAddress.toLowerCase();
      case 'sold':
        return box.seller?.id.toLowerCase() === userAddress.toLowerCase();
      case 'bought':
        return (box.buyer?.id.toLowerCase() === userAddress.toLowerCase());
      case 'bade':
        return box.bidders?.some(bidder => bidder.id.toLowerCase() === userAddress.toLowerCase());
      case 'completed':
        return box.completer?.id.toLowerCase() === userAddress.toLowerCase();
      case 'published':
        return box.publisher?.id.toLowerCase() === userAddress.toLowerCase();
      default:
        console.warn(`⚠️ filterBoxesByTab: Unknown tab type: ${tab}`);
        return true;
    }
  });

  console.log(`✅ filterBoxesByTab: Filtering completed`, {
    tab,
    originalCount: allBoxes.length,
    filteredCount: filtered.length
  });

  return filtered;
};

/**
 * 应用排序逻辑
 */
const applySorting = (boxes: Box[], orderBy: string, orderDirection: 'asc' | 'desc'): Box[] => {
  const sorted = [...boxes].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (orderBy) {
      case 'tokenId':
        aValue = Number(a.tokenId);
        bValue = Number(b.tokenId);
        break;
      case 'price':
        aValue = Number(a.price);
        bValue = Number(b.price);
        break;
      case 'createTimestamp':
        aValue = Number(a.createTimestamp);
        bValue = Number(b.createTimestamp);
        break;
      default:
        return 0;
    }

    if (orderDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sorted;
};

/**
 * useUserBoxes - 获取用户相关的 Box 列表
 *
 * 重构说明：
 * - 移除 React Query 和 The Graph 依赖
 * - 直接从 useQueryStore 读取数据
 * - 使用 selectors.selectAllBoxes 获取所有 Box
 * - 实现客户端筛选、排序逻辑
 * - 保持与旧版本相同的接口（向后兼容）
 * - 暂时移除元数据处理（等待元数据模块开发）
 */
export const useUserBoxes = (address: string | undefined, filters: FilterState) => {
  // 从 store 获取所有 Box 数据
  const allBoxes = useQueryStore(selectors.selectAllBoxes());

  // 应用筛选和排序逻辑
  const filteredBoxes = useMemo(() => {
    if (!address) return [];

    console.log(`🔍 useUserBoxes: Processing boxes`, {
      address: address.slice(0, 8) + '...',
      totalBoxes: allBoxes.length,
      filters
    });

    let result = [...allBoxes];

    // 1. 根据 tab 筛选
    result = filterBoxesByTab(result, filters.selectedTab, address);

    // 2. 根据状态筛选
    if (filters.selectedStatus) {
      result = result.filter(box => box.status === filters.selectedStatus);
    }

    // 3. 排序
    if (filters.orderBy) {
      result = applySorting(result, filters.orderBy, filters.orderDirection);
    }

    console.log(`✅ useUserBoxes: Filtering completed`, {
      originalCount: allBoxes.length,
      filteredCount: result.length,
      filters
    });

    return result;
  }, [allBoxes, address, filters]);

  // 转换为 BoxData 格式（添加元数据字段）
  const boxData = useMemo((): BoxData[] => {
    return filteredBoxes.map(box => ({
      ...box,
      // TODO: 等待元数据处理模块开发完成后，这些字段将自动填充
      title: undefined,
      description: undefined,
      image: undefined,
      boxImage: undefined,
      country: undefined,
      state: undefined,
      eventDate: undefined,
      typeOfCrime: undefined,
      hasError: false,
    }));
  }, [filteredBoxes]);

  // 返回 React Query InfiniteQuery 兼容的接口
  return {
    data: {
      pages: [{ items: boxData, hasMore: false }],
      pageParams: [0]
    },
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
    fetchNextPage: () => Promise.resolve({ data: undefined, error: null, isError: false, isSuccess: true }),
    hasNextPage: false,
    isFetchingNextPage: false,
  };
};