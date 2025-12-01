"use client"
import React from 'react';
import { Typography } from 'antd';
// import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
// import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
// import { useWriteCustormV2 } from '@/dapp/hooks/useWriteCustormV2';
// import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const RefuseButton: React.FC<Props> = ({ onClick, className }) => {
  // const { boxId } = useBoxDetailContext();
  // const { writeCustormV2, error } = useWriteCustormV2(boxId);
  // const allConfigs = useAllContractConfigs();

  const controller = useBoxActionController(boxActionConfigs.refuseRefund);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Refuse Refund, the transaction will be completed.
        </Typography.Paragraph>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(RefuseButton); 