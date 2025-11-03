

/**
 * 创建一个美观的盒子容器，用于展示内容
 * 美观的边框，圆角，背景色
 * 根据colorStyle自动搭配边框和背景色
 */

import { cn } from "@/lib/utils";

export type colorStyle = "red" | "orange" | "yellow" | "green" | "blue" | "cyan" | "purple" | "pink"| "white" | "black";

interface BoxContainerProps {
    children: React.ReactNode;
    className?: string;
    color?: colorStyle;
    showBorder?: boolean;
    radius?: "none" | "sm" | "md" | "lg" | "full";
    showBg?: boolean;
}

export default function BoxContainer({ 
    children, 
    className, 
    color,
    showBorder=true,
    radius="md",
    showBg=true,
}: BoxContainerProps) {

    // 圆角样式映射
    const radiusMap = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
    };

    // 颜色样式映射 - 边框和背景色搭配
    const colorStyles = {
        red: {
            border: "border-red-400/15",
            bg: "bg-red-500/7"
        },
        orange: {
            border: "border-orange-400/15",
            bg: "bg-orange-500/7"
        },
        yellow: {
            border: "border-yellow-400/15",
            bg: "bg-yellow-500/7"
        },
        green: {
            border: "border-green-400/15",
            bg: "bg-green-500/7"
        },
        blue: {
            border: "border-blue-400/15",
            bg: "bg-blue-500/7"
        },
        cyan: {
            border: "border-cyan-400/15",
            bg: "bg-cyan-500/7"
        },
        purple: {
            border: "border-purple-400/15",
            bg: "bg-purple-500/7"
        },
        pink: {
            border: "border-pink-400/15",
            bg: "bg-pink-500/7"
        },
        white: {
            border: "border-white/10",
            bg: "bg-white/5"
        },
        black: {
            border: "border-gray-800/30",
            bg: "bg-gray-800/7"
        }
    };

    // 获取样式类
    const radiusClass = radiusMap[radius];
    const colorStyle = color ? colorStyles[color] : null;
    
    const borderClass = showBorder 
        ? (colorStyle ? colorStyle.border : "border-white/7")
        : "";
    
    const bgClass = showBg 
        ? (colorStyle ? colorStyle.bg : "bg-card")
        : "bg-transparent";

    return (
        <div className={cn(
            "shadow-lg",
            "border",
            radiusClass,
            borderClass,
            bgClass,
            className
        )}>
            {children}
        </div>
    )
}