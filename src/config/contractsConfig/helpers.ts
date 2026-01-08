import { RuntimeScope } from '@/oasisQuery/types/searchScope'
import { ContractAddresses, ContractName, NetworkContractMap, SupportedChainId } from './types'
import { NETWORK_CONTRACTS } from './contracts'

const runtimeScopeToChainIdMap: Record<string, SupportedChainId | undefined> = {
  'mainnet.sapphire': SupportedChainId.SAPPHIRE_MAINNET,
  'testnet.sapphire': SupportedChainId.SAPPHIRE_TESTNET,
}

export const getChainIdForRuntimeScope = (scope: RuntimeScope): SupportedChainId | undefined =>
  runtimeScopeToChainIdMap[`${scope.network}.${scope.layer}`]

export const getContractAddressesForChain = (
  chainId: SupportedChainId,
  contractMap: NetworkContractMap = NETWORK_CONTRACTS,
): ContractAddresses => contractMap[chainId]

export const getContractAddressByScope = (
  scope: RuntimeScope,
  contract: ContractName,
  contractMap: NetworkContractMap = NETWORK_CONTRACTS,
): `0x${string}` | undefined => {
  const chainId = getChainIdForRuntimeScope(scope)
  if (!chainId) return undefined
  return contractMap[chainId]?.[contract]
}
