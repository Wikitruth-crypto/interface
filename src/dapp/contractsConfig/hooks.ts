/**
 * React Hooks - 用于在组件中获取合约配置
 */

import { useMemo, useEffect } from 'react';
// import { usePublicClient, } from 'wagmi';
// import { useWalletContext } from '../context/useAccount/WalletContext';
import {
  ContractName,
  ContractConfig,
  ContractConfigs,
  ContractAddresses,
  SupportedChainId,
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
import { useChainId } from 'wagmi';


export function useAllContractAddresses(): ContractAddresses {
  const chainId = useChainId();

  return useMemo(() => {
    return getContractAddresses_WithChainId(chainId);
  }, [chainId]);
}

export function useContractConfig(contractName: ContractName): ContractConfig {
  const chainId = useChainId();

  return useMemo(() => {
    return getContractConfig(contractName, chainId);
  }, [contractName, chainId]);
}

export function useAllContractConfigs(): ContractConfigs {
  const chainId = useChainId();

  return useMemo(() => {
    return getAllContractConfigs_WithChainId(chainId);
  }, [chainId]);
}

export function useSupportedTokens(): TokenMetadata[] {
  const chainId = useChainId();

  return useMemo(() => {
    return getSupportedTokens_WithChainId(chainId);
  }, [chainId]);
}

export function useContractAddress(contractName: ContractName): `0x${string}` {
  const config = useContractConfig(contractName);
  return config.address;
}

export function useChainConfig(): ChainConfig {
  const chainId = useChainId();
  return useMemo(() => {
    const chainConfig = getChainConfig(chainId);
    if (!chainConfig) {
      throw new Error(`Chain config not found for chainId: ${chainId}`);
    }
    return chainConfig;
  }, [chainId]);
}