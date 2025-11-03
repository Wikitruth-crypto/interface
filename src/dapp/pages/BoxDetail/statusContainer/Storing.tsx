'use client'
import React from 'react';
import { useCurrentBox } from '../hooks/useCurrentBox';
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

const Storing: React.FC<Props> = ({ tokenId }) => {
    // const store = useBoxDetailStore(state => state)
    // const tokenId = store.tokenId
    const { box } = useCurrentBox(tokenId)

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
