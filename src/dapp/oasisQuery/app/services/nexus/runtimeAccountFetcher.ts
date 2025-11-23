import axios from 'axios'
import { keccak256 } from 'viem'
import { stringToBytes } from 'viem/utils'
import type { RuntimeEvent,Runtime } from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { buildRuntimeEndpoint } from './endpoints'
import type { GetRuntimeEventsParams } from '../../../oasis-nexus/generated/api'

export interface RuntimeAccountFetchConfig {
  network: Network
  layer: Runtime
  address: string
  maxRecords?: number
  offset?: number
  params?: Partial<GetRuntimeEventsParams>
}

export type FetchResult<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

type Logger = Pick<typeof console, 'log' | 'error'>

const defaultLogger: Logger = console

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error)

export async function fetchRuntimeAccountInfo(
  { network, layer, address }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/accounts/${address}`)
    logger.log(`📥 Fetching account info: ${url}`)
    const response = await axios.get(url)
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got account info`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch account info: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchRuntimeAccountTransactions(
  { network, layer, address, maxRecords }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/transactions`)
    logger.log(`📥 Fetching transactions: ${url}`)
    const response = await axios.get(url, {
      params: {
        rel: address,
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.transactions?.length || 0} transactions`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch transactions: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchRuntimeAccountEvents(
  { network, layer, address, maxRecords, offset, params }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/events`)
    logger.log(`📥 Fetching events: ${url}`)
    const { limit: paramLimit, offset: paramOffset, rel: _ignoredRel, ...restParams } = params ?? {}
    const limit = paramLimit ?? maxRecords ?? 100
    const resolvedOffset = offset ?? paramOffset ?? 0
    const response = await axios.get(url, {
      params: {
        rel: address,
        limit,
        offset: resolvedOffset,
        ...restParams,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.events?.length || 0} events`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch events: ${message}`)
    return { success: false, error: message }
  }
}

export interface RuntimeEventsFetchFilters extends RuntimeAccountFetchConfig {
  pageSize: number
  startOffset?: number
  maxPages?: number
  maxResults?: number
  eventNames?: readonly string[]
  eventSignatures?: readonly string[]
  fromRound?: number
  toRound?: number
  fromTimestamp?: number
  toTimestamp?: number
  useEvmSignatureFilter?: boolean
}

const buildSignatureIndex = (signatures: readonly string[] | undefined) => {
  const map = new Map<string, { topic: `0x${string}` }>()
  if (!signatures) return map
  for (const declaration of signatures) {
    const match = /^event\s+(\w+)\((.*)\)\s*$/.exec(declaration.trim())
    if (!match) continue
    const [, name, params] = match
    const signature = `${name}(${params})`
    const topic = keccak256(stringToBytes(signature)) as `0x${string}`
    map.set(name, { topic })
  }
  return map
}

export async function fetchRuntimeEventsWithFilters(
  options: RuntimeEventsFetchFilters,
  logger: Logger = defaultLogger,
): Promise<{ events: RuntimeEvent[]; pagesFetched: number }> {
  const {
    pageSize,
    startOffset = 0,
    maxPages,
    maxResults,
    eventNames,
    eventSignatures,
    fromRound,
    toRound,
    fromTimestamp,
    toTimestamp,
    useEvmSignatureFilter,
    params,
    ...baseConfig
  } = options

  const signatureIndex = buildSignatureIndex(eventSignatures)
  const evmLogSignature =
    useEvmSignatureFilter && eventNames && eventNames.length === 1
      ? signatureIndex.get(eventNames[0])?.topic.slice(2)
      : undefined

  let offset = startOffset
  let pagesFetched = 0
  const collected: RuntimeEvent[] = []
  let shouldStop = false

  while (!shouldStop) {
    if (maxPages !== undefined && pagesFetched >= maxPages) {
      break
    }

    const fetchResult = await fetchRuntimeAccountEvents(
      {
        ...baseConfig,
        maxRecords: pageSize,
        offset,
        params: {
          ...params,
          evm_log_signature: evmLogSignature ?? params?.evm_log_signature,
        },
      },
      logger,
    )

    if (!fetchResult.success) {
      throw new Error(fetchResult.error)
    }

    const eventsBatch = (fetchResult.data?.events ?? []) as RuntimeEvent[]
    if (!eventsBatch.length) {
      break
    }

    for (const event of eventsBatch) {
      const eventRound = event.round
      const eventTimestamp = Math.floor(new Date(event.timestamp).getTime() / 1000)

      if (toRound !== undefined && eventRound > toRound) {
        continue
      }
      if (toTimestamp !== undefined && eventTimestamp > toTimestamp) {
        continue
      }
      if (fromRound !== undefined && eventRound < fromRound) {
        shouldStop = true
        continue
      }
      if (fromTimestamp !== undefined && eventTimestamp < fromTimestamp) {
        shouldStop = true
        continue
      }

      collected.push(event)
      if (maxResults !== undefined && collected.length >= maxResults) {
        shouldStop = true
        break
      }
    }

    pagesFetched += 1
    offset += eventsBatch.length

    if (eventsBatch.length < pageSize) {
      break
    }
    if (typeof fetchResult.data?.total_count === 'number' && offset >= fetchResult.data.total_count) {
      break
    }
  }

  return { events: collected, pagesFetched }
}

export async function fetchRuntimeAccountERC20Tokens(
  { network, layer, address, maxRecords }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/erc20`)
    logger.log(`📥 Fetching ERC-20 tokens: ${url}`)
    const response = await axios.get(url, {
      params: {
        address,
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.erc20_balances?.length || 0} ERC-20 tokens`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch ERC-20 tokens: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchRuntimeAccountERC721Tokens(
  { network, layer, address, maxRecords }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/erc721`)
    logger.log(`📥 Fetching ERC-721 NFTs: ${url}`)
    const response = await axios.get(url, {
      params: {
        address,
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.erc721_balances?.length || 0} ERC-721 NFTs`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch ERC-721 NFTs: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchRuntimeAccountTokenTransfers(
  { network, layer, address, maxRecords }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/evm_tokens/transfers`)
    logger.log(`📥 Fetching token transfers: ${url}`)
    const response = await axios.get(url, {
      params: {
        rel: address,
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.evm_token_transfers?.length || 0} token transfers`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch token transfers: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchRuntimeContractCode(
  { network, layer, address }: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildRuntimeEndpoint(network, layer, `/contracts/${address}`)
    logger.log(`📥 Fetching contract code: ${url}`)
    const response = await axios.get(url)
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got contract code`)
    return { success: true, data }
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch contract code: ${message}`)
    return { success: false, error: message }
  }
}

export interface RuntimeAccountDataBundle {
  metadata: {
    network: Network
    layer: Runtime
    address: string
    fetchedAt: string
    maxRecords: number
  }
  data: {
    accountInfo: FetchResult<any>
    transactions: FetchResult<any>
    events: FetchResult<any>
    erc20Tokens: FetchResult<any>
    erc721Tokens: FetchResult<any>
    tokenTransfers: FetchResult<any>
    contractCode: FetchResult<any>
  }
}

export async function fetchAllRuntimeAccountData(
  config: RuntimeAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<RuntimeAccountDataBundle> {
  const { network, layer, address, maxRecords } = config

  logger.log('\n🚀 Starting runtime data fetch...')
  logger.log(`📍 Network: ${network}`)
  logger.log(`📍 Layer: ${layer}`)
  logger.log(`📍 Address: ${address}`)
  logger.log(`📍 Max records per list: ${maxRecords}\n`)

  const results: RuntimeAccountDataBundle = {
    metadata: {
      network,
      layer,
      address,
      fetchedAt: new Date().toISOString(),
      maxRecords: maxRecords ?? 500,
    },
    data: {
      accountInfo: { success: false, error: 'Not fetched yet' },
      transactions: { success: false, error: 'Not fetched yet' },
      events: { success: false, error: 'Not fetched yet' },
      erc20Tokens: { success: false, error: 'Not fetched yet' },
      erc721Tokens: { success: false, error: 'Not fetched yet' },
      tokenTransfers: { success: false, error: 'Not fetched yet' },
      contractCode: { success: false, error: 'Not fetched yet' },
    },
  }

  logger.log('1️⃣  Fetching account info...')
  results.data.accountInfo = await fetchRuntimeAccountInfo(config, logger)

  logger.log('\n2️⃣  Fetching transactions...')
  results.data.transactions = await fetchRuntimeAccountTransactions(config, logger)

  logger.log('\n3️⃣  Fetching events...')
  results.data.events = await fetchRuntimeAccountEvents(config, logger)

  logger.log('\n4️⃣  Fetching ERC-20 tokens...')
  results.data.erc20Tokens = await fetchRuntimeAccountERC20Tokens(config, logger)

  logger.log('\n5️⃣  Fetching ERC-721 NFTs...')
  results.data.erc721Tokens = await fetchRuntimeAccountERC721Tokens(config, logger)

  logger.log('\n6️⃣  Fetching token transfers...')
  results.data.tokenTransfers = await fetchRuntimeAccountTokenTransfers(config, logger)

  logger.log('\n7️⃣  Fetching contract code...')
  results.data.contractCode = await fetchRuntimeContractCode(config, logger)

  return results
}
