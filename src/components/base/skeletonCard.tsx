import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonCardProps {
    className?: string;
    animate?: boolean;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
    className,
    animate = true
}) => {
    const shimmerClass = animate ? 'animate-pulse' : '';

    return (
        <div className={cn(
            "flex flex-col items-center w-full bg-card",
            "md:max-w-[350px]",
            "mt-3 sm:mt-4 md:mt-5",
            "border border-border/50",
            "rounded-xl md:rounded-2xl shadow-lg",
            "bg-card overflow-hidden",
            shimmerClass,
            className
        )}>
            <div 
                className={cn(
                    "w-full overflow-hidden bg-white/20",
                    shimmerClass
                )}
                style={{ aspectRatio: 1/1 }}
            />

            <div className={cn(
                "w-full bg-card flex flex-col items-center",
                "rounded-b-xl md:rounded-b-2xl",
                "px-2 sm:px-3 md:px-4",
                "py-2 sm:py-2.5 md:py-3"
            )}>
                {/* Title - Match p element */}
                <div className={cn(
                    "bg-white/20 rounded",
                    "h-[30px] sm:h-[35px] md:h-[43px]",
                    "w-full", // Title takes up full width
                    shimmerClass
                )} />

                {/* Information row - Country and date, match p element */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    "mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 md:mt-2 md:mb-2",
                    "min-h-[20px] sm:min-h-[22px] md:min-h-[24px]"
                )}>
                    {/* Country - Match the max-width of the first p element */}
                    <div className={cn(
                        "bg-white/20 rounded",
                        "h-3.5 sm:h-3.5 md:h-3.5",
                        "max-w-[140px] sm:max-w-[160px] md:max-w-[180px]",
                        shimmerClass
                    )} />
                    {/* Date - Match the second p element, no max-width */}
                    <div className={cn(
                        "bg-white/20 rounded",
                        "h-3.5 sm:h-3.5 md:h-3.5", 
                        "w-20 sm:w-24 md:w-28",
                        shimmerClass
                    )} />
                </div>

                {/* Separator line - Match hr element */}
                <hr className={cn(
                    "w-full border-neutral-400/50",
                    shimmerClass
                )} />

                <div className={cn(
                    "w-full flex justify-between items-center",
                    "mt-1 mb-0 sm:mt-1.5 sm:mb-0 md:mt-2 md:mb-0",
                    "min-h-[24px] sm:min-h-[26px] md:min-h-[28px]"
                )}>
                    <div className={cn(
                        "bg-white/20 rounded shrink-0",
                        "h-4 sm:h-5 md:h-5",
                        "w-12 sm:w-16 md:w-16", // Simulate Token ID length
                        shimmerClass
                    )} />

                    <div className={cn(
                        "flex items-center justify-end min-w-0",
                        "gap-1 sm:gap-1.5 md:gap-2"
                    )}>
                        <div className={cn(
                            "bg-white/20 rounded shrink min-w-0",
                            "h-4 sm:h-5 md:h-5",
                            "w-12 sm:w-16 md:w-20", // Simulate price length
                            shimmerClass
                        )} />

                        <div className={cn(
                            "bg-white/20 rounded shrink-0",
                            "h-5 sm:h-6 md:h-6",
                            "w-16 sm:w-18 md:w-20", // Simulate status label length
                            shimmerClass
                        )} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard; 