"use client"
import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/lib/utils';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CancelButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.cancelRefund);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
    </BoxActionButton>
  );
};

export default React.memo(CancelButton);
