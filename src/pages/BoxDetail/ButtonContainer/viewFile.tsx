"use client"

import React, { useState } from 'react';
import ModalViewFile from '../Modal/modalViewFile';
import TextP from '@/components/base/text_p';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '../hooks/useBoxActionController';
import { boxActionConfigs } from '../actions/configs';
// import { useBoxActionController } from '../hooks/useBoxActionController';
// import { boxActionConfigs } from '../actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const ViewFileButton: React.FC<Props> = ({ onClick, className }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const { functionWriting } = useButtonInteractionStore();
  // const isActive = useButtonActive('viewFileActive');
  const controller = useBoxActionController(boxActionConfigs.viewFile);

  const handleViewFile = () => {
    onClick?.();
    setModalOpen(true);
  };

  return (
    <BoxActionButton controller={controller} className={className} onClick={handleViewFile}>
      {/* <Button
        color='primary'
        variant='outlined'
        onClick={handleViewFile}
        disabled={isDisabled || !isActive}
      >
        ViewFile
      </Button> */}
      <TextP>You can view the confidential file here.</TextP>
      {modalOpen && <ModalViewFile onClose={() => setModalOpen(false)} />}
    </BoxActionButton>
  );
};

export default React.memo(ViewFileButton);



