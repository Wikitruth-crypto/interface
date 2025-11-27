"use client"

import { useMemo } from 'react';
import type { BoxData } from '../types/profile.types';

interface ProcessedBoxData {
    id: string;
    tokenId: string;
    // Box 数据
    box?: BoxData;
    // Metadata 数据（已从 Supabase 查询中获取）
    metadata?: any;
    // 处理状态
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
}

/**
 * useProcessData - 处理 Box 数据和元数据（基于 Supabase）
 *
 * 重构说明：
 * - 移除 store_sapphire 依赖
 * - 元数据已从 Supabase 查询中获取，无需额外处理
 * - 简化逻辑，主要用于数据转换和状态管理
 * - 保持与旧版本相同的接口（向后兼容）
 */
export const useProcessData = (boxDataList: BoxData[]) => {
    // 将 BoxData 转换为 ProcessedBoxData
    const processedBoxes = useMemo((): ProcessedBoxData[] => {
        return boxDataList.map(box => ({
            id: box.id,
            tokenId: box.tokenId,
            box,
            // 元数据已包含在 BoxData 中（title, description, image 等）
            metadata: {
                title: box.title,
                description: box.description,
                image: box.nftImage,
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

    // 统计信息
    const processingStats = useMemo(() => {
        const total = boxDataList.length;
        const processed = processedBoxes.filter(box => box.metadata && !box.hasError).length;
        const loading = 0; // 所有数据已从 Supabase 加载完成
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
        // 处理后的数据
        processedBoxes,
        
        // 处理状态（已从 Supabase 加载完成，无需额外处理）
        isProcessing: false,
        processingStats,
        
        // 方法（保留接口兼容性，但无需实际处理）
        processBoxMetadata: async () => null,
        processAllMetadata: async () => {},
        
        // 便捷属性
        hasData: processedBoxes.length > 0,
        isComplete: processingStats.isComplete,
        hasErrors: processingStats.errors > 0,
    };
};
