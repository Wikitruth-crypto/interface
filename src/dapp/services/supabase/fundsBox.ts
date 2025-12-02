/**
 * Box 详情服务
 * 
 * 从 Supabase 数据库获取 Box 详情数据
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from '@supabaseDocs/supabase.config';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';


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
 * 转换 BoxRewardsRow 为 BoxRewardData
 * @param boxRewardsRow - box_rewards 表的数据行
 * @returns 转换后的 BoxRewardData
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
 * 转换 BoxUserOrderAmountsRow 为 BoxUserOrderAmountData
 * @param boxUserOrderAmountsRow - box_user_order_amounts 表的数据行
 * @returns 转换后的 BoxUserOrderAmountData
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
 * 查询 Box 的奖励数据（box_rewards 表）
 * 
 * 根据情况决定是否查询：当需要显示奖励信息时调用
 * 

 * @returns Box 奖励数据列表
 */
export async function query_BoxRewardsData(
    boxId: string,
): Promise<Result_BoxRewardsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // 查询当前 boxId 的所有 box_rewards 数据
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

        // 转换数据格式
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
 * 查询 Box 用户的订单金额数据（box_user_order_amounts 表）
 * 
 * 根据情况决定是否查询：当需要显示用户在该 Box 中的资金状态时调用
 * 需要同时拥有 boxId、currentUserId、acceptedToken 三者都存在，才能查询到数据
 * 
 * @param boxId - Box ID (字符串形式)
 * @param userId - 当前用户 ID (字符串形式)
 * @returns 用户订单金额数据列表
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

            // 转换数据格式
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

