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
    const [signError, setSignError] = useState<Error | null>(null);
    const { signAndSavePermit, getCurrentEip712Permit, isLoading: isEIP712Loading, error: eip712Error } = useEIP712Permit();
    const { readBalance, balance, isLoading, isEnough, error: balanceError } = useReadBalance();

    const initSteps = useCallback(() => {
        const init = async () => {
            if (!address || !tokenPair.secretContractAddress) {
                setCurrentStep('EIP712Permit');
                return;
            }
            const permit = getCurrentEip712Permit(
                PermitType.VIEW,
                address
            )
            if (permit) {
                setCurrentStep('checkBalance');
                await readBalance(tokenPair.secretContractAddress, address);
            } else {
                setCurrentStep('EIP712Permit');
            }
        }
        init();
    }, [getCurrentEip712Permit, address, tokenPair.secretContractAddress, readBalance]);

    const handleEIP712Permit = useCallback(async () => {
        if (!address || !tokenPair.secretContractAddress) {
            return;
        }
        setSignError(null);
        try {
            const signPermitParams: SignPermitParams = {
                contractAddress: tokenPair.secretContractAddress,
                amount: BigInt(0),
                label: PermitType.VIEW,
                spender: address,
            };
            const result = await signAndSavePermit(
                signPermitParams,
            );
            if (result) {
                setCurrentStep('checkBalance');
                setSignError(null);
                const result = await readBalance(tokenPair.secretContractAddress, address);
                // console.log('result.balance:', result.balance);
                
            }
        } catch (error) {
            console.error('Check EIP712Permit error:', error);
            setSignError(error instanceof Error ? error : new Error('Failed to sign EIP712 permit'));
        }
    }, [tokenPair, signAndSavePermit, address, readBalance]);

    return {
        initSteps,
        handleEIP712Permit,
        currentStep,
        isLoading: isLoading || isEIP712Loading,
        balance,
        isEnough,
        error: signError || eip712Error || balanceError,
    };
};


