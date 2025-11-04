import { useEffect, useCallback, RefObject } from 'react';

export interface UseInfiniteScrollOptions {
    /** 触发距离（像素），默认 100px，支持 0-200px */
    threshold?: number;
    /** 加载更多回调 */
    onLoadMore: () => void;
    /** 是否还有更多数据 */
    hasMore: boolean;
    /** 是否正在加载 */
    isLoading: boolean;
    /** 是否启用（默认 true） */
    enabled?: boolean;
    /** Intersection Observer 的根边距 */
    rootMargin?: string;
}

/**
 * 无限滚动Hook
 * 
 * 功能特点：
 * 1. 监听 window 滚动事件，兼容性好
 * 2. 支持可配置触发距离（0-200px）
 * 3. 支持启用/禁用状态
 * 4. 自动处理重复触发和清理
 * 5. 使用防抖优化性能（150ms）
 * 
 * 注意：
 * - 当前实现监听 window 滚动，containerRef 参数保留为预留接口
 * - 未来可以扩展支持自定义容器滚动
 * 
 * @param containerRef 容器元素的 ref（当前未使用，预留接口）
 * @param options 配置选项
 */
export const useInfiniteScroll = (
    containerRef: RefObject<HTMLElement | null>,
    options: UseInfiniteScrollOptions
) => {
    const {
        threshold = 100,
        onLoadMore,
        hasMore,
        isLoading,
        enabled = true,
        rootMargin = '0px',
    } = options;

    // 使用 useCallback 稳定回调引用
    const handleLoadMore = useCallback(() => {
        // 只在有更多数据且未在加载时触发
        if (hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        // 如果未启用，直接返回
        if (!enabled) {
            return;
        }

        // 添加防抖功能，避免频繁触发
        let timeoutId: NodeJS.Timeout | null = null;

        const scrollListener = () => {
            // 清除之前的定时器
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 设置新的定时器，150ms 后执行检查
            timeoutId = setTimeout(() => {
                // 检查是否到达底部（使用 window 滚动）
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = window.innerHeight || document.documentElement.clientHeight;
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

                // 如果距离底部小于等于阈值，触发加载
                if (distanceFromBottom <= threshold) {
                    handleLoadMore();
                }
            }, 150);
        };

        // 添加滚动事件监听（使用 window）
        window.addEventListener('scroll', scrollListener, { passive: true });

        // 清理函数
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener('scroll', scrollListener);
        };
    }, [
        enabled,
        threshold,
        handleLoadMore,
        rootMargin,
    ]);
};

