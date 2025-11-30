"use client"

import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { cn } from '@/lib/utils';
import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';

interface Props {
  onClick?: () => void;
  className?: string;
}

const ViewFileButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  // 使用集中的按钮交互状态（只检查是否有其他操作正在进行）
  const { functionWriting } = useButtonInteractionStore();

  const handleViewFile = () => {
    onClick?.();
    setModalOpen(true);
  };
  

  // 计算按钮状态 - 模态框打开时或有其他操作时禁用
  const isDisabled = (functionWriting !== null);

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
        <Typography.Paragraph color="muted-foreground">You can view the confidential file here.</Typography.Paragraph>
      </div>
    </div>
  );
};

export default React.memo(ViewFileButton); 



