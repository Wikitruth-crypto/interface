/**
 * 用户数据服务
 * 
 * 从 Supabase 数据库获取用户相关的数据（奖励和提取记录）
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from '@supabaseDocs/supabase.config';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';


type UserRewardsRow = Database['public']['Tables']['user_rewards']['Row'];
type UserWithdrawsRow = Database['public']['Tables']['user_withdraws']['Row'];

type QueryError = PostgrestError | Error | null;


/**
 * 用户奖励数据接口（前端使用）
 */
export interface UserRewardData {
    id: string;
    userId: string;
    rewardType: string;
    token: string;
    amount: string;
}

/**
 * 用户提取数据接口（前端使用）
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
 * 转换 UserRewardsRow 为 UserRewardData
 * @param userRewardsRow - user_rewards 表的数据行
 * @returns 转换后的 UserRewardData
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
 * 转换 UserWithdrawsRow 为 UserWithdrawData
 * @param userWithdrawsRow - user_withdraws 表的数据行
 * @returns 转换后的 UserWithdrawData
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
 * 查询用户的奖励数据（user_rewards 表）
 * 
 * 根据情况决定是否查询：当需要显示用户奖励信息时调用
 * 
 * @param userId - 用户 ID (字符串形式)
 * @returns 用户奖励数据列表
 */
export async function query_UserRewardsData(
    userId: string,
): Promise<Result_UserRewardsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // 查询当前 userId 的所有 user_rewards 数据
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

        // 转换数据格式
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
 * 查询用户的提取数据（user_withdraws 表）
 * 
 * 根据情况决定是否查询：当需要显示用户已提取的奖励资金时调用
 * 
 * @param userId - 用户 ID (字符串形式)
 * @returns 用户提取数据列表
 */
export async function query_UserWithdrawsData(
    userId: string,
): Promise<Result_UserWithdrawsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // 查询当前 userId 的所有 user_withdraws 数据
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

        // 转换数据格式
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
 * 将错误转换为 QueryError 类型
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

