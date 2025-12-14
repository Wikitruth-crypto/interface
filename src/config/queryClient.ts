import { QueryClient } from '@tanstack/react-query'


export const CACHE_TIMES = {
    /** 默认缓存时间：5分钟（用于常规查询） */
    DEFAULT: 5 * 60 * 1000,
    /** Force 模式缓存时间：15秒（用于强制刷新时的最小缓存保护） */
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

/**
 * 一次性事件查询客户端（长期缓存）
 */
// export const persistentQueryClient = new QueryClient({
//     defaultOptions: {
//         queries: {
//             retry: 2, // 失败时重试2次（历史数据可能网络不稳定）
//             refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
//             refetchOnReconnect: false, // 网络重连时不重新获取（历史数据不会改变）
//             staleTime: 30 * 24 * 60 * 60 * 1000, // 30天 - 一次性事件不会改变
//             gcTime: 30 * 24 * 60 * 60 * 1000, // v5 中 cacheTime 重命名为 gcTime
//         },
//     },
// })

