"use client"
import React, { useState } from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import ModalExtend from '@BoxDetail/Modal/modalExtend';
// import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import { boxActionConfigs } from '../actions/configs';
import { useBoxActionController } from '../hooks/useBoxActionController';
import BoxActionButton from '@BoxDetail/components/boxActionButton';

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
    <BoxActionButton controller={controller} className={className} onClick={handleExtendDeadline}>
      {/* <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
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
        </div> */}
        {modalOpen && <ModalExtend onClose={closeModal} />}
      {/* </div> */}
    </BoxActionButton>
  );
};

export default React.memo(ExtendDeadline); 