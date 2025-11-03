"use client"

import React from 'react';
import { Progress as AntProgress } from 'antd';
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
    progress: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'success' | 'warning' | 'error' | 'info';
    animated?: boolean;
    className?: string;
    style?: React.CSSProperties;
    labelPosition?: 'top' | 'bottom' | 'inline' | 'side';
    customLabel?: string;
    width?: number | string;
}

/**
 * 现代化的进度条组件
 * 使用 antd Progress 组件
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    showLabel = true,
    size = 'md',
    color = 'default',
    animated = true,
    className,
    style,
    labelPosition = 'inline',
    customLabel,
    width = '100%'
}) => {
    // 确保进度值在 0-100 范围内
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    // 获取 antd 状态
    const getAntdStatus = (): 'success' | 'exception' | 'normal' | 'active' => {
        switch (color) {
            case 'success':
                return 'success';
            case 'error':
                return 'exception';
            case 'warning':
                return 'normal';
            case 'info':
                return 'active';
            default:
                return 'active';
        }
    };

    // 获取进度条颜色
    const getStrokeColor = () => {
        switch (color) {
            case 'success':
                return '#52c41a';
            case 'warning':
                return '#faad14';
            case 'error':
                return '#ff4d4f';
            case 'info':
                return '#1890ff';
            default:
                return '#1890ff';
        }
    };

    // 获取标签文本
    const labelText = customLabel || `${clampedProgress}%`;

    return (
        <div
            className={cn("w-full", className)}
            style={{ width, ...style }}
        >
            {/* 顶部标签 */}
            {labelPosition === 'top' && showLabel && (
                <div className="mb-2 text-sm font-medium">
                    {labelText}
                </div>
            )}

            {/* 侧边标签布局 */}
            {labelPosition === 'side' ? (
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <AntProgress
                            percent={clampedProgress}
                            status={getAntdStatus()}
                            strokeColor={getStrokeColor()}
                            format={undefined}
                        />
                    </div>
                    {showLabel && (
                        <span className="text-sm font-medium whitespace-nowrap">
                            {labelText}
                        </span>
                    )}
                </div>
            ) : (
                <div>
                    <AntProgress
                        percent={clampedProgress}
                        status={getAntdStatus()}
                        strokeColor={getStrokeColor()}
                        format={labelPosition === 'inline' && showLabel ? () => labelText : undefined}
                    />
                </div>
            )}

            {/* 底部标签 */}
            {labelPosition === 'bottom' && showLabel && (
                <div className="mt-2 text-sm font-medium">
                    {labelText}
                </div>
            )}
        </div>
    );
};

export default ProgressBar; 