"use client"

import { useMemo } from 'react';
import type { BoxData } from '../types/profile.types';

interface ProcessedBoxData {
    id: string;
    tokenId: string;
    // Box data
    box?: BoxData;
    // Metadata data (obtained from Supabase query)
    metadata?: any;
    // Processing state
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
}

/**
 * useProcessData - Process Box data and metadata (based on Supabase)
 *
 * - Remove store_sapphire dependency
 * - Metadata is obtained from Supabase query, no additional processing is needed
 * - Simplify logic, mainly used for data conversion and state management
 * - Keep the same interface as the old version (backward compatibility)
 */
export const useProcessData = (boxDataList: BoxData[]) => {
    // Convert BoxData to ProcessedBoxData
    const processedBoxes = useMemo((): ProcessedBoxData[] => {
        return boxDataList.map(box => ({
            id: box.id,
            tokenId: box.tokenId,
            box,
            // Metadata is already included in BoxData (title, description, image, etc.)
            metadata: {
                title: box.title,
                description: box.description,
                nftImage: box.nftImage,
                boxImage: box.boxImage,
                country: box.country,
                state: box.state,
                eventDate: box.eventDate,
                typeOfCrime: box.typeOfCrime,
            },
            isLoading: false,
            hasError: box.hasError || false,
            errorMessage: box.hasError ? 'Failed to load metadata' : undefined,
        }));
    }, [boxDataList]);

    // Statistics information
    const processingStats = useMemo(() => {
        const total = boxDataList.length;
        const processed = processedBoxes.filter(box => box.metadata && !box.hasError).length;
        const loading = 0; // All data has been loaded from Supabase
        const errors = processedBoxes.filter(box => box.hasError).length;

        return {
            total,
            processed,
            loading,
            errors,
            progress: total > 0 ? (processed / total) * 100 : 0,
            isComplete: processed === total && loading === 0,
        };
    }, [boxDataList.length, processedBoxes]);

    return {
        // Processed data
        processedBoxes,
        
        // Processing state (all data has been loaded from Supabase, no additional processing is needed)
        isProcessing: false,
        processingStats,
        
        // Methods (keep interface compatibility, but no actual processing is needed)
        processBoxMetadata: async () => null,
        processAllMetadata: async () => {},
        
        // Convenient properties
        hasData: processedBoxes.length > 0,
        isComplete: processingStats.isComplete,
        hasErrors: processingStats.errors > 0,
    };
};
