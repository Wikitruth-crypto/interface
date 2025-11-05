/**
 * 合约配置模块统一入口
 * 
 * 使用说明：
 * 1. 在组件中使用 Hooks：
 *    import { useContractConfig, useSupportedTokens } from '@/dapp/contracts';
 * 
 * 2. 在非组件代码中使用工具函数：
 *    import { getContractConfig, getSupportedTokens } from '@/dapp/contracts';
 * 
 * 3. 使用类型定义：
 *    import { ContractName, SupportedChainId } from '@/dapp/contracts';
 */

// 导出类型
export * from './types';

// 导出链配置
export * from './chains';

// 导出 ABI
export { ABIS, getABI } from './abis';

// 导出合约地址
export { NETWORK_CONTRACTS, TESTNET_ADDRESSES, MAINNET_ADDRESSES } from './contracts';

// 导出配置管理器和工具函数
export {
  configManager,
  getContractConfig,
  getContractAddress,
  getContractAddresses,
  getAllContractConfigs,
  isContractDeployed,
} from './config';

// 导出 Hooks
export {
  useAllContractAddresses,
  useContractConfig,
  useAllContractConfigs,
  useSupportedTokens,
  useIsTestnet,
  useContractAddress,
  useChainConfig,
} from './hooks';

// 导出 Token 配置
export {
  getSupportedTokens,
  OFFICIAL_TOKEN_CONFIG,
} from './tokens';

/**
 * ⚠️ 常量已迁移说明：
 * - 区块链常量（MAX_UINT256, ZERO_ADDRESS等）请从 '@dapp/constants' 导入
 * - IPFS 配置请从 '@dapp/config' 导入
 * - 交易相关常量（Gas, 超时等）请从 '@dapp/constants' 导入
 * 
 * 示例：
 * import { MAX_UINT256, ZERO_ADDRESS } from '@dapp/constants';
 * import { IPFS_GATEWAYS, ipfsToHttp } from '@dapp/config';
 */
