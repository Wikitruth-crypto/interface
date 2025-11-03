"use client"

/**
 * 状态标签组件（使用 antd Tag）
 */
import { Tag } from 'antd';
import { BoxStatus } from "@/dapp/types/contracts/truthBox";
import { cn } from "@/lib/utils";

export type StatusType = BoxStatus | 'Waiting';

export interface StatusLabelProps {
    status: StatusType;
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
            case 'Waiting':
                return 'cyan';
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




