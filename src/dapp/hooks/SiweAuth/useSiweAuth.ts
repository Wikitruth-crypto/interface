import { useEffect, useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useReadSiweAuth } from '@/dapp/hooks/readContracts/useSiweAuth';
import { useSiweAuthBase } from './useSiweAuthBase';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';
import {
  SiweMessageParams,
  LoginResult,
  UseSiweAuthBaseResult,
  SessionInfo,
} from './types';

/**
 * Hook 返回值（包含状态管理功能）
 */
export interface UseSiweAuthResult extends UseSiweAuthBaseResult {
  logout: () => void;
  validateSession: () => Promise<boolean>;
  isSessionValidLocal: () => boolean;
  session: SessionInfo;
  isValidateSession: boolean;
}


/**
 * SIWE 认证 Hook（包含状态管理）
 * 在 useSiweAuthBase 基础上添加了会话状态管理、验证和清理功能
 * 
 * @returns 完整的 SIWE 认证功能（登录、登出、会话验证、状态管理）
 */
export const useSiweAuth = (): UseSiweAuthResult => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // 只在有地址时初始化基础 hook
  const baseAuth = useSiweAuthBase(
    chainId,
    address || '0x0000000000000000000000000000000000000000'
  );
  
  const { isSessionValid: isSessionValidContract } = useReadSiweAuth();

  const session = useSimpleSecretStore((state) => state.currentSession);
  const setSiweSession = useSimpleSecretStore((state) => state.setSiweSession);
  const clearSiweSession = useSimpleSecretStore((state) => state.clearSiweSession);

  /**
   * 在hooks内部监听的好处是：只要hooks被其它组件引用就会自动监听
   */
  useEffect(() => {
    if (!isConnected && session.isLoggedIn) {
      clearSiweSession(chainId, session.address ?? undefined);
    }
  }, [isConnected, session.isLoggedIn, session.address, chainId, clearSiweSession]);

  useEffect(() => {
    if (
      session.isLoggedIn &&
      session.address &&
      address &&
      session.address.toLowerCase() !== address.toLowerCase()
    ) {
      clearSiweSession(chainId, session.address);
    }
  }, [address, session.isLoggedIn, session.address, chainId, clearSiweSession]);

  const login = useCallback(
    async (params?: Partial<SiweMessageParams>): Promise<LoginResult | null> => {
      if (!address) {
        const error = new Error('The wallet is not connected, please connect the wallet first');
        console.error('SIWE login failed:', error);
        return null;
      }

      // 调用基础 hook 的 login 方法
      const result = await baseAuth.login(params);
      
      if (!result) {
        return null;
      }

      // 将登录结果保存到状态管理
      const { sessionInfo } = result;
      setSiweSession(sessionInfo, chainId, address);

      return result;
    },
    [address, chainId, baseAuth, setSiweSession]
  );

  /**
   * 本地检查会话是否有效（不调用合约）
   * 适用于频繁检查场景，避免网络压力
   * 
   * @returns 如果会话在本地状态中有效则返回 true，否则返回 false
   */
  const isSessionValidLocal = useCallback((): boolean => {
    // 检查基本登录状态
    if (!session.isLoggedIn) {
      return false;
    }

    // 检查 token 是否存在
    if (!session.token) {
      return false;
    }

    // 检查地址是否匹配（如果提供了当前地址）
    if (address && session.address) {
      if (session.address.toLowerCase() !== address.toLowerCase()) {
        return false;
      }
    }

    // 检查是否过期
    if (session.expiresAt) {
      const now = new Date();
      if (session.expiresAt < now) {
        // 如果过期，自动清理会话
        clearSiweSession(chainId, session.address ?? undefined);
        return false;
      }
    }

    return true;
  }, [session, address, chainId, clearSiweSession]);

  // 计算当前会话是否有效（响应式状态）
  // 当 session 相关属性变化时，立即重新计算
  const isValidateSession = useMemo(() => {
    return isSessionValidLocal();
  }, [
    session.isLoggedIn,
    session.token,
    session.address,
    session.expiresAt,
    address,
    isSessionValidLocal,
  ]);

  // 如果 session 有过期时间，设置定时器在过期时自动清理
  useEffect(() => {
    if (!session.expiresAt || !session.isLoggedIn) {
      return;
    }

    const now = Date.now();
    const expiresAt = session.expiresAt.getTime();
    const timeUntilExpiry = expiresAt - now;

    // 如果已经过期，立即清理
    if (timeUntilExpiry <= 0) {
      clearSiweSession(chainId, session.address ?? undefined);
      return;
    }

    // 设置定时器在过期时清理
    const timeout = setTimeout(() => {
      clearSiweSession(chainId, session.address ?? undefined);
    }, timeUntilExpiry);

    return () => clearTimeout(timeout);
  }, [session.expiresAt, session.isLoggedIn, session.address, chainId, clearSiweSession]);

  /**
   * 检查当前的会话是否有效（调用合约验证）
   * 用于需要与链上状态同步的验证场景
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!isSessionValidLocal()) {
      return false;
    }

    try {
      if (typeof isSessionValidContract !== 'function') {
        throw new Error('SIWE session validation interface not initialized');
      }

      const isValid = await isSessionValidContract(session.token!);

      if (!isValid) {
        clearSiweSession(chainId, session.address ?? undefined);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Session validation failed:', err);
      clearSiweSession(chainId, session.address ?? undefined);
      return false;
    }
  }, [session, isSessionValidContract, clearSiweSession, chainId, isSessionValidLocal]);

  const logout = useCallback(() => {
    clearSiweSession(chainId, session.address ?? address ?? undefined);
    if (import.meta.env.DEV) {
      console.log('SIWE session cleared');
    }
  }, [clearSiweSession, chainId, session.address, address]);

  return {
    login,
    logout,
    validateSession,
    isSessionValidLocal,
    session,
    isValidateSession,
    isLoading: baseAuth.isLoading,
    error: baseAuth.error,
    reset: baseAuth.reset,
  };
};
