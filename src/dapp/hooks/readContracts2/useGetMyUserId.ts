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
    const fetchingRef = useRef(false); // 防止重复请求

    // ==================== 依赖项 ====================
    const { setUserId: setUserIdToStore} = useAccountStore();
    const { myUserId } = useUserId();
    const { address, chainId } = useWalletContext();
    const currentSession = useSimpleSecretStore((state) => state.currentSession);
    
    // 使用 selector 精确监听当前账户的 userId 变化
    const currentUserIdFromStore = useAccountStore((state) => {
        const targetChainId = chainId || CHAIN_ID;
        const targetAddress = address || state.currentAccount;

        return resolveUserIdFromAccounts(state, targetChainId, targetAddress);
    });

    // ==================== 检查 SIWE token 是否有效 ====================
    const isSiweTokenValid = useCallback((): boolean => {
        if (!currentSession.isLoggedIn || !currentSession.token) {
            return false;
        }

        // 检查过期时间
        if (currentSession.expiresAt) {
            const now = new Date();
            const expiresAt = new Date(currentSession.expiresAt);
            return now < expiresAt;
        }

        // 如果没有过期时间，但 token 存在且 isLoggedIn 为 true，认为有效
        return true;
    }, [currentSession.isLoggedIn, currentSession.token, currentSession.expiresAt]);

    // ==================== 获取当前账户的 userId ====================
    // 使用 selector 获取的 userId，无需额外函数

    // ==================== 从合约获取 userId ====================
    const fetchUserIdFromContract = useCallback(async (): Promise<void> => {
        // 防止重复请求
        if (fetchingRef.current) {
            if (import.meta.env.DEV) {
                console.log('[useMyUserId] Already fetching, skipping...');
            }
            return;
        }

        // 检查必要条件
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

        // 再次检查是否已经有 userId（使用最新的值）
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

        // 标记为正在获取
        fetchingRef.current = true;

        try {
            
            // 调用合约获取 userId
            const fetchedUserId = await myUserId(currentSession.token);

            if (fetchedUserId && fetchedUserId > 0) {
                const userIdString = fetchedUserId.toString();
                
                // 保存到 accountStore
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
            // 立即重置 fetching 状态
            // 注意：这里不延迟，因为我们已经保存了 userId，store 更新会触发 currentUserIdFromStore 变化
            // 而 currentUserIdFromStore 变化会触发同步 useEffect，从而阻止重复请求
            fetchingRef.current = false;
        }
    }, [
        currentSession.token,
        address,
        chainId,
    ]);

    // ==================== 同步 store 中的 userId 到本地状态 ====================
    useEffect(() => {
        if (currentUserIdFromStore && currentUserIdFromStore !== userId) {
            setUserId(currentUserIdFromStore);
        }
    }, [currentUserIdFromStore, userId]);

    // ==================== 监听变化并自动获取 ====================
    useEffect(() => {
        // 如果 userId 不存在且 SIWE token 有效，且没有正在获取，则获取
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
