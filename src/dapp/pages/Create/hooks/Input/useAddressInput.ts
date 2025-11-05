import { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { ethers } from 'ethers';

/**
 * NFT Owner 地址输入 Hook (重构版)
 * 使用 React Hook Form 管理验证和错误状态
 * 
 * 关键改进：
 * - 移除验证逻辑（由 Zod schema 处理地址格式验证）
 * - 移除 debounce（RHF 的 onBlur 模式已经足够优化）
 * - 保留地址格式化功能
 */
export const useAddressInput = () => {
    const form = useCreateForm();
    const { register, formState, watch } = form;

    // 监听当前值
    const inputValue = watch('nftOwner') || '';

    // 获取错误状态（仅在 touched 后显示）
    const error = formState.touchedFields.nftOwner
        ? formState.errors.nftOwner?.message
        : undefined;

  // 处理输入变更
  const handleTypeChange = useCallback((value: string) => {
    // 自动转换为小写并去除空格
    const formattedValue = value.trim();
    
    form.setValue('nftOwner', formattedValue, {
      shouldValidate: formState.touchedFields.nftOwner, // 如果已 touched，则实时验证
      shouldDirty: true,
    });
  }, [form, formState.touchedFields.nftOwner]);

  // 处理失焦事件 - 标记为 touched 并触发验证
  const handleBlur = useCallback(() => {
    form.setValue('nftOwner', inputValue, {
      shouldTouch: true,    // ✅ 标记为已触摸
      shouldValidate: true, // ✅ 触发验证
    });
  }, [form, inputValue]);

  const isValidEthereumAddress = (address: string): boolean => {
    // return /^0x[a-fA-F0-9]{40}$/.test(address);
    return ethers.isAddress(address);
  };

  return {
    inputValue,
    handleTypeChange,
    handleBlur,
    error,
    isValidFormat: isValidEthereumAddress(inputValue), // 用于 UI 提示
  };
};
