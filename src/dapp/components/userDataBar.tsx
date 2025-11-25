"use client"

import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface UserDataBarData {
    totalBoxes?: number;
    ownedBoxes?: number;
    mintedBoxes?: number;
    soldBoxes?: number;
    boughtBoxes?: number;
    bidBoxes?: number;
    completedBoxes?: number;
    publishedBoxes?: number;
}

export type TabKey = 'all' | 'owned' | 'minted' | 'sold' | 'bought' | 'bade' | 'completed' | 'published';

export interface UserDataBarProps {
    data?: UserDataBarData;
    loading?: boolean;
    selectedTab?: TabKey;
    onTabClick?: (tab: TabKey) => void;
    className?: string;
    variant?: 'default' | 'compact';
    showZeroValues?: boolean;
}

interface TabConfig {
    key: TabKey;
    displayName: string;
    count: number;
    description?: string;
}

/**
 * 现代化的用户数据统计条组件
 * 支持响应式设计和交互式标签切换
 */
const UserDataBar: React.FC<UserDataBarProps> = ({ 
    data, 
    loading = false, 
    selectedTab = 'all',
    onTabClick,
    className,
    variant = 'default',
    showZeroValues = true
}) => {
    const tabList: TabConfig[] = [
        { 
            key: 'all',
            displayName: 'All Boxes',
            count: data?.totalBoxes || 0,
            description: '所有盒子'
        },
        { 
            key: 'owned',
            displayName: 'Owned',
            count: data?.ownedBoxes || 0,
            description: '拥有的盒子'
        },
        { 
            key: 'minted',
            displayName: 'Minted',
            count: data?.mintedBoxes || 0,
            description: '铸造的盒子'
        },
        { 
            key: 'sold',
            displayName: 'Sold',
            count: data?.soldBoxes || 0,
            description: '已售出的盒子'
        },
        { 
            key: 'bought',
            displayName: 'Bought',
            count: data?.boughtBoxes || 0,
            description: '购买的盒子'
        },
        { 
            key: 'bade',
            displayName: 'Bade',
            count: data?.bidBoxes || 0,
            description: '竞拍的盒子'
        },
        { 
            key: 'completed',
            displayName: 'Completed',
            count: data?.completedBoxes || 0,
            description: '已完成的盒子'
        },
        { 
            key: 'published',
            displayName: 'Published',
            count: data?.publishedBoxes || 0,
            description: '已发布的盒子'
        },
    ];

    // 过滤掉计数为0的项目（如果不显示零值）
    const visibleTabs = showZeroValues ? tabList : tabList.filter(tab => tab.count > 0 || tab.key === selectedTab);

    const handleTabClick = (tabKey: TabKey) => {
        if (onTabClick && !loading) {
            if (import.meta.env.DEV) {
                console.log(`🏷️ UserDataBar: Click Tab`, { 
                    from: selectedTab, 
                    to: tabKey,
                    count: tabList.find(t => t.key === tabKey)?.count || 0
                });
            }
            onTabClick(tabKey);
        }
    };

    // 紧凑版样式
    if (variant === 'compact') {
        return (
            <div className={cn(
                "flex flex-wrap gap-2 p-4 bg-card border rounded-lg",
                className
            )}>
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabClick(tab.key)}
                        disabled={loading || !onTabClick}
                        className={cn(
                            "flex items-center gap-1 px-3 py-2 rounded-md",
                            "text-sm font-medium transition-all duration-200",
                            "border border-transparent",
                            selectedTab === tab.key
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                            onTabClick && "cursor-pointer",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <span>{tab.displayName}</span>
                        <span className={cn(
                            "px-1.5 py-0.5 text-xs rounded",
                            selectedTab === tab.key
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-background text-foreground"
                        )}>
                            {loading ? "..." : tab.count}
                        </span>
                    </button>
                ))}
            </div>
        );
    }

    // 默认样式
    return (
        <div className={cn(
            "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4",
            "p-6 bg-card border rounded-xl shadow-sm",
            className
        )}>
            {visibleTabs.map((tab) => (
                <div
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                        "relative flex flex-col items-center justify-center",
                        "p-4 rounded-lg transition-all duration-300",
                        "border-2 border-transparent",
                        // 基础样式
                        "hover:shadow-md hover:border-primary hover:border-1",
                        // 交互状态
                        onTabClick && !loading && "cursor-pointer hover:scale-105",
                        // 选中状态
                        selectedTab === tab.key && [
                            "bg-primary/10 border-primary shadow-lg scale-105",
                            "ring-2 ring-primary/20"
                        ],
                        // 非选中状态
                        selectedTab !== tab.key && [
                            "bg-background hover:bg-accent/50",
                            onTabClick && "hover:border-border"
                        ],
                        // 加载状态
                        loading && "opacity-60 cursor-not-allowed",
                        // 零值状态
                        tab.count === 0 && selectedTab !== tab.key && "opacity-75"
                    )}
                >
                    {/* 数字显示 */}
                    <div className={cn(
                        "text-2xl md:text-3xl font-bold mb-2",
                        "transition-all duration-300",
                        selectedTab === tab.key 
                            ? "text-primary" 
                            : "text-foreground",
                        loading && "animate-pulse"
                    )}>
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            tab.count.toLocaleString()
                        )}
                    </div>

                    {/* 标签文本 */}
                    <div className="text-center">
                        <p className={cn(
                            "text-sm font-medium mb-1",
                            selectedTab === tab.key 
                                ? "text-primary" 
                                : "text-muted-foreground"
                        )}>
                            {tab.displayName}
                        </p>
                        
                        {/* 描述文本（仅在选中时显示） */}
                        {selectedTab === tab.key && tab.description && (
                            <p className="text-xs text-muted-foreground opacity-75">
                                {tab.description}
                            </p>
                        )}
                    </div>

                    {/* 选中指示器 */}
                    {selectedTab === tab.key && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                    )}

                    {/* 新数据指示器（可选） */}
                    {tab.count > 0 && selectedTab !== tab.key && (
                        <div className="absolute top-2 right-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                tab.count > 10 ? "bg-green-500" :
                                tab.count > 5 ? "bg-yellow-500" :
                                "bg-blue-500"
                            )} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserDataBar; 