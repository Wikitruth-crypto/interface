/**
 * @deprecated 此文件已废弃，请使用新的配置系统
 * 
 * 迁移指南：
 * - 旧方式: import { Config_TruthBox } from './contractsConfig'
 * - 新方式: import { useContractConfig, ContractName } from '@/dapp/config'
 *           const config = useContractConfig(ContractName.TRUTH_BOX)
 * 
 * 新配置系统支持自动网络切换，详见 docs/config-system.md
 */

import { Abi } from 'viem';
import { getContractConfig } from './config';
import { SupportedChainId, ContractName } from './types';

export interface ContractConfigType {
    address: `0x${string}`;
    abi: Abi;
    chainId: number;
}

/**
 * @deprecated 使用 useContractConfig(ContractName.OFFICIAL_TOKEN)
 */
export const Config_OfficialToken: ContractConfigType = getContractConfig(
    ContractName.OFFICIAL_TOKEN, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.ERC20_SECRET)
 */
export const Config_ERC20Secret: ContractConfigType = getContractConfig(
    ContractName.ERC20_SECRET, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.WROSE_SECRET)
 */
export const Config_WroseSecret: ContractConfigType = getContractConfig(
    ContractName.WROSE_SECRET, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.TRUTH_BOX)
 */
export const Config_TruthBox: ContractConfigType = getContractConfig(
    ContractName.TRUTH_BOX, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.TRUTH_NFT)
 */
export const Config_TruthNFT: ContractConfigType = getContractConfig(
    ContractName.TRUTH_NFT, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.EXCHANGE)
 */
export const Config_Exchange: ContractConfigType = getContractConfig(
    ContractName.EXCHANGE, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.FUND_MANAGER)
 */
export const Config_FundManager: ContractConfigType = getContractConfig(
    ContractName.FUND_MANAGER, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.ADDRESS_MANAGER)
 */
export const Config_AddressManager: ContractConfigType = getContractConfig(
    ContractName.ADDRESS_MANAGER, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.SIWE_AUTH)
 */
export const Config_SiweAuth: ContractConfigType = getContractConfig(
    ContractName.SIWE_AUTH, 
    SupportedChainId.SAPPHIRE_TESTNET
);

/**
 * @deprecated 使用 useContractConfig(ContractName.USER_ID)
 */
export const Config_UserId: ContractConfigType = getContractConfig(
    ContractName.USER_ID, 
    SupportedChainId.SAPPHIRE_TESTNET
);
