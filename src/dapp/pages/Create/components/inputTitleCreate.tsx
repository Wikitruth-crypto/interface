import React from 'react';
import { useFormInputDirectWithLimit } from '../hooks/Input/useFormInputDirect';
import { cn } from '@/lib/utils';
import { Input, Typography } from 'antd';

interface InputTitleCreateProps {
    className?: string;
}

export const InputTitleCreate: React.FC<InputTitleCreateProps> = ({ className }) => {
    const { inputValue, handleChange, handleBlur, error, charCount, maxLength } = useFormInputDirectWithLimit('title', 150);

    return (
        <div className={cn("w-full space-y-2", className)}>
            <div className="font-mono text-sm">Title:</div>
            <Input
                type="text"
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                value={inputValue}
                maxLength={maxLength}
                placeholder="Please enter the title (40-150 characters)"
                // status={error ? 'error' : undefined}
                showCount
            />
            {error && <Typography.Text type="danger">{error}</Typography.Text>}
        </div>
    );
};

export default InputTitleCreate; 