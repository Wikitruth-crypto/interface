
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxDetail_BiddersIds } from '@dapp/services/supabase/boxDetail';
import { CHAIN_CONFIG} from '@dapp/config/contractsConfig';
import type { BoxDetailData } from '@BoxDetail/types/boxDetailData';

export const useBoxBidders = (
    boxId: string,
    box: BoxDetailData,
) => {

    const { network, layer } = CHAIN_CONFIG;

    const shouldQuery = !!boxId && !!box && box.listedMode !== 'Storing' && box.listedMode !== 'Selling' && box.buyerId !== '';
    const listedMode = box.listedMode || '';

    if(import.meta.env.DEV && shouldQuery){
        console.log('shouldQuery-useBoxBidders:', boxId);
    }

    // Use React Query to query Box bidders data
    const { data, isLoading, error, isFetching } = useQuery({
        
        queryKey: ['box-bidders', network, layer, boxId, listedMode],
        queryFn: async () => {
            const result = await queryBoxDetail_BiddersIds(
                boxId,
                listedMode
            );
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: shouldQuery, 
    });

    // Convert data format
    const biddersIds: string[] | undefined = useMemo(() => {
        if (!data?.biddersIds) {
            return undefined;
        }
        return data.biddersIds;
    }, [data?.biddersIds]);

    return {
        biddersIds,
        isLoading: isLoading || isFetching,
        error: error || null,
    };
};

