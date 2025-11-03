import { SupportedChainId, TokenMetadata } from './types';
import { NETWORK_CONTRACTS } from './contracts';

/**
 * 获取指定网络支持的代币列表
 * @param chainId - 链ID
 * @returns 支持的代币列表
 */
export function getSupportedTokens(chainId: SupportedChainId): TokenMetadata[] {
  const addresses = NETWORK_CONTRACTS[chainId];
  
  return [
    {
      index: 0,
      name: 'WikiTruth Coin',
      symbol: 'WTC',
      decimals: 3,
      address: addresses.OfficialToken,
      types: 'ERC20',
    },
    {
      index: 1,
      name: 'WROSE Secret',
      symbol: 'WROSE.S',
      decimals: 18,
      address: addresses.WroseSecret,
      types: 'Secret',
    },
  ];
}

/**
 * 官方 Token 配置
 */
export interface OfficialTokenConfig {
  decimals: number;
  mintPeriod: number; // seconds
  name: string;
  symbol: string;
  types: 'ERC20' | 'Secret';
}

export const OFFICIAL_TOKEN_CONFIG: OfficialTokenConfig = {
  decimals: 3,
  mintPeriod: 3 * 24 * 60 * 60, // 3 days in seconds
  name: 'WikiTruth Coin',
  symbol: 'WTC',
  types: 'ERC20',
};

