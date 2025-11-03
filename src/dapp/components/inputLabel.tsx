
"use client"

import React, { useState, useCallback } from 'react';
import { Input, Tag } from 'antd';
import { cn } from "@/lib/utils";

export interface InputLabelProps {
    value: string[];
    onChange: (labels: string[]) => void;
    maxLabels?: number;
    maxLabelLength?: number;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * 标签输入组件
 *
 * 功能：
 * - 支持输入多个标签（逗号分隔）
 * - 失去焦点时自动分割标签
 * - 显示已添加的标签列表
 * - 支持删除单个标签
 * - 支持最大标签数量和长度限制
 */
const InputLabel: React.FC<InputLabelProps> = ({
    value = [],
    onChange,
    maxLabels = 10,
    maxLabelLength = 20,
    placeholder = "Enter labels separated by commas (e.g., fraud, corruption, insider trading)",
    className,
    disabled = false
}) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * 处理输入变化（优化版）
     * 实时检查重复标签，提供即时反馈
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const newValue = rawValue.replace(/[^A-Za-z\s\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u4E00-\u9FFF,;，；]+/g, ' ');
        setInputValue(newValue);
        
        // 实时检查重复（仅在输入时，不阻止输入）
        if (newValue.trim()) {
            const currentLabels = newValue
                .split(/[,;，；]+/)
                .map(label => label.trim())
                .filter(label => label.length > 0);
            
            if (currentLabels.length > 1) {
                const duplicates = currentLabels.filter((label, index) => 
                    currentLabels.findIndex(l => l.toLowerCase() === label.toLowerCase()) !== index
                );
                
                if (duplicates.length > 0) {
                    setError(`Duplicate in input: ${[...new Set(duplicates)].join(', ')}`);
                    return;
                }
            }
        }
        
        setError('');
    };

    /**
     * 验证并添加标签（优化版）
     * 
     * 改进：
     * - 大小写不敏感的去重检查
     * - 新输入标签之间的去重
     * - 更智能的错误提示
     * - 性能优化
     */
    const addLabels = useCallback((input: string) => {
        if (!input.trim()) {
            setInputValue('');
            return;
        }

        // 分割标签（支持逗号、分号、空格）
        const newLabels = input
            .split(/[^A-Za-z\s\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u4E00-\u9FFF]+/)
            .map(label => label.trim())
            .filter(label => label.length > 0);

        if (newLabels.length === 0) {
            setInputValue('');
            return;
        }

        // 创建当前标签的小写映射，用于快速查找
        const existingLabelsLower = value.map(label => label.toLowerCase());
        
        // 验证标签
        const validLabels: string[] = [];
        const errors: string[] = [];
        const duplicateLabels: string[] = [];
        const newLabelsLower = new Set<string>(); // 用于检查新标签之间的重复

        for (const label of newLabels) {
            const labelLower = label.toLowerCase();
            
            // 检查标签长度
            if (label.length > maxLabelLength) {
                errors.push(`"${label}" exceeds ${maxLabelLength} characters`);
                continue;
            }

            // 检查新标签之间是否重复
            if (newLabelsLower.has(labelLower)) {
                duplicateLabels.push(label);
                continue;
            }
            newLabelsLower.add(labelLower);

            // 检查是否与现有标签重复（大小写不敏感）
            if (existingLabelsLower.includes(labelLower)) {
                // 找到原始标签（保持原始大小写）
                const originalLabel = value.find(existingLabel => 
                    existingLabel.toLowerCase() === labelLower
                );
                duplicateLabels.push(originalLabel || label);
                continue;
            }

            // 检查标签数量限制
            if (value.length + validLabels.length >= maxLabels) {
                errors.push(`Maximum ${maxLabels} labels allowed`);
                break;
            }

            validLabels.push(label);
        }

        // 更新标签列表
        if (validLabels.length > 0) {
            onChange([...value, ...validLabels]);
        }

        // 智能错误提示
        if (errors.length > 0 || duplicateLabels.length > 0) {
            let errorMessage = '';
            
            if (duplicateLabels.length > 0) {
                const uniqueDuplicates = [...new Set(duplicateLabels)];
                if (uniqueDuplicates.length === 1) {
                    errorMessage = `"${uniqueDuplicates[0]}" already exists`;
                } else {
                    errorMessage = `Duplicates found: ${uniqueDuplicates.slice(0, 3).join(', ')}${uniqueDuplicates.length > 3 ? '...' : ''}`;
                }
            }
            
            if (errors.length > 0) {
                errorMessage = errorMessage 
                    ? `${errorMessage} | ${errors[0]}` 
                    : errors[0];
            }
            
            setError(errorMessage);
        } else {
            setError(''); // 清除错误
        }

        // 清空输入框
        setInputValue('');
    }, [value, onChange, maxLabels, maxLabelLength]);

    /**
     * 处理失去焦点
     */
    const handleBlur = () => {
        addLabels(inputValue);
    };

    /**
     * 处理按键事件
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLabels(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // 如果输入框为空且按下退格键，删除最后一个标签
            e.preventDefault();
            const newLabels = [...value];
            newLabels.pop();
            onChange(newLabels);
        }
    };

    /**
     * 删除指定标签
     */
    const removeLabel = (indexToRemove: number) => {
        const newLabels = value.filter((_, index) => index !== indexToRemove);
        onChange(newLabels);
        setError('');
    };

    return (
        <div className={cn("w-full space-y-3", className)}>
            {/* 标题 */}
            <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm">Labels:</span>
                <span className="text-xs text-muted-foreground">
                    ({value.length}/{maxLabels})
                </span>
            </div>

            {/* 输入框 */}
            <div className="relative">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || value.length >= maxLabels}
                    maxLength={maxLabelLength * 2} // 允许输入多个标签
                    className={cn(
                        error && "border-destructive focus:ring-destructive",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                />
            </div>

            {/* 错误消息 */}
            {error && (
                <p className="text-sm text-destructive font-medium">
                    {error}
                </p>
            )}

            {/* 标签列表 */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md border border-border">
                    {value.map((label, index) => (
                        <Tag
                            key={index}
                            closable={!disabled}
                            onClose={() => removeLabel(index)}
                            className={cn(
                                "group flex items-center gap-1.5 px-3 py-1.5",
                                "hover:bg-secondary/80 transition-colors",
                                disabled && "opacity-50"
                            )}
                        >
                            <span className="text-sm">{label}</span>
                        </Tag>
                    ))}
                </div>
            )}

            {/* 提示信息 */}
            <p className="text-xs text-muted-foreground">
                Separate multiple labels with commas. Press Enter or blur to add.
                {value.length === 0 && " (e.g., fraud, corruption, insider trading)"}
            </p>
        </div>
    );
};

export default InputLabel;
