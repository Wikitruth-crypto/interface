"use client"

import React from 'react';
import { Input } from 'antd';
import { cn } from "@/lib/utils";

export interface InputBoxProps {
    onChange: (value: string) => void;
    value: string | number;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    type?: 'text' | 'email' | 'password' | 'url' | 'tel';
    required?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onBlur?: () => void;
    onFocus?: () => void;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    autoComplete?: string;
    readOnly?: boolean;
}

/**
 * 现代化的单行文本输入框组件
 * 使用 shadcn-ui Input 替代原生 input
 */
const InputBox: React.FC<InputBoxProps> = ({ 
    onChange, 
    value, 
    minLength, 
    maxLength, 
    placeholder,
    error,
    disabled = false,
    type = 'text',
    required = false,
    className,
    style,
    onBlur,
    onFocus,
    prefix,
    suffix,
    autoComplete,
    readOnly = false
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={cn("w-full space-y-2", className)} style={style}>
            <div className="relative">
                {/* 前缀图标或内容 */}
                {prefix && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                        {prefix}
                    </div>
                )}
                
                <Input
                    type={type}
                    value={value}
                    onChange={handleInputChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    minLength={minLength}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    readOnly={readOnly}
                    className={cn(
                        error && "border-destructive focus:ring-destructive",
                        disabled && "opacity-50 cursor-not-allowed",
                        readOnly && "opacity-75 cursor-default",
                        prefix && "pl-10",
                        suffix && "pr-10"
                    )}
                />
                
                {/* 后缀图标或内容 */}
                {suffix && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                        {suffix}
                    </div>
                )}
            </div>
            
            {/* 错误消息 */}
            {error && (
                <p className="text-sm text-destructive font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

// 向后兼容的导出
export const InputText = InputBox;

export default InputBox; 