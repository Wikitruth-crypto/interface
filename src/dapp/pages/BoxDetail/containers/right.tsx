"use client"
import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import Storing from '@BoxDetail/statusContainer/Storing';
import Selling from '@BoxDetail/statusContainer/Selling';
import Auction from '@BoxDetail/statusContainer/Auction';
import Paid from '@BoxDetail/statusContainer/Paid';
import Refunding from '@BoxDetail/statusContainer/Refunding';
import InSecrecy from '@BoxDetail/statusContainer/InSecrecy';
import Published from '@/dapp/pages/BoxDetail/statusContainer/Published';
import StatusStep from '@/dapp/components/statusStep';
import CountdownTimer from '@/dapp/components/countdownTimer';
import RoleContainer from '../components/roleLabel';
import PriceLabel from '@BoxDetail/components/priceLabel';
import { BoxStatus } from '@/dapp/types/contracts/truthBox';
import { useCheckDeadline, } from '../hooks/useCheckDeadline';
import { useBoxDetailStore } from '../store/boxDetailStore';
import Line from '@/components/base/line';
import ShareSocial from '@/dapp/components/shareSoical';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
// import Paragraph from '@/components/base/paragraph';

interface Props {
    tokenId: number|string;
    args?: boolean;
}

const ContentRight: React.FC<Props> = ({ tokenId }) => {
    const { box, metadataBox ,isLoading} = useBoxDetailContext();

    useCheckDeadline();

    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<BoxStatus>('Storing');
    const [deadline, setDeadline] = useState<number>(0);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        if (box) {
            setStatus(box.status as BoxStatus);
            setPrice(box.price ?? '');
            setDeadline(Number(box.deadline));
            setToken(box.acceptedToken ?? '');
        }
    }, [box]);

    const renderStatusButton = () => {
        switch (status) {
            case 'Storing':
                return <Storing />;
            case 'Selling':
                return <Selling />;
            case 'Auctioning':
                return <Auction />;
            case 'Paid':
                return <Paid />;
            case 'Refunding':
                return <Refunding />;
            case 'InSecrecy':
                return <InSecrecy />;
            case 'Published':
                return <Published />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-muted-foreground text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 md:space-y-8">
            {/* Status Step */}
            {/* <div className="w-full"> */}
            <Typography.Title level={4} className="text-white font-semibold">{status}</Typography.Title>

            {/* </div> */}
            <StatusStep
                status={status}
                listedMode={box?.listedMode ?? ''}
                size="sm"
                enableHorizontalScroll={true}
            />

            <Line weight={1} />

            {/* Blacklist Warning */}
            {box?.isInBlacklist && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                    <span className="font-medium">Warning:</span> The NFT is in blacklist, can't do anything!
                </div>
            )}


            {/* Countdown Timer */}
            {status !== 'Published' && (
                <>
                    <div className="w-full">
                        <CountdownTimer targetTime={deadline} size='sm' />
                    </div>
                    <div className="w-full h-px bg-border/50"></div>
                </>
            )}

            {/* Price Container */}
                <PriceLabel status={status} price={price} token={token} />

            {/* Role Container */}
            <div className="w-full">
                <RoleContainer />
            </div>

            <Line weight={1} />

            {/* Status Action Buttons */}
            <div className="w-full">
                {renderStatusButton()}
            </div>

            <Line weight={1} />

            {/* Additional Features Section */}
            <div className="w-full space-y-4">
            

                {/* Admin Functions - Commented out for now */}
                {/* 
                <div className="admin-functions">
                    {accountRole === 'Admin' && <AdminFunction />}
                </div> 
                */}
                {/* Social Share - Commented out for now */}
            <ShareSocial 
                title={metadataBox?.title ?? ''}
                description={metadataBox?.description ?? ''}
                image={metadataBox?.nftImage ?? ''}
                url={typeof window !== 'undefined' ? window.location.href : ''}
            />
            </div>
        </div>
    );
}

export default ContentRight;
