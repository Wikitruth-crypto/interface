/** @file Wrappers around generated API */

import axios, { AxiosResponse } from 'axios'
import { getTokensForScope, paraTimesConfig } from '../config'
import * as generated from './generated/api'
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  // Account,
  EvmToken,
  // EvmTokenType,
  GetRuntimeAccountsAddress,
  HumanReadableErrorResponse,
  NotFoundErrorResponse,
  Runtime,
  RuntimeAccount,
  RuntimeEventType,
} from './generated/api'
import {
  base64ToHex,
  // getAccountSize,
  getEthAccountAddressFromBase64,
  getEthAccountAddressFromPreimage,
  getOasisAddressOrNull,
  isValidEthAddress,
} from '../app/utils/helpers'
// Removed proposal-related imports - not needed for Sapphire-only
import { Network } from '../types/network'
import { SearchScope } from '../types/searchScope'
import { Ticker } from '../types/ticker'
import { getRPCAccountBalances } from '../app/utils/getRPCAccountBalances'
import { toChecksumAddress } from '@ethereumjs/util'
import { fromBaseUnits } from '../app/utils/number-utils'
// Removed consensus transaction utilities - not needed for Sapphire-only
// import { API_MAX_TOTAL_COUNT } from '../config'
// import { hasTextMatchesForAll } from '../app/utils/text-matching'
import { decodeAbiParameters } from 'viem'
import * as oasis from '@oasisprotocol/client'
import { yamlDump } from '../app/utils/yamlDump'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

export type HasScope = SearchScope

// TODO: Remove when API is updated
export interface EntityMetadata {
  v: number
  serial: number
  name?: string
  url?: string
  email?: string
  keybase?: string
  twitter?: string
}

declare module './generated/api' {
  export interface RuntimeTransaction {
    network: Network
    layer: Runtime
  }

  export interface RuntimeBlock {
    network: Network
    layer: Runtime
  }

  export interface RuntimeAccount {
    network: Network
    layer: Runtime
    address_eth?: string
    tokenBalances: Partial<Record<EvmTokenType, generated.RuntimeEvmBalance[]>>
  }

  export interface RuntimeEvent {
    network: Network
    layer: Runtime
  }

  export interface EvmAbiParam {
    /** Added to fields that are likely an amount in tokens */
    evm_token?: EvmEventToken
    value_raw?: string
  }

  export interface EvmToken {
    network: Network
    layer: Runtime
  }

  export interface BareTokenHolder {
    network: Network
    layer: Runtime
    rank: number
  }

  // Removed RoflApp interface - ROFL support removed
}

export const isAccountEmpty = (account: RuntimeAccount) => {
  const { balances, evm_balances, stats } = account
  const { total_received, total_sent, num_txns } = stats
  const hasNoBalances = [...balances, ...evm_balances].every(b => b.balance === '0' || b.balance === '0.0')
  const hasNoTransactions = total_received === '0' && total_sent === '0' && num_txns === 0
  return hasNoBalances && hasNoTransactions
}

export const isAccountNonEmpty = (account: RuntimeAccount) => !isAccountEmpty(account)

export const groupAccountTokenBalances = (account: Omit<RuntimeAccount, 'tokenBalances'>): RuntimeAccount => {
  const tokenBalances: Partial<Record<generated.EvmTokenType, generated.RuntimeEvmBalance[]>> = {}
  account.evm_balances.forEach(balance => {
    if (balance.token_type) {
      tokenBalances[balance.token_type] ??= []
      tokenBalances[balance.token_type]!.push(balance)
    }
  })

  return {
    ...account,
    tokenBalances,
  }
}

function arrayify<T>(arrayOrItem: null | undefined | T | T[]): T[] {
  if (arrayOrItem == null) return []
  if (!Array.isArray(arrayOrItem)) return [arrayOrItem]
  return arrayOrItem
}

// Removed useGetConsensusTransactions - consensus support removed

const adjustRuntimeTransactionMethod = (
  method: string | undefined,
  isLikelyNativeTokenTransfer: boolean | undefined,
) => (isLikelyNativeTokenTransfer ? 'accounts.Transfer' : method)

/** Replace "" with native denomination, and prohibit unknown denominations */
function normalizeSymbol(rawSymbol: string | '' | undefined, scope: SearchScope) {
  const symbol = rawSymbol || getTokensForScope(scope)[0].ticker
  const whitelistedTickers = getTokensForScope(scope).map(a => a.ticker)
  return whitelistedTickers.includes(symbol as Ticker) ? symbol : 'n/a'
}

/** Returns checksummed maybeMatchingEthAddr if it matches oasisAddress when converted */
function fallbackEthAddress(
  oasisAddress: generated.Address | undefined,
  maybeMatchingEthAddr: generated.EthOrOasisAddress | undefined,
): `0x${string}` | undefined {
  if (
    oasisAddress &&
    maybeMatchingEthAddr &&
    isValidEthAddress(maybeMatchingEthAddr) &&
    getOasisAddressOrNull(maybeMatchingEthAddr) === oasisAddress
  ) {
    return toChecksumAddress(maybeMatchingEthAddr)
  }
}

export const useGetRuntimeTransactions: typeof generated.useGetRuntimeTransactions = (
  network,
  runtime,
  params?,
  options?,
) => {
  return generated.useGetRuntimeTransactions(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) =>
          transformRuntimeTransactionList(data, network, runtime, status, params?.rel),
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

// Removed useGetConsensusTransactionsTxHash - consensus support removed

export const useGetRuntimeTransactionsTxHash: typeof generated.useGetRuntimeTransactionsTxHash = (
  network,
  runtime,
  txHash,
  options?,
) => {
  // Sometimes we will call this with an undefined txHash, so we must be careful here.
  const actualHash = txHash?.startsWith('0x') ? txHash.substring(2) : txHash
  return generated.useGetRuntimeTransactionsTxHash(network, runtime, actualHash, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) =>
          transformRuntimeTransactionList(data, network, runtime, status),
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

// Removed useGetConsensusAccountsAddress - consensus support removed

export const useGetRuntimeAccountsAddress: typeof generated.useGetRuntimeAccountsAddress = (
  network,
  runtime,
  address,
  options,
) => {
  const queryKey =
    (options?.query?.queryKey as QueryKey | undefined) ??
    generated.getGetRuntimeAccountsAddressQueryKey(network, runtime, address)
  const query = generated.useGetRuntimeAccountsAddress(network, runtime, address, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      queryKey,
      enabled: !!address && (options?.query?.enabled ?? true),
    },
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return groupAccountTokenBalances({
            ...data,
            address_eth:
              getEthAccountAddressFromPreimage(data.address_preimage) ||
              fallbackEthAddress(data.address, address),
            evm_contract: data.evm_contract && {
              ...data.evm_contract,
              eth_creation_tx: data.evm_contract.eth_creation_tx
                ? `0x${data.evm_contract.eth_creation_tx}`
                : undefined,
            },
            evm_balances: (data.evm_balances || [])
              .filter(token => token.balance) // TODO: why do we filter for this? According to the API it must be there
              .map(token => {
                return {
                  ...token,
                  balance: fromBaseUnits(token.balance, token.token_decimals),
                }
              }),
            balances: (data.balances || [])
              .filter(token => token.balance) // TODO: why do we filter for this? According to the API it must be there
              .map(token => {
                return {
                  ...token,
                  balance: fromBaseUnits(token.balance, token.token_decimals),
                }
              }),
            layer: runtime,
            network,
            stats: {
              ...data.stats,
              total_received: data.stats?.total_received
                ? fromBaseUnits(data.stats?.total_received, paraTimesConfig[runtime].decimals)
                : '0',
              total_sent: data.stats?.total_sent
                ? fromBaseUnits(data.stats?.total_sent, paraTimesConfig[runtime].decimals)
                : '0',
            },
          })
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  }) as UseQueryResult<
    Awaited<ReturnType<typeof GetRuntimeAccountsAddress>>,
    HumanReadableErrorResponse | NotFoundErrorResponse
  > & { queryKey: QueryKey }

  const runtimeAccount = query.data?.data

  // TODO: Remove after account balances on Nexus are in sync with the node
  const oasisAddress = getOasisAddressOrNull(address)
  const rpcAccountBalances = useQuery({
    enabled: !!oasisAddress,
    queryKey: [oasisAddress, network, runtime],
    queryFn: async () => {
      if (!oasisAddress) throw new Error('Needed to fix types - see `enabled`')
      return await getRPCAccountBalances(oasisAddress, { network: network, layer: runtime })
    },
  }).data

  const data =
    rpcAccountBalances && runtimeAccount
      ? {
          ...runtimeAccount,
          balances: rpcAccountBalances,
        }
      : runtimeAccount

  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          data,
        }
      : query.data,
    // TypeScript complaining for no good reason
  } as any
}

const MAX_LOADED_ADDRESSES = 100
const MASS_LOAD_INDEXES = [...Array(MAX_LOADED_ADDRESSES).keys()]

type RuntimeTarget = {
  network: Network
  layer: Runtime
  address: string
}

export const useGetRuntimeAccountsAddresses = (
  targets: RuntimeTarget[] | undefined = [],
  queryOptions: { enabled: boolean },
) => {
  const queries = MASS_LOAD_INDEXES.map((i): RuntimeTarget | undefined => targets[i]).map(target =>
    // The number of iterations is constant here, so we will always call the hook the same number.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    {
      const network = target?.network ?? 'mainnet'
      const layer = target?.layer ?? 'sapphire'
      const address = target?.address ?? ''
      return useGetRuntimeAccountsAddress(network, layer, address, {
        query: {
          queryKey: generated.getGetRuntimeAccountsAddressQueryKey(network, layer, address),
          enabled: queryOptions.enabled && !!target?.address,
        },
      })
    },
  )
  return {
    isLoading: !!targets?.length && queries.some(query => query.isLoading && query.fetchStatus !== 'idle'),
    isError: queries.some(query => query.isError) || targets?.length > MAX_LOADED_ADDRESSES,
    data: queries.map(query => query.data?.data).filter(account => !!account) as RuntimeAccount[],
  }
}

// Removed useGetConsensusAccountsAddresses - consensus support removed

// Removed useGetConsensusBlockByHeight and useGetConsensusBlockByHash - consensus support removed

// TODO: replace with an appropriate API
export function useGetRuntimeBlockByHeight(
  network: Network,
  runtime: generated.Runtime,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const params: generated.GetRuntimeBlocksParams = { to: blockHeight, limit: 1 }
  const result = generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    network,
    runtime,
    params,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          function (data: generated.RuntimeBlockList, headers, status) {
            if (status !== 200) return data
            const block = data.blocks[0]
            if (!block || block.round !== blockHeight) {
              throw new axios.AxiosError('not found', 'ERR_BAD_REQUEST', this, null, {
                status: 404,
                statusText: 'not found',
                config: this,
                data: 'not found',
                headers: {},
              })
            }
            return {
              ...block,
              layer: runtime,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

export function useGetRuntimeBlockByHash(
  network: Network,
  runtime: generated.Runtime,
  blockHash: string,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const params: generated.GetRuntimeBlocksParams = { hash: blockHash }
  const result = generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    network,
    runtime,
    params,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          function (data: generated.RuntimeBlockList, headers, status) {
            if (status !== 200) return data
            const block = data.blocks[0]
            if (!block || block.hash !== blockHash) {
              throw new axios.AxiosError('not found', 'ERR_BAD_REQUEST', this, null, {
                status: 404,
                statusText: 'not found',
                config: this,
                data: 'not found',
                headers: {},
              })
            }
            return {
              ...block,
              layer: runtime,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

// Removed useGetConsensusBlocks - consensus support removed

export const useGetRuntimeBlocks: typeof generated.useGetRuntimeBlocks = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeBlocks(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeBlockList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            blocks: data.blocks.map(block => {
              return {
                ...block,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokens: typeof generated.useGetRuntimeEvmTokens = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeEvmTokens(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      // Removed paramSerializerWithComma - was only used for ROFL functions
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.EvmTokenList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            evm_tokens: data.evm_tokens.map(token => {
              return {
                ...token,
                total_supply: token.total_supply
                  ? fromBaseUnits(token.total_supply, token.decimals || 0)
                  : undefined,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokensAddress: typeof generated.useGetRuntimeEvmTokensAddress = (
  network,
  runtime,
  address,
  options,
) => {
  const queryKey =
    (options?.query?.queryKey as QueryKey | undefined) ??
    generated.getGetRuntimeEvmTokensAddressQueryKey(network, runtime, address)
  return generated.useGetRuntimeEvmTokensAddress(network, runtime, address, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      queryKey,
      enabled: options?.query?.enabled ?? true,
    },
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: EvmToken, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            total_supply: data.total_supply
              ? fromBaseUnits(data.total_supply, data.decimals || 0)
              : undefined,
            network,
            layer: runtime,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

const fixChecksumAddressInEvmEventParam = (param: generated.EvmAbiParam): generated.EvmAbiParam =>
  param.evm_type === 'address'
    ? {
        ...param,
        value: toChecksumAddress(param.value as string),
      }
    : param

const addTokenToParams = (event: generated.RuntimeEvent) => {
  if (event.evm_token?.type === 'ERC20') {
    if (event.evm_log_name === 'Transfer' || event.evm_log_name === 'Approval') {
      const valueParam = event.evm_log_params?.[2]
      if (valueParam?.evm_type === 'uint256' && typeof valueParam.value === 'string') {
        valueParam.evm_token = event.evm_token
        valueParam.value_raw = valueParam.value
        valueParam.value = fromBaseUnits(valueParam.value, event.evm_token.decimals ?? 0)
      }
    }
    if (event.evm_log_name === 'Deposit') {
      // wROSE
      const valueParam = event.evm_log_params?.[1]
      if (valueParam?.evm_type === 'uint256' && typeof valueParam.value === 'string') {
        const nativeSymbol = getTokensForScope({ network: event.network, layer: event.layer })[0].ticker
        const nativeDecimals = paraTimesConfig[event.layer]!.decimals
        valueParam.evm_token = {
          type: event.evm_token.type,
          // These could be incorrect if function isn't payable, so add parentheses
          symbol: `(${nativeSymbol})`,
          decimals: nativeDecimals,
        }
        valueParam.value_raw = valueParam.value
        valueParam.value = fromBaseUnits(valueParam.value, nativeDecimals)
      }
    }
    if (event.evm_log_name === 'Withdrawal') {
      // wROSE
      const valueParam = event.evm_log_params?.[1]
      if (valueParam?.evm_type === 'uint256' && typeof valueParam.value === 'string') {
        valueParam.evm_token = event.evm_token
        valueParam.value_raw = valueParam.value
        valueParam.value = fromBaseUnits(valueParam.value, event.evm_token.decimals ?? 0)
      }
    }
  }
  if (event.evm_token?.type === 'ERC721') {
    if (event.evm_log_name === 'Transfer' || event.evm_log_name === 'Approval') {
      const tokenParam = event.evm_log_params?.[2]
      if (tokenParam?.evm_type === 'uint256' && typeof tokenParam.value === 'string') {
        tokenParam.evm_token = event.evm_token
      }
    }
  }
  return event
}

export const useGetRuntimeEvents: typeof generated.useGetRuntimeEvents = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeEvents(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeEventList, headers, status) => {
          if (status !== 200 || !data?.events) return data

          const normalizedEvents = data.events;
          return {
            ...data,
            events: normalizedEvents
              .map((event): generated.RuntimeEvent => {
                return {
                  ...event,
                  body: {
                    ...event.body,
                    owner_eth: event.body?.owner_eth || fallbackEthAddress(event.body.owner, params?.rel),
                    from_eth: event.body?.from_eth || fallbackEthAddress(event.body.from, params?.rel),
                    to_eth: event.body?.to_eth || fallbackEthAddress(event.body.to, params?.rel),
                    address:
                      event.type === RuntimeEventType.evmlog
                        ? getEthAccountAddressFromBase64(event.body.address)
                        : event.body.address,
                  },
                  evm_log_params: event.evm_log_params?.map(fixChecksumAddressInEvmEventParam),
                  eth_tx_hash: event.eth_tx_hash ? `0x${event.eth_tx_hash}` : undefined,
                  layer: runtime,
                  network,
                }
              })
              .map(event => {
                return addTokenToParams(event)
              })
              .map((event): generated.RuntimeEvent => {
                if (
                  event.type === RuntimeEventType.accountstransfer ||
                  event.type === RuntimeEventType.accountsmint ||
                  event.type === RuntimeEventType.accountsburn ||
                  event.type === RuntimeEventType.consensus_accountsdeposit ||
                  event.type === RuntimeEventType.consensus_accountswithdraw ||
                  event.type === RuntimeEventType.consensus_accountsdelegate ||
                  event.type === RuntimeEventType.consensus_accountsundelegate_done
                  // consensus_accountsundelegate_start doesn't contain amount
                ) {
                  return {
                    ...event,
                    body: {
                      ...event.body,
                      amount: {
                        // If denomination="" or missing then use runtime's native. Otherwise unknown (would have to get by token name?).
                        ...event.body.amount,
                        Amount: fromBaseUnits(event.body.amount.Amount, paraTimesConfig[runtime].decimals),
                        Denomination: event.body.amount.Denomination || getTokensForScope(event)[0].ticker,
                      },
                    },
                  }
                }
                return event
              }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

// Removed useGetConsensusEvents - consensus support removed

export const useGetRuntimeEvmTokensAddressHolders: typeof generated.useGetRuntimeEvmTokensAddressHolders = (
  network,
  runtime,
  address,
  params,
  options,
) => {
  return generated.useGetRuntimeEvmTokensAddressHolders(network, runtime, address, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TokenHolderList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            holders: data.holders.map((holder, index) => {
              return {
                ...holder,
                rank: index + (params?.offset ?? 0) + 1,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

// Removed useGetConsensusProposals, useGetConsensusProposalsProposalId, useGetConsensusProposalsByName - consensus support removed

// Removed all consensus-related functions and types:
// - ExtendedValidatorList
// - ValidatorAddressNameMap
// - useGetConsensusValidatorsAddressNameMap
// - useGetConsensusValidators
// - useGetConsensusValidatorsAddressHistory
// - useGetConsensusValidatorsAddress
// - useGetConsensusAccounts
// - useGetConsensusAccountsAddressDelegations
// - useGetConsensusAccountsAddressDebondingDelegations
// - useGetConsensusAccountsAddressDebondingDelegationsTo
// - useGetConsensusAccountsAddressDelegationsTo
// All consensus support has been removed - only Sapphire runtime is supported

// Removed all ROFL-related functions:
// - paramSerializerWithComma
// - useGetRuntimeRoflApps
// - useGetRuntimeRoflAppsId
// - useGetRuntimeRoflAppsIdTransactions
// - useGetRuntimeRoflAppsIdInstanceTransactions
// - useGetRuntimeRoflAppsIdInstancesRakTransactions
// ROFL support has been removed - not used in this project

function transformRuntimeTransactionList(
  data: generated.RuntimeTransactionList,
  network: Network,
  runtime: Runtime,
  status: number | undefined,
  relAddress?: generated.EthOrOasisAddress,
): generated.RuntimeTransactionList {
  if (status !== 200) return data
  return {
    ...data,
    transactions: data.transactions.map(tx => {
      const parsedSubcall = (() => {
        if (
          tx.to_eth === '0x0100000000000000000000000000000000000103' &&
          tx.body?.data &&
          !tx.encryption_envelope &&
          !tx.oasis_encryption_envelope
        ) {
          try {
            const [methodName, cborHexParams] = decodeAbiParameters(
              [{ type: 'string' }, { type: 'bytes' }],
              base64ToHex(tx.body.data) as `0x${string}`,
            )
            const shortMethodName = methodName.replace('consensus.', '')

            // Removed ROFL type comment - not used in this project
            const params = oasis.misc.fromCBOR(oasis.misc.fromHex(cborHexParams.replace('0x', ''))) as any
            try {
              if (methodName === 'consensus.Delegate') {
                if (params?.to instanceof Uint8Array) params.to = oasis.staking.addressToBech32(params.to)
                if (params?.amount?.[0] instanceof Uint8Array)
                  params.amount[0] = oasis.quantity.toBigInt(params.amount[0])
                if (params?.amount?.[1] instanceof Uint8Array)
                  params.amount[1] = oasis.misc.toStringUTF8(params.amount[1])
              }
              if (methodName === 'consensus.Undelegate') {
                if (params?.from instanceof Uint8Array)
                  params.from = oasis.staking.addressToBech32(params.from)
                if (params?.shares instanceof Uint8Array)
                  params.shares = oasis.quantity.toBigInt(params.shares)
              }
              // Removed ROFL and ROFLMarket handling - not used in this project
            } catch (e) {
              console.error('Failed to normalize subcall data', e, params, tx)
            }

            let stringifiedParams
            try {
              stringifiedParams = yamlDump(params)
            } catch (e) {
              console.error('Failed to stringify subcall data', e, params, tx)
            }
            const paramsAsAbi: generated.EvmAbiParam[] = [
              {
                name: 'body',
                evm_type: 'string',
                value: stringifiedParams ?? cborHexParams,
              },
            ]
            return { shortMethodName, methodName, cborHexParams, params, paramsAsAbi }
          } catch (e) {
            console.error('Failed to parse subcall data (might be malformed)', e, tx)
          }
        }
      })()
      // Removed parseCmd function and roflmarket transaction body processing - not used in this project
      return {
        ...tx,
        to_eth: tx.to_eth || fallbackEthAddress(tx.to, relAddress),
        eth_hash: tx.eth_hash ? `0x${tx.eth_hash}` : undefined,
        // TODO: Decimals may not be correct, should not depend on ParaTime decimals, but fee_symbol
        fee: fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals),
        fee_symbol: normalizeSymbol(tx.fee_symbol, { network, layer: runtime }),
        // TODO: Decimals may not be correct, should not depend on ParaTime decimals, but fee_symbol
        charged_fee: fromBaseUnits(tx.charged_fee, paraTimesConfig[runtime].decimals),
        // TODO: Decimals may not be correct, should not depend on ParaTime decimals, but amount_symbol
        amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
        amount_symbol: normalizeSymbol(tx.amount_symbol, { network, layer: runtime }),
        layer: runtime,
        network,
        method: adjustRuntimeTransactionMethod(tx.method, tx.is_likely_native_token_transfer),
        evm_fn_name: parsedSubcall?.shortMethodName ?? tx.evm_fn_name,
        evm_fn_params: parsedSubcall?.paramsAsAbi ?? tx.evm_fn_params,
      }
    }),
  }
}
