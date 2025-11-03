import { useCallback, useState, useEffect } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { FormFieldName } from '../../types/stateType';

/**
 * 直接验证的表单输入 Hook
 * 使用本地状态管理验证，避免 React Hook Form 的延迟问题
 */
export const useFormInputDirect = (fieldName: FormFieldName) => {
  const form = useCreateForm();
  const { watch } = form;
  
  // 监听当前值
  const inputValue = watch(fieldName) || '';
  
  // 本地状态管理
  const [isTouched, setIsTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  
  // 处理输入变化
  const handleChange = useCallback((value: string) => {
    form.setValue(fieldName, value as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    
    // 如果已经 touched，立即验证
    if (isTouched) {
      validateField(value);
    }
  }, [form, fieldName, isTouched]);
  
  // 处理失焦事件
  const handleBlur = useCallback(() => {
    setIsTouched(true);
    const stringValue = Array.isArray(inputValue) ? inputValue.join(',') : inputValue;
    validateField(stringValue);
  }, [inputValue]);
  
  // 验证字段
  const validateField = useCallback((value: string) => {
    // 获取字段的验证规则
    const fieldSchema = form.getFieldState(fieldName);
    
    // 简单的验证逻辑
    let error: string | undefined = undefined;
    
    if (fieldName === 'title') {
      if (!value || value.trim().length === 0) {
        error = 'Title is required';
      } else if (value.length < 40) {
        error = 'Title must be at least 40 characters';
      } else if (value.length > 150) {
        error = 'Title must be no more than 150 characters';
      }
    } else if (fieldName === 'description') {
      if (!value || value.trim().length === 0) {
        error = 'Description is required';
      } else if (value.length < 100) {
        error = 'Description must be at least 100 characters';
      } else if (value.length > 1000) {
        error = 'Description must be no more than 1000 characters';
      }
    } else if (fieldName === 'typeOfCrime') {
      if (!value || value.trim().length === 0) {
        error = 'Type of crime is required';
      } else if (value.length > 20) {
        error = 'Type of crime must be no more than 20 characters';
      }
    }
    
    setLocalError(error);
    
    // 同时更新表单状态
    if (error) {
      form.setError(fieldName, { type: 'manual', message: error });
    } else {
      form.clearErrors(fieldName);
    }
  }, [form, fieldName]);
  
  // 当值改变时重新验证（如果已经 touched）
  useEffect(() => {
    if (isTouched) {
      const stringValue = Array.isArray(inputValue) ? inputValue.join(',') : inputValue;
      validateField(stringValue);
    }
  }, [inputValue, isTouched, validateField]);
  
  return {
    inputValue,
    error: localError,
    handleChange,
    handleBlur,
    charCount: inputValue.length,
  };
};

/**
 * 带长度限制的直接验证 Hook
 */
export const useFormInputDirectWithLimit = (fieldName: FormFieldName, maxLength?: number) => {
  const baseHook = useFormInputDirect(fieldName);
  
  // 带长度限制的输入处理
  const handleChangeWithLimit = useCallback((value: string) => {
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
