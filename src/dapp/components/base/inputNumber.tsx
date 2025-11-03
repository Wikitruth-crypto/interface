"use client"

import React from 'react';
import { InputNumber as AntInputNumber } from 'antd';
import { cn } from "@/lib/utils";

export interface InputNumberProps {
    value: string | number;
    onChange: (value: string) => void;
    decimals?: number;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    error?: string;
    warning?: string;
    touched?: boolean;
    className?: string;
    style?: React.CSSProperties;
    formatter?: (value: string) => string;
    parser?: (value: string) => string;
    allowNegative?: boolean;
    showControls?: boolean;
    showRange?: boolean;
    required?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}

/**
 * 现代化的数字输入框组件 (增强版)
 * 使用 antd InputNumber
 * 
 * 增强功能：
 * - 支持 touched 状态（可选，用于更细粒度的错误显示控制）
 * - 支持 warning 状态（非阻塞性警告）
 * - 改进的错误显示逻辑
 * - 完全兼容 React Hook Form
 */
const InputNumber: React.FC<InputNumberProps> = ({
    value,
    onChange,
    decimals = 3,
    min,
    max,
    step = 1,
    placeholder = 'Enter number',
    disabled = false,
    prefix, // 前缀
    suffix, // 后缀
    error,
    warning,
    touched,
    className,
    style,
    formatter,
    parser,
    allowNegative = true,
    showControls = true,
    showRange = false,
    required = false,
    onBlur,
    onFocus
}) => {
    // 根据状态确定显示状态
    const status = error ? 'error' : warning ? 'warning' : undefined;
    
    // 仅在 touched 后显示错误（如果提供了 touched prop）
    const shouldShowError = touched !== undefined ? (touched && error) : error;
    const shouldShowWarning = touched !== undefined ? (touched && warning) : warning;

    return (
        <div className={cn("w-full space-y-2", className)} style={style}>
            <AntInputNumber
                value={value ? Number(value) : undefined}
                onChange={(num) => onChange(String(num || ''))}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                disabled={disabled}
                prefix={prefix}
                suffix={suffix}
                precision={decimals}
                onBlur={onBlur}
                onFocus={onFocus}
                status={status}
                controls={showControls}
                // className="w-full"
            />

            {/* 错误消息（优先级高于警告） */}
            {shouldShowError && (
                <p className="text-sm text-error font-light">
                    {error}
                </p>
            )}

            {/* 警告消息（仅在没有错误时显示） */}
            {!shouldShowError && shouldShowWarning && (
                <p className="text-sm text-warning font-light">
                    {warning}
                </p>
            )}

            {/* 数值范围提示 */}
            {(min !== undefined || max !== undefined) && showRange && !shouldShowError && !shouldShowWarning && (
                <p className="text-xs text-muted-foreground">
                    {min !== undefined && max !== undefined
                        ? `范围: ${min} - ${max}`
                        : min !== undefined
                        ? `最小值: ${min}`
                        : `最大值: ${max}`
                    }
                </p>
            )}
        </div>
    );
};

export default InputNumber;