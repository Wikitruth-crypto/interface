import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
import { ContractConfig } from '@/dapp/contractsConfig/types';

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
        isPending,         // 交易是否待处理，等待钱包确认
        isError,           // 是否有错误 Boolean值
        isSuccess,         // 交易是否成功发送
        status,            // 交易状态，与isPending、isError、isSuccess 对应
        reset             // 重置状态的函数
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