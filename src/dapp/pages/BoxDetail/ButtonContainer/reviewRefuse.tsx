"use client"
import React from 'react';
import { Typography } from 'antd';
import { Button } from 'antd';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
  onClick?: () => void;
  className?: string;
}

const RefuseButton: React.FC<Props> = ({ onClick, className }) => {
  const { boxId } = useBoxDetailContext();
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  const allConfigs = useAllContractConfigs();
  
  // 使用集中的按钮交互状态
  const { functionWriting, isPending } = useButtonInteractionStore();

  const handleRefuse = async () => {
    onClick?.();
    await write_BoxDetail({
      contract: allConfigs.Exchange,
      functionName: 'refuseRefund',
      args: [boxId],
    });
  };

  // 计算按钮状态
  const isLoading = functionWriting === 'refuseRefund' || isPending;
  const isDisabled = (functionWriting !== null && functionWriting !== 'refuseRefund');

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center'}>
        <div className={'flex flex-col items-center'}>
          <Button
            onClick={handleRefuse}
            loading={isLoading}
            disabled={isDisabled}
          >
            Refuse
          </Button>
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