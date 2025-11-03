"use client"
import React from 'react';
import { Typography } from 'antd';
import { Button } from 'antd';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
// import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import Paragraph from '@/components/base/paragraph';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useCurrentBox } from '../hooks/useCurrentBox';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CancelButton: React.FC<Props> = ({ onClick, className }) => {
  const { boxId } = useCurrentBox()
  const disabled = useButtonDisabled('cancelRefundDisabled');
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  const allConfigs = useAllContractConfigs();
  
  // 使用集中的按钮交互状态
  const { currentAction, isPending } = useButtonInteractionStore();

  const handleCancel = async () => {
    onClick?.();
    await write_BoxDetail({
      contract: allConfigs.Exchange,
      functionName: 'CancelRefund',
      args: [boxId],
    });
  };

  // 计算按钮状态
  const isLoading = currentAction === 'cancelRefund' && isPending;
  const isDisabled = disabled || (currentAction !== null && currentAction !== 'cancelRefund');

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <div className={'flex flex-col items-center'}>
          <Button
            color='primary'
            variant='outlined'
            onClick={handleCancel}
            loading={isLoading}
            disabled={isDisabled}
          >
            Cancel
          </Button>
          {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
        </div>

        <div className={'flex flex-col items-center'}>
          <Typography.Paragraph className="text-muted-foreground text-sm">Cancel refund, the transaction will be completed.</Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CancelButton); 