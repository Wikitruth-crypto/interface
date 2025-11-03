"use client"
import React from 'react';
import { useMetadataStore } from '@/dapp/store_sapphire/useMetadataStore';
import ImageSwiper from '@/dapp/components/imageSwiper';
import Paragraph from '@/components/base/paragraph';
import Line from '@/components/base/line';
import { useCurrentBox } from '../hooks/useCurrentBox';

interface Props {
    loading?: boolean;
    tokenId: number;
}

const ContentLeft: React.FC<Props> = ({ loading, tokenId }) => {
    const boxMetadata = useMetadataStore(state => state.boxesMetadata[tokenId]);

    const { box } = useCurrentBox(tokenId)

    if (loading || !boxMetadata || !box) {
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
                        {box.minter?.id}
                    </span>
                </div>
                <div className="text-muted-foreground font-mono">
                    <span className="font-medium">Owner:</span>{' '}
                    <span className="font-mono text-xs md:text-sm break-all">
                        {box.owner?.id}
                    </span>
                </div>
                <div className="text-muted-foreground font-mono">
                    <span className="font-medium">Create date:</span>{' '}
                    <span>{boxMetadata.createDate}</span>
                </div>
            </div>
            <Line weight={1} />

            {/* Image Swiper */}
            <div className="w-full bg-black rounded-xl md:rounded-2xl overflow-hidden">
                <div className="aspect-video md:aspect-[4/3] lg:aspect-video">
                    <ImageSwiper 
                        images={[boxMetadata.boxImage, boxMetadata.nftImage]} 
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
                    {boxMetadata.title}
                </Paragraph>
            </div>

            {/* Location and Date */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm md:text-base">
                <div className="flex flex-wrap gap-2 text-muted-foreground">
                    <span className="font-mono py-1 rounded">
                        {boxMetadata.country}
                    </span>
                    <span className="font-mono px-2 py-1 rounded">
                        {boxMetadata.state}
                    </span>
                </div>
                <div className="text-muted-foreground font-mono">
                    {boxMetadata.eventDate}
                </div>
            </div>
            <Line weight={1} />
            {/* Description */}
            <div className="space-y-3">
                <div className="text-sm md:text-base font-mono text-muted-foreground leading-relaxed break-words">
                    {boxMetadata.description}
                </div>
            </div>
        </div>
    );
};

export default ContentLeft;