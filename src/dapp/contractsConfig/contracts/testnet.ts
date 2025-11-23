import { ContractAddresses, ContractName } from '../types';
import deployedAddresses from '../chain-23295/deployed_addresses.json';

/**
 * Sapphire Testnet (23295) 合约地址配置
 */
export const TESTNET_ADDRESSES: ContractAddresses = {
  // Token 合约
  [ContractName.OFFICIAL_TOKEN]: deployedAddresses['OfficialToken'] as `0x${string}`,
  [ContractName.OFFICIAL_TOKEN_SECRET]: deployedAddresses['OfficialToken_ERC20Secret'] as `0x${string}`,
  [ContractName.WROSE_SECRET]: deployedAddresses['WROSESecret'] as `0x${string}`,
  [ContractName.ERC20_SECRET]: deployedAddresses['ERC20Secret'] as `0x${string}`,
  // [ContractName.USDC_SECRET]: deployedAddresses['ERC20Secret'] as `0x${string}`,
  // [ContractName.WBTC_SECRET]: deployedAddresses['ERC20Secret'] as `0x${string}`,
  // [ContractName.WETH_SECRET]: deployedAddresses['ERC20Secret'] as `0x${string}`,
  
  // 核心合约（使用 Proxy 地址）
  [ContractName.TRUTH_NFT]: deployedAddresses['TruthNFT_Proxy'] as `0x${string}`,
  [ContractName.EXCHANGE]: deployedAddresses['Exchange_Proxy'] as `0x${string}`,
  [ContractName.FUND_MANAGER]: deployedAddresses['FundManager_Proxy'] as `0x${string}`,
  [ContractName.TRUTH_BOX]: deployedAddresses['TruthBox_Proxy'] as `0x${string}`,
  [ContractName.ADDRESS_MANAGER]: deployedAddresses['AddressManager_Proxy'] as `0x${string}`,
  [ContractName.SIWE_AUTH]: deployedAddresses['SiweAuth'] as `0x${string}`,
  [ContractName.USER_ID]: deployedAddresses['UserId_Proxy'] as `0x${string}`,
};

