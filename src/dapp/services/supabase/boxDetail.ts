/**
 * Box 详情服务
 * 
 * 从 Supabase 数据库获取 Box 详情数据
 */

import type { PostgrestError } from '@supabase/supabase-js';
import { supabase, Database } from '@supabaseDocs/supabase.config';
import type { MetadataBoxType } from '@/dapp/types/contracts/metadataBox';

const DEFAULT_LAYER: 'sapphire' = 'sapphire';

type BoxRow = Database['public']['Tables']['boxes']['Row'];
type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];
type QueryError = PostgrestError | Error | null;

/**
 * 简化的 User 类型（用于 Box 中的关联数据）
 */
export interface UserData {
    id: string;
}

/**
 * 简化的 Token 类型（用于 Box 中的 acceptedToken）
 */
export interface TokenData {
    id: string;
    symbol?: string;
    decimals?: number;
}

/**
 * 转换后的 Box 数据（包含嵌套的关联数据）
 * 用于前端展示，包含 User 对象和 Token 对象
 */
export interface BoxDetailData {
    id: string;
    tokenId: string;
    tokenURI?: string | null;
    boxInfoCID?: string | null;
    privateKey?: string | null;
    price: string;
    deadline: string;
    minter: UserData;
    owner: UserData;
    publisher?: UserData;
    seller?: UserData;
    buyer?: UserData;
    completer?: UserData;
    bidders: UserData[];
    acceptedToken?: TokenData;
    status: string;
    listedMode?: string | null;
    refundPermit?: boolean | null;
    isInBlacklist?: boolean;
    createTimestamp: string;
    sellTimestamp?: string | null;
    publishTimestamp?: string | null;
    listedTimestamp?: string | null;
    purchaseTimestamp?: string | null;
    completeTimestamp?: string | null;
    requestRefundDeadline?: string | null;
    reviewDeadline?: string | null;
}

/**
 * 转换后的 MetadataBox 数据
 */
export interface MetadataBoxData {
    id: string;
    typeOfCrime?: string | null;
    label?: string[] | null;
    title?: string | null;
    nftImage?: string | null;
    boxImage?: string | null;
    country?: string | null;
    state?: string | null;
    description?: string | null;
    eventDate?: string | null;
    createDate?: string | null;
    timestamp?: number | null;
    mintMethod?: string | null;
    fileList?: string[] | null;
    password?: string | null;
    encryptionSlicesMetadataCID?: Record<string, unknown> | null;
    encryptionFileCID?: Record<string, unknown>[] | null;
    encryptionPasswords?: Record<string, unknown> | null;
    publicKey?: string | null;
}

export interface BoxDetailResult {
    box: BoxDetailData | null;
    metadataBox: MetadataBoxData | null;
    error: QueryError;
}

/**
 * 转换 BoxRow 和相关联的 Users 为 BoxDetailData
 * 
 * @param boxRow - Box 数据行
 * @param users - Users 数据映射（userId -> UserData）
 * @param bidders - Bidders 用户列表
 * @param acceptedToken - Accepted Token 数据（可选）
 * @param isBlacklisted - 是否在黑名单中
 */
function convertBoxRow(
    boxRow: BoxRow,
    users: Record<string, UserData>,
    bidders: UserData[],
    acceptedToken?: TokenData,
    isBlacklisted?: boolean
): BoxDetailData {
    return {
        id: boxRow.id,
        tokenId: boxRow.token_id,
        tokenURI: boxRow.token_uri,
        boxInfoCID: boxRow.box_info_cid,
        privateKey: boxRow.private_key,
        price: boxRow.price,
        deadline: boxRow.deadline,
        minter: users[boxRow.minter_id] || { id: boxRow.minter_id },
        owner: users[boxRow.owner_address] || { id: boxRow.owner_address },
        publisher: boxRow.publisher_id ? (users[boxRow.publisher_id] || { id: boxRow.publisher_id }) : undefined,
        seller: boxRow.seller_id ? (users[boxRow.seller_id] || { id: boxRow.seller_id }) : undefined,
        buyer: boxRow.buyer_id ? (users[boxRow.buyer_id] || { id: boxRow.buyer_id }) : undefined,
        completer: boxRow.completer_id ? (users[boxRow.completer_id] || { id: boxRow.completer_id }) : undefined,
        bidders: bidders,
        acceptedToken: acceptedToken,
        status: boxRow.status,
        listedMode: boxRow.listed_mode,
        refundPermit: boxRow.refund_permit,
        isInBlacklist: isBlacklisted || false,
        createTimestamp: boxRow.create_timestamp,
        sellTimestamp: boxRow.sell_timestamp,
        publishTimestamp: boxRow.publish_timestamp,
        listedTimestamp: boxRow.listed_timestamp,
        purchaseTimestamp: boxRow.purchase_timestamp,
        completeTimestamp: boxRow.complete_timestamp,
        requestRefundDeadline: boxRow.request_refund_deadline,
        reviewDeadline: boxRow.review_deadline,
    };
}

/**
 * 转换 MetadataBoxRow 为 MetadataBoxData
 */
function convertMetadataBoxRow(metadataRow: MetadataBoxRow): MetadataBoxData {
    return {
        id: metadataRow.id,
        typeOfCrime: metadataRow.type_of_crime,
        label: metadataRow.label,
        title: metadataRow.title,
        nftImage: metadataRow.nft_image,
        boxImage: metadataRow.box_image,
        country: metadataRow.country,
        state: metadataRow.state,
        description: metadataRow.description,
        eventDate: metadataRow.event_date,
        createDate: metadataRow.create_date,
        timestamp: metadataRow.timestamp,
        mintMethod: metadataRow.mint_method,
        fileList: metadataRow.file_list,
        password: metadataRow.password,
        encryptionSlicesMetadataCID: metadataRow.encryption_slices_metadata_cid,
        encryptionFileCID: metadataRow.encryption_file_cid,
        encryptionPasswords: metadataRow.encryption_passwords,
        publicKey: metadataRow.public_key,
    };
}

/**
 * 将 MetadataBoxData 转换为 MetadataBoxType
 */
export function convertMetadataBoxToType(metadataBox: MetadataBoxData | null): MetadataBoxType | undefined {
    if (!metadataBox) {
        return undefined;
    }

    // 转换加密数据格式
    const encryptionSlicesMetadataCID = metadataBox.encryptionSlicesMetadataCID
        ? (metadataBox.encryptionSlicesMetadataCID as {
            slicesMetadataCID_encryption: string;
            slicesMetadataCID_iv: string;
        })
        : {
            slicesMetadataCID_encryption: '',
            slicesMetadataCID_iv: '',
        };

    const encryptionFileCID = Array.isArray(metadataBox.encryptionFileCID)
        ? metadataBox.encryptionFileCID as Array<{
            fileCID_encryption: string;
            fileCID_iv: string;
        }>
        : [];

    const encryptionPasswords = metadataBox.encryptionPasswords
        ? (metadataBox.encryptionPasswords as {
            password_encryption: string;
            password_iv: string;
        })
        : {
            password_encryption: '',
            password_iv: '',
        };

    return {
        // BoxInfoType
        name: 'Truth Box',
        tokenId: metadataBox.id,
        typeOfCrime: metadataBox.typeOfCrime || '',
        label: metadataBox.label || [],
        title: metadataBox.title || '',
        nftImage: metadataBox.nftImage || '',
        boxImage: metadataBox.boxImage || '',
        country: metadataBox.country || '',
        state: metadataBox.state || '',
        description: metadataBox.description || '',
        eventDate: metadataBox.eventDate || '',
        createDate: metadataBox.createDate || '',
        timestamp: metadataBox.timestamp || 0,
        mintMethod: (metadataBox.mintMethod as 'create' | 'createAndPublish') || 'create',
        // ProjectDataType
        project: 'WikiTruth',
        website: [], // website 是 string[] 类型
        // FileInfoType
        fileList: metadataBox.fileList || [],
        // EncryptionDataType
        encryptionSlicesMetadataCID,
        encryptionFileCID,
        encryptionPasswords,
        publicKey: metadataBox.publicKey || '',
    };
}

/**
 * 查询 Box 详情（包含 metadata）
 * 
 * @param network - 网络类型 (testnet | mainnet)
 * @param boxId - Box ID (字符串形式)
 * @returns Box 详情数据和元数据
 */
export async function queryBoxDetail(
    network: 'testnet' | 'mainnet',
    boxId: string
): Promise<BoxDetailResult> {
    try {
        // 查询 Box 数据（关联 metadata_boxes 和 box_bidders）
        // 使用类型断言来处理 Supabase 返回的关联数据
        type BoxWithRelations = BoxRow & {
            metadata_boxes: MetadataBoxRow[] | MetadataBoxRow | null;
            box_bidders?: Array<{
                bidder_id: string;
                users?: { id: string };
            }>;
        };

        const { data: boxData, error: boxError } = await supabase
            .from('boxes')
            .select(`
                *,
                metadata_boxes (*),
                box_bidders (
                    bidder_id,
                    users!box_bidders_bidder_id_fkey (
                        id
                    )
                )
            `)
            .eq('network', network)
            .eq('layer', DEFAULT_LAYER)
            .eq('id', boxId)
            .single() as { data: BoxWithRelations | null; error: PostgrestError | null };

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

        // 提取 metadata_boxes 数据
        let metadataRow: MetadataBoxRow | null = null;
        
        if (boxData.metadata_boxes) {
            if (Array.isArray(boxData.metadata_boxes)) {
                metadataRow = boxData.metadata_boxes[0] || null;
            } else {
                metadataRow = boxData.metadata_boxes as MetadataBoxRow;
            }
        }

        // 收集所有需要的 userId（用于查询 User 数据）
        const userIds = new Set<string>();
        userIds.add(boxData.minter_id);
        userIds.add(boxData.owner_address);
        if (boxData.publisher_id) userIds.add(boxData.publisher_id);
        if (boxData.seller_id) userIds.add(boxData.seller_id);
        if (boxData.buyer_id) userIds.add(boxData.buyer_id);
        if (boxData.completer_id) userIds.add(boxData.completer_id);

        // 从 box_bidders 中提取 bidder IDs
        const bidders: UserData[] = [];
        if (boxData.box_bidders && Array.isArray(boxData.box_bidders)) {
            for (const bidder of boxData.box_bidders) {
                if (bidder.users) {
                    bidders.push({ id: bidder.users.id });
                } else if (bidder.bidder_id) {
                    bidders.push({ id: bidder.bidder_id });
                    userIds.add(bidder.bidder_id);
                }
            }
        }

        // 查询所有关联的 Users 数据
        const userIdsArray = Array.from(userIds);
        const usersMap: Record<string, UserData> = {};
        
        if (userIdsArray.length > 0) {
            const { data: usersData } = await supabase
                .from('users')
                .select('id')
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .in('id', userIdsArray);

            if (usersData) {
                for (const user of usersData) {
                    // 使用类型断言处理 Supabase 返回的数据
                    const userRow = user as { id: string };
                    usersMap[userRow.id] = { id: userRow.id };
                }
            }
        }

        // 查询黑名单状态（检查 owner_address 是否在黑名单中）
        let isBlacklisted = false;
        if (boxData.owner_address) {
            const { data: userAddressData } = await supabase
                .from('user_addresses')
                .select('is_blacklisted')
                .eq('network', network)
                .eq('layer', DEFAULT_LAYER)
                .eq('id', boxData.owner_address)
                .single() as { data: { is_blacklisted: boolean } | null; error: PostgrestError | null };

            isBlacklisted = userAddressData?.is_blacklisted || false;
        }

        // 查询 Token 数据（如果有 acceptedToken）
        let acceptedToken: TokenData | undefined;
        if (boxData.accepted_token) {
            // 注意：tokens 表的结构需要查看，这里假设有 id、symbol、decimals 字段
            // 如果 tokens 表不存在，可以暂时只返回 id
            acceptedToken = {
                id: boxData.accepted_token,
            };
        }

        // 转换数据格式
        const box = convertBoxRow(boxData, usersMap, bidders, acceptedToken, isBlacklisted);
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

