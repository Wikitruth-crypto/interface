import { useCreateForm } from '../context/CreateFormContext';

/**
 * 数据验证 Hook (重构版)
 * 使用 React Hook Form 进行验证
 * 
 * 关键改进：
 * - 移除手动字段检查
 * - 使用 RHF 的 trigger() 方法触发所有字段验证
 * - 移除 someInputIsEmpty 状态
 */
export const useCheckData = () => {
  const form = useCreateForm();
  const { trigger, formState } = form;
  
  const checkData = async (): Promise<boolean> => {
    // 触发所有字段的验证
    const isValid = await trigger();
    
    if (!isValid) {
      console.error('Form validation failed:', formState.errors);
      // 可以在这里显示一个通知，告诉用户有哪些字段需要填写
      return false;
    }
    
    return true;
  };

  return { checkData };
}; 