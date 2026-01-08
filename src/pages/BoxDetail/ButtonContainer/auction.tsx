'use client'
import React, { useState } from 'react';
import TextP from '@/components/base/text_p';
import ModalSellAuction from '@BoxDetail/Modal/modalSellAuction';
import { useProtocolConstants } from '@dapp/config/contractsConfig';
import { boxActionConfigs } from '../actions/configs';
import { useBoxActionController } from '../hooks/useBoxActionController';
import BoxActionButton from '@BoxDetail/components/boxActionButton';

interface Props {
  onClick?: () => void;
  className?: string;
}

const AuctionButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const controller = useBoxActionController(boxActionConfigs.auction);
  
  const { initialAuctionPeriod } = useProtocolConstants();

  const handleAuction = () => {
    onClick?.();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <BoxActionButton controller={controller} className={className} onClick={handleAuction}>
        <TextP>
          Start the auction, the initial auction period is {initialAuctionPeriod / 24 / 3600} days.
        </TextP>
        {modalOpen && <ModalSellAuction onClose={closeModal} listedMode='Auction' controller={controller} />}
    </BoxActionButton>
  );
};

export default React.memo(AuctionButton); 