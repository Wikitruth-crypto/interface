'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

interface ImageSwiperProps {
    images: string[];
    /** Aspect ratio, default 1 (1:1). Common values: 1 (1:1), 16/9 (16:9), 4/3 (4:3), 3/2 (3:2) */
    aspectRatio?: number;
    /** Auto play interval time (milliseconds), default 4000ms */
    autoPlayInterval?: number;
    /** Whether to enable auto play, default true */
    autoPlay?: boolean;
    /** Alt attribute prefix for images, default 'image' */
    altPrefix?: string;
    /** Transition animation duration (seconds), default 2s */
    transitionDuration?: number;
    /** Whether to enable dynamic mask effect, default true */
    enableMask?: boolean;
    /** Whether to enable ipfsUrl, default true */
    enableIpfsUrl?: boolean;
    onImageLoad?: () => void; 
    className?: string;
}

type MaskDirection = 'lt' | 'rt' | 'lb' | 'rb';

const ImageSwiper: React.FC<ImageSwiperProps> = ({
    images,
    aspectRatio = 1,
    autoPlayInterval = 4000,
    autoPlay = true,
    className,
    altPrefix = 'image',
    transitionDuration = 2,
    enableMask = true,
    enableIpfsUrl = true,
    onImageLoad, 
}) => {

    // Current displayed image index
    const [currentIndex, setCurrentIndex] = useState(0);
    // Mask direction
    const [maskDir, setMaskDir] = useState<MaskDirection>('lt');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Randomly get mask direction - remove useCallback, define as a normal function
    const getRandomMaskDirection = (): MaskDirection => {
        const directions: MaskDirection[] = ['lt', 'rt', 'lb', 'rb'];
        return directions[Math.floor(Math.random() * directions.length)];
    };

    // Switch to the next image - remove function dependency to avoid circular reference
    const nextImage = useCallback(() => {
        if (images.length <= 1) return;

        setMaskDir(getRandomMaskDirection());
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    // Switch to the image at the specified index - remove function dependency to avoid circular reference
    const goToImage = useCallback((index: number) => {
        if (index < 0 || index >= images.length || index === currentIndex) return;

        setMaskDir(getRandomMaskDirection());
        setCurrentIndex(index);
    }, [images.length, currentIndex]);

    // Auto play logic - use ref to avoid nextImage function dependency
    const nextImageRef = useRef(nextImage);
    
    // Update nextImage reference
    useEffect(() => {
        nextImageRef.current = nextImage;
    }, [nextImage]);

    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        timerRef.current = setInterval(() => {
            nextImageRef.current();
        }, autoPlayInterval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [autoPlay, autoPlayInterval, images.length]);

    // If there are no images, return empty
    if (!images || images.length === 0) {
        return (
            <div 
                className={cn(
                    "w-full bg-black flex items-center justify-center rounded-t-2xl",
                    className
                )}
                style={{ aspectRatio: aspectRatio }}
            >
                <span className="text-white/50">No images available</span>
            </div>
        );
    }

    // Get mask style
    const getMaskStyle = (direction: MaskDirection) => {
        if (!enableMask) return {};

        const maskGradients = {
            lt: 'linear-gradient(135deg, #000 60%, transparent 100%)',
            rb: 'linear-gradient(315deg, #000 60%, transparent 100%)',
            rt: 'linear-gradient(225deg, #000 60%, transparent 100%)',
            lb: 'linear-gradient(45deg, #000 60%, transparent 100%)',
        };

        return {
            maskImage: maskGradients[direction],
            WebkitMaskImage: maskGradients[direction],
        };
    };

    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const hasNotifiedRef = useRef(false); // Track whether it has been notified

    // Handle image loading complete
    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageSrc);
            return newSet;
        });
    }, []);

    // Use useEffect to listen to all images loading complete, avoid updating parent component state during rendering
    useEffect(() => {
        if (loadedImages.size === images.length && onImageLoad && !hasNotifiedRef.current) {
            hasNotifiedRef.current = true;
            // Use setTimeout to ensure execution in the next event loop, avoid updating state during rendering
            const timer = setTimeout(() => {
                onImageLoad();
                // if (import.meta.env.DEV) {
                //     console.log('onImageLoad: imageSwiper');
                // }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [loadedImages.size, images.length]);

    // When images change, reset loading state and notification flag
    useEffect(() => {
        setLoadedImages(new Set());
        hasNotifiedRef.current = false;
    }, [images]);

    return (
        <div 
            className={cn(
                "w-full bg-black flex justify-center items-center overflow-hidden rounded-t-2xl relative",
                className
            )}
            style={{ aspectRatio: aspectRatio }}
        >
            <div className="w-full h-full relative">
                {images.map((image, index) => {
                    const isActive = index === currentIndex;
                    const isVisible = isActive || index === (currentIndex - 1 + images.length) % images.length;

                    const imageUrl = enableIpfsUrl ? ipfsCidToUrl(image) : image;

                    return (
                        <img
                            key={`${imageUrl}-${index}`}
                            src={imageUrl}
                            alt={`${altPrefix}-${index + 1}`}
                            className={cn(
                                "w-full h-full object-contain absolute left-0 top-0 pointer-events-none",
                                "transition-opacity ease-linear",
                                isActive ? "opacity-100 z-20" : "opacity-0 z-10"
                            )}
                            style={{
                                transitionDuration: `${transitionDuration}s`,
                                ...(isActive && enableMask ? getMaskStyle(maskDir) : {}),
                                transitionProperty: enableMask
                                    ? 'opacity, mask-image, -webkit-mask-image'
                                    : 'opacity',
                            }}
                            loading={isVisible ? 'eager' : 'lazy'}
                            onLoad={() => handleImageLoad(image)} // 新增
                            onError={(e) => {
                                console.error(`Failed to load image: ${image}`, e);
                                // Even if loading fails, trigger callback (avoid blocking)
                                handleImageLoad(image);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ImageSwiper;