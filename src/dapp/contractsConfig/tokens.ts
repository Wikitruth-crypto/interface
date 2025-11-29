import { SupportedChainId, TokenMetadata } from './types';
import { NETWORK_CONTRACTS } from './contracts';

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
      index: 0,
      name: 'WROSE Secret',
      symbol: 'WROSE.S',
      decimals: 18,
      address: addresses.WROSE_Secret,
      types: 'Secret',
    },
    {
      index: 1,
      name: 'WikiTruth Coin Secret',
      symbol: 'WTC.S',
      decimals: 18,
      address: addresses.OfficialTokenSecret,
      types: 'Secret',
    },

    // TODO add more tokens here...
  ];
}

export function getOfficialTokenConfig_WithChainId(chainId: SupportedChainId): TokenMetadata {
  const addresses = NETWORK_CONTRACTS[chainId];
  return {
    index: 0,
    name: 'WikiTruth Coin',
    symbol: 'WTC',
    decimals: 18,
    address: addresses.OfficialToken,
    types: 'ERC20',
  };
}