"use client";

import * as React from "react";
import { DatePicker, Space, Alert } from 'antd';
// import type { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar } from 'lucide-react';

// Data format
export interface DateDataType {
    value: string;        // Formatted date string (YYYY-MM-DD)
    displayValue: string; // Date string for display
    date: Date;          // JavaScript Date object
    dayjs: Dayjs;        // Dayjs object
    timestamp: number;   // Unix timestamp
    iso: string;         // ISO 8601 format string
}

export interface DateSelectorProps {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    showToday?: boolean;
    format?: string;           // Date format, default 'YYYY-MM-DD'
    displayFormat?: string;    // Display format, default 'MMMM DD, YYYY'
    disabledDate?: (current: Dayjs) => boolean;
    minDate?: Date | string;   // Minimum date
    maxDate?: Date | string;   // Maximum date
    defaultValue?: Date | string | Dayjs;
    value?: Date | string | Dayjs;
    onChange?: (data: DateDataType | null) => void;
    onSuccess?: (data: DateDataType) => void;
    onError?: (error: string) => void;
    className?: string;
    size?: 'small' | 'middle' | 'large';
    variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
}

export function DateSelector({
    label,
    placeholder = "Please select a date",
    disabled = false,
    allowClear = true,
    showToday = true,
    format = 'YYYY-MM-DD',
    displayFormat = 'MMMM DD, YYYY',
    disabledDate,
    minDate,
    maxDate,
    defaultValue,
    value,
    onChange,
    onSuccess,
    onError,
    className = '',
    size = 'middle',
    variant = 'outlined',
}: DateSelectorProps) {
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
    const [error, setError] = React.useState<string>('');

    // Initialize default value
    React.useEffect(() => {
        if (defaultValue) {
            const initial = dayjs(defaultValue);
            if (initial.isValid()) {
                setSelectedDate(initial);
            }
        }
    }, [defaultValue]);

    // Handle external value change
    React.useEffect(() => {
        if (value === undefined) {
            setSelectedDate(null);
            return;
        }

        const newDate = value ? dayjs(value) : null;
        if (newDate?.isValid()) {
            setSelectedDate(newDate);
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    // Create disabled date function
    const getDisabledDate = React.useCallback((current: Dayjs): boolean => {
        if (disabledDate) {
            return disabledDate(current);
        }

        let disabled = false;

        if (minDate) {
            const min = dayjs(minDate);
            if (min.isValid() && current.isBefore(min, 'day')) {
                disabled = true;
            }
        }

        if (maxDate) {
            const max = dayjs(maxDate);
            if (max.isValid() && current.isAfter(max, 'day')) {
                disabled = true;
            }
        }

        return disabled;
    }, [disabledDate, minDate, maxDate]);

    // Create date data object
    const createDateData = (date: Dayjs): DateDataType => {
        const jsDate = date.toDate();
        return {
            value: date.format(format),
            displayValue: date.format(displayFormat),
            date: jsDate,
            dayjs: date,
            timestamp: jsDate.getTime(),
            iso: jsDate.toISOString()
        };
    };

    // Handle date selection change
    const handleDateChange = (date: Dayjs | null) => {
        setError('');
        setSelectedDate(date);

        if (date && date.isValid()) {
            const dateData = createDateData(date);
            onChange?.(dateData);
            onSuccess?.(dateData);
        } else {
            onChange?.(null);
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {label && (
                <label className="text-sm font-medium font-mono flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {label}
                </label>
            )}

            <div className="space-y-2">
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        allowClear={allowClear}
                        showNow={showToday}
                        format={format}
                        disabledDate={getDisabledDate}
                        size={size}
                        variant={variant}
                        style={{ width: '100%' }}
                        className="font-mono"
                    />
                </Space>

                {/* Selected date display */}
                {selectedDate && !error && (
                    <div className="text-sm text-muted-foreground font-mono">
                        Selected: {selectedDate.format(displayFormat)}
                    </div>
                )}
            </div>

            {/* Error提示 */}
            {error && (
                <Alert
                    type="error"
                    message={error}
                    icon={<AlertCircle className="h-4 w-4" />}
                    className="mt-2 font-mono text-sm"
                />
            )}
        </div>
    );
}
