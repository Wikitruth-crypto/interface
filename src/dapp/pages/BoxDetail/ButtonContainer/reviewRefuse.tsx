"use client"
import React from 'react';
import { Typography } from 'antd';
import BaseButton from '@/dapp/components/base/baseButton';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import Paragraph from '@/components/base/paragraph';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxContext } from '../contexts/BoxContext';

interface Props {
  onClick?: () => void;
  className?: string;
}

const RefuseButton: React.FC<Props> = ({ onClick, className }) => {
  const { boxId } = useBoxContext();
  const disabled = useButtonDisabled('refuseRefundDisabled');
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  const allConfigs = useAllContractConfigs();
  
  // 使用集中的按钮交互状态
  const { currentActionFunction, isPending } = useButtonInteractionStore();

  const handleRefuse = async () => {
    onClick?.();
    await write_BoxDetail({
      contract: allConfigs.Exchange,
      functionName: 'refuseRefund',
      args: [boxId],
    });
  };

  // 计算按钮状态
  const isLoading = currentActionFunction === 'refuseRefund' && isPending;
  const isDisabled = disabled || (currentActionFunction !== null && currentActionFunction !== 'refuseRefund');

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center'}>
        <div className={'flex flex-col items-center'}>
          <BaseButton
            onClick={handleRefuse}
            loading={isLoading}
            disabled={isDisabled}
          >
            Refuse
          </BaseButton>
          {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
        </div>

        <div className={'flex flex-col items-center'}>
          <Typography.Paragraph className="text-muted-foreground text-sm">Refuse Refund, the transaction will be completed.</Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RefuseButton); 