"use client"
import React from 'react';
import { Typography } from 'antd';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import { timeToDate } from '@/dapp/utils/time';
import Paragraph from '@/components/base/paragraph';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxContext } from '../contexts/BoxContext';

interface Props {
  onClick?: () => void;
  className?: string;
}

const RequestRefundButton: React.FC<Props> = ({ onClick, className }) => {
  const disabled = useButtonDisabled('requestRefundDisabled');
  const { boxId } = useBoxContext()
  const deadlineCheckState = useBoxDetailStore(state => state.deadlineCheckState);
  const deadline = deadlineCheckState.requestRefundDeadline;
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  const allConfigs = useAllContractConfigs();
  
  // 使用集中的按钮交互状态
  const { currentActionFunction, isPending } = useButtonInteractionStore();

  const handleRequestRefund = async () => {
    onClick?.();
    await write_BoxDetail({
      contract: allConfigs.Exchange,
      functionName: 'RequestRefund',
      args: [boxId],
    });
  };

  // 计算按钮状态
  const isLoading = currentActionFunction === 'requestRefund' && isPending;
  const isDisabled = disabled || (currentActionFunction !== null && currentActionFunction !== 'requestRefund');

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <Button
          color='primary'
          variant='outlined'
          onClick={handleRequestRefund}
          loading={isLoading}
          disabled={isDisabled}
        >
          Refund
        </Button>
        {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
        <div className={'flex flex-col items-center'}>
          <Typography.Paragraph className="text-muted-foreground text-sm">Request Refund Deadline: {timeToDate(deadline)}</Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RequestRefundButton); 