import { useMemo } from 'react'
import { useGetRuntimeEvents } from '../../oasis-nexus/api'
import { RuntimeScope } from '../../types/searchScope'
import type { GetRuntimeEventsParams } from '../../oasis-nexus/generated/api'



export interface UsePaginatedRuntimeEventsParams {
  scope: RuntimeScope
  limit?: number
  offset?: number
  rel?: `0x${string}`
  contractAddress?: `0x${string}`
  runtimeContractAddress?: string
  evmLogSignature?: `0x${string}`
  round?: number
  txIndex?: number
  txHash?: `0x${string}`
  params?: Partial<GetRuntimeEventsParams>
  enabled?: boolean
}

export const usePaginatedRuntimeEvents = ({
  scope,
  limit = 20,
  offset = 0,
  rel,
  contractAddress,
  runtimeContractAddress,
  evmLogSignature,
  round, // block
  txIndex,
  txHash,
  params,
  enabled = true,
}: UsePaginatedRuntimeEventsParams) => {
  const requestParams = useMemo<GetRuntimeEventsParams>(() => {
    const relParam = rel ?? contractAddress
    const signature =
      evmLogSignature && evmLogSignature.startsWith('0x') ? evmLogSignature.slice(2) : evmLogSignature

    txHash = txHash ? txHash.startsWith('0x') ? txHash.slice(2) as `0x${string}` : txHash as `0x${string}` : undefined

    const block: number | undefined = round ? round : undefined

    return {
      limit,
      offset,
      ...(relParam ? { rel: relParam } : {}),
      ...(runtimeContractAddress ? { contract_address: runtimeContractAddress } : {}),
      ...(signature ? { evm_log_signature: signature } : {}),
      ...(typeof block === 'number' ? { block } : {}),
      ...(typeof txIndex === 'number' ? { tx_index: txIndex } : {}),
      ...(txHash ? { tx_hash: txHash } : {}),
      ...params,
    }
  }, [contractAddress, evmLogSignature, limit, offset, params, rel, round, txHash, txIndex])

  return useGetRuntimeEvents(scope.network, scope.layer, requestParams, {
    query: {
      enabled,
    },
  })
}
