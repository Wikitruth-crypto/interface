"use client";

import * as React from "react";
import { DatePicker, Space, Alert } from 'antd';
// import type { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar } from 'lucide-react';

// 数据格式
export interface DateDataType {
    value: string;        // 格式化的日期字符串 (YYYY-MM-DD)
    displayValue: string; // 显示用的日期字符串
    date: Date;          // JavaScript Date 对象
    dayjs: Dayjs;        // Dayjs 对象
    timestamp: number;   // Unix 时间戳
    iso: string;         // ISO 8601 格式字符串
}

export interface DateSelectorProps {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    showToday?: boolean;
    format?: string;           // 日期格式，默认 'YYYY-MM-DD'
    displayFormat?: string;    // 显示格式，默认 'MMMM DD, YYYY'
    disabledDate?: (current: Dayjs) => boolean;
    minDate?: Date | string;   // 最小日期
    maxDate?: Date | string;   // 最大日期
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

    // 初始化默认值
    React.useEffect(() => {
        if (defaultValue) {
            const initial = dayjs(defaultValue);
            if (initial.isValid()) {
                setSelectedDate(initial);
            }
        }
    }, [defaultValue]);

    // 处理外部 value 变化
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

    // 创建禁用日期函数
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

    // 创建日期数据对象
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

    // 处理日期选择变化
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
                        showToday={showToday}
                        format={format}
                        disabledDate={getDisabledDate}
                        size={size}
                        variant={variant}
                        style={{ width: '100%' }}
                        className="font-mono"
                    />
                </Space>

                {/* 选中日期显示 */}
                {selectedDate && !error && (
                    <div className="text-sm text-muted-foreground font-mono">
                        Selected: {selectedDate.format(displayFormat)}
                    </div>
                )}
            </div>

            {/* 错误提示 */}
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
