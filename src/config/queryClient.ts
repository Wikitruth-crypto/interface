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
 * 一次性事件查询客户端（长期缓存）
 * 
 * 适用场景：
 * - 一次事件（如 BoxCreated、Transfer 等只会发生一次的事件）
 * - 历史交易记录、已确认的链上数据
 * - 不会改变的静态数据
 * 注意：对于一次性事件，建议在查询结果处理后再进行缓存，
 * 这样可以避免重复处理相同的事件数据。
 */
export const persistentQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2, // 失败时重试2次（历史数据可能网络不稳定）
            refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
            refetchOnReconnect: false, // 网络重连时不重新获取（历史数据不会改变）
            staleTime: 30 * 24 * 60 * 60 * 1000, // 30天 - 一次性事件不会改变
            gcTime: 30 * 24 * 60 * 60 * 1000, // v5 中 cacheTime 重命名为 gcTime
        },
    },
})

