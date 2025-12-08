
import { useQueryClient } from '@tanstack/react-query';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { getContractConfig, ContractName } from '@dapp/contractsConfig';
import { useRef, useCallback } from 'react';

/**
 * ERC20 合约读取 Hook
 * 
 * 在组件中使用，返回可以在普通函数中调用的服务对象
 * 支持标准 ERC20 和隐私 ERC20 (Secret) 代币合约读取
 * 
 * @returns 包含 readContractERC20 函数的对象
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
        functionName: string,
        args?: readonly unknown[],
        force: boolean = false
    ) => {
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

        const FORCE_CACHE_TIME = 10 * 1000; // 10秒缓存时间

        if (force) {
            // force 模式下：检查10秒内的缓存
            const queryState = queryClient.getQueryState(queryKey);
            if (queryState?.dataUpdatedAt) {
                const cacheAge = Date.now() - queryState.dataUpdatedAt;
                if (cacheAge < FORCE_CACHE_TIME) {
                    if (import.meta.env.DEV) {
                        console.log('force 模式下：检查10秒内的缓存', queryState.data);
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
        const result = await client.readContract(readContractParams);

        queryClient.setQueryData(queryKey, result);
        return result;
    }, [chainId, queryClient]);

    return { readContractERC20 };
}
