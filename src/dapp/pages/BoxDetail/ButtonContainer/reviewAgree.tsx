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

const AgreementButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.agreeRefund);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Agree Refund, all funds will be returned to the buyer.
        </Typography.Paragraph>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(AgreementButton);
