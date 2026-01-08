import { useEffect, useCallback, RefObject } from 'react';

export interface UseInfiniteScrollOptions {
    /** Trigger distance (pixels), default 100px, supports 0-200px */
    threshold?: number;
    /** Load more callback */
    onLoadMore: () => void;
    /** Whether there is more data */
    hasMore: boolean;
    /** Whether it is loading */
    isLoading: boolean;
    /** Whether it is enabled (default true) */
    enabled?: boolean;
    /** Intersection Observer root margin */
    rootMargin?: string;
}

/**
 * Infinite scroll Hook
 * 
 * Features:
 * 1. Listen to window scroll events, good compatibility
 * 2. Support configurable trigger distance (0-200px)
 * 3. Support enable/disable state
 * 4. Automatically handle repeated triggers and cleanup
 * 5. Use debounce to optimize performance (150ms)
 * 
 * @param containerRef Container element ref (currently not used, reserved interface)
 * @param options Configuration options
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

    // Use useCallback to stabilize callback reference
    const handleLoadMore = useCallback(() => {
        // Only trigger when there is more data and not loading
        if (hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        // If not enabled, return directly
        if (!enabled) {
            if (import.meta.env.DEV) {
                console.log('useInfiniteScroll: Not enabled');
            }
            return;
        }

        // Add debounce function to avoid frequent triggers
        let timeoutId: NodeJS.Timeout | null = null;

        const scrollListener = () => {
            // Clear the previous timer
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set a new timer, check after 150ms
            timeoutId = setTimeout(() => {
                // Check if it has reached the bottom (using window scroll)
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = window.innerHeight || document.documentElement.clientHeight;
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

                // If the distance from the bottom is less than or equal to the threshold, trigger loading
                if (distanceFromBottom <= threshold) {
                    handleLoadMore();
                }
            }, 150);
        };

        // Add scroll event listener (using window)
        window.addEventListener('scroll', scrollListener, { passive: true });

        if (import.meta.env.DEV) {
            console.log('useInfiniteScroll: Add scroll listener');
        }

        // Cleanup function
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

