"use client"

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Button, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useShallow } from 'zustand/react/shallow';
import TextP from '@/components/base/text_p';
import { useMarketplaceStore } from '../store/marketplaceStore';
import RangeSelector from '@/components/rangeSelect';
import RangeDateSelector from '@/components/rangeDateSelect';
import { SearchBox } from '@/components/base';
import CountrySelector, { CountryStateSelection } from '@dapp/components/countrySelector/countrySelector2';
import { cn } from '@/lib/utils';
import type { MarketplaceFilters } from '../types/marketplace.types';

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
 * Marketplace filter UI component
 */
const Filter: React.FC<FilterProps> = ({ className, totalItems = 0 }) => {
    const {
        filters,
        // paginationConfig,
        setStatus,
        setSort,
        setPriceRange,
        setIdRange,
        setCountry,
        setState,
        setSearch,
        setDateRange,
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

    // Local state: store pending filter conditions (except search, search remains real-time)
    const [localFilters, setLocalFilters] = useState<Omit<MarketplaceFilters, 'search'>>(() => {
        const { search, ...rest } = filters;
        return rest;
    });

    // Use ref to track if the user is inputting, to avoid being overwritten by the store when inputting
    const isUserInputtingRef = useRef(false);

    // When the filters in the store change (except search), synchronize to the local state
    // But only synchronize in non-user input state (e.g., filters updated from other places)
    useEffect(() => {
        // If the user is inputting, do not synchronize
        if (isUserInputtingRef.current) {
            return;
        }

        const { search, ...rest } = filters;
        setLocalFilters(prev => {
            // Deep comparison, to avoid unnecessary updates
            const statusChanged = prev.status !== rest.status;
            const sortChanged = prev.sort !== rest.sort;
            const priceRangeChanged =
                prev.priceRange?.min !== rest.priceRange?.min ||
                prev.priceRange?.max !== rest.priceRange?.max;
            const idRangeChanged =
                prev.idRange?.start !== rest.idRange?.start ||
                prev.idRange?.end !== rest.idRange?.end;
            const countryChanged = prev.country !== rest.country;
            const stateChanged = prev.state !== rest.state;
            const dateRangeChanged =
                prev.dateRange?.start !== rest.dateRange?.start ||
                prev.dateRange?.end !== rest.dateRange?.end;

            if (statusChanged || sortChanged || priceRangeChanged || idRangeChanged ||
                countryChanged || stateChanged || dateRangeChanged) {
                return rest;
            }
            return prev;
        });
    }, [filters]);

    const dateRangeValue = useMemo<[Dayjs | null, Dayjs | null] | undefined>(() => {
        if (!localFilters.dateRange) {
            return undefined;
        }
        const start = localFilters.dateRange.start ? dayjs(localFilters.dateRange.start) : null;
        const end = localFilters.dateRange.end ? dayjs(localFilters.dateRange.end) : null;
        if (!start && !end) {
            return undefined;
        }
        return [start, end];
    }, [localFilters.dateRange]);

    // Search bar remains real-time search, directly update store
    const handleSearchChange = useCallback((term: string) => {
        setSearch(term);
    }, [setSearch]);

    // Other filter conditions only update local state, do not trigger filtering immediately
    const handleStatusChange = useCallback((value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            status: value as any,
        }));
    }, []);

    const handleSortChange = useCallback((value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            sort: value as any,
        }));
    }, []);

    const handlePriceChange = useCallback((start: string | null, end: string | null) => {
        isUserInputtingRef.current = true;
        setLocalFilters(prev => ({
            ...prev,
            priceRange: {
                min: toNumber(start),
                max: toNumber(end),
            },
        }));
        // Delay reset flag, allowing user to continue inputting
        setTimeout(() => {
            isUserInputtingRef.current = false;
        }, 500);
    }, []);

    const handleIdChange = useCallback((start: string | null, end: string | null) => {
        isUserInputtingRef.current = true;
        setLocalFilters(prev => ({
            ...prev,
            idRange: {
                start: toInteger(start),
                end: toInteger(end),
            },
        }));
        // Delay reset flag, allowing user to continue inputting
        setTimeout(() => {
            isUserInputtingRef.current = false;
        }, 500);
    }, []);

    const handleCountryChange = useCallback((selection: CountryStateSelection) => {
        setLocalFilters(prev => ({
            ...prev,
            country: selection.country?.name || '',
            state: selection.state?.name || '',
        }));
    }, []);

    const handleDateRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
        if (!dates) {
            setLocalFilters(prev => ({
                ...prev,
                dateRange: {
                    start: undefined,
                    end: undefined,
                },
            }));
            return;
        }
        const [start, end] = dates;
        setLocalFilters(prev => ({
            ...prev,
            dateRange: {
                start: start ? start.toISOString() : undefined,
                end: end ? end.toISOString() : undefined,
            },
        }));
    }, []);

    // Confirm button: synchronize local state to store
    const handleConfirm = useCallback(() => {
        // Mark not as user input state, allowing subsequent synchronization
        isUserInputtingRef.current = false;
        
        if (localFilters.status !== undefined) {
            setStatus(localFilters.status);
        }
        if (localFilters.sort !== undefined) {
            setSort(localFilters.sort);
        }
        if (localFilters.priceRange) {
            setPriceRange(localFilters.priceRange.min, localFilters.priceRange.max);
        }
        if (localFilters.idRange) {
            setIdRange(localFilters.idRange.start, localFilters.idRange.end);
        }
        if (localFilters.country !== undefined) {
            setCountry(localFilters.country);
        }
        if (localFilters.state !== undefined) {
            setState(localFilters.state);
        }
        if (localFilters.dateRange) {
            setDateRange(localFilters.dateRange.start, localFilters.dateRange.end);
        }
    }, [localFilters, setStatus, setSort, setPriceRange, setIdRange, setCountry, setState, setDateRange]);

    return (
        <div
            className={cn(
                'w-full p-4 sm:p-6 mt-4 md:mt-6 mb-4 sm:mb-6 bg-card/50',
                ' backdrop-blur-sm border border-border rounded-lg shadow-sm',
                ' hover:shadow-md transition-all duration-200',
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
                            disabled={true}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="w-full flex flex-row items-center justify-center">
                            <TextP>Price:</TextP>
                            <RangeSelector
                                key="price-range-selector"
                                showButton={false}
                                placeholder={{ start: 'Min', end: 'Max' }}
                                onRangeChange={handlePriceChange}
                                type="number"
                                precision={3}
                            />
                        </div>
                        <div className="w-full flex flex-row items-center justify-center">
                            <TextP>ID:</TextP>
                            <RangeSelector
                                key="id-range-selector"
                                showButton={false}
                                placeholder={{ start: 'Start', end: 'End' }}
                                onRangeChange={handleIdChange}
                                type="number"
                                precision={0}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
                            <Select
                                showSearch
                                placeholder="Status"
                                optionFilterProp="label"
                                value={localFilters.status ?? 'Default'}
                                onChange={handleStatusChange}
                                options={statusOptions}
                                allowClear={true}
                            />

                            <Select
                                showSearch
                                placeholder="Sort"
                                optionFilterProp="label"
                                value={localFilters.sort ?? 'Default'}
                                onChange={handleSortChange}
                                options={sortOptions}
                                allowClear={true}
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
                                key={`country-${localFilters.country || 'all'}-${localFilters.state || 'all'}`}
                                onSelectionChange={handleCountryChange}
                                initialCountry={localFilters.country}
                                initialState={localFilters.state}
                                placeholder={{
                                    country: 'Country',
                                    state: 'State',
                                }}
                            />
                        </div>
                    </div>

                    <div className="shrink-0 w-full lg:w-auto lg:min-w-[200px]">
                        <div className="flex flex-row gap-3 justify-center lg:justify-end items-center">
                            <Button
                                size="small"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </Button>

                            <div className="text-sm text-muted-foreground px-3 py-2 whitespace-nowrap flex flex-row">
                                <TextP className="line-clamp-1">Total:</TextP>
                                <TextP className="line-clamp-1">{totalItems}</TextP>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
