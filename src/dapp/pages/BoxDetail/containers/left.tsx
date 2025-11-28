"use client"
import React from 'react';
import ImageSwiper from '@/dapp/components/imageSwiper';
import Paragraph from '@/components/base/paragraph';
import { Divider } from 'antd';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId: number|string;
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
            {/* Truth Box ID */}
            <div className="flex flex-wrap items-baseline gap-2 text-sm md:text-base">
                <span className="text-muted-foreground font-mono">Truth Box Id:</span>
                <span className="text-foreground font-mono font-semibold text-lg md:text-xl">
                    {tokenId}
                </span>
            </div>

            {/* Owner Information */}
            <div className="space-y-2 text-sm md:text-base">
                <div className="text-muted-foreground font-mono">
                    <span className="font-medium">Minter:</span>{' '}
                    <span className="font-mono text-xs md:text-sm break-all">
                        {box.minterId}
                    </span>
                </div>
                <div className="text-muted-foreground font-mono">
                    <span className="font-medium">Owner:</span>{' '}
                    <span className="font-mono text-xs md:text-sm break-all">
                        {box.ownerAddress}
                    </span>
                </div>
                <div className="text-muted-foreground font-mono">
                    <span className="font-medium">Create date:</span>{' '}
                    <span>{metadataBox?.createDate}</span>
                </div>
            </div>
            <Divider />

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
                <Paragraph 
                    color="gray-3" 
                    size="md" 
                    weight="semibold" 
                    lineClamp={'none'}
                    className="text-md font-mono md:text-lg lg:text-xl leading-relaxed break-words"
                >
                    {metadataBox?.title}
                </Paragraph>
            </div>

            {/* Location and Date */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm md:text-base">
                <div className="flex flex-wrap gap-2 text-muted-foreground">
                    <span className="font-mono py-1 rounded">
                        {metadataBox?.country}
                    </span>
                    <span className="font-mono px-2 py-1 rounded">
                        {metadataBox?.state}
                    </span>
                </div>
                <div className="text-muted-foreground font-mono">
                    {metadataBox?.eventDate}
                </div>
            </div>
            <Divider />
            {/* Description */}
            <div className="space-y-3">
                <div className="text-sm md:text-base font-mono text-muted-foreground leading-relaxed break-words">
                    {metadataBox?.description}
                </div>
            </div>
        </div>
    );
};

export default ContentLeft;