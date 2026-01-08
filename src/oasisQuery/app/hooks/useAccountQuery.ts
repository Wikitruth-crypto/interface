import { useGetRuntimeAccountsAddress } from '../../oasis-nexus/api'
import { getGetRuntimeAccountsAddressQueryKey } from '../../oasis-nexus/generated/api'
import { RuntimeScope, SearchScope } from '../../types/searchScope'

export interface UseAccountQueryParams {
    scope: SearchScope
    address: string
    enabled?: boolean
}

/**
 * Hook for querying runtime account information (Sapphire only)
 * Consensus layer support has been removed as part of simplification
 */
export const useAccountQuery = ({ scope, address, enabled = true }: UseAccountQueryParams) => {
    // Only support Runtime (Sapphire) queries
    if (scope.layer === 'consensus') {
        throw new Error('Consensus layer queries are not supported. Only Sapphire runtime is supported.')
    }

    return useGetRuntimeAccountsAddress(
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
                enabled: enabled && !!address,
            },
        },
    )
}

