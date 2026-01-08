"use client";

import { cn } from "@/lib/utils";
import { Typography } from "antd";
import { Copy, Check } from "lucide-react";

// Define type-safe style options
type ColorVariant = 'white' |'gray-3' | 'gray-5' | 'black' | 'muted-foreground' | 'primary' | 'secondary';
type SizeVariant = 'xs' | 'sm' | 'md' | 'lg';
type WeightVariant = 'light' | 'normal' | 'medium' | 'semibold';

// Predefined style mappings
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
    textHighlight?: TextHighlightItem[]; // Specify the highlighted text style in the paragraph
    color?: ColorVariant;
    size?: SizeVariant;
    weight?: WeightVariant;
    isCopy?: boolean;
    lineClamp?: number| 'none';
    className?: string;
    maxLength?: number;
    maxWidth?: number;
}

// Render highlighted text
function renderHighlightedText(text: string, highlights: TextHighlightItem[] = []) {
    if (!highlights.length) return text;
    // Construct regular expression, support multiple highlighted words
    const pattern = highlights.map(h => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'g');
    // Split text and render
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
    // If the text-xx responsive class is passed in the className, sizeStyles is not automatically added
    const hasResponsiveText = className?.match(/text-(xs|sm|md|lg)/);

    // Handle maximum length
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