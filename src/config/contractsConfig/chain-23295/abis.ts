
import officialTokenJson from '@dapp/artifacts/contracts_23295/token/MockERC20.sol/MockERC20.json';
import erc20SecretJson from '@dapp/artifacts/contracts_23295/token/ERC20Secret.sol/ERC20Secret.json';
import wroseSecretJson from '@dapp/artifacts/contracts_23295/token/WroseSecret.sol/WroseSecret.json';

import truthBoxJson from '@dapp/artifacts/contracts_23295/TruthBox.sol/TruthBox.json';
import truthNFTJson from '@dapp/artifacts/contracts_23295/TruthNFT.sol/TruthNFT.json';
import exchangeJson from '@dapp/artifacts/contracts_23295/Exchange.sol/Exchange.json';
import fundManagerJson from '@dapp/artifacts/contracts_23295/FundManager.sol/FundManager.json';
import addressManagerJson from '@dapp/artifacts/contracts_23295/AddressManager.sol/AddressManager.json';
import siweAuthJson from '@dapp/artifacts/contracts_23295/SiweAuthWikiTruth.sol/SiweAuthWikiTruth.json';
import userIdJson from '@dapp/artifacts/contracts_23295/UserId.sol/UserId.json';

import { Abi } from 'viem';
import { ContractName } from '../types';

export const ABIS: Record<ContractName, Abi> = {
  // Token contracts
  [ContractName.OFFICIAL_TOKEN]: officialTokenJson.abi as Abi,
  [ContractName.OFFICIAL_TOKEN_SECRET]: erc20SecretJson.abi as Abi,
  [ContractName.WROSE_SECRET]: wroseSecretJson.abi as Abi,
  [ContractName.ERC20_SECRET]: erc20SecretJson.abi as Abi,
  [ContractName.WROSE]: officialTokenJson.abi as Abi,
  // [ContractName.USDC_SECRET]: erc20SecretJson.abi as Abi,
  // [ContractName.WBTC_SECRET]: erc20SecretJson.abi as Abi,
  // [ContractName.WETH_SECRET]: erc20SecretJson.abi as Abi,
  
  // Core contracts
  [ContractName.TRUTH_NFT]: truthNFTJson.abi as Abi,
  [ContractName.EXCHANGE]: exchangeJson.abi as Abi,
  [ContractName.FUND_MANAGER]: fundManagerJson.abi as Abi,
  [ContractName.TRUTH_BOX]: truthBoxJson.abi as Abi,
  [ContractName.ADDRESS_MANAGER]: addressManagerJson.abi as Abi,
  [ContractName.SIWE_AUTH]: siweAuthJson.abi as Abi,
  [ContractName.USER_ID]: userIdJson.abi as Abi,
};

export function getABI(contractName: ContractName): Abi {
  const abi = ABIS[contractName];
  if (!abi) {
    throw new Error(`ABI not found for contract: ${contractName}`);
  }
  return abi;
}

