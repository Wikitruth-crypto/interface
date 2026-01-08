"use client"

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CHAIN_CONFIG  } from '@dapp/config/contractsConfig';
import { queryUserBoxes, type UserBoxQueryResult } from '@dapp/services/supabase/profile';
import { calculateStatus } from '@dapp/services/supabase/status';
import { FilterState, BoxData } from '../types/profile.types';
import { BoxStatus } from '../types/profile.types';

/**
 * Convert Supabase query results to BoxData format
 */
const convertToBoxData = (result: UserBoxQueryResult): BoxData => {
    const metadata = result.metadata_boxes;
    
    // Calculate status based on contract logic (considering deadline and buyerId)
    const calculatedStatus = calculateStatus(
        result.status,
        result.deadline,
        result.buyer_id
    ) as BoxStatus;
    
    return {
        // Box basic fields
        id: result.id,
        tokenId: result.token_id,
        price: result.price,
        deadline: result.deadline,
        status: calculatedStatus,
        createTimestamp: result.create_timestamp,
        boxInfoCID: result.box_info_cid || undefined,
        acceptedToken: result.accepted_token || undefined,
        refundPermit: result.refund_permit || false,
        listedMode: (result.listed_mode as 'Selling' | 'Auctioning') || undefined,
        
        // User relationship fields (converted to User object format)
        owner: {
            id: result.owner_address,
        },
        minter: {
            id: result.minter_id,
        },
        seller: result.seller_id ? { id: result.seller_id } : undefined,
        buyer: result.buyer_id ? { id: result.buyer_id } : undefined,
        completer: result.completer_id ? { id: result.completer_id } : undefined,
        publisher: result.publisher_id ? { id: result.publisher_id } : undefined,
        bidders: result.box_bidders?.map(bidder => ({ id: bidder.bidder_id })) || [],
        
        // Metadata fields
        title: metadata?.title || undefined,
        description: metadata?.description || undefined,
        nftImage: metadata?.nft_image || undefined,
        boxImage: metadata?.box_image || undefined,
        country: metadata?.country || undefined,
        state: metadata?.state || undefined,
        eventDate: metadata?.event_date || undefined,
        typeOfCrime: metadata?.type_of_crime || undefined,
        hasError: false,
    } as BoxData;
};

/**
 * useUserBoxes - Get user related Box list (based on Supabase)
 *
 * - Remove store_sapphire dependency
 * - Use Supabase query data
 * - Use React Query InfiniteQuery for data fetching and caching
 * - Keep the same interface as the old version (backward compatibility)
 */
export const useUserBoxes = (
    address: string, 
    filters: FilterState,
    userId: string
) => {
    const {network,layer} = CHAIN_CONFIG 

    // Use React Query InfiniteQuery for pagination query
    const {
        data,
        isLoading,
        isError,
        error,
        isSuccess,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['user-boxes', network, layer, address, userId, filters],
        queryFn: async ({ pageParam }) => {
            if (!address) {
                return { items: [], hasMore: false };
            }

            const limit = 20;
            const result = await queryUserBoxes(
                address,
                userId,
                filters,
                limit,
                pageParam as number
            );

            if (result.error) {
                throw result.error;
            }

            const items = (result.data || []).map(convertToBoxData);
            
            return {
                items,
                hasMore: items.length === limit, // If the returned data amount is equal to limit, there may be more data
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.hasMore) {
                return undefined;
            }
            // Return next offset
            return allPages.reduce((sum, page) => sum + page.items.length, 0);
        },
        enabled: !!address, // Only query when address exists
        staleTime: 30000, // Do not re-query within 30 seconds
    });

    // Convert to React Query InfiniteQuery compatible interface
    return {
        data: {
            pages: data?.pages || [{ items: [], hasMore: false }],
            pageParams: data?.pageParams || [0],
        },
        isLoading,
        isError,
        error: error || null,
        isSuccess,
        fetchNextPage,
        hasNextPage: hasNextPage || false,
        isFetchingNextPage,
    };
};