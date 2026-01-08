import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
import { useEffect } from 'react';
import { ContractConfig } from '@dapp/config/contractsConfig';

interface WriteContractConfig {
    contract: ContractConfig,
    functionName: string;
    args: any[];
}

interface WriteContractResult {
    writeCustorm: (config: WriteContractConfig) => Promise<`0x${string}`>;
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

export const useWriteCustorm = (): WriteContractResult => {
    const {
        writeContractAsync,  
        data: hash,         // 
        error,             // 
        isPending,         // Whether the transaction is pending, waiting for wallet confirmation
        isError,           // Whether there is an error Boolean value
        isSuccess,         // Whether the transaction is successfully sent
        status,            // Transaction status, corresponding to isPending, isError, and isSuccess
        reset             // Function to reset the status
    } = useWriteContract();

    const { isSuccess: isSuccessed } = useWaitForTransactionReceipt({
        hash,
    });

    const writeCustorm = async (config: WriteContractConfig) => {
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
        }
    };

    useEffect(() => {
        if (isError) {
            reset();
        }
    }, [isError, reset]);

    return {
        writeCustorm,
        hash,
        error,
        isPending,
        isSuccess,
        isError,
        status,
        isSuccessed,
        isLoading: status !== 'idle' && status !== "error" && !isSuccessed,
        reset,
    };
};

// const { write, hash, error, isPending } = useWriteCustorm();

// const handleAction1 = async () => {
//     await write({
//         contract: Contract1,
//         functionName: 'function1',
//         args: [arg1, arg2]
//     });
// };