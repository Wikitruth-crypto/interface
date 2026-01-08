"use client"

import { useQuery } from '@tanstack/react-query';
import { CHAIN_CONFIG  } from '@dapp/config/contractsConfig';
import { queryUserStats } from '@dapp/services/supabase/profile';
import { UserProfileData } from '../types/profile.types';

/**
 * useUserProfile - Get user Profile data (based on Supabase)
 *
 * - Remove store_sapphire dependency
 * - Use Supabase query user statistics data
 * - Use React Query for data fetching and caching
 * - Keep the same interface as the old version (backward compatibility)
 */
export const useUserProfile = (
    address: string,
    userId: string
) => {
    const {network,layer} = CHAIN_CONFIG

    // Use React Query to query user statistics data
    const {
        data: statsData,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['user-profile', network, layer, address, userId],
        queryFn: async () => {
            if (!address) {
                return null;
            }

            const result = await queryUserStats(address, userId);

            if (result.error) {
                throw result.error;
            }

            return result.data;
        },
        enabled: !!address, // Only query when address exists
        staleTime: 30000, // Do not re-query within 30 seconds
    });

    // Build UserProfileData object
    const data: UserProfileData | null = statsData
        ? {
            // Basic user information (built from statistics data)
            id: userId || address, // Use userId or address as id
            address: address || '',

            // Statistics data
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

            // Box list (empty array, actual data provided by useUserBoxes)
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

    // Return React Query compatible interface
    return {
        data,
        isLoading,
        isError,
        error: error || null,
        isSuccess,
    };
};




