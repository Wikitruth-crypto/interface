"use client"

import { useEffect } from 'react';
import CardProfileContainer from '@/dapp/pages/Profile/containers/CardProfileContainer';
import SkeletonProfile from '@/dapp/components/base/skeletonProfile';
import { testBoxProfileList } from "../store/testBox";
// import { Container } from "@/components/Container";
import ProgressiveRevealCard from '@/dapp/components/base/progressiveRevealCard';
import { useProgressiveReveal } from '@/dapp/hooks/useProgressiveReveal';


interface Props {
    page?: number;
    pageSize?: number;
}

export default function ProfileList({ page = 1, pageSize = 24 }: Props) {
    // 使用专业的渐进式显示Hook
    const {
        items,
        startReveal,
        reset,
        isRevealing,
        revealedCount,
        progress
    } = useProgressiveReveal({
        revealDelay: 200,           // 每个卡片间隔200ms
        transitionDuration: 300,    // 过渡动画300ms
        initialCount: pageSize,     // 初始骨架屏数量
        cleanupOnUnmount: true      // 组件卸载时清理定时器
    });

    // 模拟数据加载和开始渐进式显示
    useEffect(() => {
        const loadData = async () => {
            // 模拟API请求延迟（5秒）
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // 开始渐进式显示
            startReveal(testBoxProfileList);
        };

        loadData();
    }, []);

    return (

            <div className="w-full">
                {/* 可选：显示加载进度（仅在开发环境） */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-black/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">
                            渐进式加载状态: {isRevealing ? '进行中' : '完成'} 
                            ({revealedCount}/{items.length})
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* 单行列表布局 */}
                <div className="w-full space-y-3 sm:space-y-4 md:space-y-6">
                    {items.map((item) => (
                        <div 
                            key={`profile-card-${item.index}`}
                            className="w-full"
                        >
                            <ProgressiveRevealCard
                                item={item}
                                skeletonComponent={SkeletonProfile}
                                contentComponent={CardProfileContainer}
                                animationType="slide-up"
                                transitionDuration={300}
                            />
                        </div>
                    ))}
                </div>
                
                {/* 空状态显示 - 只在确认无数据时显示 */}
                {!isRevealing && revealedCount === 0 && testBoxProfileList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-muted-foreground text-lg mb-2">
                            暂无用户
                        </div>
                        <div className="text-muted-foreground text-sm">
                            用户列表为空，请稍后再试
                        </div>
                        {/* 可选：重试按钮 */}
                        <button
                            onClick={() => {
                                reset();
                                // 重新加载数据的逻辑
                                setTimeout(() => startReveal(testBoxProfileList), 100);
                            }}
                            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            重试
                        </button>
                    </div>
                )}
            </div>
    );
}