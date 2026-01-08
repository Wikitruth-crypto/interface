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
    onSearch?: (term: string) => void;
    onSelectResult?: (result: SearchResult) => void;
    onSubmit?: (term: string) => void;
    placeholder?: string;
    initialTerm?: string;
    searchResults?: SearchResult[];
    className?: string;
    showSearchIcon?: boolean;
    autoSearch?: boolean;
    autoSearchDelay?: number;
    showClearButton?: boolean;
    size?: 'sm' | 'default' | 'lg';
    disabled?: boolean;
    maxResults?: number;
}

/**
 * SearchBox - Search box component
 *
 * A feature-rich search component that supports automatic search, result dropdown, keyboard navigation, etc.
 * Using antd AutoComplete component.
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

    // Automatic search feature
    useEffect(() => {
        if (!autoSearch) return;

        const timer = setTimeout(() => {
            stableOnSearch(searchTerm);
        }, autoSearchDelay);

        return () => clearTimeout(timer);
    }, [searchTerm, autoSearch, autoSearchDelay, stableOnSearch]);

    // Convert search results to antd AutoComplete format
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
