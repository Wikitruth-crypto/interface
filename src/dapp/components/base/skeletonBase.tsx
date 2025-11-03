import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export interface SkeletonLineProps extends SkeletonProps {
    width?: string | number;
    height?: string | number;
}

export interface SkeletonCircleProps extends SkeletonProps {
    size?: string | number;
}

export interface SkeletonBlockProps extends SkeletonProps {
    width?: string | number;
    height?: string | number;
    rounded?: boolean;
}

/**
 * 基础骨架屏组件
 */
export const Skeleton: React.FC<SkeletonProps> = ({ 
    className, 
    animate = true 
}) => {
    return (
        <div className={cn(
            "bg-white/20 rounded",
            animate && "animate-pulse",
            className
        )} />
    );
};

/**
 * 线条骨架组件
 */
export const SkeletonLine: React.FC<SkeletonLineProps> = ({
    width = "100%",
    height = "1rem",
    className,
    animate = true
}) => {
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div 
            className={cn(
                "bg-white/20 rounded",
                animate && "animate-pulse",
                className
            )}
            style={style}
        />
    );
};

/**
 * 圆形骨架组件
 */
export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
    size = "2rem",
    className,
    animate = true
}) => {
    const style = {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
    };

    return (
        <div 
            className={cn(
                "bg-white/20 rounded-full",
                animate && "animate-pulse",
                className
            )}
            style={style}
        />
    );
};

/**
 * 块状骨架组件
 */
export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
    width = "100%",
    height = "2rem",
    rounded = true,
    className,
    animate = true
}) => {
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div 
            className={cn(
                "bg-white/20",
                rounded ? "rounded" : "",
                animate && "animate-pulse",
                className
            )}
            style={style}
        />
    );
};

/**
 * 段落骨架组件
 */
export const SkeletonParagraph: React.FC<{
    lines?: number;
    className?: string;
    animate?: boolean;
}> = ({
    lines = 3,
    className,
    animate = true
}) => {
    const shimmerClass = animate ? 'animate-pulse' : '';

    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "h-4 bg-white/20 rounded",
                        shimmerClass,
                        // 最后一行稍微短一些
                        index === lines - 1 && lines > 1 ? "w-4/5" : "w-full"
                    )}
                />
            ))}
        </div>
    );
};

/**
 * 按钮骨架组件
 */
export const SkeletonButton: React.FC<{
    width?: string | number;
    height?: string | number;
    className?: string;
    animate?: boolean;
}> = ({
    width = "6rem",
    height = "2.5rem",
    className,
    animate = true
}) => {
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div 
            className={cn(
                "bg-white/20 rounded-lg",
                animate && "animate-pulse",
                className
            )}
            style={style}
        />
    );
};

/**
 * 头像骨架组件
 */
export const SkeletonAvatar: React.FC<{
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    animate?: boolean;
}> = ({
    size = 'md',
    className,
    animate = true
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };

    return (
        <div className={cn(
            "bg-white/20 rounded-full",
            sizeClasses[size],
            animate && "animate-pulse",
            className
        )} />
    );
};

export default {
    Skeleton,
    SkeletonLine,
    SkeletonCircle,
    SkeletonBlock,
    SkeletonParagraph,
    SkeletonButton,
    SkeletonAvatar
}; 