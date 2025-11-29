"use client"
import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/lib/utils';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CancelButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.cancelRefund);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Cancel refund, the transaction will be completed.
        </Typography.Paragraph>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(CancelButton);
