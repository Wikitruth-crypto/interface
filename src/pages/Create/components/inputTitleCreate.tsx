import React from 'react';
import { useFormInputDirectWithLimit } from '../hooks/Input/useFormInputDirect';
import { cn } from '@/lib/utils';
import { Input, } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

interface InputTitleCreateProps {
    className?: string;
}

export const InputTitleCreate: React.FC<InputTitleCreateProps> = ({ className }) => {
    const { inputValue, handleChange, handleBlur, error, charCount, maxLength } = useFormInputDirectWithLimit('title', 150);

    return (
        <div className={cn("w-full space-y-2", className)}>
            <TextTitle>Title:</TextTitle>
            <Input
                type="text"
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                value={inputValue}
                maxLength={maxLength}
                placeholder="Please enter the title (40-150 characters)"
                allowClear={true}
                showCount
            />
            {error && <TextP size="sm" type="error">{error}</TextP>}
        </div>
    );
};

export default InputTitleCreate; 