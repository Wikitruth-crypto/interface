import React from 'react';
import { cn } from '@/lib/utils';
import BaseButton from './base/baseButton';

export interface ClaimButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    text?: string;
    selectedCount?: number;
    totalAmount?: string;
    decimals?: number;
    tokenSymbol?: string;
    onClick?: () => void;
    /** 按钮尺寸 */
    size?: 'sm' | 'md' | 'lg';
    /** 是否启用响应式设计 */
    responsive?: boolean;
    /** 自定义样式类名 */
    className?: string;
    /** 成功状态 */
    isSuccess?: boolean;
    /** 错误信息 */
    error?: string;
    /** 是否显示详细信息 */
    showDetails?: boolean;
}

/**
 * ClaimButton - 增强的 Claim 按钮组件
 * 
 * 功能：
 * - 支持多种状态：正常、加载、成功、错误、禁用
 * - 显示选择数量和总金额
 * - 响应式设计
 * - 改善的用户反馈
 * 
 * 设计原则：
 * - 纯UI组件，状态由外部管理
 * - 丰富的视觉反馈
 * - 清晰的状态指示
 * - 良好的可访问性
 */
const ClaimButton: React.FC<ClaimButtonProps> = ({
    disabled = false,
    isLoading = false,
    text = 'Claim',
    selectedCount = 0,
    totalAmount,
    decimals = 18,
    tokenSymbol = '',
    onClick,
    size = 'md',
    responsive = true,
    className,
    isSuccess = false,
    error,
    showDetails = true
}) => {

    // 获取响应式按钮配置
    const getButtonConfig = () => {
        if (!responsive) {
            // 非响应式模式：固定尺寸
            const sizes = {
                sm: { width: 'w-20', height: 'h-8', text: 'text-xs', padding: 'px-3 py-1' },
                md: { width: 'w-24', height: 'h-10', text: 'text-sm', padding: 'px-4 py-2' },
                lg: { width: 'w-28', height: 'h-12', text: 'text-base', padding: 'px-6 py-3' }
            };
            return sizes[size];
        }

        // 响应式模式：根据屏幕尺寸调整
        return {
            width: 'w-full',  // 宽度跟随父容器
            height: '', // 高度由内容决定
            text: 'text-xs sm:text-sm md:text-base', // 响应式文字大小
            padding: 'px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3' // 响应式内边距
        };
    };

    const buttonConfig = getButtonConfig();

    // 格式化金额显示
    const formatAmount = (amount: string): string => {
        if (!amount || amount === '0') return '0.000';

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '0.000';

        // 根据金额大小选择合适的显示格式
        if (numAmount >= 1e18) {
            const ethAmount = numAmount / 1e18;
            return `${ethAmount.toFixed(3)}`;
        }

        // 格式化为合适的小数位数
        if (numAmount >= 1000) {
            return `${(numAmount / 1000).toFixed(2)}K`;
        }

        return numAmount.toFixed(3);
    };

    // 获取按钮文本
    const getButtonText = () => {
        if (isSuccess) return '✓ Claimed';
        if (isLoading) return 'Claiming...';
        if (error) return 'Retry';
        if (selectedCount > 0) return `Claim (${selectedCount})`;
        return text;
    };

    // 获取按钮状态样式
    const getButtonStateClasses = () => {
        if (isSuccess) {
            return 'bg-green-600 hover:bg-green-700 text-white';
        }
        if (error) {
            return 'bg-red-600 hover:bg-red-700 text-white';
        }
        return ''; // 使用默认样式
    };

    return (
        <div className={cn(
            "flex flex-col items-center gap-2",
            responsive && "w-full", // 响应式时占满父容器宽度
            className
        )}>
            {/* 主要 Claim 按钮 */}
            <BaseButton
                disabled={disabled || isSuccess}
                onClick={onClick}
                loading={isLoading}
                className={cn(
                    buttonConfig.width,
                    buttonConfig.height,
                    buttonConfig.text,
                    buttonConfig.padding,
                    // 响应式最小宽度
                    responsive && [
                        "min-w-[80px] sm:min-w-[100px] md:min-w-[120px]",
                        "min-h-[36px] sm:min-h-[40px] md:min-h-[44px]"
                    ],
                    // 确保按钮内容居中
                    "flex items-center justify-center font-medium transition-all duration-200",
                    // 状态样式
                    getButtonStateClasses(),
                    // 成功状态的特殊效果
                    isSuccess && "shadow-lg shadow-green-500/20",
                    // 错误状态的特殊效果
                    error && "shadow-lg shadow-red-500/20"
                )}
            >
                {getButtonText()}
            </BaseButton>

            {/* 详细信息展示区域 */}
            {showDetails && (
                <div className="w-full space-y-1">
                    {/* 金额显示 */}
                    {selectedCount > 0 && totalAmount && (
                        <div className={cn(
                            "text-center p-2 rounded-md bg-primary/10 border border-primary/20",
                            responsive ? "text-xs sm:text-xs md:text-sm" : "text-xs"
                        )}>
                            <div className={cn(
                                `text-primary font-mono font-medium`,
                                responsive && "px-1"
                            )}>
                                💰 Total: {formatAmount(totalAmount)} {tokenSymbol}
                            </div>
                            <div className="text-muted-foreground text-xs mt-1">
                                {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                            </div>
                        </div>
                    )}

                    {/* 成功状态消息 */}
                    {isSuccess && (
                        <div className="text-center p-2 rounded-md bg-green-100 border border-green-200 text-green-800">
                            <div className="text-xs font-medium">
                                🎉 Successfully claimed!
                            </div>
                        </div>
                    )}

                    {/* 错误状态消息 */}
                    {error && (
                        <div className="text-center p-2 rounded-md bg-red-100 border border-red-200 text-red-800">
                            <div className="text-xs font-medium mb-1">
                                ❌ Claim failed
                            </div>
                            <div className="text-xs opacity-80">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* 禁用状态提示 */}
                    {disabled && !isLoading && !isSuccess && !error && (
                        <div className="text-center p-2 rounded-md bg-muted/20 border border-muted-foreground/20">
                            <div className="text-xs text-muted-foreground">
                                {selectedCount === 0 ? 
                                    '🔒 Select items to claim' : 
                                    '🔒 Cannot claim at this time'
                                }
                            </div>
                        </div>
                    )}

                    {/* 加载状态额外信息 */}
                    {isLoading && (
                        <div className="text-center p-2 rounded-md bg-blue-100 border border-blue-200 text-blue-800">
                            <div className="text-xs font-medium">
                                ⏳ Processing transaction...
                            </div>
                            <div className="text-xs opacity-80 mt-1">
                                Please wait and don't close this page
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClaimButton; 