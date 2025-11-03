"use client"

import React, { useCallback } from 'react';
// import { CustomSelect } from '@dapp/components/base/customSelect';
import { Select, Button } from 'antd';

import { useMarketplaceStore } from '../store/marketplaceStore';
import RangeSelector from '@dapp/components/rangeSelect';
import { cn } from '@/lib/utils';
// import BaseButton from '@dapp/components/base/baseButton';
import RangeDateSelector from '@dapp/components/rangeDateSelect';
import { SearchBox } from '@/dapp/components/base';
import CountrySelector, { CountryStateSelection } from '@/dapp/components/countrySelector/countrySelector2';
import { useMarketplaceBoxes } from '../hooks/useMarketplaceBoxes';


interface FilterProps {
    className?: string;
}

/**
 * Marketplace 筛选UI组件
 */
const Filter: React.FC<FilterProps> = ({ className }) => {
    // 获取筛选条件（actions 引用稳定，不需要 shallow）
    const filters = useMarketplaceStore(state => state.filters);
    const setStatus = useMarketplaceStore(state => state.setStatus);
    const setSort = useMarketplaceStore(state => state.setSort);
    const setPriceRange = useMarketplaceStore(state => state.setPriceRange);
    const setIdRange = useMarketplaceStore(state => state.setIdRange);
    const setCountry = useMarketplaceStore(state => state.setCountry);
    const setState = useMarketplaceStore(state => state.setState);
    
    // 分页配置
    const paginationConfig = useMarketplaceStore(state => state.paginationConfig);
    const setPaginationMode = useMarketplaceStore(state => state.setPaginationMode);

    const {
        totalItems,
    } = useMarketplaceBoxes();

    const statuses: { value: string; label: string }[] = [
        { value: 'Default', label: 'All' },
        { value: 'Storing', label: 'Storing' },
        { value: 'Selling', label: 'Selling' },
        { value: 'Auctioning', label: 'Auctioning' },
        { value: 'Paid', label: 'Paid' },
        { value: 'Refunding', label: 'Refunding' },
        { value: 'InSecrecy', label: 'InSecrecy' },
        { value: 'Published', label: 'Published' },
        // { value: 'Blacklisted', label: 'Blacklisted' }, // 暂时不支持黑名单
    ];

    const sortOptions: { value: string; label: string }[] = [
        { value: 'Default', label: 'Default' },
        { value: 'price_asc', label: 'Price Asc' },
        { value: 'price_desc', label: 'Price Desc' },
        { value: 'id_asc', label: 'ID Asc' },
        { value: 'id_desc', label: 'ID Desc' },
    ];

    // 处理事件的临时函数 - 后续实现业务逻辑
    const handleStatusChange = (status: string) => {
        console.log('🔧 Filter: 状态变化', { 旧状态: filters.status, 新状态: status });
        setStatus(status as any);
    };

    const handleSortChange = (sort: string) => {
        console.log('🔧 Filter: 排序变化', { 旧排序: filters.sort, 新排序: sort });
        setSort(sort as any);
    };

    const handleSearchChange = (search: string) => {
        console.log('search:', search);
    };

    const handlePriceChange = useCallback((start: string | null, end: string | null) => {
        console.log('🔧 Filter: 价格范围变化', { start, end });

        // 转换为数字类型，null或空字符串转为undefined
        const minPrice = start && start.trim() !== '' ? parseFloat(start) : undefined;
        const maxPrice = end && end.trim() !== '' ? parseFloat(end) : undefined;

        // 验证数字是否有效
        const validMin = minPrice !== undefined && !isNaN(minPrice) ? minPrice : undefined;
        const validMax = maxPrice !== undefined && !isNaN(maxPrice) ? maxPrice : undefined;

        console.log('🔧 Filter: 解析后的价格范围', {
            原始: { start, end },
            解析: { minPrice, maxPrice },
            有效: { validMin, validMax }
        });

        // 调用store方法更新价格范围
        setPriceRange(validMin, validMax);
    }, [setPriceRange]);

    const handleIdChange = useCallback((start: string | null, end: string | null) => {
        console.log('🔧 Filter: ID范围变化', { start, end });

        // 转换为整数类型，null或空字符串转为undefined
        const startId = start && start.trim() !== '' ? parseInt(start, 10) : undefined;
        const endId = end && end.trim() !== '' ? parseInt(end, 10) : undefined;

        // 验证数字是否有效
        const validStart = startId !== undefined && !isNaN(startId) ? startId : undefined;
        const validEnd = endId !== undefined && !isNaN(endId) ? endId : undefined;

        console.log('🔧 Filter: 解析后的ID范围', {
            原始: { start, end },
            解析: { startId, endId },
            有效: { validStart, validEnd }
        });

        // 调用store方法更新ID范围
        setIdRange(validStart, validEnd);
    }, [setIdRange]);

    const handleCountryChange = (selection: CountryStateSelection) => {
        console.log('country selection:', selection);
        setCountry(selection.country?.value || '');
        setState(selection.state?.value || '');
    };

    const handleModeChange = (mode: string) => {
        console.log('🔧 Filter: 分页模式变化', { 旧模式: paginationConfig.mode, 新模式: mode });
        setPaginationMode(mode as 'loadMore' | 'paginator');
    };

    // 临时禁用状态 - 后续根据实际筛选条件判断
    const disabled = true;

    const paginationModeOptions: { value: string; label: string }[] = [
        { value: 'paginator', label: 'Pages' },
        { value: 'loadMore', label: 'Scroll' },
    ];

    return (
        <div className={cn(
            // 基础布局
            "w-full",
            // 内边距和边距
            "p-4 sm:p-6 mt-4 md:mt-6 mb-4 sm:mb-6",
            // 背景和边框 - 使用 shadcn/ui 设计系统
            "bg-card/50 backdrop-blur-sm border border-border rounded-lg",
            // 阴影效果
            "shadow-sm hover:shadow-md transition-all duration-200",
            className
        )}>
            {/* 主筛选区域 - 分组布局 */}
            <div className="space-y-4">
                {/* 第一行：搜索和范围选择器组 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 搜索框 - 独立一列 */}
                    <div className="w-full">
                        <SearchBox
                            placeholder="Search"
                            onSearch={handleSearchChange}
                            className="w-full"
                            disabled={true}
                        />
                    </div>

                    {/* 价格和ID范围选择器组 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 价格范围 */}
                        <div className="w-full">
                            <RangeSelector
                                label="Price:"
                                showButton={false}
                                placeholder={{ start: 'Min', end: 'Max' }}
                                onRangeChange={handlePriceChange}
                                type="number"
                                decimal={3}
                                className="w-full flex flex-row items-center justify-center gap-1"
                            />
                        </div>

                        {/* ID范围 */}
                        <div className="w-full">
                            <RangeSelector
                                label="ID:"
                                showButton={false}
                                placeholder={{ start: 'Start', end: 'End' }}
                                onRangeChange={handleIdChange}
                                type="number"
                                decimal={0}
                                className="w-full flex flex-row items-center justify-center gap-1"
                            />
                        </div>
                    </div>
                </div>

                {/* 第二行：筛选器和操作组 */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                    {/* 左侧筛选器组 */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {/* 状态和排序组 */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
                            {/* 状态筛选 */}
                            <div className="w-full">
                                <Select
                                    showSearch
                                    placeholder="Status"
                                    optionFilterProp="label"
                                    onChange={handleStatusChange}
                                    // onSearch={onSearch}
                                    options={statuses}
                                />
                            </div>

                            {/* 排序 */}
                            <div className="w-full">
                                <Select
                                    showSearch
                                    placeholder="Sort"
                                    optionFilterProp="label"
                                    onChange={handleSortChange}
                                    // onSearch={onSearch}
                                    options={sortOptions}
                                />
                            </div>
                        </div>

                        {/* 日期筛选: 暂时不使用 */}
                        <div className="w-full flex items-center justify-center">
                            <RangeDateSelector disabled={true} />
                        </div>

                        {/* 国家筛选 */}
                        <div className="w-full">
                            <CountrySelector
                                disabled={false}
                                onSelectionChange={handleCountryChange}
                                placeholder={{
                                    country: "Country",
                                    state: "State"
                                }}
                            />
                        </div>

                        {/* 空白占位（超宽屏时） */}
                        {/* <div className="hidden xl:block w-full"></div> */}
                    </div>

                    {/* 右侧操作组 */}
                    <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[200px]">
                        <div className="flex flex-row gap-3 justify-center lg:justify-end items-center">
                            

                            {/* 提交按钮 */}
                            {/* <Button
                                type="primary"
                                size="middle"
                                onClick={handleSubmit}
                                disabled={true}
                                className="px-6 whitespace-nowrap"
                            >
                                Submit
                            </Button> */}

                            {/* 分页模式切换 */}
                            <div className="w-full lg:w-auto">
                                <Select
                                    value={paginationConfig.mode}
                                    onChange={handleModeChange}
                                    options={paginationModeOptions}
                                    className="w-full lg:min-w-[140px]"
                                />
                            </div>

                            {/* 结果数量显示 */}
                            <div className="text-sm text-muted-foreground px-3 py-2  whitespace-nowrap">
                                <span className="font-medium">Total:</span>
                                <span className="ml-1 font-mono">{totalItems}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
