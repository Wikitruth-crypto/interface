import { useState } from 'react';
import { PermitType } from '@dapp/hooks/EIP712';
import { useEIP712Permit } from '@dapp/hooks/EIP712/useEIP712Permit';
import {
    useERC20,
    useERC20Secret,
} from '../../readContracts/index';
import { useSupportedTokens, TokenMetadata } from '@dapp/config/contractsConfig';

export interface ReadAllowanceResult {
    isEnough: boolean;
    allowanceAmount: bigint;
}

const normalizeTargetAmount = (value: number | string | bigint): bigint => {
    if (typeof value === 'bigint') {
        return value;
    }
    if (typeof value === 'number') {
        if (!Number.isFinite(value) || !Number.isInteger(value)) {
            throw new Error('targetAmount must be an integer number');
        }
        if (!Number.isSafeInteger(value)) {
            throw new Error('targetAmount number exceeds safe integer range; pass bigint or integer string');
        }
        return BigInt(value);
    }
    if (typeof value === 'string') {
        if (!/^\d+$/.test(value)) {
            throw new Error('targetAmount string must be an integer representation');
        }
        return BigInt(value);
    }
    throw new Error('Unsupported targetAmount type');
};

export const useReadAllowance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allowanceAmount, setAllowanceAmount] = useState<bigint>(BigInt(0));
    const [isEnough, setIsEnough] = useState<boolean>(false);

    const { allowance } = useERC20();
    const { allowanceWithPermit } = useERC20Secret();

    const { getValidPermit } = useEIP712Permit();
    const supportedTokens = useSupportedTokens();

    const readAllowance = async (
        tokenAddress: `0x${string}`,
        owner: string,
        spender: string,
        targetAmount: number | string | bigint,
        force: boolean = false
    ): Promise<ReadAllowanceResult> => {
        setIsLoading(true);

        try {
            const tokenMetadata = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress.toLowerCase()
            );
            if (!tokenMetadata) {
                throw new Error('Token metadata not found');
            }

            let currentAllowance: bigint = BigInt(0);

            if (tokenMetadata.types === 'ERC20') {
                currentAllowance = await allowance(tokenAddress, owner, spender, force);
            } else if (tokenMetadata.types === 'Secret') {
                const validPermit = await getValidPermit({
                    spender,
                    amount: BigInt(0),
                    label: PermitType.VIEW,
                    contractAddress: tokenAddress,
                });
                currentAllowance = await allowanceWithPermit(tokenAddress, validPermit, force);
            } else {
                console.error(`Unsupported token type: ${tokenMetadata.types}`);
                setIsLoading(false);
                return { isEnough: false, allowanceAmount: BigInt(0) };
            }

            const normalizedTargetAmount = normalizeTargetAmount(targetAmount);
            const isEnoughValue = currentAllowance >= normalizedTargetAmount;

            setIsEnough(isEnoughValue);
            setAllowanceAmount(currentAllowance);
            setIsLoading(false);

            return { isEnough: isEnoughValue, allowanceAmount: currentAllowance };
        } catch (error) {
            console.error('[checkAllowance] Error:', error);
            setIsLoading(false);
            return { isEnough: false, allowanceAmount: BigInt(0) };
        }
    };

    return {
        readAllowance,
        isLoading,
        allowanceAmount,
        isEnough,
    };
};
