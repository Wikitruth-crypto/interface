import { useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useSignMessage, useChainId } from 'wagmi';
import { useReadSiweAuth } from '@/dapp/hooks/readContracts/useSiweAuth';
import { SiweMessage } from 'siwe';
import { type Hex } from 'viem';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';
import {
  SiweMessageParams,
  SignatureRSV,
  LoginResult,
  SessionInfo,
  UseSiweAuthResult,
  SiweNetworkConfig,
} from './types';
import { DEFAULT_DOMAINS } from '@dapp/constants';

const NETWORK_CONFIGS: Record<number, SiweNetworkConfig> = {
  23294: {
    chainId: 23294,
    version: '1',
    defaultStatement: 'I accept the WikiTruth Terms of Service',
    defaultExpirationHours: 24,
  },
  23295: {
    chainId: 23295,
    version: '1',
    defaultStatement: 'I accept the WikiTruth Terms of Service',
    defaultExpirationHours: 24,
  },
};

export const useSiweAuth = (): UseSiweAuthResult => {
  // const { login: contractLogin, isSessionValid } = useContext(ContractContext);
  const { login: contractLogin, isSessionValid } = useReadSiweAuth();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const session = useSimpleSecretStore((state) => state.currentSession);
  const setSiweSession = useSimpleSecretStore((state) => state.setSiweSession);
  const clearSiweSession = useSimpleSecretStore((state) => state.clearSiweSession);

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

  const generateNonce = (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  const getNetworkConfig = useCallback((): SiweNetworkConfig => {
    return NETWORK_CONFIGS[chainId] || NETWORK_CONFIGS[23294];
  }, [chainId]);

  const createSiweMessage = useCallback(
    (params: SiweMessageParams): string => {
      const networkConfig = getNetworkConfig();
      const defaultExpiration = new Date();
      defaultExpiration.setHours(defaultExpiration.getHours() + networkConfig.defaultExpirationHours);

      const siweMessage = new SiweMessage({
        domain: params.domain,
        address: params.address,
        statement: params.statement || networkConfig.defaultStatement,
        uri: params.uri || `https://${params.domain}`,
        version: networkConfig.version,
        chainId,
        nonce: params.nonce || generateNonce(),
        issuedAt: params.issuedAt?.toISOString() || new Date().toISOString(),
        expirationTime: params.expirationTime?.toISOString() || defaultExpiration.toISOString(),
        notBefore: params.notBefore?.toISOString(),
        resources: params.resources || [],
      });

      return siweMessage.toMessage();
    },
    [chainId, getNetworkConfig]
  );

  const parseSignature = (signature: Hex): SignatureRSV => {
    const sig = signature.slice(2);
    return {
      r: `0x${sig.slice(0, 64)}`,
      s: `0x${sig.slice(64, 128)}`,
      v: parseInt(sig.slice(128, 130), 16),
    };
  };

  const login = useCallback(
    async (params?: Partial<SiweMessageParams>): Promise<LoginResult | null> => {
      setError(null);
      setIsLoading(true);

      try {
        if (typeof contractLogin !== 'function') {
          throw new Error('SIWE 登录接口未初始化，请检查合约上下文');
        }

        if (!isConnected || !address) {
          throw new Error('钱包未连接，请先连接钱包');
        }

        const domain = params?.domain || DEFAULT_DOMAINS[0];
        const messageParams: SiweMessageParams = {
          domain,
          address,
          statement: params?.statement,
          uri: params?.uri,
          resources: params?.resources,
          nonce: params?.nonce,
          expirationTime: params?.expirationTime,
          notBefore: params?.notBefore,
          issuedAt: params?.issuedAt,
        };

        const message = createSiweMessage(messageParams);
        const signatureHex = await signMessageAsync({ message });
        const signature = parseSignature(signatureHex);
        const token = await contractLogin(message, signature);

        if (!token) {
          throw new Error('获取 token 失败');
        }

        const expiresAt =
          messageParams.expirationTime ||
          (() => {
            const date = new Date();
            date.setHours(date.getHours() + getNetworkConfig().defaultExpirationHours);
            return date;
          })();

        const sessionInfo: SessionInfo = {
          isLoggedIn: true,
          token,
          expiresAt,
          address: address as `0x${string}`,
        };

        setSiweSession(sessionInfo, chainId, address);

        return {
          token,
          message,
          signature,
          expiresAt,
        };
      } catch (err) {
        const authError = err instanceof Error ? err : new Error('登录失败');
        console.error('SIWE 登录失败:', authError);
        setError(authError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isConnected,
      address,
      chainId,
      createSiweMessage,
      signMessageAsync,
      contractLogin,
      getNetworkConfig,
      setSiweSession,
    ]
  );

  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!session.token) {
      return false;
    }

    try {
      if (typeof isSessionValid !== 'function') {
        throw new Error('SIWE 会话校验接口未初始化');
      }

      if (session.expiresAt && session.expiresAt < new Date()) {
        clearSiweSession(chainId, session.address ?? undefined);
        return false;
      }

      const isValid = await isSessionValid(session.token);

      if (!isValid) {
        clearSiweSession(chainId, session.address ?? undefined);
        return false;
      }

      return true;
    } catch (err) {
      console.error('验证会话失败:', err);
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

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    login,
    logout,
    validateSession,
    session,
    isLoading,
    error,
    reset,
  };
};
