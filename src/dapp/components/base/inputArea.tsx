"use client"

import React from 'react';
import { Input } from 'antd';
import { cn } from "@/lib/utils";

export interface InputAreaProps {
    onChange: (value: string) => void;
    value: string;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    rows?: number;
    showCount?: boolean;
    disabled?: boolean;
    autoResize?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onBlur?: () => void;
    onFocus?: () => void;
    error?: string;
    warning?: string;
    touched?: boolean;
    required?: boolean;
}

/**
 * 现代化的多行文本输入框组件 (增强版)
 * 使用 antd Input.TextArea
 * 
 * 增强功能：
 * - 支持 touched 状态（可选，用于更细粒度的错误显示控制）
 * - 支持 warning 状态（非阻塞性警告）
 * - 改进的错误显示逻辑
 * - 完全兼容 React Hook Form
 */
const InputArea: React.FC<InputAreaProps> = ({
    onChange,
    value,
    minLength,
    maxLength,
    placeholder,
    rows = 4,
    showCount = false,
    disabled = false,
    autoResize = false,
    className,
    style,
    onBlur,
    onFocus,
    error,
    warning,
    touched,
    required = false
}) => {
    // 根据状态确定显示状态
    const status = error ? 'error' : warning ? 'warning' : undefined;
    
    // 仅在 touched 后显示错误（如果提供了 touched prop）
    const shouldShowError = touched !== undefined ? (touched && error) : error;
    const shouldShowWarning = touched !== undefined ? (touched && warning) : warning;

    return (
        <div className={cn("w-full space-y-2", className)} style={style}>
            <Input.TextArea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                minLength={minLength}
                maxLength={maxLength}
                showCount={showCount}
                autoSize={autoResize}
                status={status}
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
        </div>
    );
};

export default InputArea;