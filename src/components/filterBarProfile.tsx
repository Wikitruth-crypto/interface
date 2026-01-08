import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Select } from 'antd';
import { FilterState, BoxStatus } from '@Profile/types/profile.types';

interface FilterBarProps {
    onStatusChange: (status: BoxStatus | undefined) => void;
    className?: string;
}


const FilterBar: React.FC<FilterBarProps> = ({
    onStatusChange,
    className
}) => {
    const statuses: { value: string; label: string }[] = [
        { value: 'all', label: 'Default' },
        { value: 'Storing', label: 'Storing' },
        { value: 'Selling', label: 'Selling' },
        { value: 'Auctioning', label: 'Auctioning' },
        { value: 'Refunding', label: 'Refunding' },
        { value: 'Paid', label: 'Paid' },
        { value: 'InSecrecy', label: 'InSecrecy' },
        { value: 'Published', label: 'Published' },
    ];

    const handleStatusChange = useCallback((value: string) => {
        const newStatus = value === 'all' ? undefined : (value as BoxStatus);

        if (typeof onStatusChange === 'function') {
            onStatusChange(newStatus);
        } else {
            console.error(`❌ FilterBar: onStatusChange is not a function`, typeof onStatusChange);
        }
    }, [onStatusChange]);

    return (
        <div className={cn(
            "flex justify-center items-center w-full",
            "px-6 py-4 mb-6",
            "bg-card/50 backdrop-blur-sm border border-border rounded-lg",
            "shadow-sm hover:shadow-md transition-all duration-200",
            className
        )}>
            {/* Status filter area */}
            <Select
                showSearch
                optionFilterProp="label"
                options={statuses}
                placeholder="Select status"
                onChange={handleStatusChange}
            />
        </div>
    );
};

export default FilterBar;
