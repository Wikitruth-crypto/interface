import type { PostgrestError } from '@supabase/supabase-js';
import { supabase, Database } from './config/supabase.config';
import type { FilterState } from '@Profile/types/profile.types';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';

type QueryError = PostgrestError | Error | null;
type BoxRow = Database['public']['Tables']['boxes']['Row'];
type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];
type BoxBiddersRow = Database['public']['Tables']['box_bidders']['Row'];

// User Box query result type (includes associated metadata)
export interface UserBoxQueryResult extends BoxRow {
    metadata_boxes: MetadataBoxRow | null;
    box_bidders?: BoxBiddersRow[];
}

// User statistical data
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
 * Query user-related Box list
 * 
 * @param network - Network type ('testnet' | 'mainnet')
 * @param userAddress - User address
 * @param userId - User ID (Optional, used for querying Tabs that require userId)
 * @param filters - Filter conditions
 * @param limit - Items per page
 * @param offset - Offset
 */
export async function queryUserBoxes(
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
            .eq('network', CHAIN_CONFIG.network)
            .eq('layer', CHAIN_CONFIG.layer);

        // Apply filters based on Tab
        switch (filters.selectedTab) {
            case 'owned':
                // Match using owner_address
                query = query.eq('owner_address', userAddress.toLowerCase());
                break;
            case 'minted':
                // userId required
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('minter_id', userId);
                break;
            case 'sold':
                // userId required
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('seller_id', userId);
                break;
            case 'bought':
                // userId required
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('buyer_id', userId);
                break;
            case 'bade':
                // Need to query box_bidders table first to get boxId list
                if (!userId) {
                    return { data: [], error: null };
                }
                const { data: bidBoxes, error: bidError } = await supabase
                    .from('box_bidders')
                    .select('id')
                    .eq('network', CHAIN_CONFIG.network)
                    .eq('layer', CHAIN_CONFIG.layer)
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
                // userId required
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('completer_id', userId);
                break;
            case 'published':
                // userId required
                if (!userId) {
                    return { data: [], error: null };
                }
                query = query.eq('publisher_id', userId);
                break;
            case 'all':
            default:
                // Query all related Boxes
                // Combined conditions: owner_address or userId related fields
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
                    // If no userId, only query owner_address
                    query = query.eq('owner_address', userAddress.toLowerCase());
                }
                break;
        }

        // Status filter
        if (filters.selectedStatus) {
            query = query.eq('status', filters.selectedStatus);
        }

        // Sort
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

        // Pagination
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
 * Query user statistical data
 * 
 * @param userAddress - User address
 * @param userId - User ID (Optional)
 */
export async function queryUserStats(
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

        // Query ownedBoxes (use owner_address)
        const { count: ownedCount } = await supabase
            .from('boxes')
            .select('*', { count: 'exact', head: true })
            .eq('network', CHAIN_CONFIG.network)
            .eq('layer', CHAIN_CONFIG.layer)
            .eq('owner_address', userAddress.toLowerCase());
        stats.ownedBoxes = ownedCount || 0;

        if (userId) {
            // Query mintedBoxes
            const { count: mintedCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('minter_id', userId);
            stats.mintedBoxes = mintedCount || 0;

            // Query soldBoxes
            const { count: soldCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('seller_id', userId);
            stats.soldBoxes = soldCount || 0;

            // Query boughtBoxes
            const { count: boughtCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('buyer_id', userId);
            stats.boughtBoxes = boughtCount || 0;

            // Query bidBoxes (via box_bidders table)
            const { count: bidCount } = await supabase
                .from('box_bidders')
                .select('*', { count: 'exact', head: true })
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('bidder_id', userId);
            stats.bidBoxes = bidCount || 0;

            // Query completedBoxes
            const { count: completedCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('completer_id', userId);
            stats.completedBoxes = completedCount || 0;

            // Query publishedBoxes
            const { count: publishedCount } = await supabase
                .from('boxes')
                .select('*', { count: 'exact', head: true })
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('publisher_id', userId);
            stats.publishedBoxes = publishedCount || 0;

            // Calculate totalBoxes (deduplicate)
            // Query all related Box IDs
            const { data: allBoxIds } = await supabase
                .from('boxes')
                .select('id')
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .or(
                    `owner_address.eq.${userAddress.toLowerCase()},` +
                    `minter_id.eq.${userId},` +
                    `seller_id.eq.${userId},` +
                    `buyer_id.eq.${userId},` +
                    `completer_id.eq.${userId},` +
                    `publisher_id.eq.${userId}`
                );

            // Query boxId from bidBoxes
            const { data: bidBoxIds } = await supabase
                .from('box_bidders')
                .select('id')
                .eq('network', CHAIN_CONFIG.network)
                .eq('layer', CHAIN_CONFIG.layer)
                .eq('bidder_id', userId);

            // Merge and deduplicate
            const allIds = new Set<string>();
            allBoxIds?.forEach((box: { id: string }) => allIds.add(box.id));
            bidBoxIds?.forEach((bid: { id: string }) => allIds.add(bid.id));
            stats.totalBoxes = allIds.size;
        } else {
            // If no userId, only count ownedBoxes
            stats.totalBoxes = stats.ownedBoxes;
        }

        return { data: stats, error: null };
    } catch (error) {
        console.error('Error querying user stats:', error);
        return { data: null, error: toQueryError(error) };
    }
}

