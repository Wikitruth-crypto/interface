/**
 * useBoxRewards - 查询 Box 的奖励数据
 * 
 * 从 Supabase 数据库获取 box_rewards 表数据
 * 使用 React Query 进行数据获取和缓存
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxDetail_BoxRewardsData } from '@/dapp/services/supabase/boxDetail';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';
import type { BoxRewardData } from '@/dapp/pages/BoxDetail/types/boxDetailData';

export const useBoxRewards = (
    boxId: string,
    enabled: boolean = true
) => {

    // 获取当前网络
    const { network, layer } = CHAIN_CONFIG;

    // 使用 React Query 查询 Box 奖励数据
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-rewards', network, layer, boxId],
        queryFn: async () => {
            const result = await queryBoxDetail_BoxRewardsData(
                boxId
            );
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: enabled && !!boxId, // 只有当 enabled 为 true 且 boxId 存在时才查询
    });

    // 转换数据格式
    const boxRewardsData: BoxRewardData[] | undefined = useMemo(() => {
        if (!data?.boxRewardsData) {
            return undefined;
        }
        return data.boxRewardsData;
    }, [data?.boxRewardsData]);

    return {
        boxRewardsData,
        isLoading: isLoading || isFetching,
        error: error || null,
    };
};

