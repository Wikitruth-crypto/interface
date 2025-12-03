import { SupportedChainId, TokenMetadata } from './types';
import { NETWORK_CONTRACTS } from './contracts';

export function getSupportedTokens_WithChainId(chainId: SupportedChainId): TokenMetadata[] {
  const addresses = NETWORK_CONTRACTS[chainId];
  
  return [
    {
      index: 0,
      name: 'WikiTruth Coin',
      symbol: 'WTRC',
      decimals: 18,
      precision: 3,
      address: addresses.OfficialToken,
      types: 'ERC20',
    },
    {
      index: 1,
      name: 'WikiTruth Coin Secret',
      symbol: 'WTRC.S',
      decimals: 18,
      precision: 3,
      address: addresses.OfficialTokenSecret,
      types: 'Secret',
    },
    {
      index: 2,
      name: 'Wrapped ROSE',
      symbol: 'wROSE',
      decimals: 18,
      precision: 3,
      address: addresses.wROSE,
      types: 'ERC20',
    },
    {
      index: 3,
      name: 'WROSE Secret',
      symbol: 'wROSE.S',
      decimals: 18,
      precision: 3,
      address: addresses.wROSE_Secret,
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
    precision: 2,
    address: addresses.OfficialToken,
    types: 'ERC20',
  };
}