// hooks/contracts/useContractReadService.ts
import { useQueryClient } from '@tanstack/react-query';
// import { usePublicClient, useChainId } from 'wagmi';
// import { getPublicClient } from '@wagmi/core';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
// import { config } from '@dapp/context/useAccount/wagmi';
import { getContractConfig, ContractName } from '@dapp/config/contractsConfig';
import { useRef, useCallback } from 'react';


export function useReadContract() {
    const queryClient = useQueryClient();
    const { publicClient, chainId } = useWalletContext();
    // const chainId = useChainId();
    // const publicClient = usePublicClient();
    const publicClientRef = useRef(publicClient);
    
    // Keep ref synchronized with the latest value
    publicClientRef.current = publicClient;
    
    const readContract = useCallback(async <TContractName extends ContractName>(params: {
        contractName: TContractName;
        functionName: string;
        args?: readonly unknown[];
        force?: boolean;
    }) => {
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

        const config_contract = getContractConfig(params.contractName, chainId);
        const queryKey = [
            'contract',
            params.contractName,
            params.functionName,
            params.args,
            chainId,
        ];

        const force = params.force ?? false;
        const FORCE_CACHE_TIME = 15 * 1000; // 15 seconds cache time

        if (force) {
            // In force mode: check cache within 10 seconds
            const queryState = queryClient.getQueryState(queryKey);
            if (queryState?.dataUpdatedAt) {
                const cacheAge = Date.now() - queryState.dataUpdatedAt;
                if (cacheAge < FORCE_CACHE_TIME) {
                    if (import.meta.env.DEV) {
                        console.log('force:', queryState.data);
                    }
                    return queryState.data as any;

                }
            }
            // If it exceeds 15 seconds, clear the cache and re-query
            queryClient.removeQueries({ queryKey });
        } else {
            // Non force mode: normal check cache (5 minutes cache)
            const cached = queryClient.getQueryData(queryKey);
            if (cached) {
                return cached;
            }
        }

        // Execute query and cache
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
