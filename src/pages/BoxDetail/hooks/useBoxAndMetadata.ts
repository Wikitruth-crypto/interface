
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxAndMetadata } from '@dapp/services/supabase/boxDetail';
import { CHAIN_CONFIG} from '@dapp/config/contractsConfig';
import type { MetadataBoxType } from '@dapp/types/typesDapp/metadata/metadataBox';
import type { BoxDetailData } from '@BoxDetail/types/boxDetailData';


export const useBoxAndMetadata = (boxId: string) => {
    const { network, layer } = CHAIN_CONFIG;

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-detail', network, layer, boxId],
        queryFn: async () => {
            const result = await queryBoxAndMetadata(boxId);
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: !!boxId, 
    });

    // Convert data format
    const box: BoxDetailData | undefined = useMemo(() => {
        if (!data?.box) {
            return undefined;
        }
        return data.box as BoxDetailData;
    }, [data?.box]);

    const metadataBox: MetadataBoxType | undefined = useMemo(() => {
        if (!data?.metadataBox) {
            return undefined;
        }
        return data.metadataBox as MetadataBoxType;
    }, [data?.metadataBox]);

    return {
        box,
        metadataBox,
        boxId: boxId,
        isLoading: isLoading || isFetching,
        error: error || null,
    };
};