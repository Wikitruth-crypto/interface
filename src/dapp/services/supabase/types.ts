/**
 * Supabase 服务层类型定义
 *
 * 用于将 Supabase 数据库类型转换为前端使用的数据结构
 */

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
 */
export function convertSearchResultToMarketplaceBoxData(
    result: SearchBoxesResult
): MarketplaceBoxData {
    return {
        id: result.id,
        tokenId: result.token_id,
        tokenIdNumeric: toNumericTokenId(result.token_id),
        price: result.price,
        status: normalizeStatus(result.status),
        // deadline: result.,
        boxInfoCID: null,
        acceptToken: undefined,
        title: result.title ?? undefined,
        description: result.description ?? undefined,
        nftImage: result.nft_image,
        boxImage: result.box_image,
        country: result.country,
        state: result.state,
        eventDate: result.event_date ?? result.create_timestamp, 
        typeOfCrime: result.type_of_crime ?? undefined,
        label: result.label,
        relevance: result.relevance,
        hasError: false,
    };
}
