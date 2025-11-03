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
    /** 初始骨架屏数量 */
    initialCount?: number;
    /** 是否在组件卸载时清理定时器 */
    cleanupOnUnmount?: boolean;
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
        initialCount = 24,
        cleanupOnUnmount = true
    } = config;

    const [items, setItems] = useState<ProgressiveItem<T>[]>([]);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);
    
    // 使用ref存储定时器ID，便于清理
    const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
    // 记录当前已经处理的数据长度，用于判断增量显示的起始位置
    const processedDataLengthRef = useRef(0);

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
        console.log(`🎭 useProgressiveReveal: ${resetMode ? '重置' : '增量'}显示 - 从索引 ${startIndex} 开始显示 ${itemsToReveal.length} 个项目（总数据 ${data.length} 个）`);

        // 清理之前的定时器
        clearAllTimeouts();
        setIsRevealing(true);

        if (resetMode) {
            setRevealedCount(0);
            processedDataLengthRef.current = 0;
        }

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
        itemsToReveal.forEach((itemData, relativeIndex) => {
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
                            console.log(`✅ useProgressiveReveal: ${resetMode ? '重置' : '增量'}显示完成，总共处理 ${data.length} 个项目`);
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
    }, [revealDelay, transitionDuration, clearAllTimeouts]);

    // 开始渐进式显示（重置模式）
    const startReveal = useCallback((data: T[]) => {
        console.log(`🔄 useProgressiveReveal: 重置显示模式 - ${data.length} 个项目`);
        revealItems(data, 0, true);
    }, [revealItems]);

    // 增量渐进式显示（保留已显示项目）
    const appendReveal = useCallback((newData: T[]) => {
        const startIndex = processedDataLengthRef.current;
        console.log(`➕ useProgressiveReveal: 增量显示模式 - 从索引 ${startIndex} 开始显示 ${newData.length} 个新项目（总共 ${newData.length} 个项目）`);
        
        revealItems(newData, startIndex, false);
    }, [revealItems]);

    // 重置到初始状态
    const reset = useCallback(() => {
        console.log(`🔄 useProgressiveReveal: 重置到初始状态`);
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
        progress
    };
} 