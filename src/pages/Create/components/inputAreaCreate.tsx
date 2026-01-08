import React from 'react';
import { useFormInputWithLimit } from '../hooks/Input/useFormInput';
import { cn } from '@/lib/utils';
import { Input,} from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

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
            <TextTitle>Description:</TextTitle>
            
            <div className="w-full">
                <Input.TextArea
                    value={String(inputValue)}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    maxLength={maxLength}
                    placeholder="Please enter the description (300-1000 characters)"
                    rows={8}
                    showCount
                    allowClear={true}
                />
            </div>
            {error && <TextP size="sm" type="error">{error}</TextP>}
        </div>
    );
};

export default InputAreaCreate;