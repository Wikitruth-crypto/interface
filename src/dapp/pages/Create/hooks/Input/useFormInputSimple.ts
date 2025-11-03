// import { useCallback, useState } from 'react';
// import { useCreateForm } from '../../context/CreateFormContext';

// /**
//  * 简化的表单输入 Hook
//  * 直接处理验证，避免延迟问题
//  */
// export const useFormInputSimple = (fieldName: FormFieldName) => {
//   const form = useCreateForm();
//   const { formState, watch } = form;
  
//   // 监听当前值
//   const inputValue = watch(fieldName) || '';
  
//   // 本地状态管理 touched 状态
//   const [isTouched, setIsTouched] = useState(false);
  
//   // 获取错误状态
//   const error = isTouched && formState.errors[fieldName] 
//     ? (formState.errors[fieldName] as any)?.message 
//     : undefined;
    
//   // 处理输入变化
//   const handleChange = useCallback((value: string) => {
//     form.setValue(fieldName, value as any, {
//       shouldValidate: false,
//       shouldDirty: true,
//     });
//   }, [form, fieldName]);
  
//   // 处理失焦事件
//   const handleBlur = useCallback(() => {
//     setIsTouched(true);
//     // 立即触发验证
//     form.trigger(fieldName);
//   }, [form, fieldName]);
  
//   return {
//     inputValue,
//     error,
//     handleChange,
//     handleBlur,
//     charCount: inputValue.length,
//   };
// };

// /**
//  * 带长度限制的简化 Hook
//  */
// export const useFormInputSimpleWithLimit = (fieldName: FormFieldName, maxLength?: number) => {
//   const baseHook = useFormInputSimple(fieldName);
  
//   // 带长度限制的输入处理
//   const handleChangeWithLimit = useCallback((value: string) => {
//     if (maxLength && value.length > maxLength) {
//       return; // 不更新值
//     }
//     baseHook.handleChange(value);
//   }, [baseHook, maxLength]);
  
//   return {
//     ...baseHook,
//     handleChange: handleChangeWithLimit,
//     maxLength,
//   };
// };
