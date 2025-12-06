import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
// import { ContractConfig, ContractName,} from '@/dapp/contractsConfig/types';
// import { Abi, parseUnits } from 'viem';
import { useSupportedTokens ,TokenMetadata} from '@/dapp/contractsConfig';

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
        isPending,         // 交易是否待处理，等待钱包确认
        isError,           // 是否有错误 Boolean值
        isSuccess,         // 交易是否成功发送
        status,            
        reset             // 重置状态的函数
    } = useWriteContract();

    const supportedTokens = useSupportedTokens();

    const { isSuccess: isSuccessed } = useWaitForTransactionReceipt({
        hash,
    });

    const writeToken = async (config: WriteContractConfig) => {

        try {
            // 1. 获取合约名称， 然后获取合约配置
            const tokenMetadata = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === config.contractAddress.toLowerCase()
            );
            if (!tokenMetadata) {
                throw new Error('Token metadata not found');
            }

            // 2. 调用合约
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