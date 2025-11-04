'use client'
import React from 'react';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxContext } from '../contexts/BoxContext';
import { BidButton, ViewFileButton, PublishButton } from '@BoxDetail/ButtonContainer';
// import AlertBox from '@dapp/components/base/alertBox'; // 已弃用
import { Alert } from 'antd'; // 直接使用antd的Alert组件

interface Props {
    tokenId?: string,
}

const Auction: React.FC<Props> = ({ }) => {
    const store = useBoxDetailStore(state => state)
    const { roles } = store.userState
    const deadlineCheckState = store.deadlineCheckState
    const { box } = useBoxContext()

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
                (box.bidders?.length === 0 && deadlineCheckState.isOverDeadline) &&
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
