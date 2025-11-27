
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxDetail_OrderAmountsData } from '@/dapp/services/supabase/boxDetail';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';
import type { BoxUserOrderAmountData } from '@/dapp/pages/BoxDetail/types/boxDetailData';

export const useBoxOrderAmounts = (
    boxId: string,
    userId: string,
    acceptedToken: string,
    enabled: boolean = true
) => {

    // 获取当前网络
    const { network, layer } = CHAIN_CONFIG;

    // 只有当所有必需参数都存在时才查询
    const shouldQuery = enabled && !!boxId && !!userId && !!acceptedToken;

    // 使用 React Query 查询 Box 用户订单金额数据
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-order-amounts', network, layer, boxId, userId, acceptedToken],
        queryFn: async () => {
            const result = await queryBoxDetail_OrderAmountsData(
                boxId,
                userId,
                acceptedToken
            );
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000, 
        enabled: shouldQuery, // 只有当所有条件满足时才查询
    });

    // 转换数据格式
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

