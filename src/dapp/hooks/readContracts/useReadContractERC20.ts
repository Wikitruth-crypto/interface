// hooks/contracts/useContractReadService.ts
import { useQueryClient } from '@tanstack/react-query';
import { usePublicClient, useChainId } from 'wagmi';
import { getPublicClient } from '@wagmi/core';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { getContractConfig, ContractName } from '@dapp/contractsConfig';
import { useRef, useCallback } from 'react';

/**
 * 在组件中使用，返回可以在普通函数中调用的服务对象
 */
export function useReadContractERC20() {
    const queryClient = useQueryClient();
    const { publicClient, chainId } = useWalletContext();
    const publicClientRef = useRef(publicClient);
    
    // 保持 ref 与最新值同步
    publicClientRef.current = publicClient;
    
    const readContractERC20 = useCallback(async(
        type: 'erc20' | 'secret',
        tokenAddress: `0x${string}`,
        functionName: string ,
        args?: readonly unknown[]
    ) => {
        // 使用可选链，如果 publicClient 不存在，尝试从 core 获取
        let client = publicClientRef.current || publicClient;
        
        // 如果还是不存在，等待初始化（最多 3 秒，因为通常很快）
        if (!client) {
            const maxWait = 3000;
            const start = Date.now();
            
            while (!client && Date.now() - start < maxWait) {
                await new Promise(resolve => setTimeout(resolve, 50));
                client = publicClientRef.current || publicClient;
            }
        }
        
        // 如果还是没有，抛出错误
        if (!client) {
            throw new Error(
                'Public client not available. ' +
                'Please ensure WagmiProvider is properly configured.'
            );
        }

        let contractName = type === 'erc20' ? ContractName.OFFICIAL_TOKEN : ContractName.ERC20_SECRET;

        const config_contract = getContractConfig(contractName, chainId);

        let queryKey: any[] = [];
        let readContractParams: any = {};
        if (args && args.length > 0) {
            queryKey = [
                type,
                tokenAddress,
                functionName,
                args,
                chainId,
            ];
            readContractParams = {
                address: tokenAddress,
                abi: config_contract.abi,
                functionName: functionName,
                args: args,
            };
        } else {
            queryKey = [
                type,
                tokenAddress,
                functionName,
                chainId,
            ];
            readContractParams = {
                address: tokenAddress,
                abi: config_contract.abi,
                functionName: functionName,
            };
        }

        // 先检查缓存
        const cached = queryClient.getQueryData(queryKey);
        if (cached) {
            return cached;
        }

        // 执行查询并缓存
        const result = await client.readContract(readContractParams);

        queryClient.setQueryData(queryKey, result);
        return result;
    }, [chainId, queryClient]);

    return { readContractERC20 };
}
