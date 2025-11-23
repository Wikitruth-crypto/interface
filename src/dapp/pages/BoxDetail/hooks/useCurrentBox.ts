/**
 * useCurrentBox - 获取当前 Box 详情
 * 
 * 从 Supabase 数据库获取 Box 详情数据和元数据
 * 使用 React Query 进行数据获取和缓存
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryBoxDetail, convertMetadataBoxToType } from '@/dapp/services/supabase/boxDetail';
import { useIsTestnet } from '@/dapp/contractsConfig';
import type { MetadataBoxType } from '@/dapp/types/contracts/metadataBox';
import type { BoxDetailData } from '@/dapp/services/supabase/boxDetail';

/**
 * 简化的 User 类型（用于 Box 中的关联数据）
 */
export interface User {
    id: string;
}

/**
 * 简化的 Token 类型（用于 Box 中的 acceptedToken）
 */
export interface Token {
    id: string;
    symbol?: string;
    decimals?: number;
}

/**
 * Box 类型（用于前端展示）
 * 包含嵌套的 User 对象和 Token 对象，匹配原有代码的使用方式
 */
export interface Box {
    id: string;
    tokenId: string;
    tokenURI?: string | null;
    boxInfoCID?: string | null;
    privateKey?: string | null;
    price: string;
    deadline: string;
    minter: User;
    owner: User;
    publisher?: User;
    seller?: User;
    buyer?: User;
    completer?: User;
    bidders: User[];
    acceptedToken?: Token;
    status: string;
    listedMode?: string | null;
    refundPermit?: boolean | null;
    isInBlacklist?: boolean;
    createTimestamp: string;
    sellTimestamp?: string | null;
    publishTimestamp?: string | null;
    listedTimestamp?: string | null;
    purchaseTimestamp?: string | null;
    completeTimestamp?: string | null;
    requestRefundDeadline?: string | null;
    reviewDeadline?: string | null;
}

/**
 * 获取当前 Box 详情
 * 
 * @param boxId - Box ID (支持 string、number 或 BigInt)
 * @returns Box 详情数据、元数据和加载状态
 */
export const useCurrentBox = (boxId: string | number | bigint) => {
    // 转换 boxId 为字符串
    const boxIdString = useMemo(() => {
        if (typeof boxId === 'string') {
            return boxId;
        }
        if (typeof boxId === 'bigint') {
            return boxId.toString();
        }
        return boxId.toString();
    }, [boxId]);

    // 获取当前网络
    const isTestnet = useIsTestnet();
    const network: 'testnet' | 'mainnet' = isTestnet ? 'testnet' : 'mainnet';

    // 使用 React Query 查询 Box 详情
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['box-detail', network, boxIdString],
        queryFn: async () => {
            const result = await queryBoxDetail(network, boxIdString);
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 30000, // 30 秒内不重新查询
        enabled: !!boxIdString, // 只有当 boxId 存在时才查询
    });

    // 转换数据格式
    const box: Box | undefined = useMemo(() => {
        if (!data?.box) {
            return undefined;
        }
        // BoxDetailData 和 Box 结构相同，直接返回
        return data.box as Box;
    }, [data?.box]);

    const metadataBox: MetadataBoxType | undefined = useMemo(() => {
        if (!data?.metadataBox) {
            return undefined;
        }
        return convertMetadataBoxToType(data.metadataBox);
    }, [data?.metadataBox]);

    return {
        box,
        metadataBox,
        boxId: boxIdString,
        isLoading: isLoading || isFetching,
        error: error || null,
    };
};