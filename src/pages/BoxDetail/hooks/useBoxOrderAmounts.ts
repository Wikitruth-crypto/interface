
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { query_OrderAmountsData, type BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import { BoxRoleType } from '@dapp/types/typesDapp/account';

export const useBoxOrderAmounts = (
    boxId: string,
    userId: string,
    roles: BoxRoleType[],
) => {
    const { network, layer } = CHAIN_CONFIG;

    const shouldQuery = !!boxId && !!userId && userId.trim() !== '' && roles.includes('Bidder');

    // Serialize the roles array to a string, for queryKey (ensure roles change automatically re-query)
    // Use the sorted JSON string, to avoid duplicate queries due to different array orders
    const rolesKey = useMemo(() => {
        return JSON.stringify([...roles].sort());
    }, [roles]);

    // Use React Query to query Box user order amount data
    // Key points: userId and rolesKey in queryKey, so when they change, they will automatically re-query
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-order-amounts', network, layer, boxId, userId, rolesKey],
        queryFn: async () => {
            // Here we don't need to check again, because enabled has controlled
            const result = await query_OrderAmountsData(
                boxId,
                userId,
            );
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: shouldQuery, // Only when all conditions are met to query
    });

    // Convert data format
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

