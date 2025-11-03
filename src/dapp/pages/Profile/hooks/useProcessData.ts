"use client"

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import { useMetadataStore } from '@/dapp/event_sapphire/useMetadataStore';
import { BoxStored } from '@/dapp/event_sapphire/types';

interface ProcessedBoxData {
    id: string;
    tokenId: string;
    // Box 数据（从新架构 - 存储类型）
    box?: BoxStored;
    // Metadata 数据
    metadata?: any;
    // 处理状态
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
}

/**
 * useProcessData - 处理 Box 数据和元数据
 *
 * 重构说明：
 * - 使用新的 useQueryStore 和 selectors
 * - 移除对旧的 boxProfiles 的依赖
 * - 使用 selectBox 获取 Box 数据
 * - 保持元数据处理逻辑不变
 */
export const useProcessData = (boxIds: string[]) => {
    const metadataStore = useMetadataStore();

    const [processedData, setProcessedData] = useState<Record<string, ProcessedBoxData>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    // 获取需要处理的Box数据
    const boxesToProcess = useMemo(() => {
        return boxIds.map(boxId => {
            // 使用 selector 获取 Box 数据
            const box = useQueryStore.getState().boxes.entities[boxId];
            const metadata = metadataStore.boxesMetadata[box?.tokenId];

            return {
                id: boxId,
                tokenId: box?.tokenId || '',
                box,
                metadata,
                needsMetadata: box && !metadata,
            };
        });
    }, [boxIds, metadataStore.boxesMetadata]);

    // 处理单个Box的metadata
    const processBoxMetadata = useCallback(async (boxId: string, tokenId: string) => {
        try {
            // 更新处理状态
            setProcessedData(prev => ({
                ...prev,
                [boxId]: {
                    ...prev[boxId],
                    isLoading: true,
                    hasError: false,
                }
            }));

            // 获取 Box 数据
            const box = useQueryStore.getState().boxes.entities[boxId];
            if (!box?.tokenURI) {
                throw new Error('TokenURI not found');
            }

            // TODO: 等待元数据处理模块开发完成
            // const metadata = await processMetadata(tokenId, box.tokenURI);
            const metadata = null; // 暂时返回 null

            // 更新成功状态
            setProcessedData(prev => ({
                ...prev,
                [boxId]: {
                    ...prev[boxId],
                    metadata,
                    isLoading: false,
                    hasError: false,
                }
            }));

            return metadata;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '处理metadata失败';
            console.error(`Error processing metadata for box ${boxId}:`, error);

            // 更新错误状态
            setProcessedData(prev => ({
                ...prev,
                [boxId]: {
                    ...prev[boxId],
                    isLoading: false,
                    hasError: true,
                    errorMessage,
                }
            }));

            return null;
        }
    }, []);

    // 批量处理metadata
    const processAllMetadata = useCallback(async () => {
        const boxesNeedingMetadata = boxesToProcess.filter(box => box.needsMetadata);
        
        if (boxesNeedingMetadata.length === 0) {
            return;
        }

        setIsProcessing(true);

        try {
            // 并发处理多个metadata，但限制并发数量
            const batchSize = 5; // 每批处理5个
            for (let i = 0; i < boxesNeedingMetadata.length; i += batchSize) {
                const batch = boxesNeedingMetadata.slice(i, i + batchSize);
                
                await Promise.allSettled(
                    batch.map(box => 
                        processBoxMetadata(box.id, box.tokenId)
                    )
                );
            }
        } finally {
            setIsProcessing(false);
        }
    }, [boxesToProcess, processBoxMetadata]);

    // 初始化处理数据状态
    useEffect(() => {
        const newProcessedData: Record<string, ProcessedBoxData> = {};

        boxesToProcess.forEach(item => {
            newProcessedData[item.id] = {
                id: item.id,
                tokenId: item.tokenId,
                box: item.box,
                metadata: item.metadata,
                isLoading: false,
                hasError: false,
            };
        });

        setProcessedData(newProcessedData);
    }, [boxesToProcess]);

    // 自动处理需要metadata的Box
    useEffect(() => {
        const needsProcessing = boxesToProcess.some(box => box.needsMetadata);
        if (needsProcessing && !isProcessing) {
            processAllMetadata();
        }
    }, [boxesToProcess, isProcessing, processAllMetadata]);

    // 获取处理完成的数据列表
    const getProcessedBoxes = useMemo(() => {
        return boxIds.map(boxId => processedData[boxId]).filter(Boolean);
    }, [boxIds, processedData]);

    // 统计信息
    const processingStats = useMemo(() => {
        const total = boxIds.length;
        const processed = getProcessedBoxes.filter(box => box.metadata).length;
        const loading = getProcessedBoxes.filter(box => box.isLoading).length;
        const errors = getProcessedBoxes.filter(box => box.hasError).length;

        return {
            total,
            processed,
            loading,
            errors,
            progress: total > 0 ? (processed / total) * 100 : 0,
            isComplete: processed === total && loading === 0,
        };
    }, [boxIds.length, getProcessedBoxes]);

    return {
        // 处理后的数据
        processedBoxes: getProcessedBoxes,
        
        // 处理状态
        isProcessing,
        processingStats,
        
        // 方法
        processBoxMetadata,
        processAllMetadata,
        
        // 便捷属性
        hasData: getProcessedBoxes.length > 0,
        isComplete: processingStats.isComplete,
        hasErrors: processingStats.errors > 0,
    };
};
