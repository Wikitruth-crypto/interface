import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonCardProps {
    className?: string;
    animate?: boolean;
}

/**
 * 现代化的卡片骨架屏组件
 * 用于替代原有的 Skeleton 组件，支持响应式设计
 * 与 TruthBoxCard 保持一致的布局和尺寸
 */
const SkeletonCard: React.FC<SkeletonCardProps> = ({
    className,
    animate = true
}) => {
    const shimmerClass = animate ? 'animate-pulse' : '';

    return (
        <div className={cn(
            // 基础布局 - 与 TruthBoxCard 一致
            "flex flex-col items-center w-full",
            // 响应式最大宽度约束 - 与 TruthBoxCard 一致
            "md:max-w-[350px]",
            // 响应式外边距 - 与 TruthBoxCard 一致
            "mt-3 sm:mt-4 md:mt-5",
            // 圆角和阴影 - 与 TruthBoxCard 一致
            "rounded-xl md:rounded-2xl shadow-lg",
            // 骨架屏背景色
            "bg-white/10 border border-white/20 overflow-hidden",
            shimmerClass,
            className
        )}>
            {/* 图片骨架区域 - 使用4:3宽高比模拟ImageSwiper */}
            <div 
                className={cn(
                    "w-full overflow-hidden bg-white/20",
                    "rounded-t-xl md:rounded-t-2xl",
                    shimmerClass
                )}
                style={{ aspectRatio: 1/1 }} // 与 ImageSwiper 的 4:3 比例一致
            />

            {/* 内容区域骨架 - 高度自适应，与 TruthBoxCard 一致 */}
            <div className={cn(
                "w-full bg-card flex flex-col items-center",
                "rounded-b-xl md:rounded-b-2xl",
                // 响应式内边距 - 与 TruthBoxCard 完全一致
                "px-2 sm:px-3 md:px-4",
                "py-2 sm:py-2.5 md:py-3"
            )}>
                {/* 标题骨架 - 模拟 Paragraph 组件 */}
                <div className="w-full">
                    <div className={cn(
                        "bg-white/20 rounded",
                        // 响应式高度，模拟文字行高
                        "h-4 sm:h-5 md:h-6",
                        "w-4/5", // 模拟标题长度
                        shimmerClass
                    )} />
                </div>

                {/* 信息行骨架 - 国家和日期 */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    // 响应式上下边距 - 与 TruthBoxCard 一致
                    "mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 md:mt-2 md:mb-2",
                    "min-h-[20px] sm:min-h-[22px] md:min-h-[24px]"
                )}>
                    <div className={cn(
                        "bg-white/20 rounded",
                        // 响应式高度和宽度
                        "h-3 sm:h-4 md:h-4",
                        "w-20 sm:w-24 md:w-28", // 模拟国家州名长度
                        shimmerClass
                    )} />
                    <div className={cn(
                        "bg-white/20 rounded",
                        // 响应式高度和宽度
                        "h-3 sm:h-4 md:h-4", 
                        "w-16 sm:w-20 md:w-24", // 模拟日期长度
                        shimmerClass
                    )} />
                </div>

                {/* 分割线骨架 */}
                <div className={cn(
                    "w-full h-px bg-white/20",
                    shimmerClass
                )} />

                {/* 底部信息骨架 - ID、价格、状态 */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    // 响应式上下边距 - 与 TruthBoxCard 一致
                    "mt-1 mb-0 sm:mt-1.5 sm:mb-0 md:mt-2 md:mb-0",
                    "min-h-[24px] sm:min-h-[26px] md:min-h-[28px]"
                )}>
                    {/* Token ID 骨架 */}
                    <div className={cn(
                        "bg-white/20 rounded flex-shrink-0",
                        // 响应式高度
                        "h-4 sm:h-5 md:h-5",
                        "w-12 sm:w-16 md:w-16", // 模拟 Token ID 长度
                        shimmerClass
                    )} />

                    {/* 状态和价格区域骨架 */}
                    <div className={cn(
                        "flex items-center justify-end min-w-0",
                        // 响应式间距 - 与 TruthBoxCard 一致
                        "gap-1 sm:gap-1.5 md:gap-2"
                    )}>
                        {/* 价格组件骨架 */}
                        <div className={cn(
                            "bg-white/20 rounded flex-shrink min-w-0",
                            // 响应式高度
                            "h-4 sm:h-5 md:h-5",
                            "w-12 sm:w-16 md:w-20", // 模拟价格长度
                            shimmerClass
                        )} />

                        {/* 状态标签骨架 */}
                        <div className={cn(
                            "bg-white/20 rounded flex-shrink-0",
                            // 响应式高度和宽度，模拟状态标签
                            "h-5 sm:h-6 md:h-6",
                            "w-16 sm:w-18 md:w-20", // 模拟状态标签长度
                            shimmerClass
                        )} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard; 