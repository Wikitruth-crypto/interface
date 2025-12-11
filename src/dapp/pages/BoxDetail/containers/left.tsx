"use client"
import React from 'react';
import ImageSwiper from '@/dapp/components/imageSwiper';
// import Paragraph from '@/components/base/paragraph';

import { Divider, Typography, Space } from 'antd';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId: number | string;
}

const ContentLeft: React.FC<Props> = ({ tokenId }) => {

    const { box, metadataBox } = useBoxDetailContext()

    if (!box) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-muted-foreground text-lg font-mono">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 md:space-y-8">
            <Space direction="vertical" size="middle">
                {/* Truth Box ID */}
                <Space direction="horizontal" size="middle">
                    <Typography.Paragraph ellipsis={{ rows: 1 }}>Truth Box Id:</Typography.Paragraph>
                    <Typography.Paragraph ellipsis={{ rows: 1 }}>
                        {tokenId}
                    </Typography.Paragraph>
                </Space>

                {/* Owner Information */}
                <Space direction="horizontal" size="middle">
                    <Typography.Paragraph >Minter:</Typography.Paragraph>{' '}
                    <Typography.Paragraph >
                        {box.minterId}
                    </Typography.Paragraph>
                </Space>
                <Space direction="horizontal" size="middle">
                    <Typography.Paragraph >Owner:</Typography.Paragraph>{' '}
                    <Typography.Paragraph >
                        {box.ownerAddress}
                    </Typography.Paragraph>
                </Space>
                <Space direction="horizontal" size="middle">
                    <Typography.Paragraph >Create date:</Typography.Paragraph>{' '}
                    <Typography.Paragraph >
                        {metadataBox?.createDate ? new Date(metadataBox?.createDate).toLocaleString() : ''}
                    </Typography.Paragraph>
                </Space>
            </Space>

            {/* Image Swiper */}
            <div className="w-full bg-black rounded-xl md:rounded-2xl overflow-hidden">
                <div className="aspect-video md:aspect-[4/3] lg:aspect-video">
                    <ImageSwiper
                        images={[metadataBox?.boxImage || '', metadataBox?.nftImage || '']}
                        className='w-full'
                    />
                </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
                <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                >
                    {metadataBox?.title}
                </Typography.Paragraph>
            </div>

            {/* Location and Date */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm md:text-base">
                <div className="flex flex-wrap gap-2 text-muted-foreground">
                    <Typography.Paragraph ellipsis={{ rows: 1 }}>
                        {metadataBox?.country}
                    </Typography.Paragraph>
                    <Typography.Paragraph ellipsis={{ rows: 1 }}>
                        {metadataBox?.state}
                    </Typography.Paragraph>
                </div>
                <Typography.Paragraph ellipsis={{ rows: 1 }}>
                    {metadataBox?.eventDate}
                </Typography.Paragraph>
            </div>
            <Divider />
            {/* Description */}
            <div className="space-y-3">
                <Typography.Paragraph>
                    {metadataBox?.description}
                </Typography.Paragraph>
            </div>
        </div>
    );
};

export default ContentLeft;