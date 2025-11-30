"use client"
import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/lib/utils';
import { useProtocolConstants } from '@/dapp/contractsConfig';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const PayConfiFeeButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.payConfiFee);
  const {
    payConfiFeeExtendDeadline,
    incrementRate,
  } = useProtocolConstants();

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Pay the confidentiality fee to extend the confidentiality period: {payConfiFeeExtendDeadline / 24 / 3600} days
        </Typography.Paragraph>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          The increment rate: {incrementRate}%
        </Typography.Paragraph>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(PayConfiFeeButton); 
