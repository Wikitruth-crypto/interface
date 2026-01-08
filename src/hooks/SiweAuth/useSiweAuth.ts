import { useEffect, useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ZeroAddress } from 'ethers';
import { useReadSiweAuth } from '@dapp/hooks/readContracts/useSiweAuth';
import { useSiweAuthBase } from './useSiweAuthBase';
import { useSimpleSecretStore } from '@dapp/store/simpleSecretStore';
import {
  SiweMessageParams,
  LoginResult,
  UseSiweAuthBaseResult,
  SessionInfo,
} from './types';

/**
 * Hook return value (contains status management functionality)
 */
export interface UseSiweAuthResult extends UseSiweAuthBaseResult {
  logout: () => void;
  validateSession: () => Promise<boolean>;
  isSessionValidLocal: () => boolean;
  session: SessionInfo;
  isValidateSession: boolean;
}


/**
 * SIWE authentication Hook (contains status management)
 * On the basis of useSiweAuthBase, add session status management, verification and cleanup functionality
 * 
 * @returns Complete SIWE authentication functionality (login, logout, session validation, status management)
 */
export const useSiweAuth = (): UseSiweAuthResult => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // Only initialize the base hook when there is an address
  const baseAuth = useSiweAuthBase(
    chainId,
    address || ZeroAddress as `0x${string}`
  );
  
  const { isSessionValid: isSessionValidContract } = useReadSiweAuth();

  const session = useSimpleSecretStore((state) => state.currentSession);
  const setSiweSession = useSimpleSecretStore((state) => state.setSiweSession);
  const clearSiweSession = useSimpleSecretStore((state) => state.clearSiweSession);

  /**
   * The advantage of listening inside the hooks is that as long as the hooks are referenced by other components, they will be automatically listened to
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

      // Call the login method of the base hook
      const result = await baseAuth.login(params);
      
      if (!result) {
        return null;
      }

      // Save the login result to the status management
      const { sessionInfo } = result;
      setSiweSession(sessionInfo, chainId, address);

      return result;
    },
    [address, chainId, baseAuth, setSiweSession]
  );

  /**
   * Local check session validity (without calling the contract)
   * Suitable for frequent check scenarios, to avoid network pressure
   * 
   * @returns If the session is valid in the local state, return true, otherwise return false
   */
  const isSessionValidLocal = useCallback((): boolean => {
    // Check basic login status
    if (!session.isLoggedIn) {
      return false;
    }

    // Check if the token exists
    if (!session.token) {
      return false;
    }

    // Check if the address matches (if the current address is provided)
    if (address && session.address) {
      if (session.address.toLowerCase() !== address.toLowerCase()) {
        return false;
      }
    }

    // Check if it is expired
    if (session.expiresAt) {
      const now = new Date();
      if (session.expiresAt < now) {
        // If it is expired, automatically clean the session
        clearSiweSession(chainId, session.address ?? undefined);
        return false;
      }
    }

    return true;
  }, [session, address, chainId, clearSiweSession]);

  // Calculate whether the current session is valid (responsive state)
  // When the session related attributes change, immediately recalculate
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

  // If the session has an expiration time, set a timer to automatically clean up when it expires
  useEffect(() => {
    if (!session.expiresAt || !session.isLoggedIn) {
      return;
    }

    const now = Date.now();
    const expiresAt = session.expiresAt.getTime();
    const timeUntilExpiry = expiresAt - now;

    // If it has expired, immediately clean up
    if (timeUntilExpiry <= 0) {
      clearSiweSession(chainId, session.address ?? undefined);
      return;
    }

    // Set a timer to automatically clean up when it expires
    const timeout = setTimeout(() => {
      clearSiweSession(chainId, session.address ?? undefined);
    }, timeUntilExpiry);

    return () => clearTimeout(timeout);
  }, [session.expiresAt, session.isLoggedIn, session.address, chainId, clearSiweSession]);

  /**
   * Check if the current session is valid (call contract verification)
   * Suitable for validation scenarios that need to be synchronized with the chain status
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
