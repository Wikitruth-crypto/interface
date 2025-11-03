"use client"
import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import BaseButton from '@/dapp/components/base/baseButton';
import { cn } from '@/lib/utils';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useAllowance_BoxDetail } from '@/dapp/pages/BoxDetail/hooks/useAllowanceBoxDetail';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import { usePeriodRate } from '@/dapp/constants/periodRate';
import ApproveButton from './approve';
import Paragraph from '@/components/base/paragraph';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useCurrentBox } from '../hooks/useCurrentBox';


interface Props {
  onClick?: () => void;
  className?: string;
}

const PayConfiFeeButton: React.FC<Props> = ({ onClick, className }) => {
  const { roles } = useBoxDetailStore(state => state.userState);
  const disabled = useButtonDisabled('payConfiFeeDisabled');
  const allConfigs = useAllContractConfigs();
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  const { box , boxId } = useCurrentBox()
  const { checkAllowance_BoxDetail, isEnough } = useAllowance_BoxDetail();
  
  // 使用集中的按钮交互状态
  const { currentAction, isPending } = useButtonInteractionStore();

  const {
    payConfiFeeExtendDeadline,
    incrementRate,
  } = usePeriodRate();

  // 检查是否需要授权
  useEffect(() => {
    if (!roles.includes('Admin') && !roles.includes('Minter')) {
      checkAllowance_BoxDetail(
        box?.acceptedToken?.id || '',
        box?.price || 0
      )
    }
  }, [box?.price, roles, checkAllowance_BoxDetail]);

  const handlePayConfiFee = async () => {
    onClick?.();
    await write_BoxDetail({
      contract: allConfigs.Exchange,
      functionName: 'payConfiFee',
      args: [boxId],
    });
  }

  // 计算按钮状态
  const isLoading = currentAction === 'payConfiFee' && isPending;
  const isDisabled = disabled || (currentAction !== null && currentAction !== 'payConfiFee');

  // 如果需要授权，显示授权按钮
  if (!isEnough) {
    return <ApproveButton className={className} onClick={onClick} />;
  }

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <div className={'flex flex-col items-center'}>
          <BaseButton
            onClick={handlePayConfiFee}
            loading={isLoading}
            disabled={isDisabled}
          >
            PayConfiFee
          </BaseButton>
          {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
        </div>
        <div className={'flex flex-col items-center'}>
          <Typography.Paragraph className="text-muted-foreground text-sm">Pay the confidentiality fee to extend the confidentiality period: {payConfiFeeExtendDeadline / 24 / 3600} days
          </Typography.Paragraph>
          <Typography.Paragraph className="text-muted-foreground text-sm">The increment rate: {incrementRate}%</Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PayConfiFeeButton); 