/**
 * Supabase 服务层类型定义
 *
 * 用于将 Supabase 数据库类型转换为前端使用的数据结构
 */

import camelcaseKeys from 'camelcase-keys';
import { boxStatus } from '@/dapp/types/contracts/truthBox';
import type { MarketplaceBoxData } from '@/dapp/pages/Marketplace/types/marketplace.types';
import type { Database } from '@supabaseDocs/supabase.config';

// Supabase 查询结果类型
export type SearchBoxesResult = Database['public']['Functions']['search_boxes']['Returns'][number];
export type StatisticalState = Database['public']['Tables']['statistical_state']['Row'];
export type BoxRow = Database['public']['Tables']['boxes']['Row'];
export type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];

// 类型守卫：检查 status 是否为有效的 BoxStatus
const isBoxStatus = (status: string): status is typeof boxStatus[number] => {
    return boxStatus.includes(status as typeof boxStatus[number]);
};

const toNumericTokenId = (tokenId: string): number | undefined => {
    const numeric = Number(tokenId);
    return Number.isNaN(numeric) ? undefined : numeric;
};

const normalizeStatus = (status: string): MarketplaceBoxData['status'] => {
    if (isBoxStatus(status)) {
        return status;
    }
    // 如果 status 不在有效列表中，返回第一个默认状态
    return boxStatus[0];
};

/**
 * 将 Supabase search_boxes 结果转换为 MarketplaceBoxData
 * 
 * 使用 camelcase-keys 自动转换 snake_case 字段为 camelCase
 * 然后处理特殊字段和类型转换
 */
export function convertSearchResultToMarketplaceBoxData(
    result: SearchBoxesResult
): MarketplaceBoxData {
    const camelCased = camelcaseKeys(result, { deep: true }) as any;
    
    // 处理特殊字段和类型转换
    return {
        ...camelCased,
        id: result.id, // 保留原始的 id 字段
        tokenId: result.token_id || result.id, // 优先使用 token_id
        tokenIdNumeric: toNumericTokenId(result.token_id || result.id),
        status: normalizeStatus(result.status),
        deadline: null,
        boxInfoCID: null,
        acceptToken: camelCased.acceptedToken ?? undefined, // camelcaseKeys 会将 accepted_token 转换为 acceptedToken
        hasError: false,
        title: camelCased.title ?? undefined,
        description: camelCased.description ?? undefined,
        typeOfCrime: camelCased.typeOfCrime ?? undefined,
        // event_date 会被 camelcaseKeys 自动转换为 eventDate
    };
}
