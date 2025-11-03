import { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';

/**
 * 标签输入 Hook (重构版)
 * 使用 React Hook Form 管理验证和错误状态
 * 
 * 关键改进：
 * - 集成 RHF 进行数组验证
 * - 支持最小/最大标签数量验证
 */
export const useLabelInput = () => {
  const form = useCreateForm();
  const { formState, watch } = form;
  
  // 监听当前值
  const labels = watch('label') || [];
  
  // 获取错误状态（仅在 touched 后显示）
  const isTouched = formState.touchedFields.label as boolean | undefined;
  const error = isTouched
    ? formState.errors.label?.message 
    : undefined;

  // 更新标签数组
  const handleLabelsChange = useCallback((newLabels: string[]) => {
    form.setValue('label', newLabels, {
      shouldValidate: Boolean(isTouched), // 如果已 touched，则实时验证
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [form, isTouched]);

  return {
    labels,
    handleLabelsChange,
    error,
  };
}; 