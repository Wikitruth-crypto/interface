"use client"
import React, { useState } from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import ModalExtend from '@BoxDetail/Modal/modalExtend';
// import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import Paragraph from '@/components/base/paragraph';
import { boxActionConfigs } from '../actions/configs';
import { useBoxActionController } from '../hooks/useBoxActionController';

interface Props {
  onClick?: () => void;
  className?: string;
}

const ExtendDeadline: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const controller = useBoxActionController(boxActionConfigs.extendDeadline);

  const handleExtendDeadline = () => {
    onClick?.();
    if (controller.isDisabled) {
      return;
    }
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <Button
          color='primary'
          variant='outlined'
          onClick={handleExtendDeadline}
          loading={controller.isLoading}
          disabled={controller.isDisabled}
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