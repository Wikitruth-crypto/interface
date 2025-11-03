import { IPFS_PINATA } from '@/config/env';
import { PinataConfig, GroupConfig, PinataGroupType, NetworkType } from './types';

/**
 * 获取 Pinata 基础配置
 */
export const getPinataConfig = (): PinataConfig => {
  const config: PinataConfig = {
    jwt: IPFS_PINATA.jwt,
    gateway: IPFS_PINATA.gateway,
  };

  // 验证必需配置
  if (!config.jwt) {
    throw new Error('Pinata JWT is not configured. Please set VITE_IPFS_PINTA_JWT in .env file');
  }

  if (!config.gateway) {
    throw new Error('Pinata Gateway is not configured. Please set VITE_IPFS_PINTA_Gateway in .env file');
  }

  return config;
};

/**
 * 从环境变量获取预配置的 Group IDs
 */
const getPredefinedGroupIds = (): Record<NetworkType, Record<PinataGroupType, string | undefined>> => {
  return {
    testnet: {
      MintData: IPFS_PINATA.groups.sapphire_testnet,
      ResultData: IPFS_PINATA.groups.sapphire_testnet_resultData,
      Evidence: IPFS_PINATA.groups.sapphire_testnet, // 使用相同的 testnet group
      Custom: IPFS_PINATA.groups.sapphire_testnet_custome
    },
    mainnet: {
      MintData: IPFS_PINATA.groups.sapphire_mainnet,
      ResultData: IPFS_PINATA.groups.sapphire_mainnet_resultData,
      Evidence: IPFS_PINATA.groups.sapphire_mainnet, // 使用相同的主网 group
      Custom: IPFS_PINATA.groups.sapphire_mainnet_custome
    }
  };
};

/**
 * Group 配置映射表（按网络分离）
 * 每个 Group 可配置：
 * - name: Group 名称
 * - maxSize: 最大文件大小限制
 * - keyvalues: Pinata 元数据（用于检索和分类）
 */
const GROUP_CONFIG_MAP: Record<NetworkType, Record<PinataGroupType, GroupConfig>> = {
  // 测试网配置
  testnet: {
    MintData: {
      name: 'WikiTruth-sapphire-testnet-mintData', // 与 Pinata Dashboard 中的名称一致
      maxSize: '1MB',
      keyvalues: {
        network: 'testnet',
        type: 'mint',
        project: 'wikitruth',
        category: 'mintdata'
      }
    },
    ResultData: {
      name: 'WikiTruth-sapphire-testnet-resultData',
      maxSize: '24KB',
      keyvalues: {
        network: 'testnet',
        type: 'result',
        project: 'wikitruth',
        category: 'resultdata'
      }
    },
    Evidence: {
      name: 'WikiTruth-sapphire-testnet-evidence', // 与 Pinata Dashboard 中的名称一致
      maxSize: '5MB',
      keyvalues: {
        network: 'testnet',
        type: 'evidence',
        project: 'wikitruth',
        category: 'evidence'
      }
    },
    Custom: {
      name: 'WikiTruth-sapphire-testnet-custom', // 与 Pinata Dashboard 中的名称一致
      maxSize: '5MB',
      keyvalues: {
        network: 'testnet',
        type: 'custom',
        project: 'wikitruth',
        category: 'custom'
      }
    }
  },
  
  // 主网配置
  mainnet: {
    MintData: {
      name: 'WikiTruth-sapphire-mainnet-mintData', // 与 Pinata Dashboard 中的名称一致
      maxSize: '24KB',
      keyvalues: {
        network: 'mainnet',
        type: 'mint',
        project: 'wikitruth',
        category: 'mintdata'
      }
    },
    ResultData: {
      name: 'WikiTruth-sapphire-mainnet-resultData',
      maxSize: '24KB',
      keyvalues: {
        network: 'mainnet',
        type: 'result',
        project: 'wikitruth',
        category: 'resultdata'
      }
    },
    Evidence: {
      name: 'WikiTruth-sapphire-mainnet-evidence', // 与 Pinata Dashboard 中的名称一致
      maxSize: '500MB',  // 主网证据文件限制 500MB
      keyvalues: {
        network: 'mainnet',
        type: 'evidence',
        project: 'wikitruth',
        category: 'evidence'
      }
    },
    Custom: {
      name: 'WikiTruth-sapphire-mainnet-custom', // 与 Pinata Dashboard 中的名称一致
      maxSize: '5MB',
      keyvalues: {
        network: 'mainnet',
        type: 'custom',
        project: 'wikitruth',
        category: 'custom'
      }
    }
  }
};

/**
 * 获取指定网络和 Group 的配置
 * @param network - 网络类型
 * @param groupType - Group 类型
 * @returns Group 配置对象
 */
export const getGroupConfig = (network: NetworkType, groupType: PinataGroupType): GroupConfig => {
  const config = GROUP_CONFIG_MAP[network]?.[groupType];
  
  if (!config) {
    throw new Error(`Unknown network or group type: ${network}/${groupType}`);
  }
  
  // 从环境变量获取预配置的 Group ID
  const predefinedGroups = getPredefinedGroupIds();
  const groupId = predefinedGroups[network][groupType];
  
  if (!groupId) {
    throw new Error(`Group ID not configured for ${network}/${groupType}. Please set the corresponding environment variable.`);
  }
  
  return {
    ...config,
    groupId
  };
};

/**
 * 获取预配置的 Group ID
 * @param network - 网络类型
 * @param groupType - Group 类型
 * @returns Group ID 或 undefined
 */
export const getGroupId = (network: NetworkType, groupType: PinataGroupType): string | undefined => {
  const predefinedGroups = getPredefinedGroupIds();
  return predefinedGroups[network][groupType];
};

/**
 * 解析文件大小限制字符串为字节数
 * @param sizeStr - 大小字符串（如 '5MB', '24KB'）
 * @returns 字节数
 */
export const parseFileSize = (sizeStr: string): number => {
  const units: Record<string, number> = {
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  };

  const match = sizeStr.match(/^(\d+)(KB|MB|GB)$/i);
  
  if (!match) {
    throw new Error(`Invalid file size format: ${sizeStr}`);
  }

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit.toUpperCase()];
};

