import { ContractName, SupportedChainId, TokenMetadata } from './types';
import { NETWORK_CONTRACTS } from './contracts';
import { ABIS } from './chain-23295/abis';

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
      mappingAddress: addresses.OfficialTokenSecret,
      types: 'ERC20',
      contractName: ContractName.OFFICIAL_TOKEN,
      abi: ABIS[ContractName.OFFICIAL_TOKEN],
    },
    {
      index: 1,
      name: 'WikiTruth Coin Secret',
      symbol: 'WTRC.S',
      decimals: 18,
      precision: 3,
      address: addresses.OfficialTokenSecret,
      mappingAddress: addresses.OfficialToken,
      types: 'Secret',
      domainName: "Secret ERC20 Token",
      contractName: ContractName.OFFICIAL_TOKEN_SECRET,
      abi: ABIS[ContractName.OFFICIAL_TOKEN_SECRET],
    },
    {
      index: 2,
      name: 'Wrapped ROSE',
      symbol: 'wROSE',
      decimals: 18,
      precision: 3,
      address: addresses.wROSE,
      mappingAddress: addresses.wROSE_Secret,
      types: 'ERC20',
      contractName: ContractName.WROSE,
      abi: ABIS[ContractName.WROSE],
    },
    {
      index: 3,
      name: 'WROSE Secret',
      symbol: 'wROSE.S',
      decimals: 18,
      precision: 3,
      address: addresses.wROSE_Secret,
      mappingAddress: addresses.wROSE,
      types: 'Secret',
      domainName: "Secret ROSE Token",
      contractName: ContractName.WROSE_SECRET,
      abi: ABIS[ContractName.WROSE_SECRET],
    },
    
    
    // TODO add more tokens here...
  ];
}

export function getOfficialTokenConfig_WithChainId(chainId: SupportedChainId): TokenMetadata {
  const addresses = NETWORK_CONTRACTS[chainId];
  return {
    index: 0,
    name: 'WikiTruth Coin',
    symbol: 'WTRC',
    decimals: 18,
    precision: 3,
    address: addresses.OfficialToken,
    mappingAddress: addresses.OfficialTokenSecret,
    types: 'ERC20',
    contractName: ContractName.OFFICIAL_TOKEN,
    abi: ABIS[ContractName.OFFICIAL_TOKEN],
  };
}