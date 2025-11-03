'use client';

import { useInputChangeTracker } from './hooks/useInputChangeTracker';
import FormContainer from './containers/formContainer';
import { CreateFormProvider } from './context/CreateFormContext';
import { cn } from '@/lib/utils';

interface CreateProps {
    className?: string;
}

/**
 * Create 页面主组件
 * 
 * 架构说明：
 * - CreateFormProvider 提供统一的表单实例给所有子组件
 * - 所有输入组件通过 useCreateForm() 共享同一个表单状态
 * - 确保验证、错误状态在所有组件间同步
 */
export default function Create({ className }: CreateProps) {
    useInputChangeTracker();
    
    return (
        <CreateFormProvider>
            <div className={cn("flex flex-col items-center justify-center w-full ", className)}>
                <FormContainer />
                {/* <SmartRetryTest /> */}
            </div>
        </CreateFormProvider>
    );
}
