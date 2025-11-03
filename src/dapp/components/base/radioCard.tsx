import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface Props {
    label: string;
    value: string | number;
    description?: string;
    textDirection?: 'horizontal' | 'vertical'; // 文本是横向还是纵向，默认是横向
    disabled?: boolean;
    selected?: boolean;
    onClick?: (value: string | number) => void;
    size?: 'large' | 'small' | 'medium';
    variant?: "default" | "outline"; // 默认无边框，outline 有边框
    // className?: string; 这个暂时不需要，以免造成风格干扰
}

const RadioCard: React.FC<Props> = ({
    label,
    value,
    description,
    textDirection = 'horizontal',
    disabled = false,
    selected = false,
    onClick,
    size = 'medium',
    variant = 'default',
    // className
}) => {

    // 获取尺寸相关的样式
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'p-2',
                    radioSize: 'w-4 h-4',
                    radioDot: 'w-1.5 h-1.5',
                    spacing: 'space-x-2',
                    label: 'text-sm font-medium',
                    description: 'text-xs'
                };
            case 'large':
                return {
                    container: 'p-6',
                    radioSize: 'w-6 h-6',
                    radioDot: 'w-2.5 h-2.5',
                    spacing: 'space-x-6',
                    label: 'text-xl font-bold',
                    description: 'text-base'
                };
            default: // medium
                return {
                    container: 'p-4',
                    radioSize: 'w-5 h-5',
                    radioDot: 'w-2 h-2',
                    spacing: 'space-x-4',
                    label: 'text-lg font-bold',
                    description: 'text-sm'
                };
        }
    };

    // 获取变体样式
    const getVariantClasses = () => {
        const baseClasses = "rounded-lg cursor-pointer transition-all duration-200 bg-card hover:bg-accent/50 active:scale-[0.98]";
        
        switch (variant) {
            case 'outline':
                return cn(
                    baseClasses,
                    "border-2",
                    {
                        "border-primary bg-primary/10 shadow-sm": selected,
                        "border-border hover:border-primary/50": !selected,
                    }
                );
            default:
                return cn(
                    baseClasses,
                    "border-2 border-transparent",
                    {
                        "bg-primary/10 shadow-sm ring-2 ring-primary/20": selected,
                        "hover:ring-1 hover:ring-primary/10": !selected,
                    }
                );
        }
    };

    // 获取文本布局样式
    const getTextLayoutClasses = () => {
        switch (textDirection) {
            case 'vertical':
                return "flex flex-col space-y-1";
            default: // horizontal
                return "flex-1 flex items-center space-x-2";
        }
    };

    // 获取主容器布局
    const getMainLayoutClasses = () => {
        const sizeClasses = getSizeClasses();
        
        if (textDirection === 'vertical') {
            return cn(
                "flex flex-col items-center text-center",
                size === 'small' ? 'space-y-2' : size === 'large' ? 'space-y-4' : 'space-y-3'
            );
        }
        
        return cn("flex items-center", sizeClasses.spacing);
    };

    const sizeClasses = getSizeClasses();

    return (
        <div
            className={cn(
                sizeClasses.container,
                getVariantClasses(),
                "hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                {
                    "cursor-not-allowed opacity-50 hover:bg-card hover:shadow-none active:scale-100": disabled,
                    "hover:ring-1 hover:ring-primary/10": !disabled && !selected,
                }
            )}
            onClick={() => !disabled && onClick?.(value)}
        >
            <div className={getMainLayoutClasses()}>
                {/* Radio Button */}
                <div
                    className={cn(
                        sizeClasses.radioSize,
                        "rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                        {
                            "border-primary bg-primary": selected && !disabled,
                            "border-muted-foreground": !selected && !disabled,
                            "border-muted-foreground/50": disabled,
                        }
                    )}
                >
                    {selected && !disabled && (
                        <div className={cn(
                            sizeClasses.radioDot,
                            "rounded-full bg-primary-foreground"
                        )}></div>
                    )}
                </div>

                {/* Token Info */}
                <div className={getTextLayoutClasses()}>
                    <div className={cn(
                        sizeClasses.label,
                        "text-foreground",
                        textDirection === 'vertical' && "text-center",
                        textDirection === 'horizontal' && "shrink-0"
                    )}>
                        {label}
                    </div>
                    {description && (
                        <div className={cn(
                            sizeClasses.description,
                            "text-muted-foreground",
                            textDirection === 'vertical' && "text-center"
                        )}>
                        {description}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RadioCard;



