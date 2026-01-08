/**
 * Supabase Service Layer Type Definitions
 *
 * Used to convert Supabase database types to data structures used by frontend
 */

import camelcaseKeys from 'camelcase-keys';
import { boxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import type { MarketplaceBoxData } from '@Marketplace/types/marketplace.types';
import type { Database } from './config/supabase.config';

// Supabase query result types
export type SearchBoxesResult = Database['public']['Functions']['search_boxes']['Returns'][number];
export type StatisticalState = Database['public']['Tables']['statistical_state']['Row'];
export type BoxRow = Database['public']['Tables']['boxes']['Row'];
export type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];

// Type guard: Check if status is a valid BoxStatus
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
    // If status is not in the valid list, return the first default status
    return boxStatus[0];
};

/**
 * Convert Supabase search_boxes result to MarketplaceBoxData
 * 
 * Use camelcase-keys to automatically convert snake_case fields to camelCase
 * Then handle special fields and type conversions
 */
export function convertSearchResultToMarketplaceBoxData(
    result: SearchBoxesResult
): MarketplaceBoxData {
    const camelCased = camelcaseKeys(result, { deep: true }) as any;
    
    // Handle special fields and type conversions
    return {
        ...camelCased,
        id: result.id, // Preserve original id field
        tokenId: result.token_id || result.id, // Prefer using token_id
        tokenIdNumeric: toNumericTokenId(result.token_id || result.id),
        status: normalizeStatus(result.status),
        // deadline:result.deadline,
        // buyerId:result.buyer_id || camelCased.buyerId,
        // boxInfoCID: null,
        acceptToken: camelCased.acceptedToken ?? undefined, // camelcaseKeys will convert accepted_token to acceptedToken
        hasError: false,
        title: camelCased.title ?? undefined,
        description: camelCased.description ?? undefined,
        typeOfCrime: camelCased.typeOfCrime ?? undefined,
        // event_date will be automatically converted to eventDate by camelcaseKeys
    };
}
