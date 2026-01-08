import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
// import { ContractConfig, ContractName,} from '@dapp/contractsConfig/types';
// import { Abi, parseUnits } from 'viem';
import { useSupportedTokens ,TokenMetadata} from '@dapp/config/contractsConfig';
import { useEffect } from 'react';

interface WriteContractConfig {
    contractAddress: `0x${string}`;
    functionName: string;
    args: any[];
    value?: bigint;
}

interface WriteContractResult {
    writeToken: (config: WriteContractConfig) => Promise<`0x${string}`>;
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

export const useWriteToken = (): WriteContractResult => {
    const {
        writeContractAsync,  
        data: hash,         // 
        error,             // 
        isPending,         // Whether the transaction is pending, waiting for wallet confirmation
        isError,           // Whether there is an error Boolean value
        isSuccess,         // Whether the transaction is successfully sent
        status,            
        reset             // Function to reset the status
    } = useWriteContract();

    const supportedTokens = useSupportedTokens();

    const { isSuccess: isSuccessed } = useWaitForTransactionReceipt({
        hash,
    });

    const writeToken = async (config: WriteContractConfig) => {

        try {
            // 1. Get the contract name, then get the contract configuration
            const tokenMetadata = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === config.contractAddress.toLowerCase()
            );
            if (!tokenMetadata) {
                throw new Error('Token metadata not found');
            }

            // 2. Call the contract
            const result = await writeContractAsync({
                address: config.contractAddress,
                abi: tokenMetadata.abi,
                functionName: config.functionName,
                args: config.args,
                value: config.value,
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
        writeToken,
        hash,
        error,
        isPending,
        isLoading: status !== 'idle' && status !== "error" && !isSuccessed,
        isSuccess,
        isError,
        status,
        isSuccessed,
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