import { useState, useCallback } from 'react';
import { useSignMessage } from 'wagmi';
import { useReadSiweAuth } from '@/dapp/hooks/readContracts/useSiweAuth';
import { SiweMessage } from 'siwe';
import { type Hex } from 'viem';
import {
    SiweMessageParams,
    SignatureRSV,
    LoginResult,
    SessionInfo,
    UseSiweAuthBaseResult,
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

/**
 * SIWE 基础登录 Hook
 * 只负责 SIWE 消息创建、签名和登录等核心逻辑，不涉及状态管理
 * 
 * @param chainId - 链 ID
 * @param address - 用户钱包地址
 * @returns 基础登录功能（login、isLoading、error、reset）
 */
export const useSiweAuthBase = (
    chainId: number, 
    address: `0x${string}`
): UseSiweAuthBaseResult => {
    const { login: contractLogin} = useReadSiweAuth();
    const { signMessageAsync } = useSignMessage();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

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

                if (!address || address === '0x0000000000000000000000000000000000000000') {
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

                return {
                    sessionInfo,
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
            address,
            chainId,
            createSiweMessage,
            signMessageAsync,
            contractLogin,
            getNetworkConfig,
        ]
    );

    const reset = useCallback(() => {
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        login,
        isLoading,
        error,
        reset,
    };
};
