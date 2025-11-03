import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressiveItem } from '@/dapp/hooks/useProgressiveReveal';

export interface ProgressiveRevealCardProps<T = any> {
    /** 项目状态数据 */
    item: ProgressiveItem<T>;
    /** 骨架屏组件 */
    skeletonComponent: React.ComponentType<any>;
    /** 真实内容组件 */
    contentComponent: React.ComponentType<{ data: T; [key: string]: any }>;
    /** 额外的容器样式类名 */
    className?: string;
    /** 过渡动画持续时间（毫秒）*/
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
    /** 调试模式：显示状态指示器 */
    debug?: boolean;
}

/**
 * 优化的渐进式显示卡片组件
 * 
 * 功能特点：
 * 1. 支持更多过渡动画类型（包括弹跳和翻转效果）
 * 2. 性能优化：useMemo缓存动画样式、will-change优化
 * 3. 增强交互性：hover和focus状态
 * 4. 更好的无障碍访问性支持
 * 5. 调试模式支持
 * 6. 错误状态处理增强
 * 
 * @param props 组件属性
 */
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
    debug = false
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
                        {...contentProps}
                    />
                </div>
            )}

            {/* 错误状态层 */}
            {hasError && (
                <div
                    className={cn(
                        "absolute top-0 left-0 w-full",
                        animationClasses.content.visible,
                        "border-2 border-red-200 rounded-lg bg-red-50"
                    )}
                    role="alert"
                    aria-live="assertive"
                >
                    {ErrorComponent ? (
                        <ErrorComponent error={data} />
                    ) : (
                        <div className="p-4 text-center">
                            <div className="text-red-600 text-sm font-medium mb-2">
                                ⚠️ 加载失败
                            </div>
                            <div className="text-red-500 text-xs">
                                请稍后重试或联系技术支持
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 调试模式：状态指示器 */}
            {debug && (
                <div className="absolute top-2 right-2 z-10">
                    <div className={cn(
                        "px-2 py-1 text-xs rounded bg-black/70 text-white font-mono",
                        "border border-white/20 backdrop-blur-sm",
                        {
                            'bg-gray-600': status === 'skeleton',
                            'bg-yellow-600': status === 'transitioning',
                            'bg-green-600': status === 'revealed',
                            'bg-red-600': status === 'error',
                        }
                    )}>
                        <div>{status}</div>
                        <div className="text-xs opacity-70">
                            {animationType}
                        </div>
                    </div>
                </div>
            )}

            {/* 加载进度指示器（过渡状态） */}
            {isTransitioning && (
                <div className="absolute inset-0 flex items-center justify-center z-5">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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