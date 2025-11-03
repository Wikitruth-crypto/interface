import React from 'react';
import { cn } from '@/lib/utils';
import RadioCard from './base/radioCard';

export interface TokenInfo {
    amount: string;
    formattedAmount: string;
    symbol: string;
    hasValidAmount: boolean;
}
export interface FundsSectionProps {
    title: string;
    officeToken?: TokenInfo;
    acceptedToken?: TokenInfo;
    selectedValue: string;
    disabled?: boolean;
    onSelect?: (tokenSymbol: string) => void;
    onDeselect?: (tokenSymbol: string) => void;
    className?: string;
}

/**
 * FundsSection - 纯UI组件
 * 
 * 功能：
 * - 展示资金信息（Office Token、Accepted Token）
 * - 提供代币选择界面
 * - 支持单选逻辑
 * - 响应式布局
 * 
 * 设计原则：
 * - 纯UI组件，不包含状态管理
 * - 通过props接收所有数据和回调
 * - 专注于展示和用户交互
 * - 状态管理由父组件或容器组件处理
 */
const FundsSection: React.FC<FundsSectionProps> = ({
    title,
    officeToken,
    acceptedToken,
    selectedValue,
    disabled = false,
    onSelect,
    onDeselect,
    className
}) => {
    // 处理代币点击逻辑
    const handleTokenClick = (tokenSymbol: string) => {
        if (disabled) return;

        if (selectedValue === tokenSymbol) {
            // 取消选择
            onDeselect?.(tokenSymbol);
        } else {
            // 选择新的token
            onSelect?.(tokenSymbol);
        }
    };

    // 检查是否有可用资金
    const hasAnyFunds = officeToken?.hasValidAmount || acceptedToken?.hasValidAmount;

    // 无资金时的空状态显示
    if (disabled && !hasAnyFunds) {
        return (
            <div className={cn(
                "p-4 text-center text-muted-foreground text-sm",
                "bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30",
                className
            )}>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-xs opacity-60">💰</div>
                    <div>No funds available</div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* 标题区域 */}
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-foreground">{title}</h5>
            </div>

            {/* 代币选择区域 */}
            <div className="space-y-3">
                {/* Office Token */}
                {officeToken?.hasValidAmount && (
                    <div className="relative">
                        <RadioCard
                            label={officeToken.formattedAmount}
                            value={officeToken.amount}
                            description={officeToken.symbol}
                            variant='outline'
                            size='small'
                            onClick={() => handleTokenClick(officeToken.symbol)}
                            selected={selectedValue === officeToken.symbol}
                            disabled={disabled}
                        />
                    </div>
                )}

                {/* Accepted Token */}
                {acceptedToken?.hasValidAmount && (
                    <div className="relative">
                        <RadioCard
                            label={acceptedToken.formattedAmount}
                            value={acceptedToken.amount}
                            description={acceptedToken.symbol}
                            variant='outline'
                            size='small'
                            onClick={() => handleTokenClick(acceptedToken.symbol)}
                            selected={selectedValue === acceptedToken.symbol}
                            disabled={disabled}
                        />
                    </div>
                )}
            </div>

            {/* 选择状态提示 */}
            {selectedValue && hasAnyFunds && (
                <div className="mt-3 p-2 bg-primary/10 rounded-md border border-primary/20">
                    <div className="text-xs text-primary font-medium">
                        ✓ Selected: {selectedValue}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Click to deselect or choose another token
                    </div>
                </div>
            )}

            {/* 禁用状态提示 */}
            {disabled && hasAnyFunds && (
                <div className="mt-3 p-2 bg-muted/20 rounded-md border border-muted-foreground/20">
                    <div className="text-xs text-muted-foreground">
                        🔒 Selection disabled
                    </div>
                </div>
            )}
        </div>
    );
};

export default FundsSection; 