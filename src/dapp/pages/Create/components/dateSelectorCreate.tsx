'use client'
import React, { useCallback } from 'react';
import { useCreateForm } from '../context/CreateFormContext';
import { DateSelector, DateDataType } from '@/dapp/components/dateSelector';
import { cn } from '@/lib/utils';

interface DateSelectorCreateProps {
    className?: string;
}

/**
 * DateSelectorCreate - Create页面专用的日期选择器 (重构版)
 * 使用 React Hook Form 进行验证
 * 
 * 关键改进：
 * - 移除 someInputIsEmpty 验证逻辑
 * - 使用 RHF 统一管理错误状态
 */
const DateSelectorCreate: React.FC<DateSelectorCreateProps> = ({
    className
}) => {
    const form = useCreateForm();
    const { formState } = form;
    const eventDateValue = form.watch('eventDate');
    
    // 获取错误状态（仅在 touched 后显示）
    const error = formState.touchedFields.eventDate 
        ? formState.errors.eventDate?.message 
        : undefined;

    const handleDateChange = useCallback((date: DateDataType) => {
        console.log('Event date selected:', date);
        form.setValue('eventDate', date.value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    }, [form]);

    return (
        <div className={cn("flex flex-col w-full lg:max-w-[300px] space-y-2", className)}>
            <div className="font-mono text-sm">Event Date:</div>
            {/* 日期选择器 */}
            <div className="w-full">
                <DateSelector
                    onSuccess={handleDateChange}
                    value={eventDateValue || undefined}
                />
            </div>
            
            {/* 错误提示 */}
            {error && (
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

export default DateSelectorCreate;
