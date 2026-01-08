"use client";

import { useQuery } from '@tanstack/react-query';
import { queryMarketplaceStats } from '@dapp/services/supabase/marketplace';
import type { GlobalStats } from '../types/marketplace.types';

/**
 * Marketplace statistics data Hook (based on Supabase)
 * 
 * Responsibilities:
 * - Get statistics data from Supabase database
 * - Convert to frontend format
 * 
 * Features:
 * - Use React Query to get and cache data
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

            // Convert to frontend format
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
                totalGTV: 0, // TODO: calculate from token_total_amounts
            };

            return stats;
        },
        staleTime: 5 * 60000, // Do not re-query within 1 minute
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

