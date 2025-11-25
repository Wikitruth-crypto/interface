
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxAndMetadata } from '@/dapp/services/supabase/boxDetail';
import { currentChainConfig} from '@/dapp/contractsConfig';
import type { MetadataBoxType } from '@/dapp/types/metadata/metadataBox';
import type { BoxDetailData } from '@/dapp/pages/BoxDetail/types/boxDetailData';

/**
 * 获取当前 Box 详情（基础数据）
 * 
 * 默认必须查询 boxes 表和 metadata_boxes 表
 * 
 * @param boxId - Box ID (支持 string、number 或 BigInt)
 * @returns Box 详情数据、元数据和加载状态
 */
export const useBoxAndMetadata = (boxId: string) => {
    // 获取当前网络
    const { network, layer } = currentChainConfig;

    // 使用 React Query 查询 Box 详情（只查询 boxes 和 metadata_boxes）
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

    // 转换数据格式
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