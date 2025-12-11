/**
 * Box 璇︽儏鏈嶅姟
 * 
 * 浠?Supabase 鏁版嵁搴撹幏鍙?Box 璇︽儏鏁版嵁
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
 * 杞崲 BoxRow 涓?BoxDetailData
 * @param boxRow - Box 鏁版嵁琛?
 */
function convertBoxRow(
    boxRow: BoxRow,
): BoxDetailData {
    const camelCased = camelcaseKeys(boxRow, { deep: true }) as any;
    return {
        ...camelCased,
        biddersIds: camelCased.biddersIds || [],
        acceptedToken: camelCased.acceptedToken ?? undefined,
        listedMode: camelCased.listedMode ?? undefined,
    };
}

/**
 * 杞崲 MetadataBoxRow 涓?MetadataBoxType
 * @param metadataRow 
 * @returns 
 */
function convertMetadataBoxRow(metadataRow: MetadataBoxRow): MetadataBoxType {
    // 鎵嬪姩鏄犲皠 supabase snake_case + JSON 瀛楁鍒?MetadataBoxType
    const encSlices: any = (metadataRow as any).encryption_slices_metadata_cid || {};
    const encPasswords: any = (metadataRow as any).encryption_passwords || {};
    const encFiles: any[] = Array.isArray((metadataRow as any).encryption_file_cid) ? (metadataRow as any).encryption_file_cid : [];

    const encryptionSlicesMetadataCID = {
        slicesMetadataCID_encryption:
            encSlices.slicesMetadataCID_encryption ??
            encSlices.slicesMetadataCidEncryption ??
            encSlices.slices_metadata_cid_encryption ??
            '',
        slicesMetadataCID_iv:
            encSlices.slicesMetadataCID_iv ??
            encSlices.slicesMetadataCidIv ??
            encSlices.slices_metadata_cid_iv ??
            '',
    };

    const encryptionPasswords = {
        password_encryption:
            encPasswords.password_encryption ??
            encPasswords.passwordEncryption ??
            encPasswords.password_encryption ??
            '',
        password_iv:
            encPasswords.password_iv ??
            encPasswords.passwordIv ??
            encPasswords.password_iv ??
            '',
    };

    const encryptionFileCID = encFiles.map((item) => ({
        fileCID_encryption:
            item.fileCID_encryption ??
            item.fileCidEncryption ??
            item.file_cid_encryption ??
            '',
        fileCID_iv:
            item.fileCID_iv ??
            item.fileCidIv ??
            item.file_cid_iv ??
            '',
    }));

    return {
        project: (metadataRow as any).project,
        website: (metadataRow as any).website,
        name: (metadataRow as any).name,
        tokenId: (metadataRow as any).id?.toString?.() ?? '',
        typeOfCrime: (metadataRow as any).type_of_crime ?? '',
        label: (metadataRow as any).label ?? [],
        title: (metadataRow as any).title ?? '',
        nftImage: (metadataRow as any).nft_image ?? '',
        boxImage: (metadataRow as any).box_image ?? '',
        country: (metadataRow as any).country ?? '',
        state: (metadataRow as any).state ?? '',
        description: (metadataRow as any).description ?? '',
        eventDate: (metadataRow as any).event_date ?? '',
        createDate: (metadataRow as any).create_date ?? '',
        timestamp: Number((metadataRow as any).timestamp ?? 0),
        mintMethod: (metadataRow as any).mint_method as MetadataBoxType['mintMethod'],
        fileList: (metadataRow as any).file_list ?? [],
        encryptionSlicesMetadataCID,
        encryptionFileCID,
        encryptionPasswords,
        publicKey: (metadataRow as any).public_key ?? '',
    } as MetadataBoxType;
}

/**
 * 鏌ヨ Box 璇︽儏锛堝寘鍚?metadata锛?
 * 
 * 榛樿蹇呴』鏌ヨ boxes 琛ㄥ拰 metadata_boxes 琛?
 * 
 * @param network - 缃戠粶绫诲瀷 (testnet | mainnet)
 * @param boxId - Box ID (瀛楃涓插舰寮?
 * @returns Box 璇︽儏鏁版嵁鍜屽厓鏁版嵁
 */
export async function queryBoxAndMetadata(
    boxId: string,
): Promise<BoxDetailResult> {
    try {
        const { network, layer } = CHAIN_CONFIG;
        // 绗竴姝ワ細鏌ヨ Box 鍩虹鏁版嵁
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

        // 绗簩姝ワ細鏌ヨ metadata_boxes锛堜竴瀵逛竴鍏崇郴锛?

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

        // 杞崲鏁版嵁鏍煎紡
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
 * 鏌ヨ Box 鐨勭珵鏍囪€?ID 鍒楄〃锛坆ox_bidders 琛級
 * 
 * 鏍规嵁鎯呭喌鍐冲畾鏄惁鏌ヨ锛氬綋 listedMode 涓?'Auctioning' 鏃惰皟鐢?
 * 
 * @param listedMode - 鍒楄〃妯″紡锛屽彧鏈?'Auctioning' 鏃舵墠鏌ヨ
 * @returns 绔炴爣鑰?ID 鍒楄〃
 */
export async function queryBoxDetail_BiddersIds(
    boxId: string,
    listedMode: string,
): Promise<BoxDetailResult_BiddersIds> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        let biddersIds: string[] | null = null;

        // 鍙湁褰?listedMode 涓?'Auctioning' 鏃舵墠鏌ヨ
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

            // 浠庢煡璇㈢粨鏋滀腑鎻愬彇 bidder_id 鏁扮粍
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
 * 灏嗛敊璇浆鎹负 QueryError 绫诲瀷
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

