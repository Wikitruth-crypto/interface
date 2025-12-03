import { useMemo } from 'react'
import { useGetConsensusAccountsAddress, useGetRuntimeAccountsAddress } from '../../oasis-nexus/api'
import {
    getGetConsensusAccountsAddressQueryKey,
    getGetRuntimeAccountsAddressQueryKey,
} from '../../oasis-nexus/generated/api'
import { ConsensusScope, RuntimeScope, SearchScope } from '../../types/searchScope'

export interface UseAccountQueryParams {
    scope: SearchScope
    address: string
    enabled?: boolean
}

export const useAccountQuery = ({ scope, address, enabled = true }: UseAccountQueryParams) => {
    const isConsensus = scope.layer === 'consensus'
    const isRuntime = scope.layer !== 'consensus'

    // 共识层账户查询
    const consensusQuery = useGetConsensusAccountsAddress(
        scope.network,
        address,
        {
            query: {
                queryKey: getGetConsensusAccountsAddressQueryKey(scope.network, address),
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
                queryKey: getGetRuntimeAccountsAddressQueryKey(
                    scope.network,
                    scope.layer as RuntimeScope['layer'],
                    address,
                ),
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

