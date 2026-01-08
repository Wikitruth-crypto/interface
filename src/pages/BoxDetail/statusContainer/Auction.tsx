'use client'
import React from 'react';
import { useBoxDetailStore } from '@BoxDetail/store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { BidButton, ViewFileButton, PublishButton } from '@BoxDetail/ButtonContainer';
import { Alert } from 'antd'; 

interface Props {
    tokenId?: string,
}

const Auction: React.FC<Props> = ({ }) => {
    const store = useBoxDetailStore(state => state)
    const { roles } = store.userState
    const { box , biddersIds } = useBoxDetailContext()

    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            {(!roles.includes('Minter') &&
                !roles.includes('Admin') &&
                !roles.includes('Seller') &&
                !roles.includes('Buyer')
            ) ? (
                <></>
            ) : (
                <Alert
                    type="warning"
                    message="Warning"
                    description="You are not authorized to participate in the bidding."
                />
            )}
            {
                (biddersIds?.length === 0 && Number(box.deadline) < Math.floor(Date.now() / 1000)) &&
                <div className="mb-4">
                    <Alert
                        type="warning"
                        message="Warning"
                        description="No one participated in the auction, the auction is over, please public this Truth Box"
                    />
                </div>
            }

            <BidButton />
            <PublishButton />
            <ViewFileButton />
        </div>
    );
}

export default Auction;
