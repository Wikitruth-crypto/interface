"use client";

import { useMemo } from 'react';
import type { Box } from '@/dapp/store_sapphire/types';
import type { MetadataBoxType } from '@/dapp/types/contracts/metadataBox';
import type { MarketplaceFilters } from '../types/marketplace.types';

/**
 * 应用排序逻辑
 * @param boxes Box 数组
 * @param sort 排序方式
 * @returns 排序后的 Box 数组
 */
const applySorting = (boxes: Box[], sort: NonNullable<MarketplaceFilters['sort']>): Box[] => {
    const sorted = [...boxes];

    if (sort === 'price_asc' || sort === 'price_desc') {
        return sorted
            .filter(box => Number(box.price) > 0)
            .sort((a, b) =>
                sort === 'price_asc' ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price),
            );
    }

    switch (sort) {
        case 'date_asc':
            return sorted.sort((a, b) => Number(a.deadline) - Number(b.deadline));
        case 'date_desc':
            return sorted.sort((a, b) => Number(b.deadline) - Number(a.deadline));
        case 'id_asc':
            return sorted.sort((a, b) => Number(a.tokenId) - Number(b.tokenId));
        case 'id_desc':
            return sorted.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
        default:
            return sorted;
    }
};

/**
 * Marketplace 筛选 Hook
 * 
 * 职责：
 * - 对 Box 数组进行基础字段筛选（status, price, id）
 * - 对 Box 数组进行排序
 * - 对 Box 数组进行元数据筛选（country, state）
 * 
 * 特点：
 * - 纯计算，无副作用
 * - 使用 useMemo 优化性能
 * - 不包含搜索逻辑（搜索功能暂不实现）
 */
export const useMarketplaceFilter = (
    allBoxes: Box[],
    filters: MarketplaceFilters,
    boxesMetadata: Record<string, MetadataBoxType>
): Box[] => {
    const hasBoxes = allBoxes.length > 0;

    // 第一步：基础字段筛选和排序
    const filteredByBaseFields = useMemo(() => {
        if (!hasBoxes) return [];

        let result = [...allBoxes];

        // 状态筛选
        if (filters.status && filters.status !== 'Default') {
            result = result.filter(box => box.status === filters.status);
        }

        // 价格范围筛选
        if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) {
            const minPrice = filters.priceRange?.min ?? 0;
            const maxPrice = filters.priceRange?.max ?? Number.POSITIVE_INFINITY;

            result = result.filter(box => {
                const price = Number(box.price);
                return price >= minPrice && price <= maxPrice;
            });
        }

        // ID 范围筛选
        if (filters.idRange?.start !== undefined || filters.idRange?.end !== undefined) {
            const startId = filters.idRange?.start ?? 0;
            const endId = filters.idRange?.end ?? Number.POSITIVE_INFINITY;

            result = result.filter(box => {
                const tokenId = Number(box.tokenId);
                return tokenId >= startId && tokenId <= endId;
            });
        }

        // 排序
        if (filters.sort && filters.sort !== 'Default') {
            result = applySorting(result, filters.sort);
        }

        return result;
    }, [allBoxes, filters.status, filters.priceRange, filters.idRange, filters.sort, hasBoxes]);

    // 第二步：元数据筛选（需要 metadata 的字段：country, state）
    const filteredBoxes = useMemo(() => {
        if (!hasBoxes) return [];

        return filteredByBaseFields.filter(box => {
            const tokenId = box.tokenId?.toString() ?? '';
            const metadata = tokenId ? boxesMetadata[tokenId] : undefined;

            // 国家筛选
            if (filters.country) {
                if (!metadata?.country) return false;
                if (metadata.country.toLowerCase() !== filters.country.toLowerCase()) return false;
            }

            // 州筛选
            if (filters.state) {
                if (!metadata?.state) return false;
                if (metadata.state.toLowerCase() !== filters.state.toLowerCase()) return false;
            }

            return true;
        });
    }, [filteredByBaseFields, filters.country, filters.state, boxesMetadata, hasBoxes]);

    return filteredBoxes;
};

