
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxDetail_BiddersIds } from '@/dapp/services/supabase/boxDetail';
import { CHAIN_CONFIG} from '@/dapp/contractsConfig';

/**
 * 查询 Box 的竞标者 ID 列表
 * 
 * @param boxId - Box ID (支持 string、number 或 BigInt)
 * @param listedMode - 列表模式，只有 'Auctioning' 时才查询
 * @param enabled - 是否启用查询（默认 true）
 * @returns 竞标者 ID 列表和加载状态
 */
export const useBoxBidders = (
    boxId: string,
    listedMode: string,
    enabled: boolean = true
) => {

    // 获取当前网络
    const { network, layer } = CHAIN_CONFIG;

    // 只有当 listedMode 为 'Auctioning' 时才查询
    const shouldQuery = listedMode === 'Auctioning' && enabled && !!boxId;

    // 使用 React Query 查询 Box 竞标者数据
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

    // 转换数据格式
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

