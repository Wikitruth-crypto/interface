
/**
 * Signature RSV structure (compatible with contract)
 */
export interface SignatureRSV {
    r: string;
    s: string;
    v: number;
}

/**
 * SIWE message parameters
 */
export interface SiweMessageParams {
    domain: string;
    address: `0x${string}`;
    statement?: string;
    uri?: string;
    resources?: string[];
    nonce?: string;
    expirationTime?: Date; // Expiration time, unit: seconds
    notBefore?: Date;
    issuedAt?: Date;
}

/**
 * SIWE network configuration
 */
export interface SiweNetworkConfig {
    chainId: number;
    version: string;
    defaultStatement: string;
    defaultExpirationHours: number;
}

/**
 * Login result
 */
export interface LoginResult {
    sessionInfo: SessionInfo;
    token: string;
    /** SIWE message */
    message: string;
    /** Signature */
    signature: SignatureRSV;
    expiresAt: Date;
}

/**
 * Session information
 */
export interface SessionInfo {
    isLoggedIn: boolean;
    token: string | null;
    expiresAt: Date | null;
    address: `0x${string}` | null;
}

/**
 * Basic Hook return value (only contains login related functionality)
 */
export interface UseSiweAuthBaseResult {
    login: (params?: Partial<SiweMessageParams>) => Promise<LoginResult | null>;
    isLoading: boolean;
    error: Error | null;
    reset: () => void;
}


