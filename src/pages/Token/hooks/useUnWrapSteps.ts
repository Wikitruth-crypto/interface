import { useCallback, useState, useEffect, useRef } from 'react';
import { TokenPair } from '../types';
import { useEIP712Permit } from '@dapp/hooks/EIP712/useEIP712Permit';
import { useReadBalance } from '@dapp/hooks/readContracts2/token/useReadBalance';
import { useAccount } from 'wagmi';
import { PermitType, SignPermitParams } from '@dapp/hooks/EIP712/types_ERC20secret';

export const useUnWrapSteps = (tokenPair: TokenPair, amount?: string) => {
    const { address } = useAccount();
    const [currentStep, setCurrentStep] = useState<string>('EIP712Permit');
    const [signError, setSignError] = useState<Error | null>(null);
    const { signAndSavePermit, getCurrentEip712Permit, isLoading: isEIP712Loading, error: eip712Error } = useEIP712Permit();
    const { readBalance, balance, isLoading,error: balanceError } = useReadBalance();
    const initStepsRef = useRef(false);

    const initSteps = useCallback(async () => {
        if (!address || !tokenPair.secret?.address) {
            setCurrentStep('EIP712Permit');
            initStepsRef.current = false;
            return;
        }

        // Prevent duplicate initialization
        if (initStepsRef.current) {
            return;
        }

        initStepsRef.current = true;
        const permit = getCurrentEip712Permit(
            PermitType.VIEW,
            address,
            tokenPair.secret.address
        );
        
        if (permit) {
            setCurrentStep('checkBalance');
            await readBalance(tokenPair.secret.address, address, true);
        } else {
            setCurrentStep('EIP712Permit');
        }
        initStepsRef.current = false;
    }, [getCurrentEip712Permit, address, tokenPair.secret?.address, readBalance]);

    const handleEIP712Permit = useCallback(async () => {
        if (!address || !tokenPair.secret?.address) {
            return;
        }
        setSignError(null);
        try {
            const signPermitParams: SignPermitParams = {
                contractAddress: tokenPair.secret.address,
                amount: BigInt(0),
                label: PermitType.VIEW,
                spender: address,
            };
            const result = await signAndSavePermit(signPermitParams);
            if (result) {
                setCurrentStep('checkBalance');
                setSignError(null);
                
                await readBalance(tokenPair.secret.address, address, true);
            }
        } catch (error) {
            console.error('Check EIP712Permit error:', error);
            setSignError(error instanceof Error ? error : new Error('Failed to sign EIP712 permit'));
        }
    }, [tokenPair.secret?.address, signAndSavePermit, address, readBalance]);

    // When tokenPair changes, reset initialization flag and reinitialize
    useEffect(() => {
        initStepsRef.current = false;
        if (tokenPair.secret?.address && address) {
            initSteps();
        }
    }, [tokenPair.secret?.address, address]);

    return {
        initSteps,
        handleEIP712Permit,
        currentStep,
        isLoading: isLoading || isEIP712Loading,
        balance,
        error: signError || eip712Error || balanceError,
    };
};


