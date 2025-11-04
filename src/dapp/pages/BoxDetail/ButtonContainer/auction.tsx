'use client'
import React, { useState } from 'react';
import BaseButton from '@/dapp/components/base/baseButton';
import { cn } from '@/lib/utils';
import { useButtonDisabled } from '@BoxDetail/hooks/useButtonDisabled';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import ModalSellAuction from '@BoxDetail/Modal/modalSellAuction';
import { usePeriodRate } from '@dapp/constants/periodRate';
import Paragraph from '@/components/base/paragraph';

interface Props {
  onClick?: () => void;
  className?: string;
}

const AuctionButton: React.FC<Props> = ({ onClick, className }) => {
  const disabled = useButtonDisabled('auctionDisabled');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { currentActionFunction } = useButtonInteractionStore();
  
  const { auctioningTime } = usePeriodRate();

  const handleAuction = () => {
    onClick?.();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // 计算按钮状态
  const isDisabled = disabled || (currentActionFunction !== null);

  // 如果按钮被禁用，不显示
  if (disabled) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className='flex flex-col md:flex-row items-center gap-2'>
        <BaseButton
          onClick={handleAuction}
          disabled={isDisabled}
        >
          Auction
        </BaseButton>
        <Paragraph color="muted-foreground" size="sm">
          Start the auction, the initial auction period is {auctioningTime / 24 / 3600} days.
        </Paragraph>
        {modalOpen && <ModalSellAuction onClose={closeModal} listedMode='Auction' />}
      </div>
    </div>
  );
};

export default React.memo(AuctionButton); 