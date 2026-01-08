import { useState } from 'react';
import { PermitType } from '@dapp/hooks/EIP712';
import { useEIP712Permit } from '@dapp/hooks/EIP712/useEIP712Permit';
import { useSupportedTokens ,TokenMetadata} from '@dapp/config/contractsConfig';
import { 
    useERC20, 
    useERC20Secret 
} from '../../readContracts/index';

// export interface ReadBalanceResult {
//     isEnough: boolean;
//     balance: bigint;
// }

export const useReadBalance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [error, setError] = useState<Error | null>(null);

    const { balanceOf} = useERC20();
    const { balanceOfWithPermit } = useERC20Secret();

    const { getValidPermit } = useEIP712Permit();
    const supportedTokens = useSupportedTokens();
    /**
     * @example
     * // Check ERC20 token balance
     * const result = await readBalance(wtcAddress, userAddress);
     * 
     * @example
     * // Check Secret token balance (automatically handle signature)
     * const result = await readBalance(wroseSecretAddress, userAddress);
     */
    const readBalance = async (
        tokenAddress: `0x${string}`,
        owner: string,
        force: boolean = false
    ): Promise<bigint> => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Get the token configuration
            const tokenMetadata = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress.toLowerCase()
            );
            if (!tokenMetadata) {
                throw new Error('Token metadata not found');
            }

            // 2. Generate parameters based on the token type
            // let params: AllowanceERC20Params | AllowanceERC20SecretParams;
            let balance = BigInt(0);

            if (tokenMetadata?.types === 'ERC20') {
                balance = await balanceOf(tokenAddress, owner, force);

            } else if (tokenMetadata?.types === 'Secret') {
                const validPermit = await getValidPermit({
                    spender: owner,
                    amount: BigInt(0),
                    label: PermitType.VIEW,
                    contractAddress: tokenAddress,
                });

                balance = await balanceOfWithPermit(tokenAddress, validPermit, force);

            } else {
                console.error(`Unsupported token type: ${tokenMetadata?.types}`);
                setIsLoading(false);
                return BigInt(0);
            }

            setBalance(balance);
            setIsLoading(false);
            return balance;

        } catch (error) {
            console.error('[readBalance] Error:', error);
            setIsLoading(false);
            setError(error as Error);
            return BigInt(0);
        }
    };

    return {
        readBalance,
        isLoading,
        balance,
        error,
    };
};
