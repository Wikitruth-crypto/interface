import { ChainConfig, SupportedChainId } from './types';

export const sapphireTestnet: ChainConfig = {
  id: SupportedChainId.SAPPHIRE_TESTNET,
  name: 'Oasis Sapphire Testnet',
  network: 'testnet',
  layer: 'sapphire',
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

export const sapphireMainnet: ChainConfig = {
  id: SupportedChainId.SAPPHIRE_MAINNET,
  name: 'Oasis Sapphire',
  network: 'mainnet',
  layer: 'sapphire',
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

export const CHAINS: Record<SupportedChainId, ChainConfig> = {
  [SupportedChainId.SAPPHIRE_TESTNET]: sapphireTestnet,
  [SupportedChainId.SAPPHIRE_MAINNET]: sapphireMainnet,
};


export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAINS[chainId as SupportedChainId];
}

export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in CHAINS;
}

