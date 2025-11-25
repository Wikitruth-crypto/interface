/**
 * 配置管理器 - 核心模块
 * 负责根据 chainId 自动获取和切换合约配置
 */

import { 
  SupportedChainId, 
  ContractName, 
  ContractConfig, 
  ContractConfigs, 
  ContractAddresses 
} from './types';
import { ABIS } from './abis';
import { NETWORK_CONTRACTS } from './contracts';
import { currentChainConfig, isSupportedChain } from './chains';

/**
 * 配置管理类
 */
class ConfigManager {
  private currentChainId: SupportedChainId;

  constructor(initialChainId: SupportedChainId = currentChainConfig.id) {
    this.currentChainId = initialChainId;
  }

  /**
   * 获取指定网络的所有合约地址
   */
  getContractAddresses_WithChainId(chainId?: number): ContractAddresses {
    const targetChainId = chainId ?? this.currentChainId;
    
    if (!isSupportedChain(targetChainId)) {
      console.warn(
        `Unsupported chain ID: ${targetChainId}. Using default chain: ${currentChainConfig.id}`
      );
      return NETWORK_CONTRACTS[currentChainConfig.id];
    }

    return NETWORK_CONTRACTS[targetChainId];
  }

  /**
   * 获取单个合约的配置
   * 
   * 注意：此方法保证总是返回有效配置，不会返回 undefined
   * Mainnet 暂时使用 Testnet 配置，避免返回空值
   */
  getContractConfig(
    contractName: ContractName,
    chainId?: number
  ): ContractConfig {
    const targetChainId = (chainId ?? this.currentChainId) as SupportedChainId;
    const addresses = this.getContractAddresses_WithChainId(targetChainId);
    const address = addresses[contractName];

    return {
      address,
      abi: ABIS[contractName],
      chainId: targetChainId,
    };
  }

  /**
   * 获取当前网络的所有合约配置
   * 
   * 注意：保证总是返回完整的配置对象
   */
  getAllContractConfigs_WithChainId(chainId?: number): ContractConfigs {
    const targetChainId = chainId ?? this.currentChainId;
    const configs: Partial<ContractConfigs> = {};

    // 遍历所有合约名称，生成配置
    Object.values(ContractName).forEach((contractName) => {
      configs[contractName as ContractName] = this.getContractConfig(
        contractName as ContractName,
        targetChainId
      );
    });

    return configs as ContractConfigs;
  }
}

/**
 * 导出单例实例
 */
export const configManager = new ConfigManager();

/**
 * 便捷函数：获取合约配置
 */
export function getContractConfig(
  contractName: ContractName,
  chainId?: number
): ContractConfig {
  return configManager.getContractConfig(contractName, chainId);
}

/**
 * 便捷函数：获取合约地址
 */
export function getContractAddress(
  contractName: ContractName,
  chainId?: number
): `0x${string}` {
  return configManager.getContractConfig(contractName, chainId).address;
}

/**
 * 便捷函数：获取所有合约地址
 */
export function getContractAddresses_WithChainId(chainId?: number): ContractAddresses {
  return configManager.getContractAddresses_WithChainId(chainId);
}


export function getAllContractConfigs_WithChainId(chainId?: number): ContractConfigs {
  return configManager.getAllContractConfigs_WithChainId(chainId);
}

