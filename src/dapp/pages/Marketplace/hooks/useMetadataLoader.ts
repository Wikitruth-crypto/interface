"use client";

import { useEffect, useState } from 'react';
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
 * 简化说明：
 * - 移除重复的缓存检查和 inFlightIds 跟踪
 * - 依赖 processBox 内部缓存，避免重复请求
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

  useEffect(() => {
    // 如果不自动加载，直接返回
    if (!autoLoad || !boxes.length) {
      setLoading(false);
      return;
    }

    // 筛选需要加载元数据的候选框（依赖 processBox 的缓存检查）
    const candidates = boxes
      .filter(box => {
        const tokenId = box.tokenId?.toString() ?? '';
        return tokenId && box.boxInfoCID! && !boxesMetadata[tokenId];
      })
      .slice(0, batchSize);

    // 如果没有待加载的，重置状态
    if (!candidates.length) {
      setLoading(false);
      return;
    }

    // 开始加载元数据
    let cancelled = false;
    setLoading(true);

    Promise.allSettled(
      candidates.map(box => processBox(box.tokenId!.toString(), box.boxInfoCID!))
    ).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [boxes, boxesMetadata, batchSize, autoLoad]);

  return { isLoading };
};