import React from 'react';
import { cn } from '@/lib/utils';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

export interface BoxImageProps {
    src: string;
    alt: string;
    onClick?: () => void;
    className?: string;
    aspectRatio?: 'square' | 'wide' | 'tall';
}

const BoxImage: React.FC<BoxImageProps> = ({
    src,
    alt,
    onClick,
    className,
    aspectRatio = 'square'
}) => {
    const aspectClasses = {
        square: 'aspect-square',
        wide: 'aspect-video',
        tall: 'aspect-[3/4]'
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = '/images/placeholder-box.png';
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg",
                "group cursor-pointer",
                aspectClasses[aspectRatio],
                "w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px]",
                className
            )}
            onClick={onClick}
        >
            {/* 主图片 */}
            <img
                src={ipfsCidToUrl(src)}
                alt={alt}
                className={cn(
                    "w-full h-full object-cover",
                    "transition-transform duration-300 ease-in-out",
                    "group-hover:scale-105",
                    "bg-black"
                )}
                loading="lazy"
                onError={handleError}
            />

            {/* 悬停遮罩 */}
            <div className={cn(
                "absolute inset-0 bg-black bg-opacity-0",
                "transition-all duration-300 ease-in-out",
                "group-hover:bg-opacity-10"
            )} />

            {/* 状态标签 */}
            {/* {showStatus && (
                <div className="absolute top-2 right-2">
                    <StatusLabel 
                        status={status} 
                        size="sm"
                        className="backdrop-blur-md shadow-lg"
                    />
                </div>
            )} */}

            {/* 点击指示器 */}
            {onClick && (
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300",
                    "pointer-events-none"
                )}>
                    <div className={cn(
                        "w-12 h-12 bg-white bg-opacity-20 rounded-full",
                        "flex items-center justify-center",
                        "backdrop-blur-sm border border-white border-opacity-30"
                    )}>
                        <svg 
                            className="w-6 h-6 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                            />
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoxImage;