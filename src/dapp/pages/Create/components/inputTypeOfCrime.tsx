import React from 'react';
import InputText from '@/dapp/components/base/inputBox';
import { useFormInputWithLimit } from '../hooks/Input/useFormInput';
import { cn } from '@/lib/utils';

interface InputTypeOfCrimeProps {
    className?: string;
}

/**
 * 犯罪类型输入组件 (简化版)
 * 使用通用 useFormInputWithLimit Hook
 */
export const InputTypeOfCrime: React.FC<InputTypeOfCrimeProps> = ({ className }) => {
    const { inputValue, handleChange, handleBlur, error, maxLength } = useFormInputWithLimit('typeOfCrime', 20);

    const handleSanitizedChange = (value: string) => {
        const sanitizedValue = value.replace(/[^\p{L}\s]/gu, '');
        handleChange(sanitizedValue);
    };

    return (
        <div className={cn("flex flex-col w-full space-y-2", className)}>
            <div className="font-mono text-sm">Crime Event Type:</div>
            <div className="flex flex-col md:flex-row w-full gap-2">
                <InputText
                    onChange={handleSanitizedChange}
                    onBlur={handleBlur}
                    value={String(inputValue)}
                    placeholder="Please input the type of crime"
                    minLength={1}
                    maxLength={maxLength}
                    className="w-full md:w-md"
                />
                <p className="text-sm text-gray-500">
                    Such as: Modular, Insider Trading, etc.
                </p>
            </div>
            {error && <p className={cn(
                "text-sm font-light text-error",
                "px-1 leading-tight"
            )}>
                {error}
            </p>}
        </div>
    );
}
