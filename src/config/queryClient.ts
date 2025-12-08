import { QueryClient } from '@tanstack/react-query'

export const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, 
            refetchOnWindowFocus: false, 
            staleTime: 5 * 60 * 1000, 
            gcTime: 5 * 60 * 1000, // 5分钟 - 查询卸载后缓存保留时间（v5 中 cacheTime 重命名为 gcTime）
            refetchOnReconnect: true, // 网络重连时重新获取
        },
    },
})

/**
 * 强制重新获取查询客户端（10秒缓存）
 * 
 * 注意：此客户端主要用于特殊场景，通常不需要单独使用。
 * 在 useReadContract 和 useReadContractERC20 中，force 模式会自动实现10秒缓存检查。
 * 
 * 配置说明：
 * - staleTime: 15* - 数据在15秒内被视为新鲜
 * - refetchOnWindowFocus: false - 窗口聚焦时不重新获取
 */
export const forceRefetchQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 15 * 1000,
            gcTime: 15 * 1000,
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

