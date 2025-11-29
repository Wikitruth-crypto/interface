"use client"
import React, { useState } from 'react';
import BaseButton from '@/dapp/components/base/baseButton';
import { cn } from '@/lib/utils';
import ModalSellAuction from '@BoxDetail/Modal/modalSellAuction';
import { usePeriodRate } from '@/dapp/constants/periodRate';
import Paragraph from '@/components/base/paragraph';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';

interface Props {
  onClick?: () => void;
  className?: string;
}

const SellButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const controller = useBoxActionController(boxActionConfigs.sell);
  const { roles } = useBoxDetailStore(state => state.userState);
  const { helperRewardRate } = usePeriodRate();

  const handleSell = () => {
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
        <BaseButton onClick={handleSell} disabled={controller.isDisabled}>
          Sell
        </BaseButton>
        <div className={'flex flex-col items-start'}>
          {roles.includes('Minter') ? (
            <Paragraph color="muted-foreground" size="sm">
              You can sell or auction the Box at any time.
            </Paragraph>
          ) : (
            <Paragraph color="muted-foreground" size="sm">
              Sell or auction the Box, you can get the Rewards, the Rewards is {helperRewardRate}% of the Box price.
            </Paragraph>
          )}
        </div>
        {modalOpen && (
          <ModalSellAuction onClose={closeModal} listedMode="Sell" controller={controller} />
        )}
      </div>
    </div>
  );
};

export default React.memo(SellButton);
