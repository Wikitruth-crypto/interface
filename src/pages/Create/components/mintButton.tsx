import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { useCheckData } from '@Create/hooks/useCheckData';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import MintProgress from '@Create/ModalDialog/mintProgress';
import CompletedCreate from '@Create/ModalDialog/completed';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useCreateForm } from '../context/CreateFormContext';
import TextP from '@/components/base/text_p';

const MintButton: React.FC = () => {
  const [openModal, setOpenModal] = useState<'mintProgress' | 'completed' | null>(null);
  const { address } = useWalletContext();
  
  const { checkData } = useCheckData();
  const form = useCreateForm();
  const { formState } = form;
  
  const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
  
  /**
   * Use React Hook Form's built-in status to determine
   * 
   * formState.isValid: All fields pass validation (but need to trigger validation first)
   * formState.errors: Validation error object
   * 
   * ⚠️ Note: In onBlur mode, isValid is only accurate after all fields are touched
   * Therefore we need to check for errors, rather than relying on isValid
   */
  const { errors } = formState;

  /**
   * Check if there are known validation errors
   * Note: In onBlur mode, only fields that have been touched by the user will be validated
   */
  const hasKnownErrors = Object.keys(errors).length > 0;

  const isButtonDisabled = 
    !address || 
    workflowStatus === 'processing';

  /**
   * Button text (dynamic prompt)
   */
  const buttonText = useMemo(() => {
    if (!address) return 'Connect Wallet';
    if (workflowStatus === 'processing') return 'Creating...';
    return 'Create';
  }, [address, workflowStatus]);

  const handleCreate = async () => {
    // Last complete validation
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
      
      {/* Error提示：显示需要修复的字段 */}
      {hasKnownErrors && (
        <TextP size="sm" type="error">
          {Object.keys(errors).length} field(s) need attention - Click to see all errors
        </TextP>
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