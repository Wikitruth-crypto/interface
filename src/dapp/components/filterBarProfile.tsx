import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Select } from 'antd';
import { FilterState, BoxStatus } from '@/dapp/pages/Profile/types/profile.types';

interface FilterBarProps {
    onStatusChange: (status: BoxStatus | undefined) => void;
    className?: string;
}


const FilterBar: React.FC<FilterBarProps> = ({
    onStatusChange,
    className
}) => {
    const statuses: { value: string; label: string }[] = [
        { value: 'all', label: '全部状态' },
        { value: 'Storing', label: 'Storing' },
        { value: 'Selling', label: 'Selling' },
        { value: 'Auctioning', label: 'Auctioning' },
        { value: 'Refunding', label: 'Refunding' },
        { value: 'Delivered', label: 'Delivered' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Published', label: 'Published' },
    ];

    const handleStatusChange = useCallback((value: string) => {
        const newStatus = value === 'all' ? undefined : (value as BoxStatus);

        if (typeof onStatusChange === 'function') {
            onStatusChange(newStatus);
        } else {
            console.error(`❌ FilterBar: onStatusChange不是函数`, typeof onStatusChange);
        }
    }, [onStatusChange]);

    return (
        <div className={cn(
            // 基础布局
            "flex justify-center items-center w-full",
            // 内边距和边距
            "px-6 py-4 mb-6",
            // 背景和边框 - 使用 shadcn/ui 设计系统
            "bg-card/50 backdrop-blur-sm border border-border rounded-lg",
            // 阴影效果
            "shadow-sm hover:shadow-md transition-all duration-200",
            // 额外样式
            className
        )}>
            {/* 状态筛选区域 */}
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
