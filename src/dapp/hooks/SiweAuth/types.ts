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
    expirationTime?: Date;
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
    /** 会话信息 */
    sessionInfo: SessionInfo;
    /** 认证 token（加密的） */
    token: string;
    /** SIWE 消息 */
    message: string;
    /** 签名 */
    signature: SignatureRSV;
    /** 过期时间 */
    expiresAt: Date;
}

/**
 * 会话信息
 */
export interface SessionInfo {
    /** 是否已登录 */
    isLoggedIn: boolean;
    /** 认证 token */
    token: string | null;
    /** 过期时间 */
    expiresAt: Date | null;
    /** 用户地址 */
    address: `0x${string}` | null;
}

/**
 * 基础 Hook 返回值（仅包含登录相关功能）
 */
export interface UseSiweAuthBaseResult {
    /** 登录（生成消息、签名、获取token） */
    login: (params?: Partial<SiweMessageParams>) => Promise<LoginResult | null>;
    /** 是否正在处理 */
    isLoading: boolean;
    /** 错误信息 */
    error: Error | null;
    /** 重置状态 */
    reset: () => void;
}


