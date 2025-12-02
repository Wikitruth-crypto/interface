"use client"

import { Tag } from 'antd';
import { cn } from "@/lib/utils";


export interface StatusLabelProps {
    status: string;
    className?: string;
    disabled?: boolean;
    /** 尺寸变体 */
    size?: 'sm' | 'md' | 'lg';
    /** 是否启用响应式 */
    responsive?: boolean;
}

export default function StatusLabel({
    status,
    className,
    disabled = false,
    size = 'md',
    responsive = true
}: StatusLabelProps) {
    // 获取状态对应的颜色
    const getStatusColor = () => {
        if (disabled) {
            return 'default';
        }

        switch (status) {
            case 'Storing':
                return 'blue';
            case 'Selling':
            case 'Auctioning':
                return 'orange';
            case 'Paid':
                return 'green';
            case 'Refunding':
                return 'red';
            case 'InSecrecy':
                return 'purple';
            case 'Published':
                return 'lime';
            default:
                return 'blue';
        }
    };

    // 获取尺寸样式
    const getSizeStyle = () => {
        switch (size) {
            case 'sm':
                return { fontSize: '12px', padding: '2px 8px' };
            case 'lg':
                return { fontSize: '16px', padding: '6px 12px' };
            default:
                return { fontSize: '14px', padding: '4px 10px' };
        }
    };

    return (
        <Tag
            color={getStatusColor()}
            className={cn(
                'font-mono font-medium truncate whitespace-nowrap',
                responsive && 'text-xs sm:text-sm',
                className
            )}
            style={getSizeStyle()}
            title={status}
        >
            {status}
        </Tag>
    );
};




