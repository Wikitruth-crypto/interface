import { useState } from 'react';
// import { useAllowanceBase, AllowanceERC20Params, AllowanceERC20SecretParams, AllowanceBaseResult } from './useAllowanceBase';
// import { useSupportedTokens } from '@/dapp/contractsConfig';
import { PermitType } from '@/dapp/hooks/EIP712';
// import { useSecretStore } from '@/dapp/store/secretStore';
// import { TokenMetadata } from '@/dapp/contractsConfig';
import { useEIP712Permit } from '@/dapp/hooks/EIP712/useEIP712Permit';
// import { useChainId } from 'wagmi';
import { useGetTokenMetadata } from './useGetTokenMetadata';
import { 
    useERC20, 
    useERC20Secret 
} from '../index';

export interface ReadAllowanceResult {
    isEnough: boolean;
    allowanceAmount: number;
}

export const useReadAllowance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allowanceAmount, setAllowanceAmount] = useState<number>(0);
    const [isEnough, setIsEnough] = useState<boolean>(false);

    const { allowance} = useERC20();
    const { allowanceWithPermit } = useERC20Secret();

    // const { getAllowanceBase } = useAllowanceBase();
    const { getValidPermit } = useEIP712Permit();
    const { getTokenMetadata } = useGetTokenMetadata();
    /**
     * @example
     * // 检查 ERC20 代币授权
     * const result = await checkAllowance(wtcAddress, userAddress, fundManagerAddress, 1000);
     * 
     * @example
     * // 检查 Secret 代币授权（自动处理签名）
     * const result = await checkAllowance(wroseSecretAddress, userAddress, fundManagerAddress, 500);
     */
    const readAllowance = async (
        tokenAddress: `0x${string}`,
        owner: string,
        spender: string,
        targetAmount: number | string | bigint
    ): Promise<ReadAllowanceResult> => {
        setIsLoading(true);

        try {
            // 1. 获取代币配置
            const tokenMetadata = await getTokenMetadata(tokenAddress);

            // 2. 根据代币类型生成参数
            // let params: AllowanceERC20Params | AllowanceERC20SecretParams;
            let allowanceAmount = 0;

            if (tokenMetadata?.types === 'ERC20') {
                allowanceAmount = await allowance(tokenAddress, owner, spender);
                if (import.meta.env.DEV) {
                    console.log(`[ERC20] Allowance: ${allowanceAmount}, Target: ${targetAmount}`);
                }
                

            } else if (tokenMetadata?.types === 'Secret') {
                const validPermit = await getValidPermit({
                    spender: spender,
                    amount: 0,
                    label: PermitType.VIEW,
                    contractAddress: tokenAddress,
                });

                allowanceAmount = await allowanceWithPermit(tokenAddress, validPermit);

                if (import.meta.env.DEV) {
                    console.log(`[Secret] Allowance with permit: ${allowanceAmount}`);
                }

            } else {
                console.error(`Unsupported token type: ${tokenMetadata?.types}`);
                setIsLoading(false);
                return { isEnough: false, allowanceAmount: 0 };
            }

            // 判断授权是否足够
            const isEnoughValue = allowanceAmount >= Number(targetAmount);

            setIsEnough(isEnoughValue);
            setAllowanceAmount(allowanceAmount);
            setIsLoading(false);
            return { isEnough: isEnoughValue, allowanceAmount };

        } catch (error) {
            console.error('[checkAllowance] Error:', error);
            setIsLoading(false);
            return { isEnough: false, allowanceAmount: 0 };
        }
    };

    return {
        readAllowance,
        isLoading,
        allowanceAmount,
        isEnough,
    };
};
