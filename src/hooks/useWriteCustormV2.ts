import { useEffect, useState } from 'react';
import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
import { ContractConfig } from '@dapp/config/contractsConfig';
import { useButtonInteractionStore } from '@dapp/store/buttonInteractionStore';
import { FunctionNameType } from '@dapp/types/typesDapp/contracts';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { useAccountStore } from '@dapp/store/accountStore';

interface WriteContractConfig {
    contract: ContractConfig,
    functionName: string;
    args: any[],
}

interface WriteContractResult {
    writeCustormV2: (config: WriteContractConfig) => Promise<`0x${string}`>;
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

export const useWriteCustormV2 = (boxIds?: string| string[]): WriteContractResult => {

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
    const [functionName, setFunctionName] = useState<FunctionNameType | null>(null);
    
    // use buttonInteractionStore to manage button interaction state
    const { setFunctionWriting} = useButtonInteractionStore();
    const addBoxInteraction = useAccountStore(state => state.addBoxInteraction);

    const writeCustormV2 = async (
        config: WriteContractConfig
    ) => {
        const functionName = config.functionName as FunctionNameType;
        setFunctionName(functionName);
        setFunctionWriting(functionName);
        
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
            setFunctionWriting(null);
        }
    };

    useEffect(() => {
        if (isSuccessed && functionName && address && boxIds) {
            if (Array.isArray(boxIds)) {
                boxIds.forEach(boxId => {
                    addBoxInteraction(boxId, functionName, hash);
                });
            } else {
                addBoxInteraction(boxIds, functionName, hash);
            }
        } else if (isError){
            reset();
            setFunctionWriting(null);
        }
    }, [isSuccessed, functionName, address, boxIds, hash, addBoxInteraction, isError, reset]);

    return {
        writeCustormV2,
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
