// hooks/contracts/useContractReadService.ts
import { useQueryClient } from '@tanstack/react-query';
// import { usePublicClient, useChainId } from 'wagmi';
// import { getPublicClient } from '@wagmi/core';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
// import { config } from '@/dapp/context/useAccount/wagmi';
import { getContractConfig, ContractName } from '@dapp/contractsConfig';
import { useRef, useCallback } from 'react';

/**
 * 通用合约读取 Hook
 * 
 * 在组件中使用，返回可以在普通函数中调用的服务对象
 * 支持读取任意已配置的合约函数
 * 
 * @returns 包含 readContract 函数的对象
 */
export function useReadContract() {
    const queryClient = useQueryClient();
    const { publicClient, chainId } = useWalletContext();
    // const chainId = useChainId();
    // const publicClient = usePublicClient();
    const publicClientRef = useRef(publicClient);
    
    // 保持 ref 与最新值同步
    publicClientRef.current = publicClient;
    
    const readContract = useCallback(async <TContractName extends ContractName>(params: {
        contractName: TContractName;
        functionName: string;
        args?: readonly unknown[];
        force?: boolean;
    }) => {
        // 使用可选链，如果 publicClient 不存在，尝试从 core 获取
        let client = publicClientRef.current || publicClient;
        
        // 等待初始化（最多 3 秒，因为通常很快）
        if (!client) {
            const maxWait = 3000;
            const start = Date.now();
            
            while (!client && Date.now() - start < maxWait) {
                await new Promise(resolve => setTimeout(resolve, 50));
                client = publicClientRef.current || publicClient;
            }
        }
        
        if (!client) {
            throw new Error(
                'Public client not available. ' +
                'Please ensure WagmiProvider is properly configured.'
            );
        }

        const config_contract = getContractConfig(params.contractName, chainId);
        const queryKey = [
            'contract',
            params.contractName,
            params.functionName,
            params.args,
            chainId,
        ];

        const force = params.force ?? false;
        const FORCE_CACHE_TIME = 10 * 1000; // 10秒缓存时间

        if (force) {
            // force 模式下：检查10秒内的缓存
            const queryState = queryClient.getQueryState(queryKey);
            if (queryState?.dataUpdatedAt) {
                const cacheAge = Date.now() - queryState.dataUpdatedAt;
                if (cacheAge < FORCE_CACHE_TIME) {
                    if (import.meta.env.DEV) {
                        console.log('force:', queryState.data);
                        console.log('queryKey', queryKey);
                    }
                    return queryState.data as any;

                }
            }
            // 超过10秒，清除缓存并重新查询
            queryClient.removeQueries({ queryKey });
        } else {
            // 非 force 模式：正常检查缓存（5分钟缓存）
            const cached = queryClient.getQueryData(queryKey);
            if (cached) {
                return cached;
            }
        }

        // 执行查询并缓存
        const result = await client.readContract({
            address: config_contract.address,
            abi: config_contract.abi,
            functionName: params.functionName,
            args: params.args,
        });

        queryClient.setQueryData(queryKey, result);
        return result;
    }, [chainId, queryClient]);

    return { readContract };
}
