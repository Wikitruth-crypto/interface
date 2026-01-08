import { useEffect, useState, useRef, useCallback } from 'react';
import { useAccountStore } from '@dapp/store/accountStore';
import { useUserId } from '../readContracts/useUserId';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { CHAIN_ID } from '@dapp/config/contractsConfig';
import { useSiweAuth } from '@dapp/hooks/SiweAuth';

type AccountStoreSnapshot = ReturnType<typeof useAccountStore.getState>;

const resolveUserIdFromAccounts = (
    state: AccountStoreSnapshot,
    chainId?: number | null,
    address?: string | null,
): string => {
    if (!chainId || !address) {
        return '';
    }

    const chainAccounts = state.accounts[chainId];
    if (!chainAccounts) {
        return '';
    }

    return (
        chainAccounts[address]?.userId ??
        chainAccounts[address.toLowerCase()]?.userId ??
        ''
    );
};

/**
 * Listen and read the userId of the current account
 * @returns The userId of the current account (if it exists)
 * 
 * 
 * @example
 * ```tsx
 * const userId = useMyUserId();
 * 
 * // The userId will be automatically updated in the following cases:
 * // 1. SIWE token becomes valid and userId does not exist
 * // 2. Account switch
 * // 3. Chain switch
 * ```
 */
export function useGetMyUserId(): string {
    const [userId, setUserId] = useState<string>('');
    const fetchingRef = useRef(false); // Prevent duplicate requests

    const { setUserId: setUserIdToStore} = useAccountStore();
    const { myUserId } = useUserId();
    const { address, chainId } = useWalletContext();
    
    // Use useSiweAuth to get the responsive session validation status and token
    const { isValidateSession, session } = useSiweAuth();
    
    // Use selector to precisely listen for changes in the userId of the current account
    const currentUserIdFromStore = useAccountStore((state) => {
        const targetChainId = chainId || CHAIN_ID;
        const targetAddress = address || state.currentAccount;

        return resolveUserIdFromAccounts(state, targetChainId, targetAddress);
    });

    // ==================== Get the current account's userId ====================

    // ==================== Get the userId from the contract ====================
    const fetchUserIdFromContract = useCallback(async (): Promise<void> => {
        // Prevent duplicate requests
        if (fetchingRef.current) {
            if (import.meta.env.DEV) {
                console.log('[useMyUserId] Already fetching, skipping...');
            }
            return;
        }

        // Check the necessary conditions - Use responsive isValidateSession
        if (!session.token || !isValidateSession) {
            if (import.meta.env.DEV) {
                console.log('[useMyUserId] SIWE token is not valid, skipping fetch');
            }
            return;
        }

        const targetAddress = address;
        if (!targetAddress) {
            if (import.meta.env.DEV) {
                console.log('[useMyUserId] No address available, skipping fetch');
            }
            return;
        }

        // Check if there is already a userId (using the latest value)
        const targetChainId = chainId || CHAIN_ID || 0;
        const latestUserId = resolveUserIdFromAccounts(
            useAccountStore.getState(),
            targetChainId,
            targetAddress
        );
        if (latestUserId) {
            if (import.meta.env.DEV) {
                console.log('latestUserId-useGetMyUserId:', latestUserId);
            }
            setUserId(latestUserId);
            fetchingRef.current = false; // Reset state
            return;
        }

        // Mark as fetching
        fetchingRef.current = true;

        try {
            
            // Call the contract to get the userId
            const fetchedUserId = await myUserId(session.token!);

            if (fetchedUserId && fetchedUserId > 0) {
                const userIdString = fetchedUserId.toString();
                
                // Save to accountStore
                setUserIdToStore(userIdString);
                setUserId(userIdString);
                if (import.meta.env.DEV) {
                    console.log('userIdString-useGetMyUserId:', userIdString);
                }
            } else {
                console.warn('[useMyUserId] Invalid userId received:', fetchedUserId);
            }

        } catch (error) {
            console.error('[useMyUserId] Failed to fetch userId:', error);
        } finally {
            // Immediately reset the fetching state
            // Note: Here is no delay, because we have saved the userId, the store update will trigger the currentUserIdFromStore change,
            // and the currentUserIdFromStore change will trigger the synchronous useEffect, thus preventing duplicate requests
            fetchingRef.current = false;
        }
    }, [
        session.token,
        isValidateSession,
        address,
        chainId,
        myUserId,
        setUserIdToStore,
    ]);

    // ==================== Synchronize the userId in the store to the local state ====================
    useEffect(() => {
        if (currentUserIdFromStore && currentUserIdFromStore !== userId) {
            setUserId(currentUserIdFromStore);
        }
    }, [currentUserIdFromStore, userId]);

    // ==================== Listen for changes and automatically get ====================
    useEffect(() => {
        // If the userId does not exist and the SIWE token is valid, and there is no fetching, then get
        if (!currentUserIdFromStore && isValidateSession && !fetchingRef.current) {
            fetchUserIdFromContract();
        }
    }, [
        currentUserIdFromStore,
        isValidateSession,
        fetchUserIdFromContract,
    ]);

    return userId;
}
