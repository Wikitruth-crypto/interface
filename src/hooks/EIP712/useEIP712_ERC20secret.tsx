import { useState, useCallback } from 'react';
import { useSignTypedData} from 'wagmi';
import { type Hex } from 'viem';
import { 
    SignPermitParams, 
    EIP712Permit, 
    EIP712Domain, 
    SignatureRSV, 
    PermitType 
} from './types_ERC20secret';
import { ethers } from 'ethers';

export interface UseEIP712SignatureResult {
    signPermit: (params: SignPermitParams) => Promise<EIP712Permit | null>;
    isLoading: boolean;
    error: Error | null;
    permit: EIP712Permit | null;
    reset: () => void;
}

export const useEIP712_ERC20secret = ( 
    chainId: number, 
    address: string, 
): UseEIP712SignatureResult => {
    const { signTypedDataAsync } = useSignTypedData();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [permit, setPermit] = useState<EIP712Permit | null>(null);

    /**
     * Parse signature string to RSV structure
     */
    const parseSignature = (signature: Hex): SignatureRSV => {
        // Remove 0x prefix
        const sig = signature.slice(2);
        
        return {
            r: '0x' + sig.slice(0, 64),
            s: '0x' + sig.slice(64, 128),
            v: parseInt(sig.slice(128, 130), 16)
        };
    };

    /**
     * Validate address format
     */
    const validateAddress = (addr: string, name: string): void => {
        if (!ethers.isAddress(addr)) {
            throw new Error(`The ${name} address format is invalid: ${addr}`);
        }
    };

    /**
     * Create EIP712 domain configuration
     */
    const createDomain = (
        chainId: number,
        contractAddress: string,
        domainName: string,
        domainVersion?: string
    ): EIP712Domain => {
        return {
            name: domainName,
            version: domainVersion || '1',
            chainId: chainId,
            verifyingContract: contractAddress as `0x${string}`
        };
    };

    /**
     * Generate EIP712 signature
     */
    const signPermit = useCallback(async (
        params: SignPermitParams
    ): Promise<EIP712Permit | null> => {
        const {
            spender,
            amount,
            label,
            contractAddress,
            domainName,
            domainVersion,
            customDeadline
        } = params;

        if(import.meta.env.DEV) {
            console.log(" SignPermit EIP-712")
        }

        // Reset state
        setError(null);
        setIsLoading(true);

        try {

            // Add at the beginning of the signPermit function
            if ( !address || !chainId) {
                if(import.meta.env.DEV) {
                    console.error(" Please connect your wallet first")
                }
                throw new Error('Please connect your wallet first');
            }

            validateAddress(contractAddress, 'token');
            validateAddress(spender, 'spender');

            if (!domainName) {
                throw new Error('The domain name is not valid');
            }

            // Validate amount
            const amountBigInt = typeof amount === 'bigint' 
                ? amount 
                : BigInt(amount);
            
            if (Number(amountBigInt) < 0) {
                throw new Error('The amount cannot be negative');
            }

            // Validate permit type
            if (!Object.values(PermitType).includes(label)) {
                throw new Error(`The permit type is invalid: ${label}`);
            }

            // For VIEW type, the amount must be 0
            if (label === PermitType.VIEW && Number(amountBigInt) !== 0) {
                throw new Error('The amount of VIEW type must be 0');
            }

            // Set deadline (default 1 hour later)
            const deadline = customDeadline || Math.floor(Date.now() / 1000) + 3600;

            // Create domain configuration
            const domain = createDomain(chainId, contractAddress, domainName, domainVersion);

            // EIP712 type definition
            const types = {
                EIP712Permit: [
                    { name: 'label', type: 'uint8' },
                    { name: 'owner', type: 'address' },
                    { name: 'spender', type: 'address' },
                    { name: 'amount', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' }
                ]
            };

            // Signature value
            const value = {
                label: label,
                owner: address,
                spender: spender as `0x${string}`,
                amount: amountBigInt,
                deadline: BigInt(deadline)
            };

            if(import.meta.env.DEV) {
                console.log("Try to excuse: signTypedDataAsync!")
            }

            // Execute signature
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: 'EIP712Permit',
                message: value
            });
            
            if(import.meta.env.DEV) {
                console.log(" excute: signTypedDataAsync!")
            }

            // Parse signature
            const sig = parseSignature(signature);

            // Construct permit object
            const permitData: EIP712Permit = {
                label: label,
                owner: address,
                spender,
                amount: amountBigInt.toString(),
                deadline,
                signature: sig
            };

            setPermit(permitData);
            return permitData;

        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to generate EIP712 signature');
            console.error('❌ EIP712 signature failed:', error);
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [chainId, address, signTypedDataAsync]);

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setError(null);
        setPermit(null);
        setIsLoading(false);
    }, []);

    return {
        signPermit,
        isLoading,
        error,
        permit,
        reset
    };
};

