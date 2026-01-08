import { useAccountStore } from '@dapp/store/accountStore';
import { useAccount, useChainId } from 'wagmi';
import { useEffect } from 'react';

/**
 * Secure account Hook
 * 
 * Features:
 * - Automatically handle account switching and data isolation
 * - Automatically initialize new accounts
 * - Automatically manage session lifecycle
 * - Ensure secure access to account data
 */
export const useSecureAccount = () => {
    const { address, isConnected, connector } = useAccount();
    const chainId = useChainId();
    
    const {
        currentAccount,
        setCurrentAccount,
        initAccount,
        endSession,
        startSession,
    } = useAccountStore();

    // Listen for account changes
    useEffect(() => {
        if (isConnected && address) {
            // If the account changes
            if (currentAccount !== address.toLowerCase()) {
                
                // End the session of the old account
                if (currentAccount) {
                    endSession();
                }
                
                // Initialize new account
                initAccount(address.toLowerCase());
                
                // Start new session
                startSession(chainId);
            }
        } else {
            // If not connected, clear the current account
            if (currentAccount) {
                endSession();
                setCurrentAccount(null);
            }
        }
    }, [address, isConnected, chainId, currentAccount, connector, initAccount, startSession, endSession, setCurrentAccount]);

    return {
        address,
        isConnected,
        chainId,
    };
};

