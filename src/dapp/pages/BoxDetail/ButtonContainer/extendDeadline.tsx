"use client"
import React, { useState } from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import ModalExtend from '@BoxDetail/Modal/modalExtend';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import Paragraph from '@/components/base/paragraph';

interface Props {
  onClick?: () => void;
  className?: string;
}

const ExtendDeadline: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { functionWriting } = useButtonInteractionStore();

  const handleExtendDeadline = () => {
    onClick?.();
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  // 计算按钮状态
  const isDisabled = (functionWriting !== null );

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <Button
          color='primary'
          variant='outlined'
          onClick={handleExtendDeadline}
          disabled={isDisabled}
        >
          Extend Deadline
        </Button>
        <div className={'flex flex-col items-center'}>
          <Paragraph color="muted-foreground" size="sm">Extend the storage time of the Truth Box.</Paragraph>
        </div>
        {modalOpen && <ModalExtend onClose={closeModal} />}
      </div>
    </div>
  );
};

export default React.memo(ExtendDeadline); 