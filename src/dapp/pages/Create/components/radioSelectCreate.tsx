import React, { useCallback } from 'react';
import { useCreateForm } from '../context/CreateFormContext';
// import RadioCard from '@/dapp/components/base/radioCard';
import {Radio} from 'antd';

/**
 * RadioSelectCreate - Mint 方法选择器 (重构版)
 * 使用 React Hook Form 进行状态管理
 */
const RadioSelectCreate: React.FC = () => {
    const form = useCreateForm();
    const { watch } = form;
    
    // 监听当前选择的 mint 方法
    const mintMethod = watch('mintMethod') || 'create';
    
    const onChange = useCallback((value: string | number) => {
        form.setValue('mintMethod', value as 'create' | 'createAndPublish', {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [form]);
    
    return (
        <div className="flex flex-col space-y-2">
            <div className="font-mono text-sm">Mint Method:</div>
            <div className="flex flex-row gap-2 ">
                {/* <RadioCard
                    label="Storing"
                    variant="outline"
                    value="create"
                    size="small"
                    onClick={onChange}
                    selected={mintMethod === 'create'}
                />
                <RadioCard
                    label="Publish"
                    variant="outline"
                    value="createAndPublish"
                    size="small"
                    onClick={onChange}
                    selected={mintMethod === 'createAndPublish'}
                /> */}
                <Radio.Group buttonStyle='outline' onChange={(e) => onChange(e.target.value)} defaultValue={mintMethod}>
                    <Radio.Button value="create">Storing</Radio.Button>
                    <Radio.Button value="createAndPublish">Publish</Radio.Button>
                </Radio.Group>
            </div>
        </div>
    );
}

export default RadioSelectCreate;

