'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

interface ImageSwiperProps {
    images: string[];
    /** 宽高比，默认1（1:1）。常用值：1 (1:1), 16/9 (16:9), 4/3 (4:3), 3/2 (3:2) */
    aspectRatio?: number;
    /** 自动播放间隔时间（毫秒），默认4000ms */
    autoPlayInterval?: number;
    /** 是否启用自动播放，默认true */
    autoPlay?: boolean;
    /** 图片的alt属性前缀，默认为'image' */
    altPrefix?: string;
    /** 过渡动画持续时间（秒），默认2s */
    transitionDuration?: number;
    /** 是否启用动态遮罩效果，默认true */
    enableMask?: boolean;
    /** 是否启用ipfsUrl，默认true */
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

    // 当前显示的图片索引
    const [currentIndex, setCurrentIndex] = useState(0);
    // 遮罩方向
    const [maskDir, setMaskDir] = useState<MaskDirection>('lt');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 随机获取遮罩方向 - 移除useCallback，直接定义为普通函数
    const getRandomMaskDirection = (): MaskDirection => {
        const directions: MaskDirection[] = ['lt', 'rt', 'lb', 'rb'];
        return directions[Math.floor(Math.random() * directions.length)];
    };

    // 切换到下一张图片 - 移除函数依赖避免循环引用
    const nextImage = useCallback(() => {
        if (images.length <= 1) return;

        setMaskDir(getRandomMaskDirection());
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    // 切换到指定索引的图片 - 移除函数依赖避免循环引用
    const goToImage = useCallback((index: number) => {
        if (index < 0 || index >= images.length || index === currentIndex) return;

        setMaskDir(getRandomMaskDirection());
        setCurrentIndex(index);
    }, [images.length, currentIndex]);

    // 自动播放逻辑 - 使用ref避免nextImage函数依赖
    const nextImageRef = useRef(nextImage);
    
    // 更新nextImage引用
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

    // 如果没有图片，返回空
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

    // 获取遮罩样式
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
    const hasNotifiedRef = useRef(false); // 跟踪是否已经通知过

    // 处理图片加载完成
    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageSrc);
            return newSet;
        });
    }, []);

    // 使用 useEffect 监听所有图片加载完成，避免在渲染期间更新父组件状态
    useEffect(() => {
        if (loadedImages.size === images.length && onImageLoad && !hasNotifiedRef.current) {
            hasNotifiedRef.current = true;
            // 使用 setTimeout 确保在下一个事件循环中执行，避免在渲染期间更新状态
            const timer = setTimeout(() => {
                onImageLoad();
                // if (import.meta.env.DEV) {
                //     console.log('onImageLoad: imageSwiper');
                // }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [loadedImages.size, images.length]);

    // 当 images 变化时重置加载状态和通知标志
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
                                // 即使加载失败也触发回调（避免阻塞）
                                handleImageLoad(image);
                            }}
                        />
                    );
                })}
            </div>

            {/* 可选：显示指示器点 */}
            {/* {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === currentIndex
                                    ? "bg-white scale-125"
                                    : "bg-white/50 hover:bg-white/70"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )} */}

            {/* 可选：导航箭头 */}
            {/* {images.length > 1 && (
                <>
                    <button
                        onClick={() => goToImage((currentIndex - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                        aria-label="Previous image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => goToImage((currentIndex + 1) % images.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                        aria-label="Next image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )} */}
        </div>
    );
};

export default ImageSwiper;