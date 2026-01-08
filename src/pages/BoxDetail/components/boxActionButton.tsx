import React from 'react';
import { Button, Typography } from 'antd';
import TextP from '@/components/base/text_p';
import { cn } from '@/lib/utils';
import type { BoxActionController } from '../actions/types';
import { ButtonContainer } from './buttonContainer';

interface BoxActionButtonProps {
  controller: BoxActionController;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const BoxActionButton: React.FC<BoxActionButtonProps> = ({ controller, className, onClick, children }) => {
  // if (controller.showApprove) {
  //   return <ApproveButton className={className} onClick={onClick} />;
  // }

  return (
    <ButtonContainer className={className}>
        <Button
          onClick={() => controller.execute({ onClick })}
          loading={controller.isLoading}
          disabled={controller.isDisabled}
        >
          {controller.label}
        </Button>
        <div className="flex flex-col items-start">
        {controller.error?.message && (
          <TextP type="error">{controller.error.message}</TextP>
        )}
        {controller.description && (
          <div className="flex flex-col items-start">
            <TextP size="sm">
              {controller.description}
            </TextP>
          </div>
        )}
        {children}
        </div>
    </ButtonContainer>
  );
};

export default BoxActionButton;
