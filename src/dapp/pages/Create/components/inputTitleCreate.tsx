import React from 'react';
import { useFormInputDirectWithLimit } from '../hooks/Input/useFormInputDirect';
import { cn } from '@/lib/utils';
import { Input } from 'antd';

interface InputTitleCreateProps {
    className?: string;
}

/**
 * 标题输入组件 (简化版)
 * 使用通用 useFormInputWithLimit Hook
 */
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
                status={error ? 'error' : undefined}
                showCount
            />
            {error && <p className="text-sm text-destructive font-light">{error}</p>}
        </div>
    );
};

export default InputTitleCreate; 