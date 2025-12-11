import React from 'react';
import { Button, Typography } from 'antd';
// import ApproveButton from '@BoxDetail/ButtonContainer/approve';
import { cn } from '@/lib/utils';
import type { BoxActionController } from '../actions/types';

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
    <div className={cn('w-full', className)}>
      <div className="flex flex-col md:flex-row w-full items-start gap-2">
        <Button
          onClick={() => controller.execute({ onClick })}
          loading={controller.isLoading}
          disabled={controller.isDisabled}
        >
          {controller.label}
        </Button>
        {controller.error?.message && (
          <p className="text-red-400 text-sm mt-2 font-mono">{controller.error.message}</p>
        )}
        {controller.description && (
          <div className="flex flex-col items-start">
            <Typography.Paragraph className="text-muted-foreground text-sm">
              {controller.description}
            </Typography.Paragraph>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BoxActionButton;
