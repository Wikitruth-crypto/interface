import React from 'react';
import { useFormInputWithLimit } from '../hooks/Input/useFormInput';
import { cn } from '@/lib/utils';
import InputArea from '@/dapp/components/base/inputArea';

interface InputAreaCreateProps {
    className?: string;
}

/**
 * 描述输入组件 (简化版)
 * 使用通用 useFormInputWithLimit Hook
 */
const InputAreaCreate: React.FC<InputAreaCreateProps> = ({className}) => {
    const { 
        inputValue, 
        handleChange, 
        handleBlur,
        error, 
        maxLength 
    } = useFormInputWithLimit('description', 1000);

    return (
        <div className={cn("flex flex-col w-full space-y-2", className)}>
            <div className="font-mono text-sm">Description:</div>
            
            <div className="w-full">
                <InputArea
                    showCount
                    maxLength={maxLength}
                    onChange={(value: string) => handleChange(value)}
                    onBlur={handleBlur}
                    placeholder="Please enter the description (300-1000 characters)"
                    className="responsive-textarea"
                    style={{ resize: 'none' }}
                    value={String(inputValue)}
                    rows={8}
                    error={error}
                />
            </div>
        </div>
    );
};

export default InputAreaCreate;