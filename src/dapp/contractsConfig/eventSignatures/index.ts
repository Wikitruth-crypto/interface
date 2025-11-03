import { ContractName } from '../types'
import { WIKI_TRUTH_EVENT_SIGNATURES } from './wikiTruthEvents'

export const CONTRACT_EVENT_SIGNATURES: Partial<Record<ContractName, readonly string[]>> = {
  [ContractName.TRUTH_BOX]: WIKI_TRUTH_EVENT_SIGNATURES,
  // [ContractName.TRUTH_NFT]: WIKI_TRUTH_EVENT_SIGNATURES,
  [ContractName.EXCHANGE]: WIKI_TRUTH_EVENT_SIGNATURES,
  [ContractName.FUND_MANAGER]: WIKI_TRUTH_EVENT_SIGNATURES,
  [ContractName.ADDRESS_MANAGER]: WIKI_TRUTH_EVENT_SIGNATURES,
  [ContractName.USER_ID]: WIKI_TRUTH_EVENT_SIGNATURES,
}

export const getContractEventSignatures = (contract: ContractName): readonly string[] | undefined =>
  CONTRACT_EVENT_SIGNATURES[contract]
