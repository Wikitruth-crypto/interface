"use client"

import React from 'react';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';
import { cn } from '@/lib/utils';
import { Typography } from 'antd';

interface Props {
  onClick?: () => void;
  className?: string;
}

const PublishButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.publish);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Publish the box.
        </Typography.Paragraph>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(PublishButton);
