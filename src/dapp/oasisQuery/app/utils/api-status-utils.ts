import { getStatus, GetRuntimeStatus, useGetRuntimeStatus, useGetStatus } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { RuntimeScope } from '../../types/searchScope'
import { outOfDateThreshold } from '../../config'
import { UseQueryResult } from '@tanstack/react-query'
import { formatDistanceToNowStrict } from 'date-fns'

/**
 * Format a timestamp as a distance to now
 */
const formatTimestampDistance = (timestamp: string | undefined): string | undefined => {
  if (!timestamp) return undefined
  try {
    return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true })
  } catch {
    return undefined
  }
}

/**
 * Check if the API is reachable
 * 
 * @param network - The network to check
 * @returns Object indicating if the API is reachable and the reason if not
 */
export const useIsApiReachable = (
  network: Network,
): { reachable: true } | { reachable: false; reason: 'userOffline' | 'apiOffline' } => {
  const query = useGetStatus(network, { query: { useErrorBoundary: false } })
  if (query.isPaused) return { reachable: false, reason: 'userOffline' }
  if (query.isFetched && !query.isSuccess) return { reachable: false, reason: 'apiOffline' }
  return { reachable: true }
}

export type FreshnessInfo = {
  unavailable?: boolean
  outOfDate?: boolean
  outOfDateReason?: false | 'indexer' | 'blocks' | 'node'
  lastUpdate?: string
  latestBlock?: number
}

/**
 * Check the freshness of data from the API
 * 
 * @param network - The network to check
 * @param query - The query result to check
 * @returns Information about data freshness
 */
const useFreshness = (
  network: Network,
  query: UseQueryResult<Awaited<ReturnType<typeof getStatus | typeof GetRuntimeStatus>>>,
): FreshnessInfo => {
  const isApiReachable = useIsApiReachable(network).reachable
  const data = query.data?.data
  const lastUpdate = formatTimestampDistance(data?.latest_block_time)
  const latestBlock = data?.latest_block

  if (query.isError) {
    return {
      unavailable: true,
      outOfDate: true,
      outOfDateReason: 'indexer',
    }
  }

  if (query.isLoading) {
    return {
      outOfDate: undefined,
      outOfDateReason: undefined,
    }
  }

  if (!isApiReachable) {
    // The error state will be handled by NetworkOfflineBanner,
    // no need to display another banner whining about obsolete data.
    return {
      outOfDate: false,
      outOfDateReason: false,
    }
  }
  if (!query.isSuccess || !data) {
    return {
      outOfDate: true,
      outOfDateReason: 'indexer',
    }
  }
  if (data.latest_block === -1) {
    return {
      outOfDate: true,
      outOfDateReason: 'indexer',
    }
  }
  const timeSinceLastUpdate = query.dataUpdatedAt - new Date(data.latest_block_time).getTime()
  return {
    outOfDate: timeSinceLastUpdate > outOfDateThreshold,
    outOfDateReason: timeSinceLastUpdate > outOfDateThreshold ? 'indexer' : false,
    lastUpdate: lastUpdate,
    latestBlock,
  }
}

/**
 * Check the freshness of consensus layer data
 * 
 * @param network - The network to check
 * @param queryParams - Optional query parameters
 * @returns Information about consensus data freshness
 */
export const useConsensusFreshness = (
  network: Network,
  queryParams: { polling?: boolean } = {},
): FreshnessInfo => {
  const query = useGetStatus(network, {
    query: { refetchInterval: queryParams.polling ? 8000 : undefined, useErrorBoundary: false },
  })
  const data = query.data?.data
  const freshness = useFreshness(network, query)

  if (!data) return freshness

  const blockInterval = 6 * 1000
  const blocksAreBehindNode = data.latest_node_block > data.latest_block + outOfDateThreshold / blockInterval
  const nodeIsOutOfDate = freshness.outOfDate && data.latest_node_block === data.latest_block
  const outOfDateReason = blocksAreBehindNode
    ? 'blocks'
    : nodeIsOutOfDate
      ? 'node'
      : freshness.outOfDateReason
  return {
    ...freshness,
    outOfDate: outOfDateReason === undefined ? undefined : !!outOfDateReason,
    outOfDateReason: outOfDateReason,
  }
}

/**
 * Check the freshness of runtime layer data
 * 
 * @param scope - The runtime scope to check
 * @param queryParams - Optional query parameters
 * @returns Information about runtime data freshness
 */
export const useRuntimeFreshness = (
  scope: RuntimeScope,
  queryParams: { polling?: boolean } = {},
): FreshnessInfo => {
  const query = useGetRuntimeStatus(scope.network, scope.layer, {
    query: { refetchInterval: queryParams.polling ? 8000 : undefined, useErrorBoundary: false },
  })

  return useFreshness(scope.network, query)
}

