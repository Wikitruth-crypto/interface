
import React, { createContext, useContext, useMemo, useEffect } from 'react';
import type { 
  BoxDetailData, 
  DeadlineCheckStateType 
} from '../types/boxDetailData';
import { useBoxAndMetadata } from '@BoxDetail/hooks/useBoxAndMetadata';
import { useBoxRewards } from '../hooks/useBoxRewards';
import { useBoxBidders } from '../hooks/useBoxBidders';
import { useBoxOrderAmounts } from '../hooks/useBoxOrderAmounts';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { useAccountStore } from '@dapp/store/accountStore';
import type { MetadataBoxType } from '@dapp/types/typesDapp/metadata/metadataBox';
import { type BoxRewardData, type BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';
import { CHAIN_ID } from '@dapp/config/contractsConfig';
import { useCheckDeadline } from '../hooks/useCheckDeadline';
import { useBoxDetailStore } from '../store/boxDetailStore';

interface BoxDetailContextType {
  // Basic data (default query - must)
  box: BoxDetailData | undefined;
  boxId: string;
  metadataBox: MetadataBoxType | undefined;
  isLoading: boolean;

  // Deadline check status
  deadlineCheckState: DeadlineCheckStateType | undefined;
  
  // Reward data (optional query - based on conditions)
  boxRewardsData: BoxRewardData[] | undefined;
  isLoadingRewards: boolean;
  
  // Bidders data (optional query - only when listedMode === 'Auctioning')
  biddersIds: string[] | undefined;
  isLoadingBidders: boolean;
  
  // User order amount data (optional query - needs userId and acceptedToken, listening to userId change)
  orderAmountsData: BoxUserOrderAmountData[] | undefined;
  isLoadingOrderAmounts: boolean;
}

const BoxDetailContext = createContext<BoxDetailContextType | undefined>(undefined);

/**
 * BoxProvider - Provide Box data Context Provider
 * 
 * Default query boxes table and metadata_boxes table
 * Automatically query other related data based on conditions (box_rewards, box_bidders, box_user_order_amounts)
 * 
 * @param tokenId - Box tokenId (supports string, number or bigint)
 * @param children - Child components
 */
export const BoxDetailProvider: React.FC<{ 
  boxId: string; 
  children: React.ReactNode 
}> = ({ boxId, children }) => {
  // Basic data query (default must query)
  const { 
    box,
    metadataBox, 
    isLoading: isLoadingBase 
  } = useBoxAndMetadata(boxId);

  // Deadline check status query
  const deadlineCheckState = useCheckDeadline(box || {} as BoxDetailData);

  // ==================== Get user information (for conditional queries) ====================
  // Get userId, for orderAmounts query
  // Note: Zustand's selector will automatically listen for changes, no additional useEffect
  const { address } = useWalletContext() || {};
  
  // Use selector to listen for userId changes
  // When userId changes, this value will be automatically updated, triggering React Query to re-query
  const userId = useAccountStore((state) => {
    if (!address || !CHAIN_ID) {
      return null; // Return null instead of an empty string, for easier judgment
    }

    const chainAccounts = state.accounts[CHAIN_ID];
    if (!chainAccounts) {
      return null;
    }

    const userIdValue =
      chainAccounts[address]?.userId ??
      chainAccounts[address.toLowerCase()]?.userId ??
      null;

    // If userId exists and is not an empty string, return; otherwise return null
    return userIdValue && userIdValue.trim() !== '' ? userIdValue : null;
  });

  // ==================== Conditional queries ====================
  
  // 1. Reward data query (based on demand to decide whether to query, here default query)
  const { 
    boxRewardsData, 
    isLoading: isLoadingRewards 
  } = useBoxRewards(boxId, box || {} as BoxDetailData);
  
  // 2. Bidders data query (only when listedMode === 'Auctioning' to query)
  // const listedMode = box?.listedMode || '';
  // const shouldQueryBidders = !!boxId && listedMode === 'Auctioning' ;
  const { 
    biddersIds, 
    isLoading: isLoadingBidders 
  } = useBoxBidders(
    boxId, 
    box || {} as BoxDetailData
  );
  
  // 3. User order amount data query (needs userId and acceptedToken, listening to userId change)
  // Key points:
  // - userId in queryKey, so when userId changes, React Query will automatically re-query
  // - enabled parameter controls whether to query, only when all conditions are met
  const roles = useBoxDetailStore((state) => state.userState.roles);

  const { 
    orderAmountsData, 
    isLoading: isLoadingOrderAmounts 
  } = useBoxOrderAmounts(
    boxId,
    userId || '', // When userId is null, pass an empty string
    roles,
  );
  
  // ==================== Context Value ====================
  const contextValue = useMemo(() => ({
    box,
    boxId,
    metadataBox,
    isLoading: isLoadingBase || !box,

    deadlineCheckState,

    boxRewardsData,
    isLoadingRewards,
    
    biddersIds,
    isLoadingBidders,
    
    orderAmountsData,
    isLoadingOrderAmounts,
  }), [
    box,
    boxId,
    metadataBox,
    isLoadingBase,
    deadlineCheckState,
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
 * useBoxContext - Get Box Context Hook
 * 
 * @throws Error if used outside BoxProvider
 */
export const useBoxDetailContext = (): BoxDetailContextType => {
  const context = useContext(BoxDetailContext);
  
  if (!context) {
    throw new Error('useBoxContext must be used within BoxProvider');
  }
  
  return context;
};

