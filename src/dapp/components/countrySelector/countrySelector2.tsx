import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import theworldData from './theworld.json';
import { Select } from 'antd';

const { Option } = Select;

// 数据类型定义
interface State {
    name: string;
}

interface Country {
    name: string;
    codes: {
        phone: string;
    };
    states: {
        [key: string]: State;
    };
}

interface WorldData {
    [key: string]: Country;
}

// antd Select 选项类型
interface SelectOption {
    value: string;
    label: string;
    phoneCode?: string;
    countryName?: string;
    stateName?: string;
}

export interface CountryStateSelection {
    country: {
        value: string;
        number: string;
        name: string;
    };
    state: {
        value: string;
        number: string;
        name: string;
    };
}

export interface CountrySelectorProps {
    onSelectionChange?: (selection: CountryStateSelection) => void;
    initialCountry?: string;
    initialState?: string;
    className?: string;
    placeholder?: {
        country?: string;
        state?: string;
    };
    disabled?: boolean;
    required?: boolean;
    countryWidth?: string;
    stateWidth?: string;
    searchable?: boolean;
}

/**
 * CountrySelector - 国家州省选择器组件
 * 
 * 一个功能完整的地理位置选择器，支持国家和对应州省的联动选择。
 * 使用 antd Select 组件实现，支持搜索功能。
 */
const CountrySelector: React.FC<CountrySelectorProps> = ({
    onSelectionChange,
    initialCountry,
    initialState,
    className,
    placeholder = {
        country: 'Select a country',
        state: 'Select a state'
    },
    disabled = false,
    required = false,
    countryWidth = "w-48",
    stateWidth = "w-44",
    searchable = true
}) => {
    const theworld: WorldData = theworldData as WorldData;

    // 工具函数：根据国家名找到国家代码
    const findCountryCode = (countryName?: string): string | null => {
        if (!countryName) return null;

        const countryEntry = Object.entries(theworld).find(
            ([, country]) => country.name === countryName
        );

        return countryEntry ? countryEntry[0] : null;
    };

    // 工具函数：根据州名找到州代码
    const findStateCode = (countryCode: string | null, stateName?: string): string | null => {
        if (!countryCode || !stateName) return null;

        const country = theworld[countryCode];
        if (!country) return null;

        const stateEntry = Object.entries(country.states).find(
            ([, state]) => state.name === stateName
        );

        return stateEntry ? stateEntry[0] : null;
    };

    // 初始化选择
    const initialCountryCode = findCountryCode(initialCountry);
    const initialStateCode = findStateCode(initialCountryCode, initialState);
    const initialStates = initialCountryCode ? theworld[initialCountryCode].states : {};

    const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(initialCountryCode);
    const [selectedStateCode, setSelectedStateCode] = useState<string | null>(initialStateCode);
    const [states, setStates] = useState<{ [key: string]: State }>(initialStates);

    // 避免重复通知的引用
    const prevSelectionRef = useRef<CountryStateSelection | null>(null);
    const onSelectionChangeRef = useRef(onSelectionChange);

    // 更新回调引用
    useEffect(() => {
        onSelectionChangeRef.current = onSelectionChange;
    });

    // 国家选择处理
    const handleCountrySelect = (value: string) => {
        setSelectedCountryCode(value);
        setSelectedStateCode(null);

        if (value && theworld[value]) {
            setStates(theworld[value].states);
        } else {
            setStates({});
        }
    };

    // 州选择处理
    const handleStateSelect = (value: string) => {
        setSelectedStateCode(value);
    };

    // 通知父组件选择变化
    useEffect(() => {
        if (!onSelectionChangeRef.current) return;

        const selectedCountry = selectedCountryCode ? theworld[selectedCountryCode] : null;
        const selectedState = selectedStateCode && selectedCountry ? selectedCountry.states[selectedStateCode] : null;

        const currentSelection: CountryStateSelection = {
            country: {
                value: selectedCountryCode || '',
                number: selectedCountry?.codes.phone || '',
                name: selectedCountry?.name || ''
            },
            state: {
                value: selectedStateCode || '',
                number: '',
                name: selectedState?.name || ''
            }
        };

        // 检查是否与上一次选择相同
        const prevSelection = prevSelectionRef.current;
        if (prevSelection &&
            prevSelection.country.value === currentSelection.country.value &&
            prevSelection.state.value === currentSelection.state.value) {
            return;
        }

        prevSelectionRef.current = currentSelection;
        onSelectionChangeRef.current(currentSelection);
    }, [selectedCountryCode, selectedStateCode]);

    // 生成国家选项
    const countryOptions: SelectOption[] = Object.keys(theworld).map((countryCode) => ({
        value: countryCode,
        label: `${theworld[countryCode].name} (${countryCode})`,
        phoneCode: theworld[countryCode].codes.phone,
        countryName: theworld[countryCode].name
    }));

    // 生成州选项
    const stateOptions: SelectOption[] = Object.keys(states).map((stateCode) => ({
        value: stateCode,
        label: `${states[stateCode].name} (${stateCode})`,
        stateName: states[stateCode].name
    }));

    // 自定义国家过滤函数（搜索国家名、国家代码、电话号码）
    const countryFilterOption = (input: string, option?: SelectOption): boolean => {
        if (!option || !input) return true;
        
        const searchText = input.toLowerCase().trim();
        if (!searchText) return true;

        return (
            // 搜索国家名称
            (option.countryName && option.countryName.toLowerCase().includes(searchText)) ||
            // 搜索国家代码
            option.value.toLowerCase().includes(searchText) ||
            // 搜索电话号码（包含+号和不含+号）
            (option.phoneCode && option.phoneCode.includes(searchText)) ||
            (option.phoneCode && `+${option.phoneCode}`.includes(searchText)) ||
            // 搜索标签（完整显示文本）
            option.label.toLowerCase().includes(searchText)
        );
    };

    // 自定义州过滤函数（搜索州名、州代码）
    const stateFilterOption = (input: string, option?: SelectOption): boolean => {
        if (!option || !input) return true;
        
        const searchText = input.toLowerCase().trim();
        if (!searchText) return true;

        return (
            // 搜索州名称
            (option.stateName && option.stateName.toLowerCase().includes(searchText)) ||
            // 搜索州代码
            option.value.toLowerCase().includes(searchText) ||
            // 搜索标签（完整显示文本）
            option.label.toLowerCase().includes(searchText)
        );
    };

    return (
        <div className={cn("flex gap-4", className)}>
            {/* 国家选择器 */}
            <div className={countryWidth}>
                <Select
                    showSearch={searchable}
                    placeholder={placeholder.country}
                    filterOption={searchable ? countryFilterOption : false}
                    disabled={disabled}
                    value={selectedCountryCode}
                    onChange={handleCountrySelect}
                    className="w-full"
                    allowClear
                    size="middle"
                >
                    {countryOptions.map(option => (
                        <Option 
                            key={option.value} 
                            value={option.value}
                            label={option.label}
                            phoneCode={option.phoneCode}
                            countryName={option.countryName}
                        >
                            <div className="flex justify-between items-center">
                                <span>{theworld[option.value].name}</span>
                                <span className="text-gray-500 text-sm">
                                    +{option.phoneCode}
                                </span>
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>

            {/* 州选择器 */}
            <div className={stateWidth}>
                <Select
                    showSearch={searchable}
                    placeholder={placeholder.state}
                    filterOption={searchable ? stateFilterOption : false}
                    disabled={disabled || !selectedCountryCode}
                    value={selectedStateCode}
                    onChange={handleStateSelect}
                    className="w-full"
                    allowClear
                    size="middle"
                    notFoundContent={selectedCountryCode ? "未找到匹配的州省" : "请先选择国家"}
                >
                    {stateOptions.map(option => (
                        <Option 
                            key={option.value} 
                            value={option.value}
                            label={option.label}
                            stateName={option.stateName}
                        >
                            {states[option.value].name}
                        </Option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default CountrySelector;
