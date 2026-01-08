"use client"
import React, { useMemo, useState } from 'react';
import { Typography, Button } from 'antd';
import { cn } from '@/lib/utils';
import { useProtocolConstants } from '@dapp/config/contractsConfig';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import { useBoxDetailContext } from '@BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@BoxDetail/Modal/modalBuyBidPay';
import TextP from '@/components/base/text_p';
import { ButtonContainer } from '../components/buttonContainer';
import BoxActionButton from '@BoxDetail/components/boxActionButton';

interface Props {
  onClick?: () => void;
  className?: string;
}

const PayConfiFeeButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.payConfiFee);
  const { box } = useBoxDetailContext();
  const {
    confidentialityFeeExtensionPeriod,
    incrementRate,
  } = useProtocolConstants();
  const [open, setOpen] = useState(false);

  const handlePayConfiFee = () => {
    onClick?.();
    setOpen(true);
  };

  const tokenAddress = box?.acceptedToken as `0x${string}` | undefined;
  const amount = useMemo(() => {
    const price = box?.price;
    return price ? price.toString() : '0';
  }, [box?.price]);

  // const disabled = controller.isDisabled || !tokenAddress;

  return (
      <BoxActionButton controller={controller} className={className} onClick={handlePayConfiFee}>

      <div className={cn('flex flex-col items-start')}>
        <TextP>
          Pay the confidentiality fee to extend the confidentiality period: {confidentialityFeeExtensionPeriod / 24 / 3600} days
        </TextP>
        <TextP>
          The increment rate: {incrementRate}%
        </TextP>
      </div>

      {tokenAddress && (
        <ModalBuyBidPay
          open={open}
          onClose={() => setOpen(false)}
          boxId={box?.id?.toString() || ''}
          tokenAddress={tokenAddress}
          amount={amount}
          functionName="payConfiFee"
        />
      )}
    </BoxActionButton>
  );
};

export default React.memo(PayConfiFeeButton); 
