import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useAccountStore } from '@/dapp/store/accountStore';
import { useUserId } from '../readContracts/useUserId';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';
import { CHAIN_ID } from '@/dapp/contractsConfig';

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
 * 监听和读取当前账户的 UserId
 * 
 * 功能：
 * 1. 监听 SIWE token 的有效性
 * 2. 如果 SIWE token 有效且 userId 不存在，则自动从合约获取 userId
 * 3. 将获取到的 userId 保存到 accountStore
 * 
 * @returns 当前账户的 userId（如果存在）
 * 
 * @example
 * ```tsx
 * const userId = useMyUserId();
 * 
 * // userId 会在以下情况自动更新：
 * // 1. SIWE token 变为有效且 userId 不存在时
 * // 2. 账户切换时
 * // 3. 链切换时
 * ```
 */
export function useGetMyUserId(): string {
    const [userId, setUserId] = useState<string>('');
    const fetchingRef = useRef(false); // Prevent duplicate requests

    const { setUserId: setUserIdToStore} = useAccountStore();
    const { myUserId } = useUserId();
    const { address, chainId } = useWalletContext();
    const currentSession = useSimpleSecretStore((state) => state.currentSession);
    
    // Use selector to precisely listen for changes in the userId of the current account
    const currentUserIdFromStore = useAccountStore((state) => {
        const targetChainId = chainId || CHAIN_ID;
        const targetAddress = address || state.currentAccount;

        return resolveUserIdFromAccounts(state, targetChainId, targetAddress);
    });

    // ==================== Check if the SIWE token is valid ====================
    const isSiweTokenValid = useCallback((): boolean => {
        if (!currentSession.isLoggedIn || !currentSession.token) {
            return false;
        }

        // Check the expiration time
        if (currentSession.expiresAt) {
            const now = new Date();
            const expiresAt = new Date(currentSession.expiresAt);
            return now < expiresAt;
        }

        // If there is no expiration time, but the token exists and isLoggedIn is true, consider it valid
        return true;
    }, [currentSession.isLoggedIn, currentSession.token, currentSession.expiresAt]);

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

        // Check the necessary conditions
        if (!currentSession.token || !isSiweTokenValid()) {
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
            fetchingRef.current = false; // 重置状态
            return;
        }

        // Mark as fetching
        fetchingRef.current = true;

        try {
            
            // Call the contract to get the userId
            const fetchedUserId = await myUserId(currentSession.token);

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
        currentSession.token,
        address,
        chainId,
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
        if (!currentUserIdFromStore && isSiweTokenValid() && !fetchingRef.current) {
            fetchUserIdFromContract();
        }
    }, [
        currentUserIdFromStore,
        currentSession.isLoggedIn,
        currentSession.token,
        currentSession.expiresAt,
        fetchUserIdFromContract,
        isSiweTokenValid,
    ]);

    return userId;
}
