"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import { ReactNode } from "react";
import { Button } from 'antd';
import { FaSpinner } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface ButtonProps {
    children: ReactNode;
    icon?: ReactNode;
    size?: 'large' | 'small' | 'medium' | 'default';
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    fullWidth?: boolean;
}

export default function ButtonShadcn({
    children,
    icon,
    size = "default",
    variant = "default",
    disabled = false,
    onClick,
    className,
    fullWidth = false,
}: ButtonProps) {

    // 处理 size 映射到 antd Button 的 size
    const getAntdSize = (): "large" | "middle" | "small" => {
        switch (size) {
            case "large":
                return "large";
            case "small":
                return "small";
            case "medium":
            case "default":
            default:
                return "middle";
        }
    };

    // 处理 variant 映射到 antd Button 的 type
    const getButtonType = (): "primary" | "default" | "dashed" | "text" | "link" => {
        switch (variant) {
            case "default":
                return "primary";
            case "outline":
                return "dashed";
            case "ghost":
                return "text";
            case "secondary":
                return "default";
            case "destructive":
                return "primary"; // 需要配合 danger 属性
            case "link":
                return "link";
            default:
                return "default";
        }
    };

    // 为每种 size 创建独立的响应式类名
    const getResponsiveClasses = () => {
        const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200";
        
        switch (size) {
            case "large":
                return cn(
                    baseClasses,
                    // Large 尺寸的响应式变化 - 更灵活的宽度
                    "text-xs px-3 py-1.5 h-8", // 移动端 - 移除最小宽度限制
                    "sm:text-sm sm:px-4 sm:py-2 sm:h-9", // 小屏
                    "md:text-base md:px-6 md:py-2.5 md:h-11", // 中屏
                    "lg:text-lg lg:px-8 lg:py-3 lg:h-12" // 大屏
                );
            
            case "medium":
                return cn(
                    baseClasses,
                    // Medium 尺寸的响应式变化 - 更灵活的宽度
                    "text-xs px-2.5 py-1 h-7", // 移动端
                    "sm:text-sm sm:px-3 sm:py-1.5 sm:h-8", // 小屏
                    "md:text-sm md:px-4 md:py-2 md:h-9", // 中屏
                    "lg:text-base lg:px-6 lg:py-2.5 lg:h-10" // 大屏
                );
            
            case "small":
                return cn(
                    baseClasses,
                    // Small 尺寸的响应式变化 - 最紧凑的设计
                    "text-xs px-2 py-0.5 h-6", // 移动端
                    "sm:text-xs sm:px-2.5 sm:py-1 sm:h-7", // 小屏
                    "md:text-sm md:px-3 md:py-1.5 md:h-8", // 中屏
                    "lg:text-sm lg:px-4 lg:py-2 lg:h-9" // 大屏
                );
            
            case "default":
            default:
                return cn(
                    baseClasses,
                    // Default 尺寸的响应式变化 - 平衡的设计
                    "text-xs px-2.5 py-1 h-7", // 移动端
                    "sm:text-sm sm:px-3 sm:py-1.5 sm:h-8", // 小屏
                    "md:text-sm md:px-4 md:py-2 md:h-9", // 中屏
                    "lg:text-base lg:px-5 lg:py-2.5 lg:h-10" // 大屏
                );
        }
    };

    const isDangerous = variant === "destructive";

    return (
        <Button
            type={getButtonType()}
            size={getAntdSize()}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            danger={isDangerous}
            className={cn(
                getResponsiveClasses(),
                "gap-1 sm:gap-1.5 md:gap-2", // 响应式图标间距
                className,
                fullWidth && "w-full"
            )}
        >
            {icon && (
                <span className={cn(
                    "flex-shrink-0",
                    // 图标尺寸响应式
                    size === "large" && "text-xs sm:text-sm md:text-base lg:text-lg",
                    size === "medium" && "text-xs sm:text-xs md:text-sm lg:text-base",
                    size === "small" && "text-xs sm:text-xs md:text-xs lg:text-sm",
                    size === "default" && "text-xs sm:text-xs md:text-sm lg:text-base"
                )}>
                    {icon}
                </span>
            )}
            <span className="truncate">
                {children}
            </span>
        </Button>
    );
}



