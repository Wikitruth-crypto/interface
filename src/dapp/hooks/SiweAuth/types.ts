/**
 * SIWE 认证相关类型定义
 * 用于前端 SIWE (Sign-In with Ethereum) 认证流程
 */

/**
 * 签名 RSV 结构（与合约兼容）
 */
export interface SignatureRSV {
    r: string;
    s: string;
    v: number;
}

/**
 * SIWE 消息参数
 */
export interface SiweMessageParams {
    domain: string;
    address: `0x${string}`;
    statement?: string;
    uri?: string;
    resources?: string[];
    nonce?: string;
    expirationTime?: Date; // 过期时间，单位：秒
    notBefore?: Date;
    issuedAt?: Date;
}

/**
 * SIWE 网络配置
 */
export interface SiweNetworkConfig {
    chainId: number;
    version: string;
    defaultStatement: string;
    defaultExpirationHours: number;
}

/**
 * 登录结果
 */
export interface LoginResult {
    sessionInfo: SessionInfo;
    token: string;
    /** SIWE 消息 */
    message: string;
    /** 签名 */
    signature: SignatureRSV;
    expiresAt: Date;
}

/**
 * 会话信息
 */
export interface SessionInfo {
    isLoggedIn: boolean;
    token: string | null;
    expiresAt: Date | null;
    address: `0x${string}` | null;
}

/**
 * 基础 Hook 返回值（仅包含登录相关功能）
 */
export interface UseSiweAuthBaseResult {
    login: (params?: Partial<SiweMessageParams>) => Promise<LoginResult | null>;
    isLoading: boolean;
    error: Error | null;
    reset: () => void;
}


