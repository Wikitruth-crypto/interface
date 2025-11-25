import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProgressiveItem<T = any> {
    data: T | null;
    status: 'skeleton' | 'transitioning' | 'revealed' | 'error';
    index: number;
}

export interface UseProgressiveRevealConfig {
    /** 每个项目的显示延迟间隔（毫秒） */
    revealDelay?: number;
    /** 过渡动画持续时间（毫秒） */
    transitionDuration?: number;
    initialCount?: number;
    /** 是否在组件卸载时清理定时器 */
    cleanupOnUnmount?: boolean;
    /** 是否基于图片加载完成来触发下一个（而不是时间延迟） */
    waitForImageLoad?: boolean; // 新增
}

export interface UseProgressiveRevealReturn<T> {
    /** 当前项目列表状态 */
    items: ProgressiveItem<T>[];
    /** 开始渐进式显示（重置模式） */
    startReveal: (data: T[]) => void;
    /** 增量渐进式显示（保留已显示项目，只对新增项目进行渐进式显示） */
    appendReveal: (newData: T[]) => void;
    /** 重置到初始状态 */
    reset: () => void;
    /** 是否正在进行渐进式显示 */
    isRevealing: boolean;
    /** 已完成显示的项目数量 */
    revealedCount: number;
    /** 总进度（0-1） */
    progress: number;
    /** 通知某个索引的图片已加载完成（仅在 waitForImageLoad=true 时使用） */
    notifyImageLoaded: (index: number) => void; // 新增
}

/**
 * 渐进式显示Hook
 * 
 * 功能特点：
 * 1. 支持自定义延迟时间和动画配置
 * 2. 提供完整的状态管理和进度追踪
 * 3. 自动清理定时器防止内存泄漏
 * 4. 支持重置和重新开始
 * 5. 支持增量显示（无限滚动场景）
 * 6. 类型安全的泛型支持
 * 
 * @param config 配置选项
 * @returns 渐进式显示的状态和控制函数
 */
export function useProgressiveReveal<T = any>(
    config: UseProgressiveRevealConfig = {}
): UseProgressiveRevealReturn<T> {
    const {
        revealDelay = 200,
        transitionDuration = 300,
        initialCount = 20,
        cleanupOnUnmount = true,
        waitForImageLoad = false, 
    } = config;

    const [items, setItems] = useState<ProgressiveItem<T>[]>([]);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);
    
    // 使用ref存储定时器ID，便于清理
    const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
    // 记录当前已经处理的数据长度，用于判断增量显示的起始位置
    const processedDataLengthRef = useRef(0);

    // 新增：跟踪每个项目的图片加载状态
    const imageLoadStatusRef = useRef<Map<number, boolean>>(new Map());
    // 新增：当前等待显示的下一个索引
    const nextIndexToRevealRef = useRef<number>(0);
    // 新增：待显示的数据队列
    const pendingDataRef = useRef<T[]>([]);
    // 新增：是否正在处理图片加载完成事件
    const isProcessingImageLoadRef = useRef<boolean>(false);

    // 清理所有定时器的函数
    const clearAllTimeouts = useCallback(() => {
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current.clear();
    }, []);

    // 初始化骨架屏项目
    const initializeItems = useCallback((count: number) => {
        const initialItems: ProgressiveItem<T>[] = Array.from({ length: count }, (_, index) => ({
            data: null,
            status: 'skeleton',
            index
        }));
        setItems(initialItems);
        setRevealedCount(0);
        processedDataLengthRef.current = 0;
    }, []);

    // 渐进式显示项目的通用函数
    const revealItems = useCallback((data: T[], startIndex: number = 0, resetMode: boolean = false) => {
        const itemsToReveal = resetMode ? data : data.slice(startIndex);

        // 清理之前的定时器
        clearAllTimeouts();
        setIsRevealing(true);

        if (resetMode) {
            setRevealedCount(0);
            processedDataLengthRef.current = 0;
        }

        // 如果启用图片加载等待模式
        if (waitForImageLoad) {
            // 图片加载模式：先设置所有数据到 pendingDataRef
            pendingDataRef.current = [...data];
            nextIndexToRevealRef.current = resetMode ? 0 : startIndex;
            imageLoadStatusRef.current.clear();
            isProcessingImageLoadRef.current = false;

            // 初始化所有项目为 skeleton 状态
            setItems(prevItems => {
                const requiredCount = Math.max(data.length, prevItems.length);
                return Array.from({ length: requiredCount }, (_, index) => ({
                    data: null,
                    status: 'skeleton' as const,
                    index
                }));
            });

            // 延迟显示第一个，确保骨架屏先显示
            if (resetMode && data.length > 0) {
                // 先等待一小段时间，让骨架屏显示出来
                setTimeout(() => {
                    // 给第一个设置数据，进入 transitioning 状态
                    setItems(prevItems => {
                        const newItems = [...prevItems];
                        if (newItems[0]) {
                            newItems[0] = {
                                data: data[0],
                                status: 'transitioning',
                                index: 0
                            };
                        }
                        return newItems;
                    });
                    nextIndexToRevealRef.current = 1;
                    
                    // 再延迟设置第一个为 revealed 状态，以便图片可以开始加载
                    setTimeout(() => {
                        setItems(prevItems => {
                            const newItems = [...prevItems];
                            if (newItems[0] && data[0]) {
                                newItems[0] = {
                                    data: data[0],
                                    status: 'revealed',
                                    index: 0
                                };
                            }
                            return newItems;
                        });
                        setRevealedCount(1);
                    }, transitionDuration / 2);
                }, 100); // 延迟100ms，让骨架屏先显示
            }
            return;
        }

        // 普通模式：基于时间延迟
        // 准备项目列表
        setItems(prevItems => {
            const requiredCount = Math.max(data.length, prevItems.length);
            
            if (resetMode) {
                // 重置模式：全部重新创建为骨架屏
                return Array.from({ length: requiredCount }, (_, index) => ({
                    data: null,
                    status: 'skeleton' as const,
                    index
                }));
            } else {
                // 增量模式：保留已显示的项目，只为新增项目添加骨架屏
                const newItems = [...prevItems];
                
                // 如果需要更多项目位置，添加新的骨架屏项目
                for (let i = prevItems.length; i < requiredCount; i++) {
                    newItems.push({
                        data: null,
                        status: 'skeleton' as const,
                        index: i
                    });
                }
                
                return newItems;
            }
        });

        // 开始渐进式显示
        itemsToReveal.forEach((itemData: T, relativeIndex: number) => {
            const absoluteIndex = resetMode ? relativeIndex : startIndex + relativeIndex;
            
            // 开始过渡的定时器
            const startTransitionTimeout = setTimeout(() => {
                setItems(prevItems => {
                    const newItems = [...prevItems];
                    if (newItems[absoluteIndex]) {
                        newItems[absoluteIndex] = {
                            ...newItems[absoluteIndex],
                            status: 'transitioning'
                        };
                    }
                    return newItems;
                });

                // 完成显示的定时器
                const completeRevealTimeout = setTimeout(() => {
                    setItems(prevItems => {
                        const newItems = [...prevItems];
                        if (newItems[absoluteIndex]) {
                            newItems[absoluteIndex] = {
                                data: itemData,
                                status: 'revealed',
                                index: absoluteIndex
                            };
                        }
                        return newItems;
                    });

                    setRevealedCount(prev => {
                        const newCount = prev + 1;
                        // 检查是否为当前批次的最后一个项目
                        const isLastInBatch = relativeIndex === itemsToReveal.length - 1;
                        
                        if (isLastInBatch) {
                            setIsRevealing(false);
                            // 更新已处理的数据长度
                            processedDataLengthRef.current = data.length;
                            if (import.meta.env.DEV) {
                                console.log(`✅ useProgressiveReveal: ${resetMode ? 'Reset' : 'Incremental'} display completed, total ${data.length} projects processed`);
                            }
                        }
                        return newCount;
                    });

                    // 移除已完成的定时器
                    timeoutsRef.current.delete(completeRevealTimeout);
                }, transitionDuration / 2);

                timeoutsRef.current.add(completeRevealTimeout);
                timeoutsRef.current.delete(startTransitionTimeout);
            }, relativeIndex * revealDelay);

            timeoutsRef.current.add(startTransitionTimeout);
        });
    }, [revealDelay, transitionDuration, clearAllTimeouts, waitForImageLoad]);

    // 新增：处理图片加载完成的函数
    const handleImageLoaded = useCallback((index: number) => {
        if (import.meta.env.DEV) {
            console.log('handleImageLoaded: useProgressiveReveal', index);
        }
        if (!waitForImageLoad) return;

        // 使用 setTimeout 延迟执行，避免在渲染期间更新状态
        setTimeout(() => {
            imageLoadStatusRef.current.set(index, true);

            // 检查是否可以显示下一个
            const checkAndRevealNext = () => {
                if (isProcessingImageLoadRef.current) return;
                if (nextIndexToRevealRef.current >= pendingDataRef.current.length) return;

                const nextIndex = nextIndexToRevealRef.current;
                const prevIndex = nextIndex - 1;

                // 如果是第一个，或者前一个已经加载完成
                if (nextIndex === 0 || imageLoadStatusRef.current.get(prevIndex) === true) {
                    isProcessingImageLoadRef.current = true;

                    // 开始过渡
                    setItems(prevItems => {
                        const newItems = [...prevItems];
                        if (newItems[nextIndex]) {
                            newItems[nextIndex] = {
                                ...newItems[nextIndex],
                                status: 'transitioning'
                            };
                        }
                        return newItems;
                    });

                    // 完成显示
                    setTimeout(() => {
                        setItems(prevItems => {
                            const newItems = [...prevItems];
                            if (newItems[nextIndex] && pendingDataRef.current[nextIndex]) {
                                newItems[nextIndex] = {
                                    data: pendingDataRef.current[nextIndex],
                                    status: 'revealed',
                                    index: nextIndex
                                };
                            }
                            return newItems;
                        });

                        setRevealedCount(prev => {
                            const newCount = prev + 1;
                            nextIndexToRevealRef.current = newCount;
                            isProcessingImageLoadRef.current = false;

                            // 检查是否还有更多需要显示
                            if (nextIndexToRevealRef.current < pendingDataRef.current.length) {
                                // 递归检查下一个
                                setTimeout(() => checkAndRevealNext(), 0);
                            } else {
                                setIsRevealing(false);
                                processedDataLengthRef.current = pendingDataRef.current.length;
                            }

                            return newCount;
                        });
                    }, transitionDuration / 2);
                }
            };

            checkAndRevealNext();
        }, 0);
    }, [waitForImageLoad, transitionDuration]);

    // 开始渐进式显示（重置模式）
    const startReveal = useCallback((data: T[]) => {
        if (import.meta.env.DEV) {
            console.log(`🔄 useProgressiveReveal: Reset display mode - ${data.length} projects`);
        }
        revealItems(data, 0, true);
    }, [revealItems]);

    // 增量渐进式显示（保留已显示项目）
    const appendReveal = useCallback((newData: T[]) => {
        const startIndex = processedDataLengthRef.current;
        if (import.meta.env.DEV) {
            console.log(`➕ useProgressiveReveal: Incremental display mode - start from index ${startIndex} to display ${newData.length} new projects (total ${newData.length} projects)`);
        }
        
        revealItems(newData, startIndex, false);
    }, [revealItems]);

    // 重置到初始状态
    const reset = useCallback(() => {
        if (import.meta.env.DEV) {
            console.log(`🔄 useProgressiveReveal: Reset to initial state`);
        }
        clearAllTimeouts();
        setIsRevealing(false);
        initializeItems(initialCount);
    }, [clearAllTimeouts, initializeItems, initialCount]);

    // 计算总进度
    const progress = items.length > 0 ? revealedCount / items.length : 0;

    // 初始化
    useEffect(() => {
        initializeItems(initialCount);
    }, [initializeItems, initialCount]);

    // 组件卸载时清理定时器
    useEffect(() => {
        if (cleanupOnUnmount) {
            return () => {
                clearAllTimeouts();
            };
        }
    }, [cleanupOnUnmount, clearAllTimeouts]);

    return {
        items,
        startReveal,
        appendReveal,
        reset,
        isRevealing,
        revealedCount,
        progress,
        notifyImageLoaded: handleImageLoaded, // 新增
    };
} 