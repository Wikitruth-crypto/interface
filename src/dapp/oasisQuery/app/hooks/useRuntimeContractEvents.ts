import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RuntimeScope } from '../../types/searchScope'
import { ContractName } from '../../../contractsConfig/types'
import { getContractAddressByScope } from '../../../contractsConfig/helpers'
import { getContractEventSignatures } from '../../../contractsConfig/eventSignatures'
import {
  DecodedRuntimeEvent,
  RuntimeEventFormatterConfig,
  decodeRuntimeEvents,
} from '../services/events'
import {
  fetchRuntimeEventsWithFilters,
  RuntimeEventsFetchFilters,
} from '../services/nexus/runtimeAccountFetcher'

export interface UseRuntimeContractEventsParams {
  scope: RuntimeScope
  contract: ContractName
  limit?: number
  offset?: number
  eventNames?: readonly string[]
  enabled?: boolean
  batchSize?: number
  maxPages?: number
  fromRound?: number
  toRound?: number
  fromTimestamp?: number
  toTimestamp?: number
  useEvmSignatureFilter?: boolean
}

export const useRuntimeContractEvents = <TArgs = Record<string, unknown>>({
  scope,
  contract,
  limit = 50,
  offset = 0,
  eventNames,
  enabled = true,
  batchSize = 100,
  maxPages,
  fromRound,
  toRound,
  fromTimestamp,
  toTimestamp,
  useEvmSignatureFilter = false,
}: UseRuntimeContractEventsParams) => {
  const contractAddress = getContractAddressByScope(scope, contract)
  const signatures = getContractEventSignatures(contract)

  const targetResultCount = Math.max(0, offset + limit)
  const effectiveBatchSize = Math.max(1, Math.min(500, Math.floor(batchSize)))

  const queryEnabled = Boolean(enabled && contractAddress && signatures?.length)

  const query = useQuery({
    queryKey: [
      'runtime-contract-events',
      scope.network,
      scope.layer,
      contract,
      contractAddress,
      limit,
      offset,
      eventNames,
      effectiveBatchSize,
      maxPages,
      fromRound,
      toRound,
      fromTimestamp,
      toTimestamp,
      useEvmSignatureFilter,
    ],
    enabled: queryEnabled,
    queryFn: async () => {
      if (!contractAddress || !signatures) {
        return { events: [], pagesFetched: 0 }
      }

      const fetchOptions: RuntimeEventsFetchFilters = {
        network: scope.network,
        layer: scope.layer,
        address: contractAddress,
        pageSize: effectiveBatchSize,
        maxPages,
        maxResults: targetResultCount > 0 ? targetResultCount : undefined,
        eventNames,
        eventSignatures: signatures,
        fromRound,
        toRound,
        fromTimestamp,
        toTimestamp,
        useEvmSignatureFilter,
      }

      return fetchRuntimeEventsWithFilters(fetchOptions, console)
    },
  })

  useEffect(() => {
    console.log('[useRuntimeContractEvents] fetch result', {
      scope,
      contract,
      contractAddress,
      limit,
      offset,
      eventNames,
      isLoading: query.isLoading,
      isError: query.isError,
      data: query.data,
      error: query.error,
      fromRound,
      toRound,
      fromTimestamp,
      toTimestamp,
      batchSize: effectiveBatchSize,
    })
  }, [
    contract,
    contractAddress,
    eventNames,
    effectiveBatchSize,
    fromRound,
    fromTimestamp,
    limit,
    offset,
    query.data,
    query.error,
    query.isError,
    query.isLoading,
    scope.layer,
    scope.network,
    toRound,
    toTimestamp,
  ])

  const decodedEvents = useMemo(() => {
    if (!contractAddress || !signatures) {
      return [] as DecodedRuntimeEvent<TArgs>[]
    }

    const formatterConfig: RuntimeEventFormatterConfig = {
      contractAddress,
      eventSignatures: signatures,
      allowEvents: eventNames,
    }

    return decodeRuntimeEvents<TArgs>(query.data?.events ?? [], formatterConfig)
  }, [contractAddress, eventNames, query.data?.events, signatures])

  const slicedEvents = useMemo(() => {
    if (!decodedEvents.length) return decodedEvents
    const start = Math.max(0, offset)
    const end = Math.max(start, start + limit)
    return decodedEvents.slice(start, end)
  }, [decodedEvents, limit, offset])

  useEffect(() => {
    console.log('[useRuntimeContractEvents] decoded events', {
      contractAddress,
      decodedCount: decodedEvents.length,
      slicedCount: slicedEvents.length,
      preview: slicedEvents.slice(0, 3),
    })
  }, [contractAddress, decodedEvents.length, slicedEvents])

  return {
    address: contractAddress,
    events: slicedEvents,
    totalFetched: decodedEvents.length,
    pagesFetched: query.data?.pagesFetched ?? 0,
    query,
  }
}
