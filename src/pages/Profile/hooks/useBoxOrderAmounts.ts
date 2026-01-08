
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { query_OrderAmountsData, type BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
// import { BoxRoleType } from '@dapp/types/typesDapp/account';
import { SelectedTabType } from '../types';
import { BoxData } from '../types/profile.types';

export const useBoxOrderAmounts = (
    box: BoxData,
    userId: string,
    selectedTab: SelectedTabType
) => {
    const { network, layer } = CHAIN_CONFIG;

    const bidderIds = box.bidders?.map((bidder) => String(bidder.id));
    const buyerId = box.buyer?.id ? String(box.buyer.id) : undefined;
    
    // if (import.meta.env.DEV) {
    //     console.log('box:', box);
    // }

    // Only query when tab is 'bought' or 'bade', not 'all' or other tabs
    const shouldQuery = useMemo(() => {
        if (selectedTab !== 'bought' && selectedTab !== 'bade') {
            return false;
        }
        
        if (selectedTab === 'bought') {
            return box?.refundPermit === true && buyerId === userId;
        }
        
        if (selectedTab === 'bade') {
            return buyerId !== userId && bidderIds?.includes(userId);
        }
        
        return false;
    }, [selectedTab, box?.refundPermit, buyerId, userId, bidderIds]);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-order-amounts', network, layer, box.id, userId, selectedTab],
        queryFn: async () => {

            const result = await query_OrderAmountsData(
                box.id,
                userId,
            );
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: shouldQuery && !!box.id && !!userId && userId.trim() !== '', 
    });

    if (import.meta.env.DEV && shouldQuery) {
        console.log('data:', data);
    }

    const orderAmountsData: BoxUserOrderAmountData[] | undefined = useMemo(() => {
        if (!data?.orderAmountsData) {
            return undefined;
        }
        return data.orderAmountsData;
    }, [data?.orderAmountsData]);

    return {
        orderAmountsData,
        isLoading: isLoading || isFetching,
        error: error || null,
    };
};

