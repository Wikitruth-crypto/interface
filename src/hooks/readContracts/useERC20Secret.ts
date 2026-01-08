'use client';

import { EIP712Permit, SignatureRSV } from '@dapp/hooks/EIP712';
import { useReadContractERC20 } from './useReadContractERC20';

export function useERC20Secret() {

    const { readContractERC20 } = useReadContractERC20();


    /**
     * The underlying token address
     */
    const underlyingToken = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'underlyingToken');
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('underlyingToken error:', error);
            return '';
        }
    };

    const balanceOfWithPermit = async (
        tokenAddress: `0x${string}`,
        permit: EIP712Permit,
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'secret', 
                tokenAddress, 
                'balanceOfWithPermit', 
                [permit],
                force
            );
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('balanceOfWithPermit error:', error);
            return BigInt(0);
        }
    };

    const allowanceWithPermit = async (
        tokenAddress: `0x${string}`,
        permit: EIP712Permit,
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'secret', 
                tokenAddress, 
                'allowanceWithPermit', 
                [permit],
                force
            );
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('allowanceWithPermit error:', error);
            return BigInt(0);
        }
    };

    // ==================== EIP-712 Domain Separator ====================
    
    /**
     * Get the EIP-712 domain separator
     */
    const DOMAIN_SEPARATOR = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'DOMAIN_SEPARATOR');
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('DOMAIN_SEPARATOR error:', error);
            return '';
        }
    };

    /**
     * Get the EIP-712 Permit type hash
     */
    const EIP_PERMIT_TYPEHASH = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'EIP_PERMIT_TYPEHASH');
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('EIP_PERMIT_TYPEHASH error:', error);
            return '';
        }
    };

    // ==================== Signature Management ====================
    
    /**
     * Check if the signature has been used
     */
    const isSignatureUsed = async (
        tokenAddress: `0x${string}`,
        signature: SignatureRSV,
        force: boolean = false
    ): Promise<boolean> => {
        try {
            const tx = await readContractERC20(
                'secret', 
                tokenAddress, 
                'isSignatureUsed', 
                [signature],
                force
            );
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isSignatureUsed error:', error);
            return false;
        }
    };

    return {
        underlyingToken,
        balanceOfWithPermit,
        allowanceWithPermit,
        DOMAIN_SEPARATOR,
        EIP_PERMIT_TYPEHASH,
        isSignatureUsed,
    };
}

