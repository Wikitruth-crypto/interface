"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import TextP from '@/components/base/text_p';

interface Props {
  onClick?: () => void;
  className?: string;
}

const AgreementButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.agreeRefund);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
    </BoxActionButton>
  );
};

export default React.memo(AgreementButton);
