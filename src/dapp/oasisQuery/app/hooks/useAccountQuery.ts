import { useMemo } from 'react'
import { useGetConsensusAccountsAddress, useGetRuntimeAccountsAddress } from '../../oasis-nexus/api'
import { ConsensusScope, RuntimeScope, SearchScope } from '../../types/searchScope'

export interface UseAccountQueryParams {
    scope: SearchScope
    address: string
    enabled?: boolean
}

/**
 * 统一的账户查询 Hook
 *
 * 根据 scope 的类型自动选择查询共识层或运行时层账户信息。
 * 支持所有类型的地址格式（Oasis 地址、EVM 地址等）。
 *
 * @example
 * ```tsx
 * // 查询运行时账户
 * const { data, isLoading } = useAccountQuery({
 *   scope: { network: 'testnet', layer: 'sapphire' },
 *   address: '0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94',
 * })
 *
 * // 查询共识层账户
 * const { data, isLoading } = useAccountQuery({
 *   scope: { network: 'mainnet', layer: 'consensus' },
 *   address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
 * })
 * ```
 */
export const useAccountQuery = ({ scope, address, enabled = true }: UseAccountQueryParams) => {
    const isConsensus = scope.layer === 'consensus'
    const isRuntime = scope.layer !== 'consensus'

    // 共识层账户查询
    const consensusQuery = useGetConsensusAccountsAddress(
        scope.network,
        address,
        {
            query: {
                enabled: enabled && isConsensus && !!address,
            },
        },
    )

    // 运行时层账户查询
    const runtimeQuery = useGetRuntimeAccountsAddress(
        scope.network,
        scope.layer as RuntimeScope['layer'],
        address,
        {
            query: {
                enabled: enabled && isRuntime && !!address,
            },
        },
    )

    // 根据 scope 类型返回对应的查询结果
    return useMemo(() => {
        if (isConsensus) {
            return consensusQuery
        }
        return runtimeQuery
    }, [isConsensus, consensusQuery, runtimeQuery])
}

