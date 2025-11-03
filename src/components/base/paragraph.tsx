"use client";

import { cn } from "@/lib/utils";
import { Typography } from "antd";
import { Copy, Check } from "lucide-react";

// 定义类型安全的样式选项
type ColorVariant = 'white' |'gray-3' | 'gray-5' | 'black' | 'muted-foreground' | 'primary' | 'secondary';
type SizeVariant = 'xs' | 'sm' | 'md' | 'lg';
type WeightVariant = 'light' | 'normal' | 'medium' | 'semibold';

// 预定义的样式映射
const colorStyles: Record<ColorVariant, string> = {
    'white': 'text-white',
    'gray-3': 'text-gray-300',
    'gray-5': 'text-gray-500',
    'black': 'text-black',
    'muted-foreground': 'text-muted-foreground',
    'primary': 'text-primary',
    'secondary': 'text-secondary',
};

const sizeStyles: Record<SizeVariant, string> = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-md', 
    'lg': 'text-lg',
};

const weightStyles: Record<WeightVariant, string> = {
    'light': 'font-light',
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
};


const lineClampStyles: Record<number | 'none', string> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
    'none': '',
};

interface ParagraphProps {
    children: React.ReactNode;
    color?: ColorVariant;
    size?: SizeVariant;
    weight?: WeightVariant;
    isCopy?: boolean;
    lineClamp?: number| 'none';
    className?: string;
    maxLength?: number;
    maxWidth?: number;
}


export default function Paragraph({ 
    children, 
    color = "white", 
    size = "md", 
    weight = "normal", 
    lineClamp = 2, 
    isCopy = false,
    className,
    maxLength,
    maxWidth,
}: ParagraphProps) {
    // 如果传入了 className 的 text-xx 响应式类，则不再自动加 sizeStyles
    const hasResponsiveText = className?.match(/text-(xs|sm|md|lg)/);

    // 处理最大长度
    let displayText = children;
    let isTruncated = false;
    if (typeof children === 'string' && maxLength && children.length > maxLength) {
        displayText = children.slice(0, maxLength) + '...';
        isTruncated = true;
    }

    const textContent = String(displayText);
    const fullContent = String(children);

    return (
        <Typography.Paragraph
            className={cn(
                "leading-relaxed font-mono",
                colorStyles[color],
                !hasResponsiveText && sizeStyles[size],
                weightStyles[weight],
                lineClampStyles[lineClamp],
                className
            )}
            style={maxWidth ? { maxWidth: typeof maxWidth === 'number' ? maxWidth + 'px' : maxWidth } : undefined}
            title={isTruncated ? fullContent : undefined}
            copyable={isCopy ? {
                text: fullContent,
                icon: [<Copy key="copy" className="h-4 w-4" />, <Check key="check" className="h-4 w-4 text-green-500" />],
                tooltips: ['Copy', 'Copied!'],
            } : false}
        >
            {textContent}
        </Typography.Paragraph>
    );
}