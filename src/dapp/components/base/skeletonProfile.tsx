import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProfileProps {
    className?: string;
    animate?: boolean;
}

/**
 * 现代化的资料卡片骨架屏组件
 * 用于替代原有的 SkeletonProfile 组件，支持响应式设计
 */
const SkeletonProfile: React.FC<SkeletonProfileProps> = ({
    className,
    animate = true
}) => {
    const shimmerClass = animate ? 'animate-pulse' : '';

    return (
        <div className={cn(
            "bg-white/10 rounded-xl shadow-sm border border-white/20",
            "overflow-hidden p-4 mb-4",
            // 响应式布局：移动端垂直，桌面端水平
            "flex flex-col lg:flex-row lg:items-stretch gap-4",
            "w-full",
            "min-h-[200px]",
            shimmerClass,
            className
        )}>
            {/* 左侧：Box 基础信息展示区 */}
            <div className={cn(
                "flex-1 min-w-0",
                "flex flex-col sm:flex-row gap-4",
                "p-2 rounded-lg"
            )}>
                {/* Box 图片骨架 */}
                <div className="flex-shrink-0 self-center sm:self-start">
                    <div className={cn(
                        "bg-white/20 rounded-lg",
                        "w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48",
                        shimmerClass
                    )} />
                </div>

                {/* Box 信息骨架 */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* 标题和描述区域 */}
                    <div className="space-y-2">
                        {/* 标题骨架 */}
                        <div className={cn(
                            "h-5 sm:h-6 bg-white/20 rounded",
                            "w-4/5",
                            shimmerClass
                        )} />

                        {/* 描述骨架 */}
                        <div className="space-y-1">
                            <div className={cn(
                                "h-4 bg-white/20 rounded",
                                "w-full",
                                shimmerClass
                            )} />
                            <div className={cn(
                                "h-4 bg-white/20 rounded",
                                "w-3/4",
                                shimmerClass
                            )} />
                            <div className={cn(
                                "h-4 bg-white/20 rounded",
                                "w-1/2",
                                shimmerClass
                            )} />
                        </div>
                    </div>

                    {/* 元数据区域骨架 */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Token ID */}
                        <div className={cn(
                            "h-4 bg-white/20 rounded",
                            "w-16",
                            shimmerClass
                        )} />

                        {/* 状态标签 */}
                        <div className={cn(
                            "h-6 bg-white/20 rounded-md",
                            "w-20",
                            shimmerClass
                        )} />

                        {/* 位置信息 */}
                        <div className={cn(
                            "h-4 bg-white/20 rounded",
                            "w-24",
                            shimmerClass
                        )} />

                        {/* 日期 */}
                        <div className={cn(
                            "h-4 bg-white/20 rounded",
                            "w-20",
                            shimmerClass
                        )} />
                    </div>
                </div>
            </div>

            {/* 中间：资金展示区域 */}
            <div className={cn(
                "flex-shrink-0",
                "lg:w-56 xl:w-64",
                "border-t lg:border-t-0 lg:border-l border-white/20",
                "pt-4 lg:pt-0 lg:pl-4"
            )}>
                <div className="space-y-3">
                    {/* 标题 */}
                    <div className={cn(
                        "h-4 bg-white/20 rounded",
                        "w-24",
                        shimmerClass
                    )} />
                    
                    {/* 代币选项 */}
                    <div className="space-y-2">
                        {/* 第一个代币选项 */}
                        <div className={cn(
                            "p-3 border-2 border-white/20 rounded-lg",
                            "flex items-center space-x-3"
                        )}>
                            {/* Radio Button */}
                            <div className={cn(
                                "w-4 h-4 bg-white/20 rounded-full",
                                shimmerClass
                            )} />
                            
                            {/* Token Info */}
                            <div className="flex-1 space-y-1">
                                <div className={cn(
                                    "h-5 bg-white/20 rounded",
                                    "w-20",
                                    shimmerClass
                                )} />
                                <div className={cn(
                                    "h-3 bg-white/20 rounded",
                                    "w-12",
                                    shimmerClass
                                )} />
                            </div>
                        </div>

                        {/* 第二个代币选项 */}
                        <div className={cn(
                            "p-3 border-2 border-white/20 rounded-lg",
                            "flex items-center space-x-3"
                        )}>
                            {/* Radio Button */}
                            <div className={cn(
                                "w-4 h-4 bg-white/20 rounded-full",
                                shimmerClass
                            )} />
                            
                            {/* Token Info */}
                            <div className="flex-1 space-y-1">
                                <div className={cn(
                                    "h-5 bg-white/20 rounded",
                                    "w-16",
                                    shimmerClass
                                )} />
                                <div className={cn(
                                    "h-3 bg-white/20 rounded",
                                    "w-10",
                                    shimmerClass
                                )} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧：Claim 按钮区域 */}
            <div className={cn(
                "flex-shrink-0 flex items-center justify-center",
                "lg:w-36 xl:w-40",
                "border-t lg:border-t-0 lg:border-l border-white/20",
                "pt-4 lg:pt-0 lg:pl-4"
            )}>
                <div className="flex flex-col items-center space-y-2">
                    {/* 按钮骨架 */}
                    <div className={cn(
                        "h-10 bg-white/20 rounded-lg",
                        "w-24",
                        shimmerClass
                    )} />
                    
                    {/* 金额显示骨架 */}
                    <div className={cn(
                        "h-3 bg-white/20 rounded",
                        "w-20",
                        shimmerClass
                    )} />
                </div>
            </div>
        </div>
    );
};

export default SkeletonProfile; 