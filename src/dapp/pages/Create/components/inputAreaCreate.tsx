import React from 'react';
import { useFormInputWithLimit } from '../hooks/Input/useFormInput';
import { cn } from '@/lib/utils';
import InputArea from '@/dapp/components/base/inputArea';
import { Input,Typography } from 'antd';

interface InputAreaCreateProps {
    className?: string;
}

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
                <Input.TextArea
                    value={String(inputValue)}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    maxLength={maxLength}
                    placeholder="Please enter the description (300-1000 characters)"
                    rows={8}
                    showCount
                />
            </div>
            {error && <Typography.Text type="danger">{error}</Typography.Text>}
        </div>
    );
};

export default InputAreaCreate;