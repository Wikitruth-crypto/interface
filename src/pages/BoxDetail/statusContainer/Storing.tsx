'use client'
import React from 'react';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { 
    SellButton, 
    AuctionButton, 
    PublishButton, 
    ViewFileButton, 
    ExtendDeadline 
} from '@BoxDetail/ButtonContainer';

interface Props {
    tokenId?: string,
}

const Storing: React.FC<Props> = ({ }) => {
    const { box } = useBoxDetailContext()

    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            <SellButton />
            <AuctionButton />
            <ExtendDeadline />
            <PublishButton />
            <ViewFileButton />
        </div>
    );
}

export default Storing;
