'use client'
import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { cn } from '@/lib/utils';
import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import BoxActionButton from '@/dapp/pages/BoxDetail/components/boxActionButton';
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
          loading={controller.isLoading}
          disabled={controller.isDisabled}
        >
          Auction
        </Button>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Start the auction, the initial auction period is {auctioningTime / 24 / 3600} days.
        </Typography.Paragraph>
        {modalOpen && <ModalSellAuction onClose={closeModal} listedMode='Auction' controller={controller} />}
      </div>
    </div>
  );
};

export default React.memo(AuctionButton); 