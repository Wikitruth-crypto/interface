import { useEffect, useCallback } from 'react';
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
  session: SessionInfo;
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
  
  const { isSessionValid } = useReadSiweAuth();

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
   * 检查当前的会话是否有效
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!session.token) {
      return false;
    }

    try {
      if (typeof isSessionValid !== 'function') {
        throw new Error('SIWE session validation interface not initialized');
      }

      if (session.expiresAt && session.expiresAt < new Date()) {
        clearSiweSession(chainId, session.address ?? undefined);
        return false;
      }

      const isValid = await isSessionValid(session.token, true);

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
  }, [session, isSessionValid, clearSiweSession, chainId]);

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
    session,
    isLoading: baseAuth.isLoading,
    error: baseAuth.error,
    reset: baseAuth.reset,
  };
};
