"use client"

import { useQuery } from '@tanstack/react-query';
import { useIsTestnet } from '@/dapp/contractsConfig';
import { queryUserStats } from '@/dapp/services/supabase/profile';
import { UserProfileData } from '../types/profile.types';

/**
 * useUserProfile - 获取用户 Profile 数据（基于 Supabase）
 *
 * 重构说明：
 * - 移除 store_sapphire 依赖
 * - 使用 Supabase 查询用户统计数据
 * - 使用 React Query 进行数据获取和缓存
 * - 保持与旧版本相同的接口（向后兼容）
 */
export const useUserProfile = (
    address: string | undefined,
    userId: string | null = null
) => {
    const isTestnet = useIsTestnet();
    const network: 'testnet' | 'mainnet' = isTestnet ? 'testnet' : 'mainnet';

    // 使用 React Query 查询用户统计数据
    const {
        data: statsData,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['user-profile', network, address, userId],
        queryFn: async () => {
            if (!address) {
                return null;
            }

            const result = await queryUserStats(network, address, userId);

            if (result.error) {
                throw result.error;
            }

            return result.data;
        },
        enabled: !!address, // 只有当 address 存在时才查询
        staleTime: 30000, // 30 秒内不重新查询
    });

    // 构建 UserProfileData 对象
    const data: UserProfileData | null = statsData
        ? {
            // 基础用户信息（从统计数据构建）
            id: userId || address, // 使用 userId 或 address 作为 id
            address: address || '',

            // 统计数据
            stats: {
                totalBoxes: statsData.totalBoxes,
                ownedBoxes: statsData.ownedBoxes,
                mintedBoxes: statsData.mintedBoxes,
                soldBoxes: statsData.soldBoxes,
                boughtBoxes: statsData.boughtBoxes,
                bidBoxes: statsData.bidBoxes,
                completedBoxes: statsData.completedBoxes,
                publishedBoxes: statsData.publishedBoxes,
            },

            // Box 列表（空数组，实际数据由 useUserBoxes 提供）
            allBoxes: [],
            ownedBoxes: [],
            mintedBoxes: [],
            soldBoxes: [],
            boughtBoxes: [],
            bidBoxes: [],
            completedBoxes: [],
            publishedBoxes: [],
        }
        : null;

    // 返回 React Query 兼容的接口
    return {
        data,
        isLoading,
        isError,
        error: error || null,
        isSuccess,
    };
};




