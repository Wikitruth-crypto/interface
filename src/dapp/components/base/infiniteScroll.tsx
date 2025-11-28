// "use client"

// import React, { useEffect, useRef, useCallback } from 'react';
// import { cn } from "@/lib/utils";
// import { Loader2, ChevronDown } from "lucide-react";

// export interface InfiniteScrollProps {
//     onLoadMore: () => void;
//     disabled?: boolean;
//     hasMore?: boolean;
//     loading?: boolean;
//     threshold?: number;
//     className?: string;
//     variant?: 'default' | 'minimal' | 'button';
//     loadingText?: string;
//     endText?: string;
//     showEndMessage?: boolean;
//     children?: React.ReactNode;
// }

// /**
//  * 现代化的无限滚动组件
//  * 使用 Intersection Observer API 实现高性能的滚动加载
//  */
// const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
//     onLoadMore,
//     disabled = false,
//     hasMore = true,
//     loading = false,
//     threshold = 0.1,
//     className,
//     variant = 'default',
//     loadingText = "Loading more...",
//     endText = "No more data to load",
//     showEndMessage = true,
//     children
// }) => {
//     const observer = useRef<IntersectionObserver | null>(null);
//     const loaderRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);
    
//     // 使用ref保存回调函数，避免useEffect依赖问题
//     const onLoadMoreRef = useRef(onLoadMore);

//     // 更新回调函数引用
//     useEffect(() => {
//         onLoadMoreRef.current = onLoadMore;
//     }, [onLoadMore]);

//     // 触发加载更多的回调函数 - 移除函数依赖避免无限循环
//     const handleLoadMore = useCallback(() => {
//         if (!disabled && hasMore && !loading && onLoadMoreRef.current) {
//             if (import.meta.env.DEV) {
//                 console.log('InfiniteScroll: Trigger Load More');
//             }
//             onLoadMoreRef.current();
//         }
//     }, [disabled, hasMore, loading]);

//     // 初始化 Intersection Observer
//     useEffect(() => {
//         // 按钮模式不使用 Intersection Observer
//         if (variant === 'button') {
//             return;
//         }

//         if (!loaderRef.current || disabled || !hasMore) {
//             return;
//         }

//         if (import.meta.env.DEV) {
//             console.log('InfiniteScroll: Init Observer', { disabled, hasMore, loading });
//         }

//         observer.current = new IntersectionObserver(
//             (entries) => {
//                 const target = entries[0];
//                 if (target.isIntersecting) {
//                     handleLoadMore();
//                 }
//             },
//             { 
//                 threshold,
//                 rootMargin: '20px' // 提前 20px 触发
//             }
//         );

//         observer.current.observe(loaderRef.current);

//         return () => {
//             if (observer.current) {
//                 observer.current.disconnect();
//             }
//         };
//     }, [disabled, hasMore, loading, threshold, handleLoadMore, variant]);

//     // 如果已禁用且没有更多数据，不渲染任何内容
//     if (disabled && !hasMore && !showEndMessage) {
//         return null;
//     }

//     // 按钮变体
//     if (variant === 'button') {
//         return (
//             <div className={cn("flex justify-center py-6", className)}>
//                 {hasMore ? (
//                     <button
//                         ref={buttonRef}
//                         onClick={handleLoadMore}
//                         disabled={loading || disabled}
//                         className={cn(
//                             "flex items-center gap-2 px-6 py-3",
//                             "bg-primary text-primary-foreground",
//                             "rounded-lg font-medium transition-all duration-200",
//                             "hover:bg-primary/90 hover:scale-105",
//                             "disabled:opacity-50 disabled:cursor-not-allowed",
//                             "disabled:hover:scale-100 disabled:hover:bg-primary"
//                         )}
//                     >
//                         {loading ? (
//                             <>
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 <span>{loadingText}</span>
//                             </>
//                         ) : (
//                             <>
//                                 <ChevronDown className="h-4 w-4" />
//                                 <span>Load More</span>
//                             </>
//                         )}
//                     </button>
//                 ) : (
//                     showEndMessage && (
//                         <div className="text-sm text-muted-foreground text-center py-4">
//                             {endText}
//                         </div>
//                     )
//                 )}
//             </div>
//         );
//     }

//     // 最小化变体
//     if (variant === 'minimal') {
//         if (!hasMore) {
//             return showEndMessage ? (
//                 <div className={cn("text-center py-4", className)}>
//                     <span className="text-xs text-muted-foreground">{endText}</span>
//                 </div>
//             ) : null;
//         }

//         return (
//             <div 
//                 ref={loaderRef}
//                 className={cn(
//                     "flex justify-center items-center py-4",
//                     className
//                 )}
//             >
//                 {loading && (
//                     <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//                 )}
//             </div>
//         );
//     }

//     // 默认变体
//     return (
//         <div className={cn("w-full", className)}>
//             {children}
            
//             {hasMore ? (
//                 <div 
//                     ref={loaderRef}
//                     className={cn(
//                         "flex flex-col items-center justify-center",
//                         "py-8 gap-3 min-h-[100px]"
//                     )}
//                 >
//                     {loading && (
//                         <>
//                             {/* 加载动画 */}
//                             <div className="relative">
//                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                 <div className="absolute inset-0 h-8 w-8 animate-pulse bg-primary/20 rounded-full" />
//                             </div>
                            
//                             {/* 加载文本 */}
//                             <p className="text-sm font-medium text-muted-foreground">
//                                 {loadingText}
//                             </p>
                            
//                             {/* 加载骨架屏 */}
//                             <div className="flex flex-col gap-2 w-full max-w-sm">
//                                 <div className="h-2 bg-muted rounded animate-pulse" />
//                                 <div className="h-2 bg-muted rounded animate-pulse w-3/4" />
//                                 <div className="h-2 bg-muted rounded animate-pulse w-1/2" />
//                             </div>
//                         </>
//                     )}
//                 </div>
//             ) : (
//                 showEndMessage && (
//                     <div className="flex flex-col items-center justify-center py-8">
//                         <div className="w-12 h-[1px] bg-border mb-4" />
//                         <p className="text-sm text-muted-foreground">{endText}</p>
//                     </div>
//                 )
//             )}
//         </div>
//     );
// };

// export default InfiniteScroll; 