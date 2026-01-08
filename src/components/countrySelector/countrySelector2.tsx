import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import theworldData from './theworld.json';
import { Select } from 'antd';

const { Option } = Select;

// Data type definition
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

// antd Select option type
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
 * CountrySelector - Country state selection component
 * 
 * A fully functional location selector, supporting state。
 * Using antd Select component to implement, supporting search functionality.
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

    // Tool function: find country code by country name
    const findCountryCode = (countryName?: string): string | null => {
        if (!countryName) return null;

        const countryEntry = Object.entries(theworld).find(
            ([, country]) => country.name === countryName
        );

        return countryEntry ? countryEntry[0] : null;
    };

    // Tool function: find state code by state name
    const findStateCode = (countryCode: string | null, stateName?: string): string | null => {
        if (!countryCode || !stateName) return null;

        const country = theworld[countryCode];
        if (!country) return null;

        const stateEntry = Object.entries(country.states).find(
            ([, state]) => state.name === stateName
        );

        return stateEntry ? stateEntry[0] : null;
    };

    // Initialize selection
    const initialCountryCode = findCountryCode(initialCountry);
    const initialStateCode = findStateCode(initialCountryCode, initialState);
    const initialStates = initialCountryCode ? theworld[initialCountryCode].states : {};

    const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(initialCountryCode);
    const [selectedStateCode, setSelectedStateCode] = useState<string | null>(initialStateCode);
    const [states, setStates] = useState<{ [key: string]: State }>(initialStates);

    // Avoid duplicate notification references
    const prevSelectionRef = useRef<CountryStateSelection | null>(null);
    const onSelectionChangeRef = useRef(onSelectionChange);

    // Update callback reference
    useEffect(() => {
        onSelectionChangeRef.current = onSelectionChange;
    });

    // Country selection processing
    const handleCountrySelect = (value: string) => {
        setSelectedCountryCode(value);
        setSelectedStateCode(null);

        if (value && theworld[value]) {
            setStates(theworld[value].states);
        } else {
            setStates({});
        }
    };

    // State selection processing
    const handleStateSelect = (value: string) => {
        setSelectedStateCode(value);
    };

    // Notify parent component of selection changes
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

        // Check if the same as the last selection
        const prevSelection = prevSelectionRef.current;
        if (prevSelection &&
            prevSelection.country.value === currentSelection.country.value &&
            prevSelection.state.value === currentSelection.state.value) {
            return;
        }

        prevSelectionRef.current = currentSelection;
        onSelectionChangeRef.current(currentSelection);
    }, [selectedCountryCode, selectedStateCode]);

    // Generate country options
    const countryOptions: SelectOption[] = Object.keys(theworld).map((countryCode) => ({
        value: countryCode,
        label: `${theworld[countryCode].name} (${countryCode})`,
        phoneCode: theworld[countryCode].codes.phone,
        countryName: theworld[countryCode].name
    }));

    // Generate state options
    const stateOptions: SelectOption[] = Object.keys(states).map((stateCode) => ({
        value: stateCode,
        label: `${states[stateCode].name} (${stateCode})`,
        stateName: states[stateCode].name
    }));

    // Custom country filtering function (search country name, country code, phone number)
    const countryFilterOption = (input: string, option?: SelectOption): boolean => {
        if (!option || !input) return true;
        
        const searchText = input.toLowerCase().trim();
        if (!searchText) return true;

        return (
            // Search country name
            (option.countryName && option.countryName.toLowerCase().includes(searchText)) ||
            // Search country code
            option.value.toLowerCase().includes(searchText) ||
            // Search phone number (contains + and does not contain +)
            (option.phoneCode && option.phoneCode.includes(searchText)) ||
            (option.phoneCode && `+${option.phoneCode}`.includes(searchText)) ||
            // Search label (full display text)
            option.label.toLowerCase().includes(searchText)
        );
    };

    // Custom state filtering function (search state name, state code)
    const stateFilterOption = (input: string, option?: SelectOption): boolean => {
        if (!option || !input) return true;
        
        const searchText = input.toLowerCase().trim();
        if (!searchText) return true;

        return (
            // Search state name
            (option.stateName && option.stateName.toLowerCase().includes(searchText)) ||
            // Search state code
            option.value.toLowerCase().includes(searchText) ||
            // Search label (full display text)
            option.label.toLowerCase().includes(searchText)
        );
    };

    return (
        <div className={cn("flex gap-4", className)}>
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
                    notFoundContent={selectedCountryCode ? "No matching state found" : "Please select a country first"}
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
