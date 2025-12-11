"use client"
import React, { useMemo, useState } from 'react';
import { Typography, Button } from 'antd';
import { cn } from '@/lib/utils';
import { useProtocolConstants } from '@/dapp/contractsConfig';
import { useBoxActionController } from '@/dapp/pages/BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@/dapp/pages/BoxDetail/actions/configs';
import { useBoxDetailContext } from '@/dapp/pages/BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@/dapp/pages/BoxDetail/Modal/modalBuyBidPay';

interface Props {
  onClick?: () => void;
  className?: string;
}

const PayConfiFeeButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.payConfiFee);
  const { box } = useBoxDetailContext();
  const {
    payConfiFeeExtendDeadline,
    incrementRate,
  } = useProtocolConstants();
  const [open, setOpen] = useState(false);

  const tokenAddress = box?.acceptedToken as `0x${string}` | undefined;
  const amount = useMemo(() => {
    const price = box?.price;
    return price ? price.toString() : '0';
  }, [box?.price]);

  const disabled = controller.isDisabled || !tokenAddress;

  return (
    <>
      <Button
        type="primary"
        disabled={disabled}
        loading={controller.isLoading}
        className={className}
        onClick={() => {
          onClick?.();
          setOpen(true);
        }}
        block
      >
        Pay Confidentiality Fee
      </Button>

      <div className={cn('flex flex-col items-start mt-2')}>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          Pay the confidentiality fee to extend the confidentiality period: {payConfiFeeExtendDeadline / 24 / 3600} days
        </Typography.Paragraph>
        <Typography.Paragraph className="text-muted-foreground text-sm">
          The increment rate: {incrementRate}%
        </Typography.Paragraph>
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
    </>
  );
};

export default React.memo(PayConfiFeeButton); 
