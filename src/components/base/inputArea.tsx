"use client"

import React from 'react';
import { Input, Typography } from 'antd';
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
 * Modernized multi-line text input box component (enhanced version)
 * Using antd Input.TextArea
 * 
 * Enhanced features:
 * - Support touched state (optional, for more granular error display control)
 * - Support warning state (non-blocking warning)
 * - Improved error display logic
 * - Fully compatible with React Hook Form
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
    // Determine display status based on status
    const status = error ? 'error' : warning ? 'warning' : undefined;
    
    // Only show error after touched (if touched prop is provided)
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

            {/* Error message (priority over warning) */}
            {shouldShowError && (
                <Typography.Text type="danger">
                    {error}
                </Typography.Text>
            )}

            {/* Warning message (only displayed when there is no error) */}
            {!shouldShowError && shouldShowWarning && (
                <Typography.Text type="warning">
                    {warning}
                </Typography.Text>
            )}
        </div>
    );
};

export default InputArea;