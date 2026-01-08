import { QueryClient } from '@tanstack/react-query'


export const CACHE_TIMES = {
    DEFAULT: 5 * 60 * 1000,
    FORCE: 15 * 1000,
} as const


export const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, 
            refetchOnWindowFocus: false, 
            staleTime: CACHE_TIMES.DEFAULT, 
            gcTime: CACHE_TIMES.DEFAULT,
            refetchOnReconnect: true,
        },
    },
})

export const forceRefetchQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: CACHE_TIMES.FORCE,
            gcTime: CACHE_TIMES.FORCE,
            refetchOnReconnect: true,
        },
    },
})

