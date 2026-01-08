/**
 * React Hooks - Used to get contract configurations in components
 */

import { useMemo } from 'react';
// import { usePublicClient, } from 'wagmi';
// import { useWalletContext } from '../context/useAccount/WalletContext';
import {
  ContractName,
  ContractConfig,
  ContractConfigs,
  ContractAddresses,
  TokenMetadata,
  ChainConfig,
} from './types';
import {
  configManager,
  getContractConfig,
  getAllContractAddresses,
  getAllContractConfigs,
} from './config';
import { getChainConfig} from './chains';
import { 
  getSupportedTokens_WithChainId,
  getAcceptedTokens_WithChainId,
  getTokenMetadata,
} from './tokens';
import { CHAIN_ID, } from './current';


export function useAllContractAddresses(): ContractAddresses {

  return useMemo(() => {
    return getAllContractAddresses(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useTokenMetadata(tokenAddress: string): TokenMetadata {
  return useMemo(() => {
    return getTokenMetadata(tokenAddress);
  }, [tokenAddress]);
}

export function useAcceptedTokens(): TokenMetadata[] {
  return useMemo(() => {
    return getAcceptedTokens_WithChainId(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useContractConfig(contractName: ContractName): ContractConfig {

  return useMemo(() => {
    return getContractConfig(contractName, CHAIN_ID);
  }, [contractName, CHAIN_ID]);
}

export function useAllContractConfigs(): ContractConfigs {

  return useMemo(() => {
    return getAllContractConfigs(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useSupportedTokens(): TokenMetadata[] {

  return useMemo(() => {
    return getSupportedTokens_WithChainId(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useContractAddress(contractName: ContractName): `0x${string}` {
  const config = useContractConfig(contractName);
  return config.address;
}

export function useChainConfig(): ChainConfig {
  return useMemo(() => {
    const chainConfig = getChainConfig(CHAIN_ID);
    if (!chainConfig) {
      throw new Error(`Chain config not found for chainId: ${CHAIN_ID}`);
    }
    return chainConfig;
  }, [CHAIN_ID]);
}