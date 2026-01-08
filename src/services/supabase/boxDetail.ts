/**
 * Box Detail Service
 * 
 * Fetch Box detail data from Supabase database
 */

import type { PostgrestError } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import { supabase, Database } from './config/supabase.config';
import type { MetadataBoxType } from '@dapp/types/typesDapp/metadata/metadataBox';
import type { 
    BoxDetailData, 
} from '@BoxDetail/types/boxDetailData';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';

import { calculateStatus } from './status';

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
 * Convert BoxRow to BoxDetailData
 * @param boxRow - Box data row
 */
function convertBoxRow(
    boxRow: BoxRow,
): BoxDetailData {
    const camelCased = camelcaseKeys(boxRow, { deep: true }) as any;
    return {
        ...camelCased,
        status: calculateStatus(
            camelCased.status, 
            camelCased.deadline, 
            camelCased.buyerId || camelCased.buyer_id
        ),
        biddersIds: camelCased.biddersIds || [],
        acceptedToken: camelCased.acceptedToken ?? undefined,
        listedMode: camelCased.listedMode ?? undefined,
    };
}

/**
 * Convert MetadataBoxRow to MetadataBoxType
 * @param metadataRow 
 * @returns 
 */
function convertMetadataBoxRow(metadataRow: MetadataBoxRow): MetadataBoxType {
    // Manually map supabase snake_case + JSON fields to MetadataBoxType
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
 * Query Box details (including metadata)
 * 
 * Default must query boxes table and metadata_boxes table
 * 
 * @param network - Network type (testnet | mainnet)
 * @param boxId - Box ID (string format)
 * @returns Box detail data and metadata
 */
export async function queryBoxAndMetadata(
    boxId: string,
): Promise<BoxDetailResult> {
    try {
        const { network, layer } = CHAIN_CONFIG;
        // Step 1: Query Box basic data
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

        // Step 2: Query metadata_boxes (one-to-one relationship)

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

        // Convert data format
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
 * Query Box bidder ID list (box_bidders table)
 * 
 * Decide whether to query based on situation: called when listedMode is 'Auctioning'
 * 
 * @param listedMode - Listing mode, only query when 'Auctioning'
 * @returns Bidder ID list
 */
export async function queryBoxDetail_BiddersIds(
    boxId: string,
    listedMode: string,
): Promise<BoxDetailResult_BiddersIds> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        let biddersIds: string[] | null = null;

        // Only query when listedMode is 'Auctioning'
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

            // Extract bidder_id array from query result
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

