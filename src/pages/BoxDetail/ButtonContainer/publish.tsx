"use client"

import React from 'react';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
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
    </BoxActionButton>
  );
};

export default React.memo(PublishButton);
