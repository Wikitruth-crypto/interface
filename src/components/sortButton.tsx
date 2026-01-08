"use client"

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Select } from 'antd';

export interface SortOption {
    value: string;
    label: string;
}

export interface SortButtonProps {
    onFilterChange: (sortFilter: string) => void;
    options?: SortOption[];
    defaultValue?: string;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

const defaultSortOptions: SortOption[] = [
    { value: 'Default', label: 'Default' },
    { value: 'Recently', label: 'Recently' },
    { value: 'Farthest', label: 'Farthest' },
    { value: 'HighToLow', label: 'Price: High to Low' },
    { value: 'LowToHigh', label: 'Price: Low to High' },
];


const SortButton: React.FC<SortButtonProps> = ({ 
    onFilterChange,
    options = defaultSortOptions,
    defaultValue = 'Default',
    disabled = false,
    className,
    placeholder = 'Select sort option'
}) => {
    const [currentSort, setCurrentSort] = useState(defaultValue);

    const handleSortChange = (value: string) => {
        setCurrentSort(value);
        onFilterChange(value);
    };

    return (
        <div className={cn("w-full min-w-[180px]", className)}>
            <Select
                showSearch
                optionFilterProp="label"
                options={options}
                value={currentSort}
                onChange={handleSortChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
};

export default SortButton; 