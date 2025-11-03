"use client"

// 这是一个横线或竖线的组件
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface LineProps {
    direction?: 'horizontal' | 'vertical';
    className?: string;
    type?: 'solid' | 'dashed' | 'dotted';
    weight?: number; // 粗细，单位为 px
    color?: string; // 颜色
    length?: string | number; // 长度，可以是 px 数值或 CSS 单位字符串
}

export default function Line({
    direction = "horizontal",
    className,
    type = "solid",
    weight = 1,
    color = "rgb(255 255 255 / 0.3)", // 默认白色 30% 透明度
    length = "100%"
}: LineProps) {
    
    // 处理长度值
    const processLength = (len: string | number) => {
        return typeof len === 'number' ? `${len}px` : len;
    };

    // 根据方向设置基础样式
    const baseStyles: CSSProperties = {
        backgroundColor: type === 'solid' ? color : 'transparent',
        borderStyle: type !== 'solid' ? type : 'none',
        borderColor: type !== 'solid' ? color : 'transparent',
    };

    // 横线样式
    const horizontalStyles: CSSProperties = {
        ...baseStyles,
        width: processLength(length),
        height: `${weight}px`,
        borderBottomWidth: type !== 'solid' ? `${weight}px` : '0',
    };

    // 竖线样式
    const verticalStyles: CSSProperties = {
        ...baseStyles,
        height: processLength(length),
        width: `${weight}px`,
        borderRightWidth: type !== 'solid' ? `${weight}px` : '0',
    };

    const isHorizontal = direction === 'horizontal';

    return (
        <div
            className={cn(
                "flex-shrink-0", // 防止在 flex 容器中被压缩
                isHorizontal ? "self-stretch" : "self-stretch",
                className
            )}
            style={isHorizontal ? horizontalStyles : verticalStyles}
            role="separator"
            aria-orientation={direction}
        />
    );
}