import React from 'react';
import { useFormInputWithLimit } from '../hooks/Input/useFormInput';
import { cn } from '@/lib/utils';
import { Input, } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

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
            <TextTitle>Crime Event Type:</TextTitle>
            <TextP size="sm" type="secondary">
                Such as: Modular, Insider Trading, etc.
            </TextP>
            <Input
                onChange={(e) => handleSanitizedChange(e.target.value)}
                onBlur={handleBlur}
                value={String(inputValue)}
                placeholder="Please input the type of crime"
                minLength={1}
                maxLength={maxLength}
                className="w-full max-w-xs"
                allowClear={true}
            />

            {error && <TextP size="sm" type="error">
                {error}
            </TextP>}
        </div>
    );
}
