"use client"
import React from 'react';
import { useBoxDetailStore } from '@BoxDetail/store/boxDetailStore';
import { useProtocolConstants } from '@dapp/config/contractsConfig';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import TextP from '@/components/base/text_p';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CompleteButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.completeOrder);
  const { roles } = useBoxDetailStore(state => state.userState);
  const { helperRewardRate } = useProtocolConstants();

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      {/* <div className={cn('flex flex-col items-start')}> */}
        {!roles.includes('Buyer') && (
          <TextP>
            You will get a {helperRewardRate}% reward for completing the transaction.
          </TextP>
        )}
      {/* </div> */}
    </BoxActionButton>
  );
};

export default React.memo(CompleteButton);
