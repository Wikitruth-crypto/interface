import { ContractAddresses } from '../types';
import { TESTNET_ADDRESSES } from './testnet';

export const MAINNET_ADDRESSES: ContractAddresses = {
  ...TESTNET_ADDRESSES, // TODO: temporarily use Testnet configuration
};

