import React from 'react';
import { useFormInputWithLimit } from '../hooks/Input/useFormInput';
import { cn } from '@/lib/utils';
import { Input, Typography, Space } from 'antd';
interface InputTypeOfCrimeProps {
    className?: string;
}

export const InputTypeOfCrime: React.FC<InputTypeOfCrimeProps> = ({ className }) => {
    const { inputValue, handleChange, handleBlur, error, maxLength } = useFormInputWithLimit('typeOfCrime', 20);

    const handleSanitizedChange = (value: string) => {
        const sanitizedValue = value.replace(/[^\p{L}\s]/gu, '');
        handleChange(sanitizedValue);
    };

    return (
        <div className={cn("flex flex-col w-full space-y-2", className)}>
            <div className="font-mono text-sm">Crime Event Type:</div>
            <Space direction="horizontal" className="w-full">
                <Input
                    onChange={(e) => handleSanitizedChange(e.target.value)}
                    onBlur={handleBlur}
                    value={String(inputValue)}
                    placeholder="Please input the type of crime"
                    minLength={1}
                    maxLength={maxLength}
                    className="w-full md:w-md"
                />
                <Typography.Text type="secondary">
                    Such as: Modular, Insider Trading, etc.
                </Typography.Text>
            </Space>
            {error && <Typography.Text type="danger">
                {error}
            </Typography.Text>}
        </div>
    );
}
