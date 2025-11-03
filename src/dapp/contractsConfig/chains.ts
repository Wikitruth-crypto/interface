import { ChainConfig, SupportedChainId } from './types';

/**
 * Sapphire Testnet 配置
 */
export const sapphireTestnet: ChainConfig = {
  id: SupportedChainId.SAPPHIRE_TESTNET,
  name: 'Oasis Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: {
    name: 'Testnet ROSE',
    symbol: 'TEST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.io'],
      webSocket: ['wss://testnet.sapphire.oasis.io/ws'],
    },
    public: {
      http: ['https://testnet.sapphire.oasis.io'],
      webSocket: ['wss://testnet.sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Sapphire Testnet Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.io',
    },
  },
  testnet: true,
};

/**
 * Sapphire Mainnet 配置
 */
export const sapphireMainnet: ChainConfig = {
  id: SupportedChainId.SAPPHIRE_MAINNET,
  name: 'Oasis Sapphire',
  network: 'sapphire-mainnet',
  nativeCurrency: {
    name: 'ROSE',
    symbol: 'ROSE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sapphire.oasis.io'],
      webSocket: ['wss://sapphire.oasis.io/ws'],
    },
    public: {
      http: ['https://sapphire.oasis.io'],
      webSocket: ['wss://sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Sapphire Explorer',
      url: 'https://explorer.sapphire.oasis.io',
    },
  },
  testnet: false,
};

/**
 * 所有支持的链配置
 */
export const CHAINS: Record<SupportedChainId, ChainConfig> = {
  [SupportedChainId.SAPPHIRE_TESTNET]: sapphireTestnet,
  [SupportedChainId.SAPPHIRE_MAINNET]: sapphireMainnet,
};

/**
 * 默认链（测试网）
 */
export const DEFAULT_CHAIN = sapphireTestnet;

/**
 * 根据 chainId 获取链配置
 */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAINS[chainId as SupportedChainId];
}

/**
 * 检查是否为支持的链
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in CHAINS;
}

