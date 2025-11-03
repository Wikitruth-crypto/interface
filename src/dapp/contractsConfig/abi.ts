/**
 * @deprecated 此文件已废弃，请使用新的配置系统
 * 
 * 迁移指南：
 * - 旧方式: import { ABI_TruthBox } from './abi'
 * - 新方式: import { ABIS, ContractName } from '@/dapp/config'
 *           const abi = ABIS[ContractName.TRUTH_BOX]
 * 
 * 或者直接使用 Hook：
 *   const config = useContractConfig(ContractName.TRUTH_BOX)
 *   const abi = config.abi
 * 
 * 详见 docs/config-system.md
 */

import { ABIS } from './abis';
import { ContractName } from './types';

/**
 * @deprecated 使用 ABIS[ContractName.OFFICIAL_TOKEN]
 */
export const ABI_OfficialToken: any[] = ABIS[ContractName.OFFICIAL_TOKEN] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.ERC20_SECRET]
 */
export const ABI_ERC20Secret: any[] = ABIS[ContractName.ERC20_SECRET] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.WROSE_SECRET]
 */
export const ABI_WroseSecret: any[] = ABIS[ContractName.WROSE_SECRET] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.TRUTH_BOX]
 */
export const ABI_TruthBox: any[] = ABIS[ContractName.TRUTH_BOX] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.TRUTH_NFT]
 */
export const ABI_TruthNFT: any[] = ABIS[ContractName.TRUTH_NFT] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.EXCHANGE]
 */
export const ABI_Exchange: any[] = ABIS[ContractName.EXCHANGE] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.FUND_MANAGER]
 */
export const ABI_FundManager: any[] = ABIS[ContractName.FUND_MANAGER] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.ADDRESS_MANAGER]
 */
export const ABI_AddressManager: any[] = ABIS[ContractName.ADDRESS_MANAGER] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.SIWE_AUTH]
 */
export const ABI_SiweAuth: any[] = ABIS[ContractName.SIWE_AUTH] as any[];

/**
 * @deprecated 使用 ABIS[ContractName.USER_ID]
 */
export const ABI_UserId: any[] = ABIS[ContractName.USER_ID] as any[];
