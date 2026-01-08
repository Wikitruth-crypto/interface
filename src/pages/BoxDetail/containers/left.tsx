"use client"
import React from 'react';
import ImageSwiper from '@/components/imageSwiper';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import {Space } from 'antd';
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
                    <TextP>Truth Box Id:</TextP>
                    <TextP>{tokenId}</TextP>
                </Space>

                {/* Owner Information */}
                <Space direction="horizontal" size="middle">
                    <TextP>Minter:</TextP>{' '}
                    <TextP>{box.minterId}</TextP>
                </Space>
                <Space direction="horizontal" size="middle">
                    <TextP>Owner:</TextP>{' '}
                    <TextP>{box.ownerAddress}</TextP>
                </Space>
                <Space direction="horizontal" size="middle">
                    <TextP>Create date:</TextP>{' '}
                    <TextP>{metadataBox?.createDate ? new Date(metadataBox?.createDate).toLocaleString() : ''}</TextP>
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
                <TextTitle>{metadataBox?.title}</TextTitle>
            </div>

            {/* Location and Date */}
            <div className="flex flex-col gap-2">
                <TextP>{metadataBox?.country}</TextP>
                <TextP>{metadataBox?.state}</TextP>
                <TextP>{metadataBox?.eventDate}</TextP>
            </div>
            <hr className="border-border/50" />
            {/* Description */}
            <div className="space-y-3">
                <TextP>{metadataBox?.description}</TextP>
            </div>
        </div>
    );
};

export default ContentLeft;