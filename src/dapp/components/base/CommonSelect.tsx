"use client"

import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { cn } from '@/lib/utils';

export interface CommonSelectOption {
    icon?: string;      
    index?: number;     
    name: string;       
    symbol?: string;    
    value: string | number; 
    [key: string]: any; 
}

export interface CommonSelectProps {
    options: CommonSelectOption[];
    value?: CommonSelectOption | null;
    defaultValue?: CommonSelectOption | null;
    onChange?: (option: CommonSelectOption | null) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    filterFunction?: (option: CommonSelectOption, searchTerm: string) => boolean;
    onSearch?: (searchTerm: string) => void;
    noResultsText?: string;
    allowClear?: boolean;
    maxDisplayOptions?: number;
}

/**
 * CommonSelect - 基于 shadcn/ui 的通用选择器组件
 * 
 * 使用 shadcn/ui Select 组件重构，自动解决层级和 Portal 问题
 */
const CommonSelect: React.FC<CommonSelectProps> = ({
    options,
    value,
    defaultValue,
    onChange,
    placeholder = '请选择',
    className,
    disabled = false,
    searchable = true,
    searchPlaceholder = '搜索...',
    filterFunction,
    onSearch,
    noResultsText = '暂无匹配结果',
    allowClear = true,
    maxDisplayOptions = 10
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [internalValue, setInternalValue] = useState<string>('');

    // 判断是否为受控组件
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : 
        options.find(opt => String(opt.value) === internalValue) || null;

    // 初始化内部值
    useEffect(() => {
        if (defaultValue && !isControlled) {
            setInternalValue(String(defaultValue.value));
        }
    }, [defaultValue, isControlled]);

    // 同步受控值
    useEffect(() => {
        if (isControlled && value) {
            setInternalValue(String(value.value));
        } else if (isControlled && !value) {
            setInternalValue('');
        }
    }, [value, isControlled]);

    // 默认过滤函数
    const defaultFilterFunction = (option: CommonSelectOption, term: string): boolean => {
        const searchText = term.toLowerCase().trim();
        if (!searchText) return true;
        
        return (
            option.name.toLowerCase().includes(searchText) ||
            (option.symbol && option.symbol.toLowerCase().includes(searchText)) ||
            String(option.value).toLowerCase().includes(searchText)
        );
    };

    // 过滤后的选项
    const filteredOptions = React.useMemo(() => {
        if (!searchable || !searchTerm) {
            return options.slice(0, maxDisplayOptions);
        }
        
        const filterFn = filterFunction || defaultFilterFunction;
        const filtered = options.filter(option => filterFn(option, searchTerm));
        return filtered.slice(0, maxDisplayOptions);
    }, [options, searchTerm, searchable, filterFunction, maxDisplayOptions]);

    // 搜索变化处理
    const handleSearchChange = (searchValue: string) => {
        setSearchTerm(searchValue);
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    // 选择变化处理
    const handleValueChange = (selectedValue: string) => {
        const selectedOption = options.find(opt => String(opt.value) === selectedValue);

        if (!isControlled) {
            setInternalValue(selectedValue);
        }

        onChange?.(selectedOption || null);
    };

    // 清除处理
    const handleClear = () => {
        if (!isControlled) {
            setInternalValue('');
        }
        onChange?.(null);
        setSearchTerm('');
    };

    // 渲染选项内容
    const renderOptionContent = (option: CommonSelectOption) => (
        <div className="flex items-center gap-3 w-full">
            {option.icon && (
                <img 
                    src={option.icon} 
                    alt="icon" 
                    className="w-5 h-5 rounded-full flex-shrink-0 object-cover" 
                />
            )}
            <span className="truncate font-mono flex-1">{option.name}</span>
            {option.symbol && (
                <span className="text-muted-foreground font-mono text-sm flex-shrink-0">
                    {option.symbol}
                </span>
            )}
        </div>
    );



    const selectOptions = filteredOptions.map((option) => ({
        label: renderOptionContent(option),
        value: String(option.value),
    }));

    return (
        <div className={cn("w-full", className)}>
            <Select
                value={internalValue || undefined}
                onChange={(value) => handleValueChange(value || '')}
                disabled={disabled || selectOptions.length === 0}
                placeholder={placeholder}
                allowClear={allowClear}
                onClear={handleClear}
                showSearch={searchable}
                onSearch={handleSearchChange}
                filterOption={false}
                options={selectOptions}
                notFoundContent={
                    searchTerm ? noResultsText : '暂无选项'
                }
                className="w-full"
                optionLabelProp="label"
            />
        </div>
    );
};

export default CommonSelect;
