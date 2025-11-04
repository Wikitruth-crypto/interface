"use client"
import React from 'react';
import { Typography } from 'antd';
import BaseButton from '@/dapp/components/base/baseButton';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import { usePeriodRate } from '@/dapp/constants/periodRate';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxContext } from '../contexts/BoxContext';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CompleteButton: React.FC<Props> = ({ onClick, className }) => {
  const { boxId } = useBoxContext();
  const { roles } = useBoxDetailStore(state => state.userState);
  const deadlineCheckState = useBoxDetailStore(state => state.deadlineCheckState);
  const inRequestRefundPeriod = deadlineCheckState.inRequestRefundPeriod;
  const disabled = useButtonDisabled('completeDisabled');
  const allConfigs = useAllContractConfigs();
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  
  // 使用集中的按钮交互状态
  const { currentActionFunction, isPending } = useButtonInteractionStore();

  const { helperRewardRate } = usePeriodRate();

  const handleComplete = async () => {
    onClick?.();
    await write_BoxDetail({
      contract: allConfigs.Exchange,
      functionName: 'CompleteOrder',
      args: [boxId],
    });
  };

  // 计算按钮状态
  const isLoading = currentActionFunction === 'completeOrder' && isPending;
  const isDisabled = disabled || (currentActionFunction !== null && currentActionFunction !== 'completeOrder');

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={'w-full flex flex-col md:flex-row items-center gap-2'}>
        <div className={'flex flex-col items-center'}>
          <BaseButton
            onClick={handleComplete}
            loading={isLoading}
            disabled={isDisabled}
          >
            Complete
          </BaseButton>
          {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
        </div>
        <div className={'flex flex-col items-center'}>
          {roles.includes('Buyer') &&
            <Typography.Paragraph className="text-muted-foreground text-sm">
              Complete the transaction.
            </Typography.Paragraph>
          }
          {(!roles.includes('Buyer') && inRequestRefundPeriod === false) &&
            <Typography.Paragraph className="text-muted-foreground text-sm">You will get a {helperRewardRate}% reward for completing the transaction.</Typography.Paragraph>
          }
        </div>
      </div>
    </div>
  );
};

export default React.memo(CompleteButton); 