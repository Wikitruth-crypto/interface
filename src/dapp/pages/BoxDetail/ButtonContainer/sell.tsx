"use client"
import React, { useState } from 'react';
import BaseButton from '@/dapp/components/base/baseButton';
import { cn } from '@/lib/utils';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';
import ModalSellAuction from '@BoxDetail/Modal/modalSellAuction';
import { usePeriodRate } from '@/dapp/constants/periodRate';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import Paragraph from '@/components/base/paragraph';

interface Props {
  onClick?: () => void;
  className?: string;
}

const SellButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { roles } = useBoxDetailStore(state => state.userState);
  const { helperRewardRate } = usePeriodRate();
  
  // 使用集中的按钮交互状态
  const { currentActionFunction } = useButtonInteractionStore();

  const handleSell = () => {
    onClick?.();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // 计算按钮状态
  const isDisabled = (currentActionFunction !== null && currentActionFunction !== 'sell');

  return (
    <div className={cn('w-full', className)}>
      <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <BaseButton
          onClick={handleSell}
          disabled={isDisabled}
        >
          Sell
        </BaseButton>
        <div className={'flex flex-col items-start'}>
          {
            roles.includes('Minter') ?
              <Paragraph color="muted-foreground" size="sm">You can sell or auction the Box at any time.</Paragraph>
              :
              <Paragraph color="muted-foreground" size="sm">Sell or auction the Box, you can get the Rewards, the Rewards is {helperRewardRate}% of the Box price.</Paragraph>
          }
        </div>
        {modalOpen && <ModalSellAuction onClose={closeModal} listedMode='Sell' />}
      </div>
    </div>
  );
};

export default React.memo(SellButton); 