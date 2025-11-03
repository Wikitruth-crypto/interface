import React, { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { FormFieldName } from '../../types/stateType';

/**
 * 通用表单输入 Hook
 * 替代所有重复的输入 Hook，统一处理表单输入逻辑
 * 
 * 优势：
 * - 消除重复代码
 * - 统一验证逻辑
 * - 简化维护
 */
export const useFormInput = (fieldName: FormFieldName) => {
    const form = useCreateForm();
    const { formState, watch } = form;

    // 监听当前值
    const inputValue = watch(fieldName) || '';

    // 获取错误状态（仅在 touched 后显示）
    const error = formState.touchedFields[fieldName]
        ? (formState.errors[fieldName] as any)?.message
        : undefined;

    // 强制重新渲染当错误状态改变时
    const [forceUpdate, setForceUpdate] = React.useState(0);
    React.useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [formState.errors[fieldName], formState.touchedFields[fieldName]]);

    // 处理输入变化
    const handleChange = useCallback((value: string) => {
        (form.setValue as any)(fieldName, value, {
            shouldValidate: false, // 输入时不验证，避免干扰用户输入
            shouldDirty: true,
        });
    }, [form, fieldName]);

    // 处理失焦事件 - 标记为 touched 并触发验证
    const handleBlur = useCallback(() => {
        // 直接标记为 touched 并触发验证
        (form.setValue as any)(fieldName, inputValue, {
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, fieldName, inputValue]);

    return {
        inputValue,
        error,
        handleChange,
        handleBlur,
        // 提供字符计数信息
        charCount: inputValue.length,
    };
};

/**
 * 带长度限制的表单输入 Hook
 * 用于需要显示字符计数的字段
 */
export const useFormInputWithLimit = (fieldName: FormFieldName, maxLength?: number) => {
    const baseHook = useFormInput(fieldName);

    // 带长度限制的输入处理
    const handleChangeWithLimit = useCallback((value: string) => {
        // 如果有最大长度限制，则限制输入
        if (maxLength && value.length > maxLength) {
            return; // 不更新值
        }
        baseHook.handleChange(value);
    }, [baseHook, maxLength]);

    return {
        ...baseHook,
        handleChange: handleChangeWithLimit,
        maxLength,
    };
};

/**
 * 支持实时验证的表单输入 Hook
 * 用于需要实时反馈的字段（如密码强度、格式检查等）
 */
export const useFormInputWithRealtimeValidation = (fieldName: FormFieldName) => {
    const form = useCreateForm();
    const { formState, watch } = form;

    // 监听当前值
    const inputValue = watch(fieldName) || '';

    // 获取错误状态（实时显示）
    const error = formState.errors[fieldName]?.message;

    // 处理输入变化（实时验证）
    const handleChange = useCallback((value: string) => {
        (form.setValue as any)(fieldName, value, {
            shouldValidate: true, // 实时验证
            shouldDirty: true,
        });
    }, [form, fieldName]);

    // 处理失焦事件
    const handleBlur = useCallback(() => {
        (form.setValue as any)(fieldName, inputValue, {
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, fieldName, inputValue]);

    return {
        inputValue,
        error,
        handleChange,
        handleBlur,
        charCount: inputValue.length,
    };
};
