"use client"

import React, { useState } from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { useButtonDisabled } from '../hooks/useButtonDisabled';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import Paragraph from '@/components/base/paragraph';

interface Props {
  onClick?: () => void;
  className?: string;
}

const ViewFileButton: React.FC<Props> = ({ onClick, className }) => {
  const disabled = useButtonDisabled('viewFileDisabled');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  // 使用集中的按钮交互状态（只检查是否有其他操作正在进行）
  const { currentActionFunction } = useButtonInteractionStore();

  const handleViewFile = () => {
    onClick?.();
    setModalOpen(true);
  };
  

  // 计算按钮状态 - 模态框打开时或有其他操作时禁用
  const isDisabled = disabled || (currentActionFunction !== null);

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <Button
          color='primary'
          variant='outlined'
          onClick={handleViewFile}
          disabled={isDisabled}
        >
          ViewFile
        </Button>
        <Paragraph color="muted-foreground" size="sm">You can view the confidential file here.</Paragraph>
      </div>
    </div>
  );
};

export default React.memo(ViewFileButton); 



