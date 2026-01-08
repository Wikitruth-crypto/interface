import { useEffect, useState } from 'react';
import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
import { ContractConfig } from '@dapp/config/contractsConfig';
// import { useButtonInteractionStore } from '@dapp/store/buttonInteractionStore';
import { FunctionNameType_FundManager } from '@dapp/types/typesDapp/contracts';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { useAccountStore } from '@dapp/store/accountStore';

interface WriteContractConfig {
    contract: ContractConfig,
    functionName: string;
    tokenAddress: string;
    args: any[],
}

interface WriteContractResult {
    writeCustormV3: (config: WriteContractConfig) => Promise<`0x${string}`>;
    hash: `0x${string}` | undefined;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
    isPending: boolean;
    status: 'idle' | 'error' | 'pending' | 'success';
    isSuccessed: boolean;
    isLoading: boolean;
    reset: () => void;
}

export const useWriteCustormV3 = (): WriteContractResult => {

    const {
        writeContractAsync,
        data: hash,         // 
        error,             // 
        isPending,         // is loading, waiting for wallet to pack
        isError,           // is error, boolean value
        isSuccess,         // success send transaction
        status,            // isPending、isError、isSuccess 对应
        reset             // reset state function
    } = useWriteContract();

    const { isSuccess: isSuccessed } = useWaitForTransactionReceipt({
        hash,
    });
    
    const { address } = useWalletContext();
    const [functionName, setFunctionName] = useState<FunctionNameType_FundManager | null>(null);
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    
    const addWithdrawInteraction = useAccountStore(state => state.addWithdrawInteraction);

    const writeCustormV3 = async (
        config: WriteContractConfig
    ) => {
        const functionName = config.functionName as FunctionNameType_FundManager;
        setFunctionName(functionName);
        // TODO
        setTokenAddress(config.tokenAddress);
        
        try {
            const result = await writeContractAsync({
                address: config.contract.address,
                abi: config.contract.abi,
                functionName: config.functionName,
                args: config.args,
            });
            return result;
        } catch (err) {
            console.error('Contract write failed:', err);
            throw err;
        } finally {
        }
    };

    useEffect(() => {
        if (isSuccessed && functionName && address && tokenAddress) {
            addWithdrawInteraction(functionName, tokenAddress, hash);
        } else if (isError){
            reset();
        }
    }, [isSuccessed, functionName, address, tokenAddress, hash, addWithdrawInteraction, isError, reset]);

    return {
        writeCustormV3,
        hash,
        error,
        isPending,
        isLoading: status !== 'idle' && status !== "error" && !isSuccessed,
        isSuccess,
        status,
        isError,
        reset,
        isSuccessed,
    };
};
