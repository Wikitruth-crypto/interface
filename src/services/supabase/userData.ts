/**
 * User Data Service
 * 
 * Fetch user-related data from Supabase database (rewards and withdrawal records)
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from './config/supabase.config';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';


type UserRewardsRow = Database['public']['Tables']['user_rewards']['Row'];
type UserWithdrawsRow = Database['public']['Tables']['user_withdraws']['Row'];

type QueryError = PostgrestError | Error | null;


/**
 * User reward data interface (frontend use)
 */
export interface UserRewardData {
    id: string;
    userId: string;
    rewardType: string;
    token: string;
    amount: string;
}

/**
 * User withdrawal data interface (frontend use)
 */
export interface UserWithdrawData {
    id: string;
    userId: string;
    withdrawType: string;
    token: string;
    amount: string;
}


export interface Result_UserRewardsData {
    userRewardsData: UserRewardData[] | null;
    error: QueryError;
}

export interface Result_UserWithdrawsData {
    userWithdrawsData: UserWithdrawData[] | null;
    error: QueryError;
}


/**
 * Convert UserRewardsRow to UserRewardData
 * @param userRewardsRow - Data row from user_rewards table
 * @returns Converted UserRewardData
 */
function convertUserRewardsRow(userRewardsRow: UserRewardsRow): UserRewardData {
    const camelCased = camelcaseKeys(userRewardsRow, { deep: true }) as any;
    return {
        id: camelCased.id || '',
        userId: camelCased.userId || camelCased.user_id?.toString() || '',
        rewardType: camelCased.rewardType || camelCased.reward_type || '',
        token: camelCased.token || '',
        amount: camelCased.amount?.toString() || '0',
    };
}


/**
 * Convert UserWithdrawsRow to UserWithdrawData
 * @param userWithdrawsRow - Data row from user_withdraws table
 * @returns Converted UserWithdrawData
 */
function convertUserWithdrawsRow(userWithdrawsRow: UserWithdrawsRow): UserWithdrawData {
    const camelCased = camelcaseKeys(userWithdrawsRow, { deep: true }) as any;
    return {
        id: camelCased.id || '',
        userId: camelCased.userId || camelCased.user_id?.toString() || '',
        withdrawType: camelCased.withdrawType || camelCased.withdraw_type || '',
        token: camelCased.token || '',
        amount: camelCased.amount?.toString() || '0',
    };
}


/**
 * Query user reward data (user_rewards table)
 * 
 * Decide whether to query based on situation: call when user reward info needs to be displayed
 * 
 * @param userId - User ID (string format)
 * @returns User reward data list
 */
export async function query_UserRewardsData(
    userId: string,
): Promise<Result_UserRewardsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // Query all user_rewards data for current userId
        const { data, error } = await supabase
            .from('user_rewards')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .eq('user_id', userId);

        if (error) {
            console.warn('Failed to fetch user_rewards:', error);
            return {
                userRewardsData: null,
                error: error,
            };
        }

        // Convert data format
        const userRewardsData: UserRewardData[] = data
            ? data.map(row => convertUserRewardsRow(row))
            : [];

        return {
            userRewardsData: userRewardsData.length > 0 ? userRewardsData : null,
            error: null,
        };
    } catch (error) {
        return {
            userRewardsData: null,
            error: toQueryError(error),
        };
    }
}


/**
 * Query user withdrawal data (user_withdraws table)
 * 
 * Decide whether to query based on situation: call when user withdrawn reward funds need to be displayed
 * 
 * @param userId - User ID (string format)
 * @returns User withdrawal data list
 */
export async function query_UserWithdrawsData(
    userId: string,
): Promise<Result_UserWithdrawsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // Query all user_withdraws data for current userId
        const { data, error } = await supabase
            .from('user_withdraws')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .eq('user_id', userId);

        if (error) {
            console.warn('Failed to fetch user_withdraws:', error);
            return {
                userWithdrawsData: null,
                error: error,
            };
        }

        // Convert data format
        const userWithdrawsData: UserWithdrawData[] = data
            ? data.map(row => convertUserWithdrawsRow(row))
            : [];

        return {
            userWithdrawsData: userWithdrawsData.length > 0 ? userWithdrawsData : null,
            error: null,
        };
    } catch (error) {
        return {
            userWithdrawsData: null,
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

