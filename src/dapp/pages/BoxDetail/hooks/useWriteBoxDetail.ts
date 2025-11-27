import { useEffect, useState } from 'react';
import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
import { ContractConfig } from '@/dapp/contractsConfig/types';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useButtonInteractionStore } from '../store/buttonInteractionStore';
import { FunctionNameType } from '@/dapp/types/contracts';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useAccountStore } from '@/dapp/store/accountStore';

interface WriteContractConfig {
    contract: ContractConfig,
    functionName: string;
    args: any[];
}

interface WriteContractResult {
    write_BoxDetail: (config: WriteContractConfig) => Promise<`0x${string}`>;
    hash: `0x${string}` | undefined;
    error: Error | null;
    isPending: boolean;
    status: 'idle' | 'error' | 'pending' | 'success';
    reset: () => void;
    isSuccessed: boolean;
}

export const useWrite_BoxDetail = (): WriteContractResult => {

    const {
        writeContractAsync,
        data: hash,         // 
        error,             // 
        isPending,         // 交易是否加载中，等待钱包打包
        // isError,           // 是否有错误 Boolean值
        // isSuccess,         // 交易是否成功发送
        // isConfirmed,       // 交易是否已确认
        status,            // 交易状态：'idle' | 'error' | 'loading' | 'success'
        reset             // 重置状态的函数
    } = useWriteContract();

    const { isSuccess: isSuccessed } = useWaitForTransactionReceipt({
        hash,
    });
    
    const { boxId } = useBoxDetailContext();
    const { address } = useWalletContext();
    const [writeType, setWriteType] = useState<FunctionNameType | null>(null);
    
    // 使用 buttonInteractionStore 管理按钮交互状态
    const { setCurrentActionFunction, setPending } = useButtonInteractionStore();
    const addBoxInteraction = useAccountStore(state => state.addBoxInteraction);

    const write_BoxDetail = async (
        config: WriteContractConfig
    ) => {
        const functionName = config.functionName as FunctionNameType;
        
        setWriteType(functionName);
        setCurrentActionFunction(functionName);
        
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
            setCurrentActionFunction(null);
        }
    };

    // 同步 isPending 状态到 buttonInteractionStore
    useEffect(() => {
        setPending(isPending);
    }, [isPending, setPending]);

    // 交易成功后记录到 accountStore
    useEffect(() => {
        if (isSuccessed && writeType && address) {
            addBoxInteraction(boxId, writeType, hash);
            console.log(`[useWrite_BoxDetail] Transaction successful: ${writeType} on Box ${boxId}`);
        }
    }, [isSuccessed, writeType, address, boxId, hash, addBoxInteraction]);

    return {
        write_BoxDetail,
        hash,
        error,
        isPending,
        status,
        reset,
        isSuccessed,
    };
};
