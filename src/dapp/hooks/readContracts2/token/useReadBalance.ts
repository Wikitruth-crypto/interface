import { useState } from 'react';
import { PermitType } from '@/dapp/hooks/EIP712';
import { useEIP712Permit } from '@/dapp/hooks/EIP712/useEIP712Permit';
import { useSupportedTokens ,TokenMetadata} from '@/dapp/contractsConfig';
import { 
    useERC20, 
    useERC20Secret 
} from '../../readContracts/index';

export interface ReadBalanceResult {
    isEnough: boolean;
    balance: bigint;
}

export const useReadBalance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [isEnough, setIsEnough] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { balanceOf} = useERC20();
    const { balanceOfWithPermit } = useERC20Secret();

    const { getValidPermit } = useEIP712Permit();
    const supportedTokens = useSupportedTokens();
    /**
     * @example
     * // 检查 ERC20 代币余额
     * const result = await readBalance(wtcAddress, userAddress);
     * 
     * @example
     * // 检查 Secret 代币余额（自动处理签名）
     * const result = await readBalance(wroseSecretAddress, userAddress);
     */
    const readBalance = async (
        tokenAddress: `0x${string}`,
        owner: string,
        targetAmount?: bigint
    ): Promise<ReadBalanceResult> => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. 获取代币配置
            const tokenMetadata = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress.toLowerCase()
            );
            if (!tokenMetadata) {
                throw new Error('Token metadata not found');
            }

            // 2. 根据代币类型生成参数
            // let params: AllowanceERC20Params | AllowanceERC20SecretParams;
            let balance = BigInt(0);

            if (tokenMetadata?.types === 'ERC20') {
                balance = await balanceOf(tokenAddress, owner);

            } else if (tokenMetadata?.types === 'Secret') {
                const validPermit = await getValidPermit({
                    spender: owner,
                    amount: 0,
                    label: PermitType.VIEW,
                    contractAddress: tokenAddress,
                });

                balance = await balanceOfWithPermit(tokenAddress, validPermit);

            } else {
                console.error(`Unsupported token type: ${tokenMetadata?.types}`);
                setIsLoading(false);
                return { isEnough: false, balance: BigInt(0) };
            }

            // 判断授权是否足够
            let isEnoughValue = true;
            if (targetAmount !== undefined) {
                isEnoughValue = balance >= targetAmount;
                setIsEnough(isEnoughValue);
            }
            setBalance(balance);
            setIsLoading(false);
            return { isEnough: isEnoughValue, balance };

        } catch (error) {
            console.error('[readBalance] Error:', error);
            setIsLoading(false);
            setError(error as Error);
            return { isEnough: false, balance: BigInt(0) };
        }
    };

    return {
        readBalance,
        isLoading,
        balance,
        isEnough,
        error,
    };
};
