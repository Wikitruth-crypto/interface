/**
 * Box 列表奖励数据服务
 * 
 * 从 Supabase 数据库批量获取多个 Box 的奖励数据
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from '@supabaseDocs/supabase.config';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';
import { type BoxRewardData, type BoxUserOrderAmountData } from '@/dapp/services/supabase/fundsBox';

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
 * 查询 Box 的奖励数据（box_rewards 表）
 * 
 * 根据情况决定是否查询：当需要显示奖励信息时调用
 * 支持一次查询多个 boxId 的奖励数据
 * 
 * @param boxIds - Box ID 数组（字符串形式）
 * @returns Box 奖励数据列表（包含所有匹配 boxId 的奖励数据）
 */
export async function query_BoxRewardsDataListByBoxIds(
    boxIds: string[],
): Promise<Result_BoxRewardsData> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        // 如果 boxIds 为空数组，直接返回空结果
        if (!boxIds || boxIds.length === 0) {
            return {
                boxRewardsData: null,
                error: null,
            };
        }

        // 查询多个 boxId 的所有 box_rewards 数据
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

