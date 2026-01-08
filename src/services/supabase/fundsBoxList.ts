/**
 * Box list reward data service
 * 
 * Batch fetch reward data for multiple Boxes from Supabase database
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from './config/supabase.config';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import { type BoxRewardData, type BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';

type BoxRewardsRow = Database['public']['Tables']['box_rewards']['Row'];

type QueryError = PostgrestError | Error | null;


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
 * Query Box reward data (box_rewards table)
 * 
 * Decide whether to query based on situation: call when reward info needs to be displayed
 * Supports querying reward data for multiple boxIds at once
 * 
 * @param boxIds - Box ID array (string format)
 * @returns Box reward data list (containing all matching boxId reward data)
 */
export async function query_BoxRewardsDataListByBoxIds(
    boxIds: string[],
): Promise<Result_BoxRewardsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // If boxIds is empty array, return empty result
        if (!boxIds || boxIds.length === 0) {
            return {
                boxRewardsData: null,
                error: null,
            };
        }

        // Query all box_rewards data for multiple boxIds
        const { data, error } = await supabase
            .from('box_rewards')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .in('box_id', boxIds);

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

