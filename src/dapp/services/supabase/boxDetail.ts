/**
 * Box 详情服务
 * 
 * 从 Supabase 数据库获取 Box 详情数据
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from '@supabaseDocs/supabase.config';
import type { MetadataBoxType } from '@/dapp/types/metadata/metadataBox';
import type { 
    BoxDetailData, 
} from '@/dapp/pages/BoxDetail/types/boxDetailData';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';


type BoxRow = Database['public']['Tables']['boxes']['Row'];
type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];

type QueryError = PostgrestError | Error | null;

export interface BoxDetailResult {
    box: BoxDetailData | null;
    metadataBox: MetadataBoxType | null;
    error: QueryError;
}


export interface BoxDetailResult_BiddersIds {
    biddersIds: string[] | null;
    error: QueryError;
}

/**
 * 转换 BoxRow 为 BoxDetailData
 * @param boxRow - Box 数据行
 */
function convertBoxRow(
    boxRow: BoxRow,
): BoxDetailData {
    const camelCased = camelcaseKeys(boxRow, { deep: true }) as any;
    return {
        ...camelCased,
        // 确保 biddersIds 字段存在（boxes 表中没有此字段，初始化为空数组）
        biddersIds: camelCased.biddersIds || [],
    };
}

/**
 * 转换 MetadataBoxRow 为 MetadataBoxType
 * @param metadataRow 
 * @returns 
 */
function convertMetadataBoxRow(metadataRow: MetadataBoxRow): MetadataBoxType {
    // 使用 camelcase-keys 自动转换所有 snake_case 字段为 camelCase
    // deep: true 表示递归转换嵌套对象（如果有嵌套对象）
    const camelCased = camelcaseKeys(metadataRow, { deep: true }) as any;
    return {
        ...camelCased,
    };
}

/**
 * 查询 Box 详情（包含 metadata）
 * 
 * 默认必须查询 boxes 表和 metadata_boxes 表
 * 
 * @param network - 网络类型 (testnet | mainnet)
 * @param boxId - Box ID (字符串形式)
 * @returns Box 详情数据和元数据
 */
export async function queryBoxAndMetadata(
    boxId: string,
): Promise<BoxDetailResult> {
    try {
        const { network, layer } = CHAIN_CONFIG;
        // 第一步：查询 Box 基础数据
        const { data: boxData, error: boxError } = await supabase
            .from('boxes')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .eq('id', boxId)
            .single();

        if (boxError) {
            return {
                box: null,
                metadataBox: null,
                error: boxError,
            };
        }

        if (!boxData) {
            return {
                box: null,
                metadataBox: null,
                error: null,
            };
        }

        // 第二步：查询 metadata_boxes（一对一关系）

        const { data: metadataData, error: metadataError } = await supabase
            .from('metadata_boxes')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .eq('id', boxId)
            .maybeSingle();

        if (metadataError) {
            console.warn('Failed to fetch metadata_boxes:', metadataError);
        }

        const metadataRow: MetadataBoxRow | null = metadataData || null;

        // 转换数据格式
        const box = convertBoxRow(boxData);
        const metadataBox = metadataRow ? convertMetadataBoxRow(metadataRow) : null;

        return {
            box,
            metadataBox,
            error: null,
        };
    } catch (error) {
        return {
            box: null,
            metadataBox: null,
            error: toQueryError(error),
        };
    }
}

/**
 * 查询 Box 的竞标者 ID 列表（box_bidders 表）
 * 
 * 根据情况决定是否查询：当 listedMode 为 'Auctioning' 时调用
 * 
 * @param listedMode - 列表模式，只有 'Auctioning' 时才查询
 * @returns 竞标者 ID 列表
 */
export async function queryBoxDetail_BiddersIds(
    boxId: string,
    listedMode: string,
): Promise<BoxDetailResult_BiddersIds> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        let biddersIds: string[] | null = null;

        // 只有当 listedMode 为 'Auctioning' 时才查询
        if (listedMode === 'Auctioning') {
            const { data, error } = await supabase
                .from('box_bidders')
                .select('bidder_id')
                .eq('network', network)
                .eq('layer', layer)
                .eq('id', boxId);

            if (error) {
                console.warn('Failed to fetch box_bidders:', error);
                return {
                    biddersIds: null,
                    error: error,
                };
            }

            // 从查询结果中提取 bidder_id 数组
            if (data && Array.isArray(data)) {
                biddersIds = data
                    .map((item: { bidder_id: string | number | bigint }) => {
                        const bidderId = item.bidder_id;
                        if (typeof bidderId === 'string') {
                            return bidderId;
                        }
                        if (typeof bidderId === 'bigint') {
                            return bidderId.toString();
                        }
                        return bidderId?.toString() || '';
                    })
                    .filter(id => id !== '');
            }
        }

        return {
            biddersIds: biddersIds && biddersIds.length > 0 ? biddersIds : null,
            error: null,
        };
    } catch (error) {
        return {
            biddersIds: null,
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

