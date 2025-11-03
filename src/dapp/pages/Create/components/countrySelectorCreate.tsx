'use client'

import React, { useCallback } from 'react';
import { useCreateForm } from '../context/CreateFormContext';
import CountrySelector, { CountryStateSelection } from '@/dapp/components/countrySelector/countrySelector';
import { cn } from '@/lib/utils';

interface CountrySelectorCreateProps {
    /** 自定义样式类名 */
    className?: string;
}

/**
 * CountrySelectorCreate - Create页面专用的国家选择器 (重构版)
 * 使用 React Hook Form 进行验证
 * 
 * 关键改进：
 * - 移除 someInputIsEmpty 验证逻辑
 * - 使用 RHF 统一管理错误状态
 */
const CountrySelectorCreate: React.FC<CountrySelectorCreateProps> = ({
    className
}) => {
    const form = useCreateForm();
    const { formState } = form;

    const countryValue = form.watch('country');
    const stateValue = form.watch('state');
    
    // 获取错误状态（仅在 touched 后显示）
    const error = formState.touchedFields.country 
        ? formState.errors.country?.message 
        : undefined;
    
    // 防止初始错误显示
    const shouldShowError = formState.touchedFields.country && formState.errors.country;
    
    // 处理选择变化
    const handleSelectionChange = useCallback((selection: CountryStateSelection | null) => {
        if (selection) {
            // 先设置值，不触发验证
            form.setValue('country', selection.country.name, {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: false, // 不立即标记为 touched
            });
            form.setValue('state', selection.state.name, {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: false, // 不立即标记为 touched
            });
            
            // 延迟标记为 touched 并触发验证
            setTimeout(() => {
                form.setValue('country', selection.country.name, {
                    shouldTouch: true,
                    shouldValidate: true,
                });
                form.setValue('state', selection.state.name, {
                    shouldTouch: true,
                    shouldValidate: true,
                });
            }, 100);
        }
    }, [form]);

    return (
        <div className={cn("flex flex-col w-full lg:w-md space-y-2", className)}>
            <div className="font-mono text-sm">Country/Region:</div>
            {/* 国家选择器 */}
            <div className="w-full">
                <CountrySelector
                    onSelectionChange={handleSelectionChange}
                    placeholder={{
                        country: "Select a country",
                        state: "Select a state"
                    }}
                    initialCountry={countryValue || undefined}
                    initialState={stateValue || undefined}
                />
            </div>
            
            {/* 错误提示 */}
            {shouldShowError && (
                <p className={cn(
                    "text-sm font-light text-error",
                    "px-1 leading-tight"
                )}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default CountrySelectorCreate;
