import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressiveItem } from './useProgressiveReveal';

export interface ProgressiveRevealCardProps<T = any> {
    item: ProgressiveItem<T>;
    skeletonComponent: React.ComponentType<any>;
    contentComponent: React.ComponentType<{ data: T; [key: string]: any }>;
    className?: string;
    transitionDuration?: number;
    /** 过渡动画类型 */
    animationType?: 'fade' | 'fade-scale' | 'slide-up' | 'slide-down' | 'bounce' | 'flip';
    /** 错误状态组件 */
    errorComponent?: React.ComponentType<{ error?: any }>;
    /** 自定义过渡样式 */
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
    /** 传递给内容组件的额外props */
    contentProps?: Record<string, any>;
    /** 是否启用交互式动画 */
    interactive?: boolean;
    /** 性能优化：是否启用will-change */
    enableWillChange?: boolean;
    /** 加载完成回调（用于渐进式加载） */
    onCompleted?: (index: number) => void; // 新增
    /** 加载超时时间（毫秒），默认5000ms，超时后强制触发onCompleted */
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
    onCompleted, // 新增
    loadTimeout = 5000, // 默认5秒
}: ProgressiveRevealCardProps<T>) {
    const { data, status } = item;
    const [isHovered, setIsHovered] = useState(false);

    // 使用useMemo缓存动画样式计算
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

    // 状态判断
    const isSkeletonVisible = status === 'skeleton';
    const isContentVisible = status === 'revealed';
    const isTransitioning = status === 'transitioning';
    const hasError = status === 'error';

    // 交互式效果类名
    const interactiveClasses = useMemo(() => {
        if (!interactive || !isContentVisible) return '';
        return cn(
            'transition-transform duration-200 ease-out',
            isHovered && 'transform hover:scale-[1.02] hover:shadow-lg'
        );
    }, [interactive, isContentVisible, isHovered]);

    // 新增：跟踪图片加载状态
    const imageLoadCountRef = useRef(0);
    const expectedImageCount = 1; // truthBoxCard只会回调一次
    const hasNotifiedRef = useRef(false); // 跟踪是否已经通知过

    // 新增：图片加载完成处理 - 使用 useEffect 延迟执行，避免在渲染期间更新父组件状态
    const handleImageLoad = useCallback(() => {
        if (hasNotifiedRef.current) {
            return;
        }

        imageLoadCountRef.current += 1;
        if (imageLoadCountRef.current >= expectedImageCount && onCompleted) {
            hasNotifiedRef.current = true;
            // 延迟执行，避免在渲染期间更新状态
            setTimeout(() => {
                onCompleted(item.index);
            }, 0);
            if (import.meta.env.DEV) {
                console.log('handleImageLoad: ProgressiveRevealCard', item.index);
            }
        }
    }, [item.index, onCompleted, expectedImageCount]);

    // 重置图片加载计数（仅在数据真正变化时，且状态为 transitioning 或 revealed）
    useEffect(() => {
        // 当数据变化或状态变为 transitioning 时，重置计数器和通知标志
        if (item.status === 'transitioning') {
            imageLoadCountRef.current = 0;
            hasNotifiedRef.current = false;
        }
    }, [item.status, item.index]); // 使用更具体的依赖项

    // 定时器功能：如果超时仍未加载完成，强制触发onImageLoad
    useEffect(() => {
        if (item.status !== 'transitioning' || !onCompleted) {
            return;
        }

        const timeoutId = setTimeout(() => {
            // 如果还没有通知过，强制触发回调
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

    // 修改 contentProps，添加图片加载回调
    const enhancedContentProps = useMemo(() => ({
        ...contentProps,
        onCompleted: handleImageLoad, // 传递给内容组件
    }), [contentProps, handleImageLoad]);

    // 用于清理will-change，提升性能
    useEffect(() => {
        if (!enableWillChange) return;
        
        let cleanup: NodeJS.Timeout;
        if (isContentVisible) {
            // 内容显示完成后，清理will-change
            cleanup = setTimeout(() => {
                // 这里可以通过ref来移除will-change类，但为了简化，我们依赖CSS的自动清理
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
            {/* 骨架屏层 */}
            <div
                className={cn(
                    isSkeletonVisible 
                        ? animationClasses.skeleton.visible
                        : animationClasses.skeleton.hidden,
                    // 骨架屏特定的交互效果
                    isSkeletonVisible && interactive && 'hover:opacity-80'
                )}
                aria-hidden={!isSkeletonVisible}
                aria-label={isSkeletonVisible ? "Loading content..." : undefined}
            >
                <SkeletonComponent />
            </div>

            {/* 真实内容层 */}
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
                        {...enhancedContentProps} // 使用增强的 props
                    />
                </div>
            )}

        </div>
    );
}

// 使用React.memo优化性能，只在props真正变化时重新渲染
const MemoizedProgressiveRevealCard = React.memo(ProgressiveRevealCard, (prevProps, nextProps) => {
    // 自定义比较函数，只比较关键属性
    return (
        prevProps.item.status === nextProps.item.status &&
        prevProps.item.data === nextProps.item.data &&
        prevProps.animationType === nextProps.animationType &&
        prevProps.transitionDuration === nextProps.transitionDuration &&
        prevProps.interactive === nextProps.interactive
    );
}) as <T = any>(props: ProgressiveRevealCardProps<T>) => React.ReactElement;

export default MemoizedProgressiveRevealCard; 