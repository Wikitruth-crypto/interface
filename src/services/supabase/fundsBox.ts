/**
 * Box Detail Service
 * 
 * Fetch Box detail data from Supabase database
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from './config/supabase.config';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';


type BoxUserOrderAmountsRow = Database['public']['Tables']['box_user_order_amounts']['Row'];
type BoxRewardsRow = Database['public']['Tables']['box_rewards']['Row'];

type QueryError = PostgrestError | Error | null;

export interface BoxRewardData {
    id: string;
    boxId: string;
    rewardType: string;
    token: string;
    rewardAmount: string;
}

export interface BoxUserOrderAmountData {
    id: string;
    userId: string;
    boxId: string;
    token: string;
    amount: string;
}


export interface Result_BoxRewardsData {
    boxRewardsData: BoxRewardData[] | null;
    error: QueryError;
}

export interface Result_OrderAmountsData {
    orderAmountsData: BoxUserOrderAmountData[] | null;
    error: QueryError;
}


/**
 * Convert BoxRewardsRow to BoxRewardData
 * @param boxRewardsRow - Data row from box_rewards table
 * @returns Converted BoxRewardData
 */
function convertBoxRewardsRow(boxRewardsRow: BoxRewardsRow): BoxRewardData {
    const camelCased = camelcaseKeys(boxRewardsRow, { deep: true }) as any;
    return {
        id: camelCased.id || '',
        boxId: camelCased.boxId || boxRewardsRow.box_id.toString(),
        rewardType: camelCased.rewardType || camelCased.reward_type || '',
        token: camelCased.token || '',
        rewardAmount: camelCased.amount?.toString() || '0',
    };
}


/**
 * Convert BoxUserOrderAmountsRow to BoxUserOrderAmountData
 * @param boxUserOrderAmountsRow - Data row from box_user_order_amounts table
 * @returns Converted BoxUserOrderAmountData
 */
function convertBoxUserOrderAmountsRow(boxUserOrderAmountsRow: BoxUserOrderAmountsRow): BoxUserOrderAmountData {
    const camelCased = camelcaseKeys(boxUserOrderAmountsRow, { deep: true }) as any;
    return {
        id: camelCased.id || '',
        userId: camelCased.userId || camelCased.user_id?.toString() || '',
        boxId: camelCased.boxId || camelCased.box_id?.toString() || '',
        token: camelCased.token || '',
        amount: camelCased.amount?.toString() || '0',
    };
}


/**
 * Query Box reward data (box_rewards table)
 * 
 * Decide whether to query based on situation: call when reward info needs to be displayed
 * 

 * @returns Box reward data list
 */
export async function query_BoxRewardsData(
    boxId: string,
): Promise<Result_BoxRewardsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // Query all box_rewards data for current boxId
        const { data, error } = await supabase
            .from('box_rewards')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .eq('box_id', boxId);

        if (error) {
            console.warn('Failed to fetch box_rewards:', error);
            return {
                boxRewardsData: null,
                error: error,
            };
        }

        // Convert data format
        const boxRewardsData: BoxRewardData[] = data
            ? data.map(row => convertBoxRewardsRow(row))
            : [];

        return {
            boxRewardsData: boxRewardsData.length > 0 ? boxRewardsData : null,
            error: null,
        };
    } catch (error) {
        return {
            boxRewardsData: null,
            error: toQueryError(error),
        };
    }
}

/**
 * Query Box user order amount data (box_user_order_amounts table)
 * 
 * Decide whether to query based on situation: call when user fund status in this Box needs to be displayed
 * Requires boxId, currentUserId, and acceptedToken to all exist to query data
 * 
 * @param boxId - Box ID (string format)
 * @param userId - Current User ID (string format)
 * @returns User order amount data list
 */
export async function query_OrderAmountsData(
    boxId: string,
    userId: string,
): Promise<Result_OrderAmountsData> {
    try {
        const { network, layer } = CHAIN_CONFIG;
        let orderAmountsData: BoxUserOrderAmountData[] | null = null;

        if (userId) {
            const { data, error } = await supabase
                .from('box_user_order_amounts')
                .select('*')
                .eq('network', network)
                .eq('layer', layer)
                .eq('box_id', boxId)
                .eq('user_id', userId)

            if (error) {
                console.warn('Failed to fetch box_user_order_amounts:', error);
                return {
                    orderAmountsData: null,
                    error: error,
                };
            }

            // Convert data format
            if (data && Array.isArray(data)) {
                orderAmountsData = data.map(row => convertBoxUserOrderAmountsRow(row));
            }
        }

        return {
            orderAmountsData: orderAmountsData && orderAmountsData.length > 0 ? orderAmountsData : null,
            error: null,
        };
    } catch (error) {
        return {
            orderAmountsData: null,
            error: toQueryError(error),
        };
    }
}
/**
 * Convert error to QueryError type
 */
function toQueryError(error: unknown): QueryError {
    if (!error) {
        return null;
    }
    if (typeof error === 'object' && 'message' in (error as Record<string, unknown>)) {
        return error as PostgrestError | Error;
    }
    return new Error('Unknown Supabase error');
}

