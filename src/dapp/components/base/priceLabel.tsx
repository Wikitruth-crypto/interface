"use client"

import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

export interface PriceTextProps {
    price: string | number;
    symbol?: string;
    token?: string;
    decimals?: number;
    decimalLength?: number;
    fontSize?: number;
    fontSizeSuffix?: number;
    fontWeight?: number;
    fontWeightSuffix?: number;
    color?: string;
    colorSymbol?: string;
    align?: 'left' | 'center' | 'right';
    gap?: number;
    showSymbol?: boolean;
    prefix?: string;
    suffix?: string;
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    unitPosition?: 'left' | 'right';
    variant?: 'default' | 'large' | 'small';
    theme?: 'default' | 'success' | 'warning' | 'error';
    animated?: boolean;
    /** 是否启用响应式 */
    responsive?: boolean;
}

/**
 * 现代化的价格文本组件
 * 支持代币信息、多种样式和动画效果
 */
const PriceLabel: React.FC<PriceTextProps> = ({
    price,
    symbol = 'ETH',
    token,
    decimals = 18,
    decimalLength = 3,
    fontSize,
    fontWeight,
    fontSizeSuffix,
    fontWeightSuffix,
    color,
    colorSymbol,
    align = 'left',
    gap = 5,
    showSymbol = true,
    prefix = '',
    suffix = '', 
    className = '',
    style = {},
    loading = false,
    unitPosition = 'right',
    variant = 'default',
    theme = 'default',
    animated = false,
    responsive = true,
}) => {
    const [priceNumber, setPriceNumber] = useState(0);

    // 计算价格数值
    useEffect(() => {
        const numPrice = Number(price);
        if (isNaN(numPrice)) {
            setPriceNumber(0);
            return;
        }
        
        setPriceNumber(numPrice / (10 ** decimals));
    }, [price, decimals]);

    // 格式化价格显示
    const formatPrice = (value: number): string => {
        if (value === 0) return '0';
        
        // 如果价格很小，使用科学计数法
        if (value > 0 && value < Math.pow(10, -decimalLength)) {
            return value.toExponential(2);
        }
        
        // 如果价格很大，使用千分位分隔符
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + 'M';
        }
        if (value >= 1000) {
            return (value / 1000).toFixed(2) + 'K';
        }
        
        return value.toFixed(decimalLength);
    };

    // 获取固定尺寸样式（当 responsive=false 时使用）
    const getFixedSizeClasses = () => {
        switch (variant) {
            case 'large':
                return {
                    price: 'text-2xl font-bold',
                    symbol: 'text-lg font-medium'
                };
            case 'small':
                return {
                    price: 'text-sm font-medium',
                    symbol: 'text-xs font-normal'
                };
            default:
                return {
                    price: 'text-lg font-semibold',
                    symbol: 'text-sm font-normal'
                };
        }
    };

    // 获取响应式尺寸样式（默认使用）
    const getResponsiveSizeClasses = () => {
        switch (variant) {
            case 'large':
                return {
                    price: 'text-lg font-bold sm:text-xl md:text-2xl',
                    symbol: 'text-sm font-medium sm:text-base md:text-lg'
                };
            case 'small':
                return {
                    price: 'text-xs font-medium sm:text-sm md:text-sm',
                    symbol: 'text-xs font-normal sm:text-xs md:text-xs'
                };
            default:
                return {
                    price: 'text-sm font-semibold sm:text-base md:text-lg',
                    symbol: 'text-xs font-normal sm:text-sm md:text-sm'
                };
        }
    };

    // 获取主题颜色
    const getThemeClasses = () => {
        switch (theme) {
            case 'success':
                return {
                    price: 'text-green-600',
                    symbol: 'text-green-500'
                };
            case 'warning':
                return {
                    price: 'text-yellow-600',
                    symbol: 'text-yellow-500'
                };
            case 'error':
                return {
                    price: 'text-red-600',
                    symbol: 'text-red-500'
                };
            default:
                return {
                    price: 'text-foreground',
                    symbol: 'text-muted-foreground'
                };
        }
    };

    // 获取对齐样式
    const getAlignClass = () => {
        switch (align) {
            case 'center': return 'justify-center';
            case 'right': return 'justify-end';
            default: return 'justify-start';
        }
    };

    // 选择使用响应式还是固定尺寸
    const sizeClasses = responsive ? getResponsiveSizeClasses() : getFixedSizeClasses();
    const themeClasses = getThemeClasses();

    // 响应式间距
    const getResponsiveGap = () => {
        if (!responsive) return `${gap}px`;
        // 小屏幕较小间距，大屏幕正常间距
        return undefined; // 使用 Tailwind 类名
    };

    // 自定义样式对象
    const priceStyle: React.CSSProperties = {
        fontSize: fontSize ? `${fontSize}px` : undefined,
        fontWeight: fontWeight || undefined,
        color: color || undefined,
        ...style,
    };

    const symbolStyle: React.CSSProperties = {
        fontSize: fontSizeSuffix ? `${fontSizeSuffix}px` : undefined,
        fontWeight: fontWeightSuffix || undefined,
        color: colorSymbol || undefined,
        marginLeft: !responsive && unitPosition === 'right' ? `${gap}px` : 0,
        marginRight: !responsive && unitPosition === 'left' ? `${gap}px` : 0,
    };

    // 加载状态
    if (loading) {
        return (
            <div className={cn(
                "flex items-baseline",
                getAlignClass(),
                className
            )}>
                <div className={cn(
                    // 响应式加载骨架
                    responsive 
                        ? "h-4 w-12 sm:h-5 sm:w-16 md:h-6 md:w-20" 
                        : "h-5 w-16",
                    "bg-muted rounded animate-pulse",
                    variant === 'large' && !responsive && "h-8 w-24",
                    variant === 'small' && !responsive && "h-4 w-12"
                )} />
            </div>
        );
    }

    return (
        <div 
            className={cn(
                "flex items-baseline transition-all duration-200",
                // 响应式收缩，确保不会超出父容器
                "flex-shrink min-w-0",
                getAlignClass(),
                animated && "hover:scale-105",
                // 响应式间距
                responsive && unitPosition === 'right' && "gap-1 sm:gap-1.5 md:gap-2",
                responsive && unitPosition === 'left' && "gap-1 sm:gap-1.5 md:gap-2",
                className
            )}
            style={style}
        >
            {/* 左侧符号 */}
            {unitPosition === 'left' && showSymbol && symbol && (
                <span 
                    className={cn(
                        sizeClasses.symbol,
                        themeClasses.symbol,
                        "transition-colors duration-200",
                        "flex-shrink-0 truncate"
                    )}
                    style={symbolStyle}
                >
                    {symbol}
                </span>
            )}

            {/* 前缀 */}
            {prefix && (
                <span 
                    className={cn(
                        responsive 
                            ? "text-xs sm:text-xs md:text-sm" 
                            : "text-xs",
                        "text-muted-foreground",
                        responsive ? "mr-0.5 sm:mr-1" : "mr-1",
                        variant === 'large' && !responsive && "text-sm",
                        variant === 'small' && !responsive && "text-xs",
                        "flex-shrink-0"
                    )}
                    style={priceStyle}
                >
                    {prefix}
                </span>
            )}

            {/* 主要价格 */}
            <span 
                className={cn(
                    sizeClasses.price,
                    themeClasses.price,
                    "transition-colors duration-200",
                    "tabular-nums", // 等宽数字
                    "truncate min-w-0", // 确保能截断
                    animated && "transition-all duration-300"
                )}
                style={priceStyle}
                title={formatPrice(priceNumber)} // 悬停显示完整价格
            >
                {formatPrice(priceNumber)}
            </span>

            {/* 后缀 */}
            {suffix && (
                <span 
                    className={cn(
                        responsive 
                            ? "text-xs sm:text-xs md:text-sm" 
                            : "text-xs",
                        "text-muted-foreground",
                        responsive ? "ml-0.5 sm:ml-1" : "ml-1",
                        variant === 'large' && !responsive && "text-sm",
                        variant === 'small' && !responsive && "text-xs",
                        "flex-shrink-0"
                    )}
                >
                    {suffix}
                </span>
            )}

            {/* 右侧符号 */}
            {unitPosition === 'right' && showSymbol && symbol && (
                <span 
                    className={cn(
                        sizeClasses.symbol,
                        themeClasses.symbol,
                        "transition-colors duration-200",
                        "flex-shrink-0 truncate"
                    )}
                    style={symbolStyle}
                    title={symbol} // 悬停显示完整符号
                >
                    {symbol}
                </span>
            )}
        </div>
    );
};

export default PriceLabel; 