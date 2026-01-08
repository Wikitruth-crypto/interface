import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProgressiveItem<T = any> {
    data: T | null;
    status: 'skeleton' | 'transitioning' | 'revealed' | 'error';
    index: number;
}

export interface UseProgressiveRevealConfig {
    /** Display delay interval for each project (milliseconds) */
    revealDelay?: number;
    /** Transition animation duration (milliseconds) */
    transitionDuration?: number;
    initialCount?: number;
    /** Whether to clean up timers when the component is unmounted */
    cleanupOnUnmount?: boolean;
    /** Whether to trigger the next based on image loading completion (instead of time delay) */
    waitForImageLoad?: boolean; 
}

export interface UseProgressiveRevealReturn<T> {
    /** Current project list status */
    items: ProgressiveItem<T>[];
    /** Start progressive display (reset mode) */
    startReveal: (data: T[]) => void;
    /** Incremental progressive display (retain displayed projects, only display progressive projects for new projects) */
    appendReveal: (newData: T[]) => void;
    /** Reset to initial state */
    reset: () => void;
    /** Whether progressive display is正在进行渐进式显示 */
    isRevealing: boolean;
    /** Completed display project quantity */
    revealedCount: number;
    /** Total progress (0-1) */
    progress: number;
    /** Notify the loading completion of a specific index (only used when waitForImageLoad=true) */
    notifyCompleted: (index: number) => void; 
}

/**
 * Progressive display Hook
 * 
 * Features:
 * 1. Support custom delay time and animation configuration
 * 2. Provide complete state management and progress tracking
 * 3. Automatically clean up timers to prevent memory leaks
 * 4. Support reset and restart
 * 5. Support incremental display (infinite scrolling scenario)
 * 6. Type-safe generic support
 * 
 * @param config Configuration options
 * @returns Progressive display state and control functions
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
    
    // Use ref to store timer IDs for easy cleanup
    const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
    // Record the current length of processed data, used to determine the starting position of incremental display
    const processedDataLengthRef = useRef(0);

    // New: Track the image loading status of each project
    const imageLoadStatusRef = useRef<Map<number, boolean>>(new Map());
    // New: The next index to be displayed
    const nextIndexToRevealRef = useRef<number>(0);
    // New: The data queue to be displayed
    const pendingDataRef = useRef<T[]>([]);
    // New: Whether to process the image loading completion event
    const isProcessingImageLoadRef = useRef<boolean>(false);

    // Function to clean up all timers
    const clearAllTimeouts = useCallback(() => {
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current.clear();
    }, []);

    // Initialize skeleton screen projects
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

    // General function for progressive display of projects
    const revealItems = useCallback((data: T[], startIndex: number = 0, resetMode: boolean = false) => {
        const itemsToReveal = resetMode ? data : data.slice(startIndex);

        // Clean up previous timers
        clearAllTimeouts();
        setIsRevealing(true);

        if (resetMode) {
            setRevealedCount(0);
            processedDataLengthRef.current = 0;
        }

        // If image loading wait mode is enabled
        if (waitForImageLoad) {
            // Image loading mode: first set all data to pendingDataRef
            pendingDataRef.current = [...data];
            nextIndexToRevealRef.current = resetMode ? 0 : startIndex;
            imageLoadStatusRef.current.clear();
            isProcessingImageLoadRef.current = false;

            // Initialize all projects to skeleton state
            // Ensure the length of the items array is consistent with the data length
            setItems(prevItems => {
                const requiredCount = data.length; // Use data length, not Math.max
                if (prevItems.length !== requiredCount) {
                    if (import.meta.env.DEV) {
                        console.log(`🔄 useProgressiveReveal: Resizing items array from ${prevItems.length} to ${requiredCount}`);
                    }
                }
                return Array.from({ length: requiredCount }, (_, index) => ({
                    data: null,
                    status: 'skeleton' as const,
                    index
                }));
            });

            // Delay display the first one, ensure the skeleton screen is displayed first
            if (resetMode && data.length > 0) {
                // First wait for a short time, let the skeleton screen display
                setTimeout(() => {
                    // Set data for the first one, enter transitioning state
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
                    
                    // Delay set the first one to revealed state, so the image can start loading
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
                }, 100); // Delay 100ms, let the skeleton screen display first
            }
            return;
        }

        // Normal mode: based on time delay
        // Prepare project list
        setItems(prevItems => {
            if (resetMode) {
                const requiredCount = data.length;
                if (import.meta.env.DEV && prevItems.length !== requiredCount) {
                    console.log(`🔄 useProgressiveReveal: Resizing items array from ${prevItems.length} to ${requiredCount} (normal mode)`);
                }
                return Array.from({ length: requiredCount }, (_, index) => ({
                    data: null,
                    status: 'skeleton' as const,
                    index
                }));
            } else {
                // Incremental mode: keep displayed projects, only add skeleton screen for new projects
                const newItems = [...prevItems];
                const requiredCount = Math.max(data.length, prevItems.length);
                
                // If more project positions are needed, add new skeleton screen projects
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

        // Start progressive display
        itemsToReveal.forEach((itemData: T, relativeIndex: number) => {
            const absoluteIndex = resetMode ? relativeIndex : startIndex + relativeIndex;
            
            // Timer for starting transition
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

                // Timer for completing display
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
                        // Check if it is the last project in the current batch
                        const isLastInBatch = relativeIndex === itemsToReveal.length - 1;
                        
                        if (isLastInBatch) {
                            setIsRevealing(false);
                            // Update the length of processed data
                            processedDataLengthRef.current = data.length;
                            if (import.meta.env.DEV) {
                                console.log(`✅ useProgressiveReveal: ${resetMode ? 'Reset' : 'Incremental'} display completed, total ${data.length} projects processed`);
                            }
                        }
                        return newCount;
                    });

                    // Remove completed timers
                    timeoutsRef.current.delete(completeRevealTimeout);
                }, transitionDuration / 2);

                timeoutsRef.current.add(completeRevealTimeout);
                timeoutsRef.current.delete(startTransitionTimeout);
            }, relativeIndex * revealDelay);

            timeoutsRef.current.add(startTransitionTimeout);
        });
    }, [revealDelay, transitionDuration, clearAllTimeouts, waitForImageLoad]);

    // New: Function to handle loading completion
    const handleCompleted = useCallback((index: number) => {
        if (import.meta.env.DEV) {
            console.log('handleImageLoaded: useProgressiveReveal', index);
        }
        if (!waitForImageLoad) return;

        // Use setTimeout to delay execution, avoid updating state during rendering
        setTimeout(() => {
            imageLoadStatusRef.current.set(index, true);

            // Check if the next one can be displayed
            const checkAndRevealNext = () => {
                if (isProcessingImageLoadRef.current) return;
                if (nextIndexToRevealRef.current >= pendingDataRef.current.length) return;

                const nextIndex = nextIndexToRevealRef.current;
                const prevIndex = nextIndex - 1;

                // If it is the first one, or the previous one has been loaded
                if (nextIndex === 0 || imageLoadStatusRef.current.get(prevIndex) === true) {
                    isProcessingImageLoadRef.current = true;

                    // Start transition
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

                    // Complete display
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

                            // Check if there are more to display
                            if (nextIndexToRevealRef.current < pendingDataRef.current.length) {
                                // Recursive check the next one
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

    // Start progressive display (reset mode)
    const startReveal = useCallback((data: T[]) => {
        if (import.meta.env.DEV) {
            console.log(`🔄 useProgressiveReveal: Reset display mode - ${data.length} projects`);
        }
        revealItems(data, 0, true);
    }, [revealItems]);

    // Incremental progressive display (retain displayed projects)
    const appendReveal = useCallback((newData: T[]) => {
        const startIndex = processedDataLengthRef.current;
        if (import.meta.env.DEV) {
            console.log(`➕ useProgressiveReveal: Incremental display mode - start from index ${startIndex} to display ${newData.length} new projects (total ${newData.length} projects)`);
        }
        
        revealItems(newData, startIndex, false);
    }, [revealItems]);

    // Reset to initial state
    const reset = useCallback(() => {
        if (import.meta.env.DEV) {
            console.log(`🔄 useProgressiveReveal: Reset to initial state`);
        }
        clearAllTimeouts();
        setIsRevealing(false);
        initializeItems(initialCount);
    }, [clearAllTimeouts, initializeItems, initialCount]);

    // Calculate total progress
    const progress = items.length > 0 ? revealedCount / items.length : 0;

    // Initialize
    useEffect(() => {
        initializeItems(initialCount);
    }, [initializeItems, initialCount]);

    // Clean up timers when the component is unmounted
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
        notifyCompleted: handleCompleted, 
    };
} 