"use client";

import * as React from "react";
import { parseDate } from "chrono-node";
import { DatePicker, Space, ConfigProvider, Alert } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar } from 'lucide-react';

// 工具函数：解析自然语言日期
function parseNaturalDate(input: string): Date | null {
    try {
        const parsed = parseDate(input);
        return parsed || null;
    } catch (error) {
        console.error('Date parsing error:', error);
        return null;
    }
}

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
    naturalLanguage?: boolean; // 是否支持自然语言解析
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
    naturalLanguage = false
}: DateSelectorProps) {
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
    const [error, setError] = React.useState<string>('');
    const [naturalInput, setNaturalInput] = React.useState<string>('');

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

    // 处理自然语言输入
    const handleNaturalLanguageInput = (input: string) => {
        setNaturalInput(input);

        if (!input.trim()) {
            setError('');
            return;
        }

        const parsedDate = parseNaturalDate(input);
        if (parsedDate) {
            const dayjsDate = dayjs(parsedDate);
            if (dayjsDate.isValid()) {
                // 检查是否被禁用
                if (getDisabledDate(dayjsDate)) {
                    setError('Selected date is not available');
                    onError?.('Selected date is not available');
                    return;
                }

                setError('');
                handleDateChange(dayjsDate);
            } else {
                setError('Invalid date format');
                onError?.('Invalid date format');
            }
        } else {
            setError('Could not parse date. Try "tomorrow", "next Monday", "2024-12-25", etc.');
            onError?.('Could not parse date');
        }
    };

    // Ant Design 主题配置
    const antdTheme = {
        components: {
            DatePicker: {
                colorBgContainer: 'var(--background)',
                colorText: 'var(--foreground)',
                colorTextPlaceholder: 'var(--muted-foreground)',
                colorBorder: 'var(--border)',
                colorPrimary: 'var(--primary)',
                borderRadius: 6,
            },
        },
        token: {
            colorBgElevated: 'var(--popover)',
            colorText: 'var(--popover-foreground)',
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

                {/* 自然语言输入 */}
                {naturalLanguage && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Or type: 'tomorrow', 'next Friday', 'Dec 25'..."
                            value={naturalInput}
                            onChange={(e) => setNaturalInput(e.target.value)}
                            onBlur={() => handleNaturalLanguageInput(naturalInput)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleNaturalLanguageInput(naturalInput);
                                }
                            }}
                            disabled={disabled}
                            className={cn(
                                "w-full px-3 py-2 text-sm border rounded-md",
                                "bg-background text-foreground placeholder:text-muted-foreground",
                                "border-input focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring",
                                "font-mono",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        />
                    </div>
                )}

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

// 使用示例组件
export function DateSelectorExample() {
    const [selectedDate, setSelectedDate] = React.useState<DateDataType | null>(null);

    const handleDateChange = (data: DateDataType | null) => {
        setSelectedDate(data);
        console.log('Date changed:', data);
    };

    const handleDateSuccess = (data: DateDataType) => {
        console.log('Date selected successfully:', data);
    };

    const handleDateError = (error: string) => {
        console.error('Date selection error:', error);
    };

    return (
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground">Date Selector Examples</h2>

            {/* 基础日期选择器 */}
            <DateSelector
                label="Birth Date"
                placeholder="Select your birth date"
                maxDate={new Date()} // 不能选择未来日期
                onChange={handleDateChange}
                onSuccess={handleDateSuccess}
                onError={handleDateError}
            />

            {/* 带范围限制的日期选择器 */}
            <DateSelector
                label="Appointment Date"
                placeholder="Choose appointment date"
                minDate={new Date()} // 不能选择过去日期
                maxDate={dayjs().add(90, 'day').toDate()} // 最多90天后
                showToday={true}
                onChange={handleDateChange}
                onSuccess={handleDateSuccess}
            />

            {/* 支持自然语言的日期选择器 */}
            <DateSelector
                label="Deadline Date"
                placeholder="Select deadline"
                naturalLanguage={true}
                format="YYYY-MM-DD"
                displayFormat="dddd, MMMM DD, YYYY"
                onChange={handleDateChange}
                onSuccess={handleDateSuccess}
                onError={handleDateError}
            />

            {/* 不同尺寸和样式 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateSelector
                    label="Small Size"
                    size="small"
                    variant="filled"
                    onChange={handleDateChange}
                />

                <DateSelector
                    label="Large Size"
                    size="large"
                    variant="borderless"
                    onChange={handleDateChange}
                />
            </div>

            {/* 自定义禁用日期 */}
            <DateSelector
                label="Workday Only"
                placeholder="Select a workday"
                disabledDate={(current) => {
                    // 禁用周末
                    return current.day() === 0 || current.day() === 6;
                }}
                onChange={handleDateChange}
                onSuccess={handleDateSuccess}
            />

            {/* 显示选中的日期信息 */}
            {selectedDate && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h3 className="font-medium">Selected Date Information:</h3>
                    <div className="font-mono text-sm space-y-1">
                        <div>Value: {selectedDate.value}</div>
                        <div>Display: {selectedDate.displayValue}</div>
                        <div>Timestamp: {selectedDate.timestamp}</div>
                        <div>ISO: {selectedDate.iso}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
