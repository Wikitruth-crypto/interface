// 共享类型定义

// 代币信息接口
export interface TokenInfo {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
}

// 代币对接口
export interface TokenPair {
    erc20: TokenInfo;
    secret: TokenInfo | null;
    secretContractAddress: `0x${string}` | null;
    isNativeROSE: boolean; // 是否为原生 ROSE -> wROSE.S
}

// 操作按钮状态
export type ActiveButton = 'transfer' | 'burn' | 'wrap' | 'unwrap' | 'deposit' | 'withdraw' | 'approve' | null;

