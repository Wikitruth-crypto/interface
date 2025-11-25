import { SupportedChainId, TokenMetadata } from './types';
import { NETWORK_CONTRACTS } from './contracts';

/**
 * 获取指定网络支持的代币列表
 * @param chainId - 链ID
 * @returns 支持的代币列表
 */
export function getSupportedTokens_WithChainId(chainId: SupportedChainId): TokenMetadata[] {
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
    {
      index: 2,
      name: 'WikiTruth Coin Secret',
      symbol: 'WTC.S',
      decimals: 18,
      address: addresses.OfficialTokenSecret,
      types: 'Secret',
    },

    // TODO 此处可以添加未来可能添加的代币
  ];
}

/**
 * 官方 Token 配置
 */
export interface OfficialTokenConfig {
  decimals: number;
  name: string;
  symbol: string;
  types: 'ERC20' | 'Secret';
  mintPeriod?: number; // seconds

}

export const OFFICIAL_TOKEN_CONFIG: OfficialTokenConfig = {
  decimals: 18,
  mintPeriod: 3 * 24 * 60 * 60, // 3 days in seconds
  name: 'WikiTruth Coin',
  symbol: 'WTC',
  types: 'ERC20',
};

