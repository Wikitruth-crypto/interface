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
 * CommonSelect - A generic selector component based on shadcn/ui
 * 
 * Rebuilt using shadcn/ui Select component, automatically solving hierarchy and Portal issues
 */
const CommonSelect: React.FC<CommonSelectProps> = ({
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Please select',
    className,
    disabled = false,
    searchable = true,
    searchPlaceholder = 'Search...',
    filterFunction,
    onSearch,
    noResultsText = 'No matching results',
    allowClear = true,
    maxDisplayOptions = 10
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [internalValue, setInternalValue] = useState<string>('');

    // Check if it is a controlled component
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : 
        options.find(opt => String(opt.value) === internalValue) || null;

    // Initialize internal value
    useEffect(() => {
        if (defaultValue && !isControlled) {
            setInternalValue(String(defaultValue.value));
        }
    }, [defaultValue, isControlled]);

    // Synchronize controlled value
    useEffect(() => {
        if (isControlled && value) {
            setInternalValue(String(value.value));
        } else if (isControlled && !value) {
            setInternalValue('');
        }
    }, [value, isControlled]);

    // Default filter function
    const defaultFilterFunction = (option: CommonSelectOption, term: string): boolean => {
        const searchText = term.toLowerCase().trim();
        if (!searchText) return true;
        
        return (
            option.name.toLowerCase().includes(searchText) ||
            (option.symbol && option.symbol.toLowerCase().includes(searchText)) ||
            String(option.value).toLowerCase().includes(searchText)
        );
    };

    // Filtered options
    const filteredOptions = React.useMemo(() => {
        if (!searchable || !searchTerm) {
            return options.slice(0, maxDisplayOptions);
        }
        
        const filterFn = filterFunction || defaultFilterFunction;
        const filtered = options.filter(option => filterFn(option, searchTerm));
        return filtered.slice(0, maxDisplayOptions);
    }, [options, searchTerm, searchable, filterFunction, maxDisplayOptions]);

    // Search change handling
    const handleSearchChange = (searchValue: string) => {
        setSearchTerm(searchValue);
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    // Selection change handling
    const handleValueChange = (selectedValue: string) => {
        const selectedOption = options.find(opt => String(opt.value) === selectedValue);

        if (!isControlled) {
            setInternalValue(selectedValue);
        }

        onChange?.(selectedOption || null);
    };

    // Clear handling
    const handleClear = () => {
        if (!isControlled) {
            setInternalValue('');
        }
        onChange?.(null);
        setSearchTerm('');
    };

    // Render option content
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
                    searchTerm ? noResultsText : 'No options'
                }
                className="w-full"
                optionLabelProp="label"
            />
        </div>
    );
};

export default CommonSelect;
