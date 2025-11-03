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
    /** 域名（如：wikitruth.eth.limo） */
    domain: string;
    /** 用户地址 */
    address: `0x${string}`;
    /** 声明文本（可选） */
    statement?: string;
    /** URI（可选） */
    uri?: string;
    /** 资源列表（可选） */
    resources?: string[];
    /** 随机数（可选，不提供则自动生成） */
    nonce?: string;
    /** 过期时间（可选，默认24小时） */
    expirationTime?: Date;
    /** 生效时间（可选） */
    notBefore?: Date;
    /** 签发时间（可选，默认当前时间） */
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
 * Hook 返回值
 */
export interface UseSiweAuthResult {
    /** 登录（生成消息、签名、获取token） */
    login: (params?: Partial<SiweMessageParams>) => Promise<LoginResult | null>;
    /** 登出（清除本地 token） */
    logout: () => void;
    /** 验证会话是否有效 */
    validateSession: () => Promise<boolean>;
    /** 会话信息 */
    session: SessionInfo;
    /** 是否正在处理 */
    isLoading: boolean;
    /** 错误信息 */
    error: Error | null;
    /** 重置状态 */
    reset: () => void;
}

