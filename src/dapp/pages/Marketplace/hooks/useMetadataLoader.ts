"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import type { Box } from '@/dapp/store_sapphire/types';
import { useMetadataStore } from '@/dapp/store_sapphire/useMetadataStore';
import { processBox } from '@/dapp/store_sapphire/processMetadata/processBox';
import { useShallow } from 'zustand/react/shallow';

const DEFAULT_BATCH_SIZE = 12;

/**
 * 元数据加载配置
 */
export interface UseMetadataLoaderConfig {
  /** 需要检查的 boxes */
  boxes: Box[];
  /** 每批加载数量，默认 12 */
  batchSize?: number;
  /** 是否自动加载，默认 true */
  autoLoad?: boolean;
}

/**
 * 元数据加载返回值
 */
export interface UseMetadataLoaderReturn {
  /** 是否正在加载元数据 */
  isLoading: boolean;
}

/**
 * Metadata Loader Hook
 * 
 * 职责：
 * - 监听需要加载元数据的 Box 列表
 * - 批量加载元数据（使用 processBox 的缓存机制）
 * 
 * 修复说明：
 * - 使用 useRef 跟踪已处理的 boxIds，避免重复处理
 * - 使用 useMemo 稳定需要处理的 boxes 列表（基于 tokenId）
 * - 避免因 boxesMetadata 更新导致的无限循环
 */
export const useMetadataLoader = (
  config: UseMetadataLoaderConfig
): UseMetadataLoaderReturn => {
  const { boxes, batchSize = DEFAULT_BATCH_SIZE, autoLoad = true } = config;

  const { boxesMetadata } = useMetadataStore(
    useShallow(state => ({
      boxesMetadata: state.boxesMetadata,
    }))
  );

  const [isLoading, setLoading] = useState(false);
  
  // 使用 ref 跟踪已处理的 boxIds，避免重复处理
  const processedIdsRef = useRef<Set<string>>(new Set());
  const processingIdsRef = useRef<Set<string>>(new Set());

  // 使用 useMemo 稳定需要处理的 boxes 列表（基于 tokenId 字符串，而不是引用）
  const boxesToProcess = useMemo(() => {
    return boxes
      .filter(box => {
        const tokenId = box.tokenId?.toString();
        if (!tokenId || !box.boxInfoCID) return false;
        
        // 如果已经有元数据，不需要处理
        if (boxesMetadata[tokenId]) return false;
        
        // 如果已经处理过或正在处理，不需要处理
        if (processedIdsRef.current.has(tokenId) || processingIdsRef.current.has(tokenId)) {
          return false;
        }
        
        return true;
      })
      .map(box => ({
        tokenId: box.tokenId!.toString(),
        boxInfoCID: box.boxInfoCID!,
      }));
  }, [
    // 使用 boxes 的 tokenId 列表作为依赖，而不是 boxes 引用本身
    boxes.map(box => `${box.tokenId?.toString()}-${box.boxInfoCID}`).join(','),
    // 使用 boxesMetadata 的 keys 作为依赖，而不是整个对象
    Object.keys(boxesMetadata).join(','),
  ]);

  useEffect(() => {
    const loadMetadata = async () => {
      // 如果不自动加载或没有需要处理的 boxes，直接返回
      if (!autoLoad || !boxesToProcess.length) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 标记为正在处理
      boxesToProcess.forEach(({ tokenId }) => {
        processingIdsRef.current.add(tokenId);
      });

      try {
        await Promise.allSettled(
          boxesToProcess.map(({ tokenId, boxInfoCID }) => {
            return processBox(tokenId, boxInfoCID).then(() => {
              // 处理完成后标记为已处理
              processedIdsRef.current.add(tokenId);
              processingIdsRef.current.delete(tokenId);
            });
          })
        );
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        // 清除正在处理的标记
        boxesToProcess.forEach(({ tokenId }) => {
          processingIdsRef.current.delete(tokenId);
        });
        setLoading(false);
      }
    };

    loadMetadata();
  }, [
    // 只依赖 boxesToProcess 的长度和内容（通过 tokenId 字符串），而不是引用
    boxesToProcess.map(b => `${b.tokenId}-${b.boxInfoCID}`).join(','),
    autoLoad,
  ]);

  return { isLoading };
};