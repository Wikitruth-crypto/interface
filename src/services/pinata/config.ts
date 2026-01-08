import { IPFS_PINATA } from '@/config/env';
import { PinataConfig, GroupConfig, PinataGroupType, NetworkType } from './types';

/**
 * Get Pinata Base Configuration
 */
export const getPinataConfig = (): PinataConfig => {
  const config: PinataConfig = {
    jwt: IPFS_PINATA.jwt,
    gateway: IPFS_PINATA.gateway,
  };

  // Verify required configuration
  if (!config.jwt) {
    throw new Error('Pinata JWT is not configured. Please set VITE_IPFS_PINTA_JWT in .env file');
  }

  if (!config.gateway) {
    throw new Error('Pinata Gateway is not configured. Please set VITE_IPFS_PINTA_Gateway in .env file');
  }

  return config;
};

/**
 * Get pre-configured Group IDs from environment variables
 */
const getPredefinedGroupIds = (): Record<NetworkType, Record<PinataGroupType, string | undefined>> => {
  return {
    testnet: {
      MintData: IPFS_PINATA.groups.sapphire_testnet,
      ResultData: IPFS_PINATA.groups.sapphire_testnet_resultData,
      Evidence: IPFS_PINATA.groups.sapphire_testnet, // Use the same testnet group
      Custom: IPFS_PINATA.groups.sapphire_testnet_custome
    },
    mainnet: {
      MintData: IPFS_PINATA.groups.sapphire_mainnet,
      ResultData: IPFS_PINATA.groups.sapphire_mainnet_resultData,
      Evidence: IPFS_PINATA.groups.sapphire_mainnet, // Use the same mainnet group
      Custom: IPFS_PINATA.groups.sapphire_mainnet_custome
    }
  };
};

/**
 * Group Configuration Map (Separated by Network)
 * Each Group can configure:
 * - name: Group Name
 * - maxSize: Max file size limit
 * - keyvalues: Pinata metadata (for retrieval and classification)
 */
const GROUP_CONFIG_MAP: Record<NetworkType, Record<PinataGroupType, GroupConfig>> = {
  // Testnet Configuration
  testnet: {
    MintData: {
      name: 'WikiTruth-sapphire-testnet-mintData', // Consistent with name in Pinata Dashboard
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
      name: 'WikiTruth-sapphire-testnet-evidence', // Consistent with name in Pinata Dashboard
      maxSize: '5MB',
      keyvalues: {
        network: 'testnet',
        type: 'evidence',
        project: 'wikitruth',
        category: 'evidence'
      }
    },
    Custom: {
      name: 'WikiTruth-sapphire-testnet-custom', // Consistent with name in Pinata Dashboard
      maxSize: '5MB',
      keyvalues: {
        network: 'testnet',
        type: 'custom',
        project: 'wikitruth',
        category: 'custom'
      }
    }
  },
  
  // Mainnet Configuration
  mainnet: {
    MintData: {
      name: 'WikiTruth-sapphire-mainnet-mintData', // Consistent with name in Pinata Dashboard
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
      name: 'WikiTruth-sapphire-mainnet-evidence', // Consistent with name in Pinata Dashboard
      maxSize: '500MB',  // Mainnet evidence file limit 500MB
      keyvalues: {
        network: 'mainnet',
        type: 'evidence',
        project: 'wikitruth',
        category: 'evidence'
      }
    },
    Custom: {
      name: 'WikiTruth-sapphire-mainnet-custom', // Consistent with name in Pinata Dashboard
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
 * Get configuration for specified network and Group
 * @param network - Network type
 * @param groupType - Group type
 * @returns Group configuration object
 */
export const getGroupConfig = (network: NetworkType, groupType: PinataGroupType): GroupConfig => {
  const config = GROUP_CONFIG_MAP[network]?.[groupType];
  
  if (!config) {
    throw new Error(`Unknown network or group type: ${network}/${groupType}`);
  }
  
  // Get pre-configured Group ID from environment variables
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
 * Get pre-configured Group ID
 * @param network - Network type
 * @param groupType - Group type
 * @returns Group ID or undefined
 */
export const getGroupId = (network: NetworkType, groupType: PinataGroupType): string | undefined => {
  const predefinedGroups = getPredefinedGroupIds();
  return predefinedGroups[network][groupType];
};

/**
 * Parse file size limit string to bytes
 * @param sizeStr - Size string (e.g. '5MB', '24KB')
 * @returns Bytes
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

