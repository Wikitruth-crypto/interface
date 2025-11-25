
import React, { createContext, useContext, useMemo } from 'react';
import type { BoxDetailData } from '../types/boxDetailData';
import { useBoxAndMetadata } from '@/dapp/pages/BoxDetail/hooks/useBoxAndMetadata';
import { useBoxRewards } from '../hooks/useBoxRewards';
import { useBoxBidders } from '../hooks/useBoxBidders';
import { useBoxOrderAmounts } from '../hooks/useBoxOrderAmounts';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useAccountStore } from '@/dapp/store/accountStore';
import type { MetadataBoxType } from '@/dapp/types/metadata/metadataBox';
import type { BoxRewardData, BoxUserOrderAmountData } from '../types/boxDetailData';

interface BoxDetailContextType {
  // 基础数据（默认查询 - 必须）
  box: BoxDetailData | undefined;
  boxId: string;
  metadataBox: MetadataBoxType | undefined;
  isLoading: boolean;
  
  // 奖励数据（按需查询 - 根据条件启用）
  boxRewardsData: BoxRewardData[] | undefined;
  isLoadingRewards: boolean;
  
  // 竞标者数据（按需查询 - 仅当 listedMode === 'Auctioning'）
  biddersIds: string[] | undefined;
  isLoadingBidders: boolean;
  
  // 用户订单金额数据（按需查询 - 需要 userId 和 acceptedToken，监听 userId 变化）
  orderAmountsData: BoxUserOrderAmountData[] | undefined;
  isLoadingOrderAmounts: boolean;
}

const BoxDetailContext = createContext<BoxDetailContextType | undefined>(undefined);

/**
 * BoxProvider - 提供 Box 数据的 Context Provider
 * 
 * 默认查询 boxes 表和 metadata_boxes 表
 * 根据情况自动查询其他相关数据（box_rewards、box_bidders、box_user_order_amounts）
 * 
 * @param tokenId - Box 的 tokenId (支持 string、number 或 bigint)
 * @param children - 子组件
 */
export const BoxDetailProvider: React.FC<{ 
  boxId: string; 
  children: React.ReactNode 
}> = ({ boxId, children }) => {
  // 基础数据查询（默认必须查询）
  const { 
    box,
    metadataBox, 
    isLoading: isLoadingBase 
  } = useBoxAndMetadata(boxId);
  
  // ==================== 获取用户信息（用于条件查询） ====================
  // 获取 userId，用于 orderAmounts 查询
  // 注意：userId 可能会变化，所以需要监听变化
  const { address } = useWalletContext() || {};
  const userId = useAccountStore((state) => {
    // 从 accountStore 获取 userId
    // 这里需要根据实际的 accountStore 实现来获取 userId
    // 如果 accountStore 中没有 userId，可能需要通过合约调用获取
    // 暂时返回 null，需要根据实际实现调整
    if (!address || !state.currentChainId) {
      return null;
    }
    // TODO: 从 accountStore 或通过合约调用获取 userId
    return null;
  });
  
  // ==================== 条件查询 ====================
  
  // 1. 奖励数据查询（根据需求决定是否查询，这里默认查询）
  // 如果需要根据条件查询，可以添加 enabled 参数控制
  const shouldQueryRewards = !!boxId; // 可以根据需求调整条件
  const { 
    boxRewardsData, 
    isLoading: isLoadingRewards 
  } = useBoxRewards(boxId, shouldQueryRewards);
  
  // 2. 竞标者数据查询（仅当 listedMode === 'Auctioning' 时查询）
  const listedMode = box?.listedMode || '';
  const shouldQueryBidders = !!boxId && listedMode === 'Auctioning';
  const { 
    biddersIds, 
    isLoading: isLoadingBidders 
  } = useBoxBidders(
    boxId, 
    listedMode,
    shouldQueryBidders
  );
  
  // 3. 用户订单金额数据查询（需要 userId 和 acceptedToken，监听 userId 变化）
  // 注意：当 userId 变化时，React Query 会自动重新查询（因为 userId 在 queryKey 中）
  const acceptedToken = box?.acceptedToken || '';
  const shouldQueryOrderAmounts = !!boxId && !!userId && !!acceptedToken;
  const { 
    orderAmountsData, 
    isLoading: isLoadingOrderAmounts 
  } = useBoxOrderAmounts(
    boxId,
    userId || '', // 当 userId 为 null 时传入空字符串，hook 内部会通过 enabled 控制不查询
    acceptedToken,
    shouldQueryOrderAmounts // 只有当所有条件满足时才查询
  );
  
  // ==================== Context Value ====================
  // 使用 useMemo 优化性能，只有当依赖项变化时才重新创建
  const contextValue = useMemo(() => ({
    // 基础数据
    box,
    boxId,
    metadataBox,
    isLoading: isLoadingBase || !box,
    
    // 奖励数据
    boxRewardsData,
    isLoadingRewards,
    
    // 竞标者数据
    biddersIds,
    isLoadingBidders,
    
    // 用户订单金额数据（监听 userId 变化）
    orderAmountsData,
    isLoadingOrderAmounts,
  }), [
    box,
    boxId,
    metadataBox,
    isLoadingBase,
    boxRewardsData,
    isLoadingRewards,
    biddersIds,
    isLoadingBidders,
    orderAmountsData,
    isLoadingOrderAmounts,
  ]);

  return (
    <BoxDetailContext.Provider value={contextValue}>
      {children}
    </BoxDetailContext.Provider>
  );
};

/**
 * useBoxContext - 获取 Box Context 的 Hook
 * 
 * @throws Error 如果在 BoxProvider 外使用会抛出错误
 */
export const useBoxDetailContext = (): BoxDetailContextType => {
  const context = useContext(BoxDetailContext);
  
  if (!context) {
    throw new Error('useBoxContext must be used within BoxProvider');
  }
  
  return context;
};

