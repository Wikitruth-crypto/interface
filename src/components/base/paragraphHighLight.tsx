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

interface TextHighlightItem {
    text: string;
    color: string;
}

interface ParagraphProps {
    children: string;
    textHighlight?: TextHighlightItem[]; // 指定段落中的高亮文本样式
    color?: ColorVariant;
    size?: SizeVariant;
    weight?: WeightVariant;
    isCopy?: boolean;
    lineClamp?: number| 'none';
    className?: string;
    maxLength?: number;
    maxWidth?: number;
}

// 渲染高亮文本
function renderHighlightedText(text: string, highlights: TextHighlightItem[] = []) {
    if (!highlights.length) return text;
    // 构造正则，支持多个高亮词
    const pattern = highlights.map(h => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'g');
    // 拆分文本并渲染
    return text.split(regex).map((part, i) => {
        const highlight = highlights.find(h => h.text === part);
        if (highlight) {
            return (
                <span key={i} className={`${highlight.color}`}>{part}</span>
            );
        }
        return part;
    });
}

export default function ParagraphHighLight({ 
    children, 
    textHighlight = [],
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

    const fullContent = String(children);
    const highlightedContent = renderHighlightedText(String(displayText), textHighlight);

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
            {highlightedContent}
        </Typography.Paragraph>
    );
}