import React, { useCallback } from 'react';
import { useCreateForm } from '../context/CreateFormContext';
import {Radio} from 'antd';
import TextTitle from '@/components/base/text_title';


const RadioSelectCreate: React.FC = () => {
    const form = useCreateForm();
    const { watch } = form;
    
    const mintMethod = watch('mintMethod') || 'create';
    
    const onChange = useCallback((value: string | number) => {
        form.setValue('mintMethod', value as 'create' | 'createAndPublish', {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [form]);
    
    return (
        <div className="flex flex-col space-y-2">
            <TextTitle>Mint Method:</TextTitle>
            <div className="flex flex-row gap-2 ">
                <Radio.Group buttonStyle='solid' 
                    onChange={(e) => onChange(e.target.value)} 
                    defaultValue={mintMethod}
                >
                    <Radio.Button value="create">Storing</Radio.Button>
                    <Radio.Button value="createAndPublish">Publish</Radio.Button>
                </Radio.Group>
            </div>
        </div>
    );
}

export default RadioSelectCreate;

