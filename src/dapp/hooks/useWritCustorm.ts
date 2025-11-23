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
    write: (config: WriteContractConfig) => Promise<`0x${string}`>;
    hash: `0x${string}` | undefined;
    error: Error | null;
    isPending: boolean;
    isSuccessed: boolean;
    status: 'idle' | 'error' | 'pending' | 'success';
    reset: () => void;
}

export const useWriteCustorm = (): WriteContractResult => {
    const {
        writeContractAsync,  
        data: hash,         // 
        error,             // 
        isPending,         // 交易是否加载中，等待钱包打包
        // isError,           // 是否有错误 Boolean值
        // isSuccess,         // 交易是否成功发送
        status,            // 交易状态：'idle' | 'error' | 'loading' | 'success'
        reset             // 重置状态的函数
    } = useWriteContract();

    const { isSuccess: isSuccessed } = useWaitForTransactionReceipt({
        hash,
    });

    const write = async (config: WriteContractConfig) => {
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
        write,
        hash,
        error,
        isPending,
        isSuccessed,
        status,
        reset,
    };
};
