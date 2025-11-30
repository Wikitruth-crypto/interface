"use client"
import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/lib/utils';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { usePeriodRate } from '@/dapp/constants/periodRate';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CompleteButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.completeOrder);
  const { roles } = useBoxDetailStore(state => state.userState);
  const { helperRewardRate } = usePeriodRate();

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        {roles.includes('Buyer') && (
          <Typography.Paragraph className="text-muted-foreground text-sm">
            Complete the transaction.
          </Typography.Paragraph>
        )}
        {!roles.includes('Buyer') && (
          <Typography.Paragraph className="text-muted-foreground text-sm">
            You will get a {helperRewardRate}% reward for completing the transaction.
          </Typography.Paragraph>
        )}
      </div>
    </BoxActionButton>
  );
};

export default React.memo(CompleteButton);
