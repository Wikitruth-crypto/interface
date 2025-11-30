'use client'
import React, { useState } from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import ModalSellAuction from '@BoxDetail/Modal/modalSellAuction';
import { useProtocolConstants } from '@/dapp/contractsConfig';
import Paragraph from '@/components/base/paragraph';
import { boxActionConfigs } from '../actions/configs';
import { useBoxActionController } from '../hooks/useBoxActionController';

interface Props {
  onClick?: () => void;
  className?: string;
}

const AuctionButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { functionWriting } = useButtonInteractionStore();
  const controller = useBoxActionController(boxActionConfigs.auction);
  
  const { auctioningTime } = useProtocolConstants();

  const handleAuction = () => {
    onClick?.();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className='flex flex-col md:flex-row items-center gap-2'>
        <Button
          onClick={handleAuction}
          disabled={functionWriting !== null}
        >
          Auction
        </Button>
        <Paragraph color="muted-foreground" size="sm">
          Start the auction, the initial auction period is {auctioningTime / 24 / 3600} days.
        </Paragraph>
        {modalOpen && <ModalSellAuction onClose={closeModal} listedMode='Auction' controller={controller} />}
      </div>
    </div>
  );
};

export default React.memo(AuctionButton); 