/**
 * React Hooks - 用于在组件中获取合约配置
 */

import { useMemo, useEffect } from 'react';
import { usePublicClient, } from 'wagmi';
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
  getContractAddresses,
  getAllContractConfigs,
} from './config';
import { DEFAULT_CHAIN , getChainConfig} from './chains';
import { getSupportedTokens } from './tokens';

/**
 * Hook: 获取当前钱包连接的链ID
 */
export function useChainId(): SupportedChainId {
  // const { publicClient } = useWalletContext();
  const publicClient = usePublicClient();
  const chainId = publicClient?.chain?.id;

  return useMemo(() => {
    if (chainId && chainId in SupportedChainId) {
      return chainId as SupportedChainId;
    }
    return DEFAULT_CHAIN.id;
  }, [chainId]);
}

/**
 * Hook: 获取当前网络的所有合约地址
 * 当钱包切换网络时自动更新
 */
export function useContractAddresses(): ContractAddresses {
  const chainId = useChainId();

  // 同步更新 configManager 的 chainId
  useEffect(() => {
    configManager.setChainId(chainId);
  }, [chainId]);

  return useMemo(() => {
    return getContractAddresses(chainId);
  }, [chainId]);
}

/**
 * Hook: 获取单个合约的配置
 * 
 * Mainnet 暂时使用 Testnet 配置作为 fallback
 * 
 * @param contractName - 合约名称
 * @returns 合约配置对象（地址、ABI、chainId）
 */
export function useContractConfig(contractName: ContractName): ContractConfig {
  const chainId = useChainId();

  return useMemo(() => {
    return getContractConfig(contractName, chainId);
  }, [contractName, chainId]);
}

/**
 * Hook: 获取当前网络的所有合约配置
 * 
 */
export function useAllContractConfigs(): ContractConfigs {
  const chainId = useChainId();

  return useMemo(() => {
    return getAllContractConfigs(chainId);
  }, [chainId]);
}

/**
 * Hook: 获取当前网络支持的代币列表
 * 根据当前连接的钱包网络，返回该网络上支持的所有代币
 * @returns 支持的代币列表，包含名称、符号、精度、地址等信息
 */
export function useSupportedTokens(): TokenMetadata[] {
  const chainId = useChainId();

  return useMemo(() => {
    return getSupportedTokens(chainId);
  }, [chainId]);
}

/**
 * Hook: 检查当前网络是否为测试网
 */
export function useIsTestnet(): boolean {
  const chainId = useChainId();
  return chainId === SupportedChainId.SAPPHIRE_TESTNET;
}

/**
 * Hook: 获取特定合约的地址
 * 
 * 保证总是返回有效地址
 * 
 * @param contractName - 合约名称
 * @returns 合约地址
 */
export function useContractAddress(contractName: ContractName): `0x${string}` {
  const config = useContractConfig(contractName);
  return config.address;
}


/**
 * Hook: 获取特定链的配置
 * @param chainId - 链ID
 * @returns 链配置
 */
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