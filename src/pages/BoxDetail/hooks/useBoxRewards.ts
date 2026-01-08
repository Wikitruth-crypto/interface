/**
 * useBoxRewards - Query Box reward data
 * 
 * Get box_rewards table data from Supabase database
 * Use React Query to get and cache data
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { query_BoxRewardsData, type BoxRewardData } from '@dapp/services/supabase/fundsBox';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import type { BoxDetailData } from '@BoxDetail/types/boxDetailData';

export const useBoxRewards = (
    boxId: string,
    box: BoxDetailData,
) => {

    const { network, layer } = CHAIN_CONFIG;

    const shouldQuery = !!boxId && !!box && box.listedMode !== '' && (box.status === 'InSecrecy' || box.status === 'Published');

    // Use React Query to query Box reward data
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-rewards', network, layer, boxId],
        queryFn: async () => {
            const result = await query_BoxRewardsData(
                boxId
            );
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: shouldQuery, // Only when enabled is true and boxId exists to query
    });

    // Convert data format
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

