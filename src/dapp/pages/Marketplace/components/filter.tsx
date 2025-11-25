"use client"

import React, { useCallback, useMemo } from 'react';
import { Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useShallow } from 'zustand/react/shallow';

import { useMarketplaceStore } from '../store/marketplaceStore';
import RangeSelector from '@dapp/components/rangeSelect';
import RangeDateSelector from '@dapp/components/rangeDateSelect';
import { SearchBox } from '@/dapp/components/base';
import CountrySelector, { CountryStateSelection } from '@/dapp/components/countrySelector/countrySelector2';
import { cn } from '@/lib/utils';

interface FilterProps {
    className?: string;
    totalItems?: number;
}

const statusOptions: { value: string; label: string }[] = [
    { value: 'Default', label: 'All' },
    { value: 'Storing', label: 'Storing' },
    { value: 'Selling', label: 'Selling' },
    { value: 'Auctioning', label: 'Auctioning' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Refunding', label: 'Refunding' },
    { value: 'InSecrecy', label: 'InSecrecy' },
    { value: 'Published', label: 'Published' },
];

const sortOptions: { value: string; label: string }[] = [
    { value: 'Default', label: 'Default' },
    { value: 'price_asc', label: 'Price ↑' },
    { value: 'price_desc', label: 'Price ↓' },
    { value: 'date_asc', label: 'Date ↑' },
    { value: 'date_desc', label: 'Date ↓' },
    { value: 'id_asc', label: 'ID ↑' },
    { value: 'id_desc', label: 'ID ↓' },
];

const paginationModeOptions: { value: string; label: string }[] = [
    { value: 'paginator', label: 'Pages' },
    { value: 'loadMore', label: 'Scroll' },
];

const toNumber = (value: string | null): number | undefined => {
    if (!value?.trim()) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

const toInteger = (value: string | null): number | undefined => {
    if (!value?.trim()) return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * Marketplace 筛选 UI 组件
 */
const Filter: React.FC<FilterProps> = ({ className, totalItems = 0 }) => {
    const {
        filters,
        paginationConfig,
        setStatus,
        setSort,
        setPriceRange,
        setIdRange,
        setCountry,
        setState,
        setSearch,
        setDateRange,
        setPaginationMode,
    } = useMarketplaceStore(useShallow(state => ({
        filters: state.filters,
        paginationConfig: state.paginationConfig,
        setStatus: state.setStatus,
        setSort: state.setSort,
        setPriceRange: state.setPriceRange,
        setIdRange: state.setIdRange,
        setCountry: state.setCountry,
        setState: state.setState,
        setSearch: state.setSearch,
        setDateRange: state.setDateRange,
        setPaginationMode: state.setPaginationMode,
    })));

    const dateRangeValue = useMemo<[Dayjs | null, Dayjs | null] | undefined>(() => {
        if (!filters.dateRange) {
            return undefined;
        }
        const start = filters.dateRange.start ? dayjs(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? dayjs(filters.dateRange.end) : null;
        if (!start && !end) {
            return undefined;
        }
        return [start, end];
    }, [filters.dateRange]);

    const handleStatusChange = useCallback((value: string) => {
        setStatus(value as any);
    }, [setStatus]);

    const handleSortChange = useCallback((value: string) => {
        setSort(value as any);
    }, [setSort]);

    const handleSearchChange = useCallback((term: string) => {
        setSearch(term);
    }, [setSearch]);

    const handlePriceChange = useCallback((start: string | null, end: string | null) => {
        setPriceRange(toNumber(start), toNumber(end));
    }, [setPriceRange]);

    const handleIdChange = useCallback((start: string | null, end: string | null) => {
        setIdRange(toInteger(start), toInteger(end));
    }, [setIdRange]);

    const handleCountryChange = useCallback((selection: CountryStateSelection) => {
        setCountry(selection.country?.name || '');
        setState(selection.state?.name || '');
    }, [setCountry, setState]);

    const handleModeChange = useCallback((mode: string) => {
        setPaginationMode(mode as 'loadMore' | 'paginator');
    }, [setPaginationMode]);

    const handleDateRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
        if (!dates) {
            setDateRange(undefined, undefined);
            return;
        }
        const [start, end] = dates;
        setDateRange(start ? start.toISOString() : undefined, end ? end.toISOString() : undefined);
    }, [setDateRange]);

    return (
        <div
            className={cn(
                'w-full p-4 sm:p-6 mt-4 md:mt-6 mb-4 sm:mb-6 bg-card/50 backdrop-blur-sm border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
                className
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="w-full">
                        <SearchBox
                            placeholder="Search"
                            initialTerm={filters.search || ''}
                            onSearch={handleSearchChange}
                            onSubmit={handleSearchChange}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <RangeSelector
                            key={`price-${filters.priceRange?.min ?? ''}-${filters.priceRange?.max ?? ''}`}
                            label="Price:"
                            showButton={false}
                            placeholder={{ start: 'Min', end: 'Max' }}
                            onRangeChange={handlePriceChange}
                            type="number"
                            decimal={3}
                            className="w-full flex flex-row items-center justify-center gap-1"
                        />

                        <RangeSelector
                            key={`id-${filters.idRange?.start ?? ''}-${filters.idRange?.end ?? ''}`}
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

                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
                            <Select
                                showSearch
                                placeholder="Status"
                                optionFilterProp="label"
                                value={filters.status ?? 'Default'}
                                onChange={handleStatusChange}
                                options={statusOptions}
                            />

                            <Select
                                showSearch
                                placeholder="Sort"
                                optionFilterProp="label"
                                value={filters.sort ?? 'Default'}
                                onChange={handleSortChange}
                                options={sortOptions}
                            />
                        </div>

                        <div className="w-full flex items-center justify-center">
                            <RangeDateSelector
                                value={dateRangeValue}
                                onChange={handleDateRangeChange}
                            />
                        </div>

                        <div className="w-full">
                            <CountrySelector
                                key={`country-${filters.country || 'all'}-${filters.state || 'all'}`}
                                onSelectionChange={handleCountryChange}
                                initialCountry={filters.country}
                                initialState={filters.state}
                                placeholder={{
                                    country: 'Country',
                                    state: 'State',
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[200px]">
                        <div className="flex flex-row gap-3 justify-center lg:justify-end items-center">
                            {/* <div className="w-full lg:w-auto">
                                <Select
                                    value={paginationConfig.mode}
                                    onChange={handleModeChange}
                                    options={paginationModeOptions}
                                    className="w-full lg:min-w-[140px]"
                                />
                            </div> */}

                            <div className="text-sm text-muted-foreground px-3 py-2 whitespace-nowrap">
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
