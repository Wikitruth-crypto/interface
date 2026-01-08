import { NetworkContractMap, SupportedChainId } from '../types';
import { TESTNET_ADDRESSES } from './testnet';
import { MAINNET_ADDRESSES } from './mainnet';


export const NETWORK_CONTRACTS: NetworkContractMap = {
  [SupportedChainId.SAPPHIRE_TESTNET]: TESTNET_ADDRESSES,
  [SupportedChainId.SAPPHIRE_MAINNET]: MAINNET_ADDRESSES,
};

export { TESTNET_ADDRESSES, MAINNET_ADDRESSES };

