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
 * Modernized user data statistics bar component
 * Support responsive design and interactive label switching
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
        },
        { 
            key: 'owned',
            displayName: 'Owned',
            count: data?.ownedBoxes || 0,
        },
        { 
            key: 'minted',
            displayName: 'Minted',
            count: data?.mintedBoxes || 0,
        },
        { 
            key: 'sold',
            displayName: 'Sold',
            count: data?.soldBoxes || 0,
        },
        { 
            key: 'bought',
            displayName: 'Bought',
            count: data?.boughtBoxes || 0,
        },
        { 
            key: 'bade',
            displayName: 'Bade',
            count: data?.bidBoxes || 0,
        },
        { 
            key: 'completed',
            displayName: 'Completed',
            count: data?.completedBoxes || 0,
        },
        { 
            key: 'published',
            displayName: 'Published',
            count: data?.publishedBoxes || 0,
        },
    ];

    // Filter out items with a count of 0 (if not displaying zero values)
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

    // Compact style
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

    // Default style
    return (
        <div className={cn(
            "grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-1.5",
            "p-1.5 md:p-2 bg-card border rounded-xl shadow-sm",
            className
        )}>
            {visibleTabs.map((tab) => (
                <div
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                        "relative flex flex-col items-center justify-center",
                        "p-1 md:p-1.5 rounded-lg transition-all duration-300",
                        "border border-transparent",
                        "hover:shadow-md hover:border-primary",
                        onTabClick && !loading && "cursor-pointer hover:scale-105",
                        selectedTab === tab.key && [
                            "bg-primary/10 border-primary shadow-lg scale-105",
                            "ring-1 ring-primary/20"
                        ],
                        selectedTab !== tab.key && [
                            "bg-background hover:bg-accent/50",
                            onTabClick && "hover:border-border"
                        ],
                        loading && "opacity-60 cursor-not-allowed",
                        tab.count === 0 && selectedTab !== tab.key && "opacity-75"
                    )}
                >
                    {/* Number display */}
                    <div className={cn(
                        "text-sm md:text-base lg:text-lg font-bold",
                        "transition-all duration-300",
                        selectedTab === tab.key 
                            ? "text-primary" 
                            : "text-foreground",
                        loading && "animate-pulse"
                    )}>
                        {loading ? (
                            <Loader2 className="h-3 w-3 md:h-3.5 md:w-3.5 animate-spin" />
                        ) : (
                            tab.count.toLocaleString()
                        )}
                    </div>

                    {/* Label text */}
                    <div className="text-center">
                        <p className={cn(
                            "text-xs font-medium leading-tight mt-0.5",
                            selectedTab === tab.key 
                                ? "text-primary" 
                                : "text-muted-foreground"
                        )}>
                            {tab.displayName}
                        </p>
                    </div>

                    {/* Selected indicator */}
                    {selectedTab === tab.key && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserDataBar; 