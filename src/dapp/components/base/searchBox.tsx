"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AutoComplete } from 'antd';
import { cn } from '@/lib/utils';

export interface SearchResult {
    id: string;
    text: string;
    subtitle?: string;
    category?: string;
}

export interface SearchBoxProps {
    /** 搜索回调 */
    onSearch?: (term: string) => void;
    /** 选择结果回调 */
    onSelectResult?: (result: SearchResult) => void;
    /** 提交回调 */
    onSubmit?: (term: string) => void;
    /** 占位符文本 */
    placeholder?: string;
    /** 初始搜索词 */
    initialTerm?: string;
    /** 搜索结果列表 */
    searchResults?: SearchResult[];
    /** 自定义样式类名 */
    className?: string;
    /** 是否显示搜索图标 */
    showSearchIcon?: boolean;
    /** 是否自动搜索 */
    autoSearch?: boolean;
    /** 自动搜索延迟（毫秒） */
    autoSearchDelay?: number;
    /** 是否显示清除按钮 */
    showClearButton?: boolean;
    /** 搜索框尺寸 */
    size?: 'sm' | 'default' | 'lg';
    /** 是否禁用 */
    disabled?: boolean;
    /** 最大结果显示数量 */
    maxResults?: number;
}

/**
 * SearchBox - 搜索框组件
 *
 * 一个功能丰富的搜索组件，支持自动搜索、结果下拉、键盘导航等功能。
 * 使用 antd AutoComplete 组件。
 */
const SearchBox: React.FC<SearchBoxProps> = ({
    onSearch,
    onSelectResult,
    onSubmit,
    placeholder = "Search...",
    initialTerm = "",
    searchResults,
    className,
    showSearchIcon = true,
    autoSearch = true,
    autoSearchDelay = 300,
    showClearButton = true,
    size = 'default',
    disabled = false,
    maxResults = 10
}) => {
    const [searchTerm, setSearchTerm] = useState(initialTerm);

    useEffect(() => {
        setSearchTerm(initialTerm);
    }, [initialTerm]);

    const stableOnSearch = useCallback(onSearch || (() => {}), [onSearch]);
    const stableOnSelectResult = useCallback(onSelectResult || (() => {}), [onSelectResult]);
    const stableOnSubmit = useCallback(onSubmit || (() => {}), [onSubmit]);

    // 自动搜索功能
    useEffect(() => {
        if (!autoSearch) return;

        const timer = setTimeout(() => {
            stableOnSearch(searchTerm);
        }, autoSearchDelay);

        return () => clearTimeout(timer);
    }, [searchTerm, autoSearch, autoSearchDelay, stableOnSearch]);

    // 转换搜索结果为 antd AutoComplete 格式
    const options = useMemo(() => {
        if (!searchResults || searchResults.length === 0) {
            return [];
        }

        return [{
            label: 'Results',
            options: searchResults.slice(0, maxResults).map(result => ({
                label: (
                    <div>
                        <div className="font-medium">{result.text}</div>
                        {result.subtitle && (
                            <div className="text-xs text-gray-500">{result.subtitle}</div>
                        )}
                        {result.category && (
                            <div className="text-xs text-blue-500">{result.category}</div>
                        )}
                    </div>
                ),
                value: result.text,
                data: result
            }))
        }];
    }, [searchResults, maxResults]);

    const handleSelect = (value: string, option: any) => {
        setSearchTerm(value);
        if (option.data) {
            stableOnSelectResult(option.data);
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (!autoSearch) {
            stableOnSearch(value);
        }
    };

    const sizeMap = {
        sm: 'small',
        default: 'middle',
        lg: 'large'
    } as const;

    return (
        <AutoComplete
            value={searchTerm}
            options={options}
            onSelect={handleSelect}
            onSearch={handleSearch}
            placeholder={placeholder}
            disabled={disabled}
            size={sizeMap[size]}
            allowClear={showClearButton}
            className={cn("w-full", className)}
            filterOption={false}
        />
    );
};

export default SearchBox;
