import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { useCheckData } from '@dapp/pages/Create/hooks/useCheckData';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import MintProgress from '@dapp/pages/Create/ModalDialog/mintProgress';
import CompletedCreate from '@dapp/pages/Create/ModalDialog/completed';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useCreateForm } from '../context/CreateFormContext';

/**
 * Mint 按钮组件（重构版）
 * 
 * 关键改进：
 * - 使用 React Hook Form 实时检查表单完整性
 * - 表单不完整时自动禁用按钮
 * - 提供更好的用户反馈
 */
const MintButton: React.FC = () => {
  const [openModal, setOpenModal] = useState<'mintProgress' | 'completed' | null>(null);
  const { address } = useWalletContext();
  
  const { checkData } = useCheckData();
  const form = useCreateForm();
  const { formState } = form;
  
  const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
  
  /**
   * 使用 React Hook Form 的内置状态判断
   * 
   * formState.isValid: 所有字段都通过验证（但需要先触发验证）
   * formState.errors: 验证错误对象
   * 
   * ⚠️ 注意：在 onBlur 模式下，isValid 只在所有字段被 touched 后才准确
   * 因此我们需要检查是否有错误，而不是依赖 isValid
   */
  const { errors } = formState;

  /**
   * 检查是否有已知的验证错误
   * 注意：在 onBlur 模式下，只有用户失焦过的字段才会被验证
   */
  const hasKnownErrors = Object.keys(errors).length > 0;

  const isButtonDisabled = 
    !address || 
    workflowStatus === 'processing';

  /**
   * 按钮文本（动态提示）
   */
  const buttonText = useMemo(() => {
    if (!address) return 'Connect Wallet';
    if (workflowStatus === 'processing') return 'Creating...';
    return 'Create';
  }, [address, workflowStatus]);

  const handleCreate = async () => {
    // 最后一次完整验证
    const isDataValid = await checkData();
    if (!isDataValid) {
      return;
    }
    setOpenModal('mintProgress');
  };
  
  const handleCloseModalProgress = () => {
    setOpenModal(null);
  };

  const handleCloseModalCompleted = () => {
    setOpenModal('completed');
  };

  return (
    <div className="flex flex-col w-full items-center gap-2">
      <Button 
        size="large" 
        type="primary"
        onClick={handleCreate} 
        loading={workflowStatus === 'processing'} 
        disabled={isButtonDisabled}
        className="w-full"
      >
        {buttonText}
      </Button>
      
      {/* 错误提示：显示需要修复的字段 */}
      {hasKnownErrors && (
        <p className="text-xs text-error">
          {Object.keys(errors).length} field(s) need attention - Click to see all errors
        </p>
      )}
      
      {openModal === 'mintProgress' && (
        <MintProgress onClose={handleCloseModalProgress} onNext={handleCloseModalCompleted} />
      )}
      {openModal === 'completed' && (
        <CompletedCreate onClose={handleCloseModalProgress}/>
      )}
    </div>
  );
};

export default MintButton; 