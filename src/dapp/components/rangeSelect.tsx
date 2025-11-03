"use client";

import { useState, useEffect, useRef } from 'react';
import { Input, Alert } from 'antd';
import BaseButton2 from './base/baseButton2';
import InputNumber  from '@dapp/components/base/inputNumber';
import { AlertCircle } from 'lucide-react';

interface RangeSelectProps {
    label: string;
    placeholder?: {
        start?: string;
        end?: string;
    };
    decimal?: number; // 小数位数，0表示整数，>0表示允许小数
    showButton?: boolean;
    min?: number; // 最小值
    max?: number; // 最大值
    step?: number; // 步长
    onRangeChange?: (start: string | null, end: string | null) => void;
    onConfirm?: (start: string | null, end: string | null) => void;
    className?: string;
    disabled?: boolean;
    allowNegative?: boolean; // 是否允许负数
    showControls?: boolean; // 是否显示加减按钮
    type?: 'number' | 'text';
}

/**
 * 范围选择器组件
 * 用于选择一个范围，例如价格范围、数量范围、ID范围等
 */
export const RangeSelector: React.FC<RangeSelectProps> = ({
    label,
    placeholder = { start: 'Start', end: 'End' },
    decimal = 0, // 默认整数
    showButton = true,
    min,
    max,
    step = decimal > 0 ? 0.1 : 1, // 根据小数位数设置默认步长
    onRangeChange,
    onConfirm,
    className = '',
    disabled = false,
    allowNegative = false, // 默认不允许负数
    showControls = false, // 默认不显示加减按钮以节省空间
    type = 'number'
}) => {
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // 使用 ref 跟踪上次的值，避免重复触发
    const prevStartRef = useRef<string>('');
    const prevEndRef = useRef<string>('');

    // 验证数字格式（根据decimal参数）
    const validateNumberFormat = (value: string): boolean => {
        if (!value || value === '') return true;
        
        // 整数验证
        if (decimal === 0) {
            const integerRegex = allowNegative ? /^-?\d+$/ : /^\d+$/;
            return integerRegex.test(value);
        }
        
        // 小数验证
        const decimalRegex = allowNegative 
            ? new RegExp(`^-?\\d*\\.?\\d{0,${decimal}}$`)
            : new RegExp(`^\\d*\\.?\\d{0,${decimal}}$`);
        return decimalRegex.test(value);
    };

    // 验证输入值
    useEffect(() => {
        if (start && end) {
            if (type === 'number') {
                // 格式验证
                if (!validateNumberFormat(start) || !validateNumberFormat(end)) {
                    setIsError(true);
                    setErrorMessage(`Please enter valid ${decimal === 0 ? 'integers' : `numbers with up to ${decimal} decimal places`}`);
                    return;
                }

                const startNum = parseFloat(start);
                const endNum = parseFloat(end);

                // 数值验证
                if (isNaN(startNum) || isNaN(endNum)) {
                    setIsError(true);
                    setErrorMessage('Please enter valid numbers');
                } else if (startNum >= endNum) {
                    setIsError(true);
                    setErrorMessage('Start value must be less than end value');
                } else if (!allowNegative && (startNum < 0 || endNum < 0)) {
                    setIsError(true);
                    setErrorMessage('Values must be positive');
                } else if (min !== undefined && (startNum < min || endNum < min)) {
                    setIsError(true);
                    setErrorMessage(`Values must be greater than or equal to ${min}`);
                } else if (max !== undefined && (startNum > max || endNum > max)) {
                    setIsError(true);
                    setErrorMessage(`Values must be less than or equal to ${max}`);
                } else {
                    setIsError(false);
                    setErrorMessage('');
                }
            } else {
                setIsError(false);
                setErrorMessage('');
            }
        } else {
            setIsError(false);
            setErrorMessage('');
        }

        // 检查值是否真正变化
        const hasChanged = start !== prevStartRef.current || end !== prevEndRef.current;
        
        // 仅在有效值变化时触发回调，避免初始化时的无效触发
        if (hasChanged) {
            const timeoutId = setTimeout(() => {
                onRangeChange?.(start || null, end || null);
                prevStartRef.current = start;
                prevEndRef.current = end;
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [start, end, type, decimal, allowNegative, min, max, onRangeChange]);

    const handleConfirm = async () => {
        if (isError || (!start && !end)) return;

        setIsLoading(true);
        try {
            await onConfirm?.(start || null, end || null);
        } catch (error) {
            console.error('Error in range selector:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={`space-y-3 ${className}`}>
            <label className="text-sm font-medium font-mono items-center block">
                {label}
            </label>

            <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-3">
                {/* Start Input */}
                <div className="w-full sm:flex-1">
                    {type === 'number' ? (
                        <InputNumber
                            value={start}
                            onChange={setStart}
                            decimals={decimal}
                            min={min}
                            max={max}
                            step={step}
                            placeholder={placeholder.start}
                            disabled={disabled}
                            allowNegative={allowNegative}
                            showControls={showControls}
                            className={` font-mono ${isError ? 'border-destructive' : '' }`}
                        />
                    ) : (
                        <Input
                            type="text"
                            placeholder={placeholder.start}
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            disabled={disabled}
                            className={`w-full font-mono ${isError ? 'border-destructive' : ''}`}
                        />
                    )}
                </div>

                {/* Separator */}
                <div className="hidden sm:block text-muted-foreground">
                    ~
                </div>
                <div className="sm:hidden w-full text-center text-muted-foreground text-sm">
                    to
                </div>

                {/* End Input */}
                <div className="w-full sm:flex-1">
                    {type === 'number' ? (
                        <InputNumber
                            value={end}
                            onChange={setEnd}
                            decimals={decimal}
                            min={min}
                            max={max}
                            step={step}
                            placeholder={placeholder.end}
                            disabled={disabled}
                            allowNegative={allowNegative}
                            showControls={showControls}
                            className={isError ? 'border-destructive' : ''}
                        />
                    ) : (
                        <Input
                            type="text"
                            placeholder={placeholder.end}
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            disabled={disabled}
                            className={`w-full font-mono ${isError ? 'border-destructive' : ''}`}
                        />
                    )}
                </div>

                {/* Action Buttons */}
                {/* <div className="flex gap-2 w-full sm:w-auto"> */}

                {showButton && (
                    <BaseButton2
                        variant="default"
                        size="small"
                        onClick={handleConfirm}
                        disabled={disabled || isError || (!start && !end) || isLoading}
                    // className="flex-1 sm:flex-none"
                    >
                        {isLoading ? 'wait...' : 'Confirm'}
                    </BaseButton2>
                )}
                {/* </div> */}
            </div>

            {/* Error Message */}
            {isError && errorMessage && (
                <Alert
                    type="error"
                    message={errorMessage}
                    icon={<AlertCircle className="h-4 w-4" />}
                    className="mt-2"
                />
            )}
        </div>
    );
};

// 默认导出
export default RangeSelector;

// 使用示例组件
export const RangeSelectorExample = () => {
    const handleRangeChange = (start: string | null, end: string | null) => {
        console.log('Range changed:', { start, end });
    };

    const handleConfirm = async (start: string | null, end: string | null) => {
        console.log('Range confirmed:', { start, end });
        // 这里可以处理提交逻辑，比如API调用
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
    };

    return (
        <div className="space-y-6 p-4 max-w-md">
            {/* 价格范围 - 支持2位小数 */}
            <RangeSelector
                label="Price Range ($)"
                placeholder={{ start: 'Min Price', end: 'Max Price' }}
                onRangeChange={handleRangeChange}
                onConfirm={handleConfirm}
                type="number"
                decimal={3}
                allowNegative={false}
                showControls={false}
            />

            {/* ID范围 - 仅整数 */}
            <RangeSelector
                label="ID Range"
                placeholder={{ start: 'Start ID', end: 'End ID' }}
                onRangeChange={handleRangeChange}
                onConfirm={handleConfirm}
                type="number"
                decimal={0}
                min={1}
                allowNegative={false}
                showControls={false}
            />

            {/* 权重范围 - 支持3位小数 */}
            <RangeSelector
                label="Weight Range"
                placeholder={{ start: 'Min Weight', end: 'Max Weight' }}
                onRangeChange={handleRangeChange}
                onConfirm={handleConfirm}
                type="number"
                decimal={3}
                min={0}
                max={100}
                step={0.001}
                allowNegative={false}
                showControls={true}
            />

            {/* 温度范围 - 允许负数和1位小数 */}
            <RangeSelector
                label="Temperature Range (°C)"
                placeholder={{ start: 'Min Temp', end: 'Max Temp' }}
                onRangeChange={handleRangeChange}
                onConfirm={handleConfirm}
                type="number"
                decimal={1}
                min={-50}
                max={100}
                allowNegative={true}
                showControls={false}
            />

            {/* 文本范围（非数字） */}
            <RangeSelector
                label="Date Range"
                placeholder={{ start: 'Start Date', end: 'End Date' }}
                onRangeChange={handleRangeChange}
                onConfirm={handleConfirm}
                type="text"
            />
        </div>
    );
};

