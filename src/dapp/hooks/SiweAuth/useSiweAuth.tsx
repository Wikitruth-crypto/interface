import { useState, useCallback, useEffect } from 'react';
import { useAccount, useSignMessage, useChainId, usePublicClient } from 'wagmi';
import { SiweMessage } from 'siwe';
import { type Hex } from 'viem';
import { useContractConfig, ContractName } from '@dapp/contractsConfig';
import {
    SiweMessageParams,
    SignatureRSV,
    LoginResult,
    SessionInfo,
    UseSiweAuthResult,
    SiweNetworkConfig
} from './types';
import { DEFAULT_DOMAINS } from '@dapp/constants';

/**
 * 支持的网络配置
 */
const NETWORK_CONFIGS: Record<number, SiweNetworkConfig> = {
    23294: { // Sapphire Testnet
        chainId: 23294,
        version: '1',
        defaultStatement: 'I accept the WikiTruth Terms of Service',
        defaultExpirationHours: 24
    },
    23295: { // Sapphire Mainnet
        chainId: 23295,
        version: '1',
        defaultStatement: 'I accept the WikiTruth Terms of Service',
        defaultExpirationHours: 24
    },
};



/**
 * 本地存储 key
 */
const STORAGE_KEYS = {
    TOKEN: 'siwe_auth_token',
    EXPIRES_AT: 'siwe_auth_expires_at',
    ADDRESS: 'siwe_auth_address'
};

/**
 * SIWE 认证 Hook
 * 
 * 功能：
 * 1. 生成 SIWE 消息
 * 2. 签名消息（ERC-191）
 * 3. 调用合约 login 方法获取加密 token
 * 4. 管理会话状态（本地存储）
 * 5. 验证会话有效性
 * 
 * @example
 * ```tsx
 * const { login, logout, session, isLoading } = useSiweAuth();
 * 
 * // 登录
 * const handleLogin = async () => {
 *   const result = await login({
 *     statement: '我同意服务条款',
 *     resources: ['https://api.example.com']
 *   });
 *   if (result) {
 *     console.log('登录成功，token:', result.token);
 *   }
 * };
 * 
 * // 登出
 * const handleLogout = () => {
 *   logout();
 * };
 * 
 * // 检查登录状态
 * if (session.isLoggedIn) {
 *   console.log('已登录，地址:', session.address);
 * }
 * ```
 */
export const useSiweAuth = (): UseSiweAuthResult => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { signMessageAsync } = useSignMessage();
    const publicClient = usePublicClient();
    const siweAuthConfig = useContractConfig(ContractName.SIWE_AUTH);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [session, setSession] = useState<SessionInfo>({
        isLoggedIn: false,
        token: null,
        expiresAt: null,
        address: null
    });

    /**
     * 从本地存储加载会话
     */
    useEffect(() => {
        const loadSession = () => {
            try {
                const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
                const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
                const storedAddress = localStorage.getItem(STORAGE_KEYS.ADDRESS);

                if (token && expiresAtStr && storedAddress) {
                    const expiresAt = new Date(expiresAtStr);
                    
                    // 检查是否过期
                    if (expiresAt > new Date()) {
                        setSession({
                            isLoggedIn: true,
                            token,
                            expiresAt,
                            address: storedAddress as `0x${string}`
                        });
                    } else {
                        // 已过期，清除
                        clearSession();
                    }
                }
            } catch (err) {
                console.error('加载会话失败:', err);
                clearSession();
            }
        };

        loadSession();
    }, []);

    /**
     * 清除本地存储的会话
     */
    const clearSession = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
        localStorage.removeItem(STORAGE_KEYS.ADDRESS);
        setSession({
            isLoggedIn: false,
            token: null,
            expiresAt: null,
            address: null
        });
    }, []);

    /**
     * 保存会话到本地存储
     */
    const saveSession = useCallback((token: string, expiresAt: Date, userAddress: `0x${string}`) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toISOString());
        localStorage.setItem(STORAGE_KEYS.ADDRESS, userAddress);
        
        setSession({
            isLoggedIn: true,
            token,
            expiresAt,
            address: userAddress
        });
    }, []);

    /**
     * 生成随机 nonce
     */
    const generateNonce = (): string => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    /**
     * 获取网络配置
     */
    const getNetworkConfig = useCallback((): SiweNetworkConfig => {
        return NETWORK_CONFIGS[chainId] || NETWORK_CONFIGS[23294]; // 默认使用测试网
    }, [chainId]);

    /**
     * 生成 SIWE 消息
     */
    const createSiweMessage = useCallback((params: SiweMessageParams): string => {
        const networkConfig = getNetworkConfig();
        
        // 设置默认过期时间
        const defaultExpiration = new Date();
        defaultExpiration.setHours(defaultExpiration.getHours() + networkConfig.defaultExpirationHours);

        const siweMessage = new SiweMessage({
            domain: params.domain,
            address: params.address,
            statement: params.statement || networkConfig.defaultStatement,
            uri: params.uri || `https://${params.domain}`,
            version: networkConfig.version,
            chainId: chainId,
            nonce: params.nonce || generateNonce(),
            issuedAt: params.issuedAt?.toISOString() || new Date().toISOString(),
            expirationTime: params.expirationTime?.toISOString() || defaultExpiration.toISOString(),
            notBefore: params.notBefore?.toISOString(),
            resources: params.resources || []
        });

        return siweMessage.toMessage();
    }, [chainId, getNetworkConfig]);

    /**
     * 解析签名为 RSV 结构
     */
    const parseSignature = (signature: Hex): SignatureRSV => {
        const sig = signature.slice(2);
        
        return {
            r: '0x' + sig.slice(0, 64),
            s: '0x' + sig.slice(64, 128),
            v: parseInt(sig.slice(128, 130), 16)
        };
    };

    /**
     * 调用合约 login 方法
     */
    const contractLogin = useCallback(async (
        message: string,
        signature: SignatureRSV
    ): Promise<string> => {
        if (!publicClient) {
            throw new Error('Public client 未初始化');
        }

        try {
            // 调用合约的 login 方法（view 函数）
            const result = await publicClient.readContract({
                address: siweAuthConfig.address,
                abi: siweAuthConfig.abi,
                functionName: 'login',
                args: [message, signature]
            });

            // result 是加密的 token (bytes)
            return result as string;
        } catch (err) {
            console.error('合约 login 调用失败:', err);
            throw new Error('获取认证 token 失败');
        }
    }, [publicClient, siweAuthConfig]);

    /**
     * 登录
     */
    const login = useCallback(async (
        params?: Partial<SiweMessageParams>
    ): Promise<LoginResult | null> => {
        setError(null);
        setIsLoading(true);

        try {
            // 1. 检查钱包连接
            if (!isConnected || !address) {
                throw new Error('钱包未连接，请先连接钱包');
            }

            // 2. 准备消息参数
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
                issuedAt: params?.issuedAt
            };

            console.log('📝 生成 SIWE 消息...');
            
            // 3. 生成 SIWE 消息
            const message = createSiweMessage(messageParams);
            
            console.log('✍️ 请求签名...');
            
            // 4. 签名消息
            const signatureHex = await signMessageAsync({
                message
            });
            
            // 5. 解析签名
            const signature = parseSignature(signatureHex);
            
            console.log('🔐 调用合约获取 token...');
            
            // 6. 调用合约获取 token
            const token = await contractLogin(message, signature);
            
            if (!token) {
                throw new Error('获取 token 失败');
            }

            // 7. 计算过期时间
            const expiresAt = messageParams.expirationTime || (() => {
                const date = new Date();
                date.setHours(date.getHours() + getNetworkConfig().defaultExpirationHours);
                return date;
            })();

            // 8. 保存会话
            saveSession(token, expiresAt, address);

            console.log('✅ 登录成功');

            return {
                token,
                message,
                signature,
                expiresAt
            };

        } catch (err) {
            const error = err instanceof Error ? err : new Error('登录失败');
            console.error('❌ SIWE 登录失败:', error);
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [
        isConnected,
        address,
        createSiweMessage,
        signMessageAsync,
        contractLogin,
        saveSession,
        getNetworkConfig
    ]);

    /**
     * 验证会话有效性
     */
    const validateSession = useCallback(async (): Promise<boolean> => {
        if (!session.token) {
            return false;
        }

        try {
            // 1. 检查本地过期时间
            if (session.expiresAt && session.expiresAt < new Date()) {
                clearSession();
                return false;
            }

            // 2. 调用合约验证
            if (!publicClient) {
                return false;
            }

            const isValid = await publicClient.readContract({
                address: siweAuthConfig.address,
                abi: siweAuthConfig.abi,
                functionName: 'isSessionValid',
                args: [session.token]
            });

            if (!isValid) {
                clearSession();
                return false;
            }

            return true;
        } catch (err) {
            console.error('验证会话失败:', err);
            clearSession();
            return false;
        }
    }, [session, publicClient, siweAuthConfig, clearSession]);

    /**
     * 登出
     */
    const logout = useCallback(() => {
        clearSession();
        console.log('👋 已登出');
    }, [clearSession]);

    /**
     * 重置状态
     */
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
        reset
    };
};

