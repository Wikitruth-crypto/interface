import { useCallback, useState, useEffect } from 'react';
import { TokenPair } from '../types';
// import { TokenMetadata, useSupportedTokens } from '@/dapp/contractsConfig';
// import { useTokenOperations } from './useTokenOperations';
import { useEIP712Permit } from '@/dapp/hooks/EIP712/useEIP712Permit';
import { useReadBalance } from '@/dapp/hooks/readContracts2/token/useReadBalance';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { PermitType, SignPermitParams } from '@/dapp/hooks/EIP712/types_ERC20secret';

export const useUnWrapSteps = (tokenPair: TokenPair, amount?: string) => {
    const { address } = useAccount();
    const [currentStep, setCurrentStep] = useState<string>('EIP712Permit');
    const { signAndSavePermit, getCurrentEip712Permit } = useEIP712Permit();
    const { readBalance, balance, isLoading, isEnough } = useReadBalance();

    const initSteps = useCallback(() => {
        if (!tokenPair.secretContractAddress) return;
        const permit = getCurrentEip712Permit(
            PermitType.VIEW, 
            tokenPair.secretContractAddress
        )
        if (permit) {
            setCurrentStep('checkBalance');
        }
    }, [getCurrentEip712Permit, tokenPair.secretContractAddress]);

    const handleEIP712Permit = useCallback(async () => {

        if (!address || !tokenPair.erc20.address|| !tokenPair.secretContractAddress) {
            return;
        }
        try {
            const signPermitParams: SignPermitParams = {
                contractAddress: tokenPair.erc20.address,
                amount: 0,
                label: PermitType.VIEW,
                spender: address,
            };
            const result = await signAndSavePermit(
                signPermitParams,
            );
            if (result) {
                setCurrentStep('checkBalance');
            }
        } catch (error) {
            console.error('Check EIP712Permit error:', error);
        }
    }, [tokenPair, signAndSavePermit, address]);

    useEffect(() => {
        const handleReadBalance = async () => {
            if (currentStep !== 'checkBalance') return;
            if (!tokenPair.erc20.address || !address ) {
                return;
            }
            const amountInWei = amount ? parseUnits(amount, tokenPair.erc20.decimals) : BigInt(0);
            await readBalance(tokenPair.erc20.address, address, amountInWei);
        }
        handleReadBalance();
    }, [address, amount, readBalance, currentStep]);


    return {
        initSteps,
        handleEIP712Permit,
        currentStep,
        isLoading,
        balance,
        isEnough,
    };
};


