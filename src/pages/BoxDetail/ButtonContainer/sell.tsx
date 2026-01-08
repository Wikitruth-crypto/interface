"use client"
import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { cn } from '@/lib/utils';
import ModalSellAuction from '@BoxDetail/Modal/modalSellAuction';
import { useProtocolConstants } from '@dapp/config/contractsConfig';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import { useBoxDetailStore } from '@BoxDetail/store/boxDetailStore';
import TextP from '@/components/base/text_p';

interface Props {
  onClick?: () => void;
  className?: string;
}

const SellButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const controller = useBoxActionController(boxActionConfigs.sell);
  const { roles } = useBoxDetailStore(state => state.userState);
  const { helperRewardRate } = useProtocolConstants();

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
    <BoxActionButton controller={controller} className={className} onClick={handleSell}>
      {/* <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
        <Button onClick={handleSell} disabled={controller.isDisabled}>
          Sell
        </Button> */}
        <div className={'flex flex-col items-start'}>
          {roles.includes('Minter') ? (
            <TextP>
              You can sell or auction the Box at any time.
            </TextP>
          ) : (
            <TextP>
              Sell or auction the Box, you can get the Rewards, the Rewards is {helperRewardRate}% of the Box price.
            </TextP>
          )}
        </div>
        {modalOpen && (
          <ModalSellAuction onClose={closeModal} listedMode="Sell" controller={controller} />
        )}
      {/* </div> */}
    </BoxActionButton>
  );
};

export default React.memo(SellButton);
