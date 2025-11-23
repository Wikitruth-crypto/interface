/**
 * BoxContext - 为 BoxDetail 页面及其子组件提供 Box 数据的 Context
 * 
 * 使用目的：
 * 1. 避免在多个组件中重复调用 useCurrentBox，减少性能开销
 * 2. 统一管理 Box 数据的访问，便于后续扩展
 * 3. 确保所有子组件使用同一份 Box 数据，避免数据不一致
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { Box } from '../hooks/useCurrentBox';
import { useCurrentBox } from '../hooks/useCurrentBox';
import type { MetadataBoxType } from '@/dapp/types/contracts/metadataBox';

interface BoxContextType {
  box: Box | undefined;
  boxId: string;
  isLoading: boolean;
  metadataBox: MetadataBoxType | undefined;
}

const BoxContext = createContext<BoxContextType | undefined>(undefined);

/**
 * BoxProvider - 提供 Box 数据的 Context Provider
 * 
 * @param tokenId - Box 的 tokenId，如果不提供则从 boxDetailStore 获取
 * @param children - 子组件
 */
export const BoxProvider: React.FC<{ 
  tokenId: string | number | bigint; 
  children: React.ReactNode 
}> = ({ tokenId, children }) => {
  // 在 Provider 中只调用一次 useCurrentBox，避免子组件重复调用
  const { box, boxId, metadataBox, isLoading } = useCurrentBox(tokenId );
  
  // 使用 useMemo 优化性能，只有当 box、boxId、metadataBox 或 isLoading 变化时才重新创建 context value
  const contextValue = useMemo(() => ({
    box,
    boxId,
    metadataBox,
    isLoading: isLoading || !box, // 如果正在加载或没有数据，则标记为加载中
  }), [box, boxId, metadataBox, isLoading]);

  return (
    <BoxContext.Provider value={contextValue}>
      {children}
    </BoxContext.Provider>
  );
};

/**
 * useBoxContext - 获取 Box Context 的 Hook
 * 
 * @throws Error 如果在 BoxProvider 外使用会抛出错误
 */
export const useBoxContext = (): BoxContextType => {
  const context = useContext(BoxContext);
  
  if (!context) {
    throw new Error('useBoxContext must be used within BoxProvider');
  }
  
  return context;
};

