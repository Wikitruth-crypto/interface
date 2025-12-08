import { Abi } from 'viem';

/**
 * 支持的链ID
 */
export enum SupportedChainId {
  SAPPHIRE_TESTNET = 23295,
  SAPPHIRE_MAINNET = 23294,
}

/**
 * 链配置接口
 */
export interface ChainConfig {
  id: SupportedChainId;
  name: string;
  network: 'testnet' | 'mainnet';
  layer: 'sapphire';
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
      webSocket?: string[];
    };
    public: {
      http: string[];
      webSocket?: string[];
    };
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet: boolean;
}

/**
 * 合约名称枚举
 */
export enum ContractName {
  // Token 合约
  OFFICIAL_TOKEN = 'OfficialToken',
  OFFICIAL_TOKEN_SECRET = 'OfficialTokenSecret',
  WROSE_SECRET = 'wROSE_Secret',
  ERC20_SECRET = 'ERC20_Secret',
  WROSE = 'wROSE',
  // USDC_SECRET = 'ERC20Secret',
  // WBTC_SECRET = 'WBTCSecret',
  // WETH_SECRET = 'WETHSercet',


  
  // 核心合约
  TRUTH_NFT = 'TruthNFT',
  EXCHANGE = 'Exchange',
  FUND_MANAGER = 'FundManager',
  TRUTH_BOX = 'TruthBox',
  ADDRESS_MANAGER = 'AddressManager',
  SIWE_AUTH = 'SiweAuth',
  USER_ID = 'UserId',
}

/**
 * 合约地址映射类型
 */
export type ContractAddresses = {
  [key in ContractName]: `0x${string}`;
};

/**
 * 合约配置接口
 */
export interface ContractConfig {
  address: `0x${string}`;
  abi: Abi;
  chainId: SupportedChainId;
}

/**
 * 完整合约配置映射
 */
export type ContractConfigs = {
  [key in ContractName]: ContractConfig;
};

/**
 * Token 元数据接口
 */
export interface TokenMetadata {
  index: number;
  name: string;
  symbol: string;
  decimals: number;
  precision: number; // 精度，用于显示小数位数
  address: `0x${string}`;
  mappingAddress?: `0x${string}`; // erc20 -> secret, secret -> erc20
  logo?: string;
  types: 'ERC20' | 'Secret';
  domainName?: string;
  mintPeriod?: number; // seconds only official token
  contractName: ContractName;
  abi: Abi;
}

/**
 * 网络合约配置映射
 */
export type NetworkContractMap = {
  [chainId in SupportedChainId]: ContractAddresses;
};

