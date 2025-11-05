// hooks/contracts/useContractReadService.ts
import { useQueryClient } from '@tanstack/react-query';
import { usePublicClient, useChainId } from 'wagmi';
import { getPublicClient } from '@wagmi/core';
import { config } from '@/dapp/context/useAccount/wagmi';
import { getContractConfig, ContractName } from '@dapp/contractsConfig';
import { useRef, useCallback } from 'react';

/**
 * 在组件中使用，返回可以在普通函数中调用的服务对象
 */
export function useReadContract() {
    const queryClient = useQueryClient();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const publicClientRef = useRef(publicClient);
    
    // 保持 ref 与最新值同步
    publicClientRef.current = publicClient;
    
    const readContract = useCallback(async <TContractName extends ContractName>(params: {
        contractName: TContractName;
        functionName: string;
        args?: readonly unknown[];
    }) => {
        // 使用可选链，如果 publicClient 不存在，尝试从 core 获取
        let client = publicClientRef.current || getPublicClient(config);
        
        // 如果还是不存在，等待初始化（最多 3 秒，因为通常很快）
        if (!client) {
            const maxWait = 3000;
            const start = Date.now();
            
            while (!client && Date.now() - start < maxWait) {
                await new Promise(resolve => setTimeout(resolve, 50));
                client = publicClientRef.current || getPublicClient(config);
            }
        }
        
        // 如果还是没有，抛出错误
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

        // 先检查缓存
        const cached = queryClient.getQueryData(queryKey);
        if (cached) {
            return cached;
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
