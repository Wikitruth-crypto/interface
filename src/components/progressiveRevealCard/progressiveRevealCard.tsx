import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressiveItem } from './useProgressiveReveal';

export interface ProgressiveRevealCardProps<T = any> {
    item: ProgressiveItem<T>;
    skeletonComponent: React.ComponentType<any>;
    contentComponent: React.ComponentType<{ data: T; [key: string]: any }>;
    className?: string;
    transitionDuration?: number;
    /** Transition animation type */
    animationType?: 'fade' | 'fade-scale' | 'slide-up' | 'slide-down' | 'bounce' | 'flip';
    /** Error status component */
    errorComponent?: React.ComponentType<{ error?: any }>;
    /** Custom transition style */
    customTransitionClasses?: {
        skeleton: {
            visible: string;
            hidden: string;
        };
        content: {
            visible: string;
            hidden: string;
        };
    };
    /** Extra props passed to the content component */
    contentProps?: Record<string, any>;
    /** Whether to enable interactive animation */
    interactive?: boolean;
    /** Performance optimization: whether to enable will-change */
    enableWillChange?: boolean;
    /** Loading completed callback (for progressive loading) */
    onCompleted?: (index: number) => void; 
    /** Loading timeout time (milliseconds), default 5000ms, after timeout, force trigger onCompleted */
    loadTimeout?: number;
}


function ProgressiveRevealCard<T = any>({
    item,
    skeletonComponent: SkeletonComponent,
    contentComponent: ContentComponent,
    className,
    transitionDuration = 300,
    animationType = 'fade-scale',
    errorComponent: ErrorComponent,
    customTransitionClasses,
    contentProps = {},
    interactive = true,
    enableWillChange = true,
    onCompleted, 
    loadTimeout = 5000, 
}: ProgressiveRevealCardProps<T>) {
    const { data, status } = item;
    const [isHovered, setIsHovered] = useState(false);

    // Use useMemo to cache animation style calculation
    const animationClasses = useMemo(() => {
        if (customTransitionClasses) {
            return customTransitionClasses;
        }

        const baseDuration = `duration-${transitionDuration}`;
        const baseTransition = `transition-all ${baseDuration} ease-out`;
        const willChange = enableWillChange ? 'will-change-transform will-change-opacity' : '';

        switch (animationType) {
            case 'fade':
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100`,
                        hidden: `${baseTransition} ${willChange} opacity-0 pointer-events-none`
                    },
                    content: {
                        visible: `${baseTransition} ${willChange} opacity-100 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 pointer-events-none`
                    }
                };
            case 'fade-scale':
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100 scale-100`,
                        hidden: `${baseTransition} ${willChange} opacity-0 scale-95 pointer-events-none`
                    },
                    content: {
                        visible: `${baseTransition} ${willChange} opacity-100 scale-100 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 scale-95 pointer-events-none`
                    }
                };
            case 'slide-up':
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100 translate-y-0`,
                        hidden: `${baseTransition} ${willChange} opacity-0 -translate-y-4 pointer-events-none`
                    },
                    content: {
                        visible: `${baseTransition} ${willChange} opacity-100 translate-y-0 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 translate-y-4 pointer-events-none`
                    }
                };
            case 'slide-down':
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100 translate-y-0`,
                        hidden: `${baseTransition} ${willChange} opacity-0 translate-y-4 pointer-events-none`
                    },
                    content: {
                        visible: `${baseTransition} ${willChange} opacity-100 translate-y-0 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 -translate-y-4 pointer-events-none`
                    }
                };
            case 'bounce':
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100 scale-100`,
                        hidden: `${baseTransition} ${willChange} opacity-0 scale-90 pointer-events-none`
                    },
                    content: {
                        visible: `transition-all duration-500 ease-bounce ${willChange} opacity-100 scale-100 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 scale-110 pointer-events-none`
                    }
                };
            case 'flip':
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100 rotateY-0`,
                        hidden: `${baseTransition} ${willChange} opacity-0 rotateY-90 pointer-events-none`
                    },
                    content: {
                        visible: `transition-all duration-600 ease-in-out ${willChange} opacity-100 rotateY-0 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 rotateY-90 pointer-events-none`
                    }
                };
            default:
                return {
                    skeleton: {
                        visible: `${baseTransition} ${willChange} opacity-100 scale-100`,
                        hidden: `${baseTransition} ${willChange} opacity-0 scale-95 pointer-events-none`
                    },
                    content: {
                        visible: `${baseTransition} ${willChange} opacity-100 scale-100 delay-150`,
                        hidden: `${baseTransition} ${willChange} opacity-0 scale-95 pointer-events-none`
                    }
                };
        }
    }, [animationType, transitionDuration, enableWillChange, customTransitionClasses]);

    // Status judgment
    const isSkeletonVisible = status === 'skeleton';
    const isContentVisible = status === 'revealed';
    const isTransitioning = status === 'transitioning';
    const hasError = status === 'error';

    // Interactive effect class name
    const interactiveClasses = useMemo(() => {
        if (!interactive || !isContentVisible) return '';
        return cn(
            'transition-transform duration-200 ease-out',
            isHovered && 'transform hover:scale-[1.02] hover:shadow-lg'
        );
    }, [interactive, isContentVisible, isHovered]);

    // New: track image loading status
    const imageLoadCountRef = useRef(0);
    const expectedImageCount = 1; // truthBoxCard只会回调一次
    const hasNotifiedRef = useRef(false); // Track whether it has been notified

    // New: image loading completed processing - use useEffect to delay execution, avoid updating the parent component state during rendering
    const handleImageLoad = useCallback(() => {
        if (hasNotifiedRef.current) {
            return;
        }

        imageLoadCountRef.current += 1;
        if (imageLoadCountRef.current >= expectedImageCount && onCompleted) {
            hasNotifiedRef.current = true;
            // Delay execution, avoid updating the state during rendering
            setTimeout(() => {
                onCompleted(item.index);
            }, 0);
            if (import.meta.env.DEV) {
                console.log('handleImageLoad: ProgressiveRevealCard', item.index);
            }
        }
    }, [item.index, onCompleted, expectedImageCount]);

    // Reset image load count (only when the data really changes, and the status is transitioning or revealed)
    useEffect(() => {
        // When the data changes or the status becomes transitioning, reset the counter and notification flag
        if (item.status === 'transitioning') {
            imageLoadCountRef.current = 0;
            hasNotifiedRef.current = false;
        }
    }, [item.status, item.index]); // Use more specific dependencies

    // Timer function: if the timeout is still not loaded, force trigger onImageLoad
    useEffect(() => {
        if (item.status !== 'transitioning' || !onCompleted) {
            return;
        }

        const timeoutId = setTimeout(() => {
            // If it has not been notified yet, force trigger the callback
            if (!hasNotifiedRef.current) {
                hasNotifiedRef.current = true;
                setTimeout(() => {
                    onCompleted(item.index);
                }, 0);
                if (import.meta.env.DEV) {
                    console.log('loadTimeout: ProgressiveRevealCard', item.index);
                }
            }
        }, loadTimeout);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [item.status, item.index, loadTimeout, onCompleted]);

    // Modify contentProps, add image load callback
    const enhancedContentProps = useMemo(() => ({
        ...contentProps,
        onCompleted: handleImageLoad, // Pass to the content component
    }), [contentProps, handleImageLoad]);

    // Used to clean up will-change, improve performance
    useEffect(() => {
        if (!enableWillChange) return;
        
        let cleanup: NodeJS.Timeout;
        if (isContentVisible) {
            // After the content is displayed, clean up will-change
            cleanup = setTimeout(() => {
                // Here we can remove the will-change class through ref, but for simplicity, we rely on CSS automatic cleanup
            }, transitionDuration + 300);
        }

        return () => {
            if (cleanup) clearTimeout(cleanup);
        };
    }, [isContentVisible, transitionDuration, enableWillChange]);

    return (
        <div 
            className={cn("relative w-full", className)}
            onMouseEnter={() => interactive && setIsHovered(true)}
            onMouseLeave={() => interactive && setIsHovered(false)}
            role="article"
            aria-busy={isTransitioning}
            aria-live="polite"
        >
            {/* Skeleton layer */}
            <div
                className={cn(
                    isSkeletonVisible 
                        ? animationClasses.skeleton.visible
                        : animationClasses.skeleton.hidden,
                    // Skeleton specific interactive effect
                    isSkeletonVisible && interactive && 'hover:opacity-80'
                )}
                aria-hidden={!isSkeletonVisible}
                aria-label={isSkeletonVisible ? "Loading content..." : undefined}
            >
                <SkeletonComponent />
            </div>

            {/* Real content layer */}
            {data && !hasError && (
                <div
                    className={cn(
                        "absolute top-0 left-0 w-full",
                        isContentVisible 
                            ? animationClasses.content.visible
                            : animationClasses.content.hidden,
                        interactiveClasses
                    )}
                    aria-hidden={!isContentVisible}
                >
                    <ContentComponent 
                        data={data} 
                        {...enhancedContentProps} // Use enhanced props
                    />
                </div>
            )}

        </div>
    );
}

// Use React.memo to optimize performance, only re-render when the props really change
const MemoizedProgressiveRevealCard = React.memo(ProgressiveRevealCard, (prevProps, nextProps) => {
    // Custom comparison function, only compare key properties
    return (
        prevProps.item.status === nextProps.item.status &&
        prevProps.item.data === nextProps.item.data &&
        prevProps.animationType === nextProps.animationType &&
        prevProps.transitionDuration === nextProps.transitionDuration &&
        prevProps.interactive === nextProps.interactive
    );
}) as <T = any>(props: ProgressiveRevealCardProps<T>) => React.ReactElement;

export default MemoizedProgressiveRevealCard; 