"use client"

import React from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { FunctionNameType } from '@dapp/types/contracts';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWrite_BoxDetail } from '../hooks/useWriteBoxDetail';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';

interface Props {
  onClick?: () => void;
  className?: string;
}

const PublishButton: React.FC<Props> = ({ onClick, className }) => {
  const { roles } = useBoxDetailStore(state => state.userState);
  const { box , boxId } = useBoxDetailContext()
  const allConfigs = useAllContractConfigs();
  const { write_BoxDetail, error } = useWrite_BoxDetail();
  
  // 使用集中的按钮交互状态
  const { currentActionFunction, isPending } = useButtonInteractionStore();

  const handlePublish = async () => {
    onClick?.();
    const status = box?.status;
    let functionName: FunctionNameType = 'publishByMinter';
    try {
      if (status === 'Storing') {
        if (roles.includes('Minter')) {
          functionName = 'publishByMinter'
        }
      } else if (status === 'InSecrecy') {
        if (roles.includes('Buyer')) {
          functionName = 'publishByBuyer'
        } else {
          throw new Error('role is not correct')
        }
      } 
    } catch (error: any) {
      console.error(error);
      throw error;
    }
    
    await write_BoxDetail({
      contract: allConfigs.TruthBox,
      functionName: functionName,
      args: [boxId],
    });
  };

  // 计算按钮状态
  const isLoading = (currentActionFunction === 'publishByMinter' || currentActionFunction === 'publishByBuyer') && isPending;
  const isDisabled = (currentActionFunction !== null && currentActionFunction !== 'publishByMinter' && currentActionFunction !== 'publishByBuyer');

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <Button
          color='primary'
          variant='outlined'
          onClick={handlePublish}
          loading={isLoading}
          disabled={isDisabled}
        >
          Publish
        </Button>
        {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
      </div>
    </div>
  );
};

export default React.memo(PublishButton); 