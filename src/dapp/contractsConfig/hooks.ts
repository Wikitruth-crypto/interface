/**
 * React Hooks - 用于在组件中获取合约配置
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
  getContractAddresses_WithChainId,
  getAllContractConfigs_WithChainId,
} from './config';
import { getChainConfig} from './chains';
import { getSupportedTokens_WithChainId } from './tokens';
import { CHAIN_ID, getTokenMetadata } from './current';


export function useAllContractAddresses(): ContractAddresses {

  return useMemo(() => {
    return getContractAddresses_WithChainId(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useTokenMetadata(tokenAddress: string): TokenMetadata {
  return useMemo(() => {
    return getTokenMetadata(tokenAddress);
  }, [tokenAddress]);
}

export function useContractConfig(contractName: ContractName): ContractConfig {

  return useMemo(() => {
    return getContractConfig(contractName, CHAIN_ID);
  }, [contractName, CHAIN_ID]);
}

export function useAllContractConfigs(): ContractConfigs {

  return useMemo(() => {
    return getAllContractConfigs_WithChainId(CHAIN_ID);
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