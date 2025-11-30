"use client"
import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/lib/utils';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { timeToDate } from '@/dapp/utils/time';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
  onClick?: () => void;
  className?: string;
}

const RequestRefundButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.requestRefund);
  const { box } = useBoxDetailContext();

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Request Refund Deadline: {timeToDate(Number(box?.requestRefundDeadline))}
        </Typography.Paragraph>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(RequestRefundButton);
