import axios from 'axios'
import { Network } from '../../../types/network'
import { buildConsensusEndpoint } from './endpoints'

export interface ConsensusAccountFetchConfig {
  network: Network
  address: string
  maxRecords: number
}

export type FetchResult<T> =
  | {
      success: true
      data: T
      message?: string
    }
  | {
      success: false
      error: string
    }

type Logger = Pick<typeof console, 'log' | 'error'>

const defaultLogger: Logger = console

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error)

const isNotFoundError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404

export async function fetchConsensusAccountInfo(
  { network, address }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/accounts/${address}`)
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

export async function fetchConsensusAccountTransactions(
  { network, address, maxRecords }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/transactions`)
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

export async function fetchConsensusAccountEvents(
  { network, address, maxRecords }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/events`)
    logger.log(`📥 Fetching events: ${url}`)
    const response = await axios.get(url, {
      params: {
        rel: address,
        limit: maxRecords,
        offset: 0,
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

export async function fetchConsensusDelegations(
  { network, address, maxRecords }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/accounts/${address}/delegations`)
    logger.log(`📥 Fetching delegations: ${url}`)
    const response = await axios.get(url, {
      params: {
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.delegations?.length || 0} delegations`)
    return { success: true, data }
  } catch (error) {
    if (isNotFoundError(error)) {
      logger.log(`ℹ️  Not a validator account or no delegations`)
      return { success: true, data: null, message: 'Not a validator or no delegations' }
    }
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch delegations: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchConsensusDebondingDelegations(
  { network, address, maxRecords }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/accounts/${address}/debonding_delegations`)
    logger.log(`📥 Fetching debonding delegations: ${url}`)
    const response = await axios.get(url, {
      params: {
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.debonding_delegations?.length || 0} debonding delegations`)
    return { success: true, data }
  } catch (error) {
    if (isNotFoundError(error)) {
      logger.log(`ℹ️  Not a validator account or no debonding delegations`)
      return { success: true, data: null, message: 'Not a validator or no debonding delegations' }
    }
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch debonding delegations: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchConsensusDelegationsTo(
  { network, address, maxRecords }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/accounts/${address}/delegations_to`)
    logger.log(`📥 Fetching delegations to: ${url}`)
    const response = await axios.get(url, {
      params: {
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(`✅ Success - Got ${data?.delegations?.length || 0} delegations to this account`)
    return { success: true, data }
  } catch (error) {
    if (isNotFoundError(error)) {
      logger.log(`ℹ️  Not a validator account or no delegations to this account`)
      return { success: true, data: null, message: 'Not a validator or no delegations' }
    }
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch delegations to: ${message}`)
    return { success: false, error: message }
  }
}

export async function fetchConsensusDebondingDelegationsTo(
  { network, address, maxRecords }: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<FetchResult<any>> {
  try {
    const url = buildConsensusEndpoint(network, `/accounts/${address}/debonding_delegations_to`)
    logger.log(`📥 Fetching debonding delegations to: ${url}`)
    const response = await axios.get(url, {
      params: {
        limit: maxRecords,
        offset: 0,
      },
    })
    const data = response.data?.data || response.data
    logger.log(
      `✅ Success - Got ${data?.debonding_delegations?.length || 0} debonding delegations to this account`,
    )
    return { success: true, data }
  } catch (error) {
    if (isNotFoundError(error)) {
      logger.log(`ℹ️  Not a validator account or no debonding delegations to this account`)
      return { success: true, data: null, message: 'Not a validator or no debonding delegations' }
    }
    const message = getErrorMessage(error)
    logger.error(`❌ Failed to fetch debonding delegations to: ${message}`)
    return { success: false, error: message }
  }
}

export interface ConsensusAccountDataBundle {
  metadata: {
    network: Network
    address: string
    fetchedAt: string
    maxRecords: number
  }
  data: {
    accountInfo: FetchResult<any>
    transactions: FetchResult<any>
    events: FetchResult<any>
    delegations: FetchResult<any>
    debondingDelegations: FetchResult<any>
    delegationsTo: FetchResult<any>
    debondingDelegationsTo: FetchResult<any>
  }
}

export async function fetchAllConsensusAccountData(
  config: ConsensusAccountFetchConfig,
  logger: Logger = defaultLogger,
): Promise<ConsensusAccountDataBundle> {
  const { network, address, maxRecords } = config

  logger.log(`\n🚀 Starting consensus data fetch...`)
  logger.log(`📍 Network: ${network}`)
  logger.log(`📍 Address: ${address}`)
  logger.log(`📍 Max records per list: ${maxRecords}\n`)

  const results: ConsensusAccountDataBundle = {
    metadata: {
      network,
      address,
      fetchedAt: new Date().toISOString(),
      maxRecords,
    },
    data: {
      accountInfo: { success: false, error: 'Not fetched yet' },
      transactions: { success: false, error: 'Not fetched yet' },
      events: { success: false, error: 'Not fetched yet' },
      delegations: { success: false, error: 'Not fetched yet' },
      debondingDelegations: { success: false, error: 'Not fetched yet' },
      delegationsTo: { success: false, error: 'Not fetched yet' },
      debondingDelegationsTo: { success: false, error: 'Not fetched yet' },
    },
  }

  logger.log('1️⃣  Fetching account info...')
  results.data.accountInfo = await fetchConsensusAccountInfo(config, logger)

  logger.log('\n2️⃣  Fetching transactions...')
  results.data.transactions = await fetchConsensusAccountTransactions(config, logger)

  logger.log('\n3️⃣  Fetching events...')
  results.data.events = await fetchConsensusAccountEvents(config, logger)

  logger.log('\n4️⃣  Fetching delegations...')
  results.data.delegations = await fetchConsensusDelegations(config, logger)

  logger.log('\n5️⃣  Fetching debonding delegations...')
  results.data.debondingDelegations = await fetchConsensusDebondingDelegations(config, logger)

  logger.log('\n6️⃣  Fetching delegations to...')
  results.data.delegationsTo = await fetchConsensusDelegationsTo(config, logger)

  logger.log('\n7️⃣  Fetching debonding delegations to...')
  results.data.debondingDelegationsTo = await fetchConsensusDebondingDelegationsTo(config, logger)

  return results
}
