import type { PostgrestError } from '@supabase/supabase-js';
import { supabase, Database } from '@supabaseDocs/supabase.config';
import type { FilterState } from '@/dapp/pages/Profile/types/profile.types';

const DEFAULT_NETWORK: 'testnet' | 'mainnet' = 'testnet';
const DEFAULT_LAYER: 'sapphire' = 'sapphire';

type QueryError = PostgrestError | Error | null;
type BoxRow = Database['public']['Tables']['boxes']['Row'];
type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];
type BoxBiddersRow = Database['public']['Tables']['box_bidders']['Row'];

// 用户 Box 查询结果类型（包含关联的元数据）
export interface UserBoxQueryResult extends BoxRow {
    metadata_boxes: MetadataBoxRow | null;
    box_bidders?: BoxBiddersRow[];
}

// 用户统计数据
export interface UserStatsResult {
    totalBoxes: number;
    ownedBoxes: number;
    mintedBoxes: number;
    soldBoxes: number;
    boughtBoxes: number;
    bidBoxes: number;
    completedBoxes: number;
    publishedBoxes: number;
}

const toQueryError = (error: unknown): QueryError => {
    if (!error) {
        return null;
    }
    if (typeof error === 'object' && 'message' in (error as Record<string, unknown>)) {
        return error as PostgrestError | Error;
    }
    return new Error('Unknown Supabase error');
};

/**
 * 查询用户相关的 Box 列表
 * 
 * @param network - 网络类型 ('testnet' | 'mainnet')
 * @param userAddress - 用户地址
 * @param userId - 用户 ID (可选,用于查询需要 userId 的 Tab)
 * @param filters - 筛选条件
 * @param limit - 每页数量
 * @param offset - 偏移量
 */
export async function queryUserBoxes(
    network: 'testnet' | 'mainnet',
    userAddress: string,
    userId: string | null,
    filters: FilterState,
    limit: number = 20,
    offset: number = 0
): Promise<{ data: UserBoxQueryResult[] | null; error: QueryError }> {
    try {
        let query = supabase
            .from('boxes')
            .select(`
                *,
                metadata_boxes (*),
                box_bidders (*)
            `)
            .eq('network', network)
            .eq('layer', DEFAULT_LAYER);

        // 根据 Tab 应用筛选
        switch (filters.selectedTab) {
            case 'owned':
                // 使用 owner_address 匹配
                query = query.eq('owner_address', userAddress.toLowerCase());
                break;
            case 'minted':
                // 需要 userId
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('minter_id', userId);
                break;
            case 'sold':
                // 需要 userId
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('seller_id', userId);
                break;
            case 'bought':
                // 需要 userId
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('buyer_id', userId);
                break;
            case 'bade':
                // 需要先查询 box_bidders 表获取 boxId 列表
                if (!userId) {
                    return { data: [], error: null };
                }
                const { data: bidBoxes, error: bidError } = await supabase
                    .from('box_bidders')
                    .select('id')
                    .eq('network', network)
                    .eq('layer', DEFAULT_LAYER)
                    .eq('bidder_id', userId);
                
                if (bidError) {
                    return { data: null, error: bidError };
                }
                
                const boxIds = bidBoxes?.map((b: { id: string }) => b.id) || [];
                if (boxIds.length === 0) {
                    return { data: [], error: null };
                }
                query = query.in('id', boxIds);
                break;
            case 'completed':
                // 需要 userId
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('completer_id', userId);
                break;
            case 'published':
                // 需要 userId
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('publisher_id', userId);
                break;
            case 'all':
            default:
                // 查询所有相关的 Box
                // 组合条件: owner_address 或 userId 相关的字段
                if (userId) {
                    query = query.or(
                        `owner_address.eq.${userAddress.toLowerCase()},` +
                        `minter_id.eq.${userId},` +
                        `seller_id.eq.${userId},` +
                        `buyer_id.eq.${userId},` +
                        `completer_id.eq.${userId},` +
                        `publisher_id.eq.${userId}`
                    );
                } else {
                    // 如果没有 userId,只查询 owner_address
                    query = query.eq('owner_address', userAddress.toLowerCase());
                }
                break;
        }

        // 状态筛选
        if (filters.selectedStatus) {
            query = query.eq('status', filters.selectedStatus);
        }

        // 排序
        switch (filters.orderBy) {
            case 'tokenId':
                query = query.order('id', { ascending: filters.orderDirection === 'asc' });
                break;
            case 'price':
                query = query.order('price', { ascending: filters.orderDirection === 'asc' });
                break;
            case 'createTimestamp':
                query = query.order('create_timestamp', { ascending: filters.orderDirection === 'asc' });
                break;
            default:
                query = query.order('create_timestamp', { ascending: false });
                break;
        }

        // 分页
        query = query.range(offset, offset + limit - 1);

        const { data, error } = await query;

        if (error) {
            return { data: null, error };
        }

        return { data: data as UserBoxQueryResult[] | null, error: null };
    } catch (error) {
        console.error('Error querying user boxes:', error);
        return { data: null, error: toQueryError(error) };
    }
}

/**
 * 查询用户统计数据
 * 
 * @param network - 网络类型
 * @param userAddress - 用户地址
 * @param userId - 用户 ID (可选)
 */
export async function queryUserStats(
    network: 'testnet' | 'mainnet',
    userAddress: string,
    userId: string | null
): Promise<{ data: UserStatsResult | null; error: QueryError }> {
    try {
        const stats: UserStatsResult = {
            totalBoxes: 0,
            ownedBoxes: 0,
            mintedBoxes: 0,
            soldBoxes: 0,
            boughtBoxes: 0,
            bidBoxes: 0,
            completedBoxes: 0,
            publishedBoxes: 0,
        };

        // 查询 ownedBoxes (使用 owner_address)
        const { count: ownedCount } = await supabase
            .from('boxes')
            .select('*', { count: 'exact', head: true })
            .eq('network', network)
            .eq('layer', DEFAULT_LAYER)
            .eq('owner_address', userAddress.toLowerCase());
        stats.ownedBoxes = ownedCount || 0;

        if (userId) {
            // 查询 mintedBoxes
            const { count: mintedCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('minter_id', userId);
            stats.mintedBoxes = mintedCount || 0;

            // 查询 soldBoxes
            const { count: soldCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('seller_id', userId);
            stats.soldBoxes = soldCount || 0;

            // 查询 boughtBoxes
            const { count: boughtCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('buyer_id', userId);
            stats.boughtBoxes = boughtCount || 0;

            // 查询 bidBoxes (通过 box_bidders 表)
            const { count: bidCount } = await supabase
                .from('box_bidders')
                .select('*', { count: 'exact', head: true })
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('bidder_id', userId);
            stats.bidBoxes = bidCount || 0;

            // 查询 completedBoxes
            const { count: completedCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('completer_id', userId);
            stats.completedBoxes = completedCount || 0;

            // 查询 publishedBoxes
            const { count: publishedCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('publisher_id', userId);
            stats.publishedBoxes = publishedCount || 0;

            // 计算 totalBoxes (去重)
            // 查询所有相关的 Box ID
            const { data: allBoxIds } = await supabase
                .from('boxes')
                .select('id')
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .or(
                    `owner_address.eq.${userAddress.toLowerCase()},` +
                    `minter_id.eq.${userId},` +
                    `seller_id.eq.${userId},` +
                    `buyer_id.eq.${userId},` +
                    `completer_id.eq.${userId},` +
                    `publisher_id.eq.${userId}`
                );

            // 查询 bidBoxes 的 boxId
            const { data: bidBoxIds } = await supabase
                .from('box_bidders')
                .select('id')
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('bidder_id', userId);

            // 合并并去重
            const allIds = new Set<string>();
            allBoxIds?.forEach((box: { id: string }) => allIds.add(box.id));
            bidBoxIds?.forEach((bid: { id: string }) => allIds.add(bid.id));
            stats.totalBoxes = allIds.size;
        } else {
            // 如果没有 userId,只统计 ownedBoxes
            stats.totalBoxes = stats.ownedBoxes;
        }

        return { data: stats, error: null };
    } catch (error) {
        console.error('Error querying user stats:', error);
        return { data: null, error: toQueryError(error) };
    }
}

