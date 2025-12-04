// 共享类型定义

// 代币信息接口
export interface TokenInfo {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
}

// 代币对接�?
export interface TokenPair {
    erc20: TokenInfo;
    secret: TokenInfo | null;
    secretContractAddress: `0x${string}` | null;
    isNativeROSE: boolean; // 是否为原�?ROSE -> wROSE.S
}

// 操作按钮状�?
export type ActiveButton = 'transfer' | 'burn' | 'wrap' | 'unwrap' | 'deposit' | 'withdraw' | 'approve' | null;

export type writeStatus = 'idle' | 'pending' | 'success' | 'error'; // 与 useWriteToken 的 status 类型一致

