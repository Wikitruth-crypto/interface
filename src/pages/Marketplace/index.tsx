"use client";

import React, { useState } from 'react';
import Marketplace from './containers/Marketplace';
// import PromptModal from '@/components/promptModal2';

const MarketplacePage = () => {
    // const [isPromptModalOpen, setIsPromptModalOpen] = useState(true);

    // const handleClosePromptModal = () => {
    //     setIsPromptModalOpen(false);
    // };

    return (
        <>
            {/* <PromptModal isOpen={isPromptModalOpen} onClose={handleClosePromptModal} /> */}
            <Marketplace />
        </>
    );
};

export default MarketplacePage;
