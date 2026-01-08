
import { useQueryClient } from '@tanstack/react-query';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { getContractConfig, ContractName } from '@dapp/config/contractsConfig';
import { useRef, useCallback } from 'react';


export function useReadContractERC20() {
    const queryClient = useQueryClient();
    const { publicClient, chainId } = useWalletContext();
    const publicClientRef = useRef(publicClient);
    
    // Keep ref synchronized with the latest value
    publicClientRef.current = publicClient;
    
    const readContractERC20 = useCallback(async(
        type: 'erc20' | 'secret',
        tokenAddress: `0x${string}`,
        functionName: string,
        args?: readonly unknown[],
        force: boolean = false
    ) => {
        // Use optional chaining, if publicClient does not exist, try to get from core
        let client = publicClientRef.current || publicClient;
        
        // Wait for initialization (up to 3 seconds, usually very fast)
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

        const FORCE_CACHE_TIME = 15 * 1000; // 15 seconds cache time

        if (force) {
            const queryState = queryClient.getQueryState(queryKey);
            if (queryState?.dataUpdatedAt) {
                const cacheAge = Date.now() - queryState.dataUpdatedAt;
                if (cacheAge < FORCE_CACHE_TIME) {
                    if (import.meta.env.DEV) {
                        console.log('force ReadContractERC20', queryState.data);
                    }
                    return queryState.data as any;
                }
            }
            // If it exceeds 10 seconds, clear the cache and re-query
            queryClient.removeQueries({ queryKey });
        } else {
            // Non force mode: normal check cache (5 minutes cache)
            const cached = queryClient.getQueryData(queryKey);
            if (cached) {
                return cached;
            }
        }

        // Execute query and cache
        const result = await client.readContract(readContractParams);

        queryClient.setQueryData(queryKey, result);
        return result;
    }, [chainId, queryClient]);

    return { readContractERC20 };
}
