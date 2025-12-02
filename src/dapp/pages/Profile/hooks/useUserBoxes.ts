"use client"

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CHAIN_CONFIG  } from '@/dapp/contractsConfig';
import { queryUserBoxes, type UserBoxQueryResult } from '@/dapp/services/supabase/profile';
import { FilterState, BoxData } from '../types/profile.types';
import { BoxStatus } from '../types/profile.types';

/**
 * 将 Supabase 查询结果转换为 BoxData 格式
 */
const convertToBoxData = (result: UserBoxQueryResult): BoxData => {
    const metadata = result.metadata_boxes;
    
    return {
        // Box 基础字段
        id: result.id,
        tokenId: result.token_id,
        price: result.price,
        deadline: result.deadline,
        status: result.status as BoxStatus,
        createTimestamp: result.create_timestamp,
        boxInfoCID: result.box_info_cid || undefined,
        acceptedToken: result.accepted_token || undefined,
        refundPermit: result.refund_permit || false,
        listedMode: (result.listed_mode as 'Selling' | 'Auctioning') || undefined,
        
        // 用户关系字段（转换为 User 对象格式）
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
        
        // 元数据字段
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
 * useUserBoxes - 获取用户相关的 Box 列表（基于 Supabase）
 *
 * 重构说明：
 * - 移除 store_sapphire 依赖
 * - 使用 Supabase 查询数据
 * - 使用 React Query InfiniteQuery 进行数据获取和缓存
 * - 保持与旧版本相同的接口（向后兼容）
 */
export const useUserBoxes = (
    address: string, 
    filters: FilterState,
    userId: string
) => {
    const {network,layer} = CHAIN_CONFIG 

    // 使用 React Query InfiniteQuery 进行分页查询
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
                hasMore: items.length === limit, // 如果返回的数据量等于 limit，可能还有更多数据
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.hasMore) {
                return undefined;
            }
            // 返回下一个 offset
            return allPages.reduce((sum, page) => sum + page.items.length, 0);
        },
        enabled: !!address, // 只有当 address 存在时才查询
        staleTime: 30000, // 30 秒内不重新查询
    });

    // 转换为 React Query InfiniteQuery 兼容的接口
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