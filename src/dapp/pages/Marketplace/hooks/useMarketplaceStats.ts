"use client";

import { useQuery } from '@tanstack/react-query';
import { queryMarketplaceStats } from '@/dapp/services/supabase/marketplace';
import type { GlobalStats } from '../types/marketplace.types';

/**
 * Marketplace 统计数据 Hook (基于 Supabase)
 * 
 * 职责：
 * - 从 Supabase 数据库获取统计数据
 * - 转换为前端使用的格式
 * 
 * 特点：
 * - 使用 React Query 进行数据获取和缓存
 */
export const useMarketplaceStats = () => {
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ['marketplace-stats'],
        queryFn: async () => {
            const result = await queryMarketplaceStats();

            if (result.error) {
                throw result.error;
            }

            if (!result.data) {
                return null;
            }

            // 转换为前端使用的格式
            const stats: GlobalStats = {
                totalSupply: parseInt(result.data.total_supply || '0', 10),
                totalStoring: parseInt(result.data.storing_supply || '0', 10),
                totalOnSale:
                    parseInt(result.data.selling_supply || '0', 10) +
                    parseInt(result.data.auctioning_supply || '0', 10),
                totalSwaping:
                    parseInt(result.data.paid_supply || '0', 10) +
                    parseInt(result.data.refunding_supply || '0', 10),
                totalInSecrecy: parseInt(result.data.in_secrecy_supply || '0', 10),
                totalPublished: parseInt(result.data.published_supply || '0', 10),
                totalGTV: 0, // TODO: 从 token_total_amounts 计算
            };

            return stats;
        },
        staleTime: 5 * 60000, // 1 分钟内不重新查询
    });

    return {
        data: data || null,
        isLoading,
        isFetching,
        isError: !!error,
        error: error || null,
        isSuccess: !error,
    };
};

