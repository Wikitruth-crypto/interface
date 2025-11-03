import { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { useNumberInput } from '@/dapp/hooks/useNumberInput';

/**
 * 价格输入 Hook (简化版)
 * 保留数字格式化功能，移除重复的验证逻辑
 */
export const usePriceInput = (decimals: number = 3) => {
    const form = useCreateForm();
    const { formState, watch } = form;

    // 使用通用数字输入 hooks 进行格式化
    const { value: formattedValue, handleNumberChange } = useNumberInput(decimals);

    // 监听表单中的价格值
    const inputValue = watch('price') || '';

    // 获取错误状态（仅在 touched 后显示）
    const error = formState.touchedFields.price
        ? formState.errors.price?.message
        : undefined;

    // 处理输入变更
    const handlePriceChange = useCallback((value: string) => {
        // 使用 useNumberInput 进行格式化
        handleNumberChange(value);

        // 更新表单值
        form.setValue('price', value, {
            shouldValidate: formState.touchedFields.price,
            shouldDirty: true,
        });
    }, [handleNumberChange, form, formState.touchedFields.price]);

    // 处理失焦事件 - 标记为 touched 并触发验证
    const handleBlur = useCallback(() => {
        form.setValue('price', inputValue, {
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, inputValue]);

    return {
        error,
        inputValue,
        handlePriceChange,
        handleBlur,
        formattedValue, // 格式化后的值
        decimals,
    };
};
