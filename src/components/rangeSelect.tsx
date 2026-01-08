"use client";

import { useState, useEffect, useRef } from 'react';
import { Input, Alert, InputNumber, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface RangeSelectProps {
    placeholder?: {
        start?: string;
        end?: string;
    };
    precision?: number; 
    showButton?: boolean;
    min?: number; 
    max?: number;
    onRangeChange?: (start: string | null, end: string | null) => void;
    onConfirm?: (start: string | null, end: string | null) => void;
    disabled?: boolean;
    allowNegative?: boolean; 
    type?: 'number' | 'text';
}

/**
 * Range selector component
 * Used to select a range, such as price range, quantity range, ID range, etc.
 */
export const RangeSelector: React.FC<RangeSelectProps> = ({
    placeholder = { start: 'Start', end: 'End' },
    precision = 0, 
    showButton = true,
    min,
    max,
    onRangeChange,
    onConfirm,
    disabled = false,
    allowNegative = false, 
    type = 'number'
}) => {
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Use ref to track the last value, avoid repeated triggering
    const prevStartRef = useRef<string>('');
    const prevEndRef = useRef<string>('');

    // Convert string to number (for InputNumber)
    const startNum = start && start.trim() !== '' ? (type === 'number' ? Number(start) : null) : null;
    const endNum = end && end.trim() !== '' ? (type === 'number' ? Number(end) : null) : null;

    // Validate number format (according to precision parameter)
    const validateNumberFormat = (value: string): boolean => {
        if (!value || value === '') return true;

        // Integer validation
        if (precision === 0) {
            const integerRegex = allowNegative ? /^-?\d+$/ : /^\d+$/;
            return integerRegex.test(value);
        }

        // Decimal validation
        const precisionRegex = allowNegative
            ? new RegExp(`^-?\\d*\\.?\\d{0,${precision}}$`)
            : new RegExp(`^\\d*\\.?\\d{0,${precision}}$`);
        return precisionRegex.test(value);
    };

    // Validate input values
    useEffect(() => {
        if (start && end) {
            if (type === 'number') {
                // Format validation
                if (!validateNumberFormat(start) || !validateNumberFormat(end)) {
                    setIsError(true);
                    setErrorMessage(`Please enter valid ${precision === 0 ? 'integers' : `numbers with up to ${precision} precision places`}`);
                    return;
                }

                const startNum = parseFloat(start);
                const endNum = parseFloat(end);

                // Number validation
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

        // Check if the value has actually changed
        const hasChanged = start !== prevStartRef.current || end !== prevEndRef.current;

        // Only trigger callback when the value has actually changed, avoid invalid triggering during initialization
        if (hasChanged) {
            const timeoutId = setTimeout(() => {
                onRangeChange?.(start || null, end || null);
                prevStartRef.current = start;
                prevEndRef.current = end;
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [start, end, type, precision, allowNegative, min, max, onRangeChange]);

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
        <Space direction="vertical" size="middle" style={{ width: '100%' }} >

            <Space.Compact style={{ width: '100%' }} size="small">
                {/* Start Input */}
                {type === 'number' ? (
                    <InputNumber
                        value={startNum}
                        onChange={(value) => setStart(value !== null && value !== undefined ? String(value) : '')}
                        precision={precision > 0 ? precision : undefined}
                        min={allowNegative ? (min !== undefined ? min : undefined) : (min !== undefined ? Math.max(0, min) : 0)}
                        max={max}
                        placeholder={placeholder.start}
                        disabled={disabled}
                        style={{ flex: 1, fontFamily: 'monospace' }}
                        status={isError ? 'error' : ''}
                        controls={false}
                    />
                ) : (
                    <Input
                        type="text"
                        placeholder={placeholder.start}
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        disabled={disabled}
                        style={{ flex: 1, fontFamily: 'monospace' }}
                        status={isError ? 'error' : ''}
                    />
                )}

                {/* Separator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    minWidth: '24px',
                    justifyContent: 'center'
                }}>
                    <Text type="secondary">~</Text>
                </div>

                {/* End Input */}
                {type === 'number' ? (
                    <InputNumber
                        value={endNum}
                        onChange={(value) => setEnd(value !== null && value !== undefined ? String(value) : '')}
                        precision={precision > 0 ? precision : undefined}
                        min={allowNegative ? (min !== undefined ? min : undefined) : (min !== undefined ? Math.max(0, min) : 0)}
                        max={max}
                        placeholder={placeholder.end}
                        disabled={disabled}
                        style={{ flex: 1, fontFamily: 'monospace' }}
                        status={isError ? 'error' : ''}
                        controls={false}
                    />
                ) : (
                    <Input
                        type="text"
                        placeholder={placeholder.end}
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        disabled={disabled}
                        style={{ flex: 1, fontFamily: 'monospace' }}
                        status={isError ? 'error' : ''}
                    />
                )}

                {/* Confirm Button */}
                {showButton && (
                    <Button
                        type="primary"
                        size="small"
                        onClick={handleConfirm}
                        disabled={disabled || isError || (!start && !end) || isLoading}
                        loading={isLoading}
                    >
                        Confirm
                    </Button>
                )}
            </Space.Compact>

            {/* Error Message */}
            {isError && errorMessage && (
                <Alert
                    type="error"
                    message={errorMessage}
                    icon={<ExclamationCircleOutlined />}
                    showIcon
                />
            )}
        </Space>
    );
};

export default RangeSelector;