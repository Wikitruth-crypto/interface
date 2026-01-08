import { useState, useCallback } from 'react';
import { useEIP712_ERC20secret,} from '@dapp/hooks/EIP712';
import { 
    SignPermitParams , 
    EIP712Permit, 
    PermitType 
} from '@dapp/hooks/EIP712/types_ERC20secret';
import { useSimpleSecretStore } from '@dapp/store/simpleSecretStore';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { TokenMetadata, useSupportedTokens } from '@dapp/config/contractsConfig';

/**
 * This is for the current frontend
 * 1. Check and get valid permit (if invalid, automatically generate new signature)
 * 2. Generate new EIP712 signature and save to store
 * 3. Get current valid permit
 */

export interface GetValidPermitOptions {
    contractAddress?: string;
    domainName?: string;
    domainVersion?: string;
    customDeadline?: number;
}


export interface UseCheckEIP712PermitResult {
    getValidPermit: (
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ) => Promise<EIP712Permit>;
    signAndSavePermit: (params: SignPermitParams) => Promise<EIP712Permit>;
    isExpired: (permit: EIP712Permit) => boolean;
    getCurrentEip712Permit: (label: PermitType, spender: string, contractAddress: string) => EIP712Permit | null;
    isLoading: boolean;
    error: Error | null;
}

export const useEIP712Permit = (): UseCheckEIP712PermitResult => {
    const { address, chainId } = useWalletContext();
    const { signPermit, isLoading: isSigningLoading, error: signError } = useEIP712_ERC20secret(chainId ?? 0, address ?? '');
    const supportedTokens = useSupportedTokens();

    const getEip712Permit = useSimpleSecretStore((state) => state.getEip712Permit);
    const setEip712Permit = useSimpleSecretStore((state) => state.setEip712Permit);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Check if EIP712 Permit is expired
     * @param permit - EIP712 Permit
     * @returns Whether expired
     */
    const isExpired = useCallback((permit: EIP712Permit): boolean => {
        if (!permit.deadline) {
            return true; // If there is no expiration time, it is considered expired
        }
        
        const now = Math.floor(Date.now() / 1000); // Current timestamp (seconds)
        const expired = now >= permit.deadline;
        
        if (expired) {
            if (import.meta.env.DEV) {
                console.log(`[EIP712] Permit expired. Deadline: ${permit.deadline}, Now: ${now}`);
            }
        }
        
        return expired;
    }, []);


    /**
     * Type guard: check if it is EIP712Permit
     */
    const isEIP712Permit = (p: EIP712Permit | SignPermitParams): p is EIP712Permit => {
        return 'signature' in p && 'deadline' in p;
    };

    /**
     * Parse the incoming parameters, return SignPermitParams
     * If the incoming parameter is EIP712Permit and not expired, return null (表示可以直接使用）
     */
    const parseSignPermitParams = useCallback((
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ): SignPermitParams | null => {
        // If the incoming parameter is EIP712Permit and not expired, return null
        if (isEIP712Permit(params) && !isExpired(params)) {
            return null;
        }

        // Get contract address
        let contractAddress: string;
        if (isEIP712Permit(params)) {
            contractAddress = options?.contractAddress || '';
        } else {
            contractAddress = params.contractAddress;
            
        }

        // Get token metadata
        const tokenMetadata = supportedTokens.find(
            (token: TokenMetadata) => token.address.toLowerCase() === contractAddress.toLowerCase()
        );
        if (!tokenMetadata) {
            throw new Error('Token metadata not found');
        }
        // Get domain name
        const domainName = tokenMetadata.domainName;
        if (!domainName) {
            throw new Error('Token domain name not found');
        }

        let label: PermitType;
        let spender: string;
        let amount: bigint | string;
        
        // let domainName: string | undefined;
        let domainVersion: string | undefined;
        let customDeadline: number | undefined;

        // Case 1: The incoming parameter is an existing EIP712Permit (expired)
        if (isEIP712Permit(params)) {
            // Extract parameters from permit
            label = params.label;
            spender = params.spender;
            // Convert to bigint or string
            amount = typeof params.amount === 'bigint' 
                ? params.amount 
                : typeof params.amount === 'string' 
                    ? params.amount 
                    : BigInt(params.amount);
            
            // contractAddress = options?.contractAddress || '';
            // domainName = options?.domainName;
            domainVersion = options?.domainVersion;
            customDeadline = options?.customDeadline;
        } else {
            // Case 2: The incoming parameter is SignPermitParams
            const signParams = params;
            
            label = signParams.label;
            spender = signParams.spender;
            // Convert number to bigint
            amount = typeof signParams.amount === 'number' 
                ? BigInt(signParams.amount) 
                : signParams.amount;
            // contractAddress = signParams.contractAddress;
            // domainName = signParams.domainName || options?.domainName;
            domainVersion = signParams.domainVersion || options?.domainVersion;
            customDeadline = signParams.customDeadline || options?.customDeadline;
        }

        // Validate necessary parameters
        if (!spender) {
            throw new Error('Missing spender parameter');
        }

        if (!contractAddress) {
            throw new Error('Missing contractAddress parameter');
        }

        return {
            label,
            spender,
            amount,
            contractAddress,
            domainName,
            domainVersion,
            customDeadline
        };
    }, [isExpired]);
    
    /**
     * Generate new EIP712 signature and save to store
     */
    const signAndSavePermit = useCallback(async (
        params: SignPermitParams,
    ): Promise<EIP712Permit> => {
        try {
            // Parse parameters, supplement domainName
            const enrichedParams = parseSignPermitParams(params);
            if (!enrichedParams) {
                throw new Error('Failed to parse permit params');
            }
        
            // Generate new EIP712 signature
            const newPermit = await signPermit(enrichedParams);

            if (!newPermit) {
                throw new Error('Failed to generate signature');
            }

            // Save to store
            setEip712Permit(params.label, params.spender, params.contractAddress, newPermit);

            return newPermit;
        } catch (signError) {
            const error = signError instanceof Error 
                ? signError 
                : new Error('Failed to generate EIP712 signature');
            console.error('[EIP712] Failed to generate permit:', error);
            setError(error);
            throw error;
        }
    }, [address, chainId, signPermit, setEip712Permit, parseSignPermitParams]);

    const getCurrentEip712Permit = useCallback((
        label: PermitType,
        spender: string,
        contractAddress: string,
    ): EIP712Permit | null => {
            const existingPermit = getEip712Permit(label, spender, contractAddress);
            if (
                existingPermit && 
                !isExpired(existingPermit) && 
                existingPermit.label=== label && 
                existingPermit.spender=== spender
            ) {
                return existingPermit;
            } 
            return null;
    }, [getEip712Permit, isExpired]);

    /**
     * Get valid permit
     * 1. If the incoming parameter is EIP712Permit and not expired, return directly
     * 2. If the incoming parameter is EIP712Permit but expired, need to regenerate
     * 3. If the incoming parameter is SignPermitParams, check if there is a valid permit in the store
     * 4. If there is no or expired, generate a new permit
     */
    const getValidPermit = useCallback(async (
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ): Promise<EIP712Permit> => {
        setError(null);
        setIsLoading(true);

        try {
            if (isEIP712Permit(params) && !isExpired(params)) {
                return params;
            }
            const signPermitParams = parseSignPermitParams(params, options);
            if (!signPermitParams) {
                if (isEIP712Permit(params)) {
                    return params;
                }
                throw new Error('Unexpected error: failed to parse permit params');
            }

            const { label, spender, contractAddress } = signPermitParams;
            const currentPermit = getCurrentEip712Permit(label, spender, contractAddress);
            if (currentPermit) {
                return currentPermit;
            }

            const newPermit = await signAndSavePermit(signPermitParams);
            return newPermit;

        } catch (err) {
            const error = err instanceof Error 
                ? err 
                : new Error('Failed to get valid permit');
            console.error('[useEIP712Permit] Error:', error);
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [
        address,
        chainId,
        isExpired,
        parseSignPermitParams,
        getEip712Permit,
        signAndSavePermit
    ]);

    return {
        getValidPermit,
        isExpired,
        signAndSavePermit,
        getCurrentEip712Permit,
        isLoading: isLoading || isSigningLoading,
        error: error || signError
    };
};