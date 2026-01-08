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
//  * Modernized infinite scrolling component
//  * Using Intersection Observer API to implement high-performance scroll loading
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
    
//     // Use ref to save callback function, avoid useEffect dependency problem
//     const onLoadMoreRef = useRef(onLoadMore);

//     // Update callback function reference
//     useEffect(() => {
//         onLoadMoreRef.current = onLoadMore;
//     }, [onLoadMore]);

//     // Trigger load more callback function - remove function dependency to avoid infinite loop
//     const handleLoadMore = useCallback(() => {
//         if (!disabled && hasMore && !loading && onLoadMoreRef.current) {
//             if (import.meta.env.DEV) {
//                 console.log('InfiniteScroll: Trigger Load More');
//             }
//             onLoadMoreRef.current();
//         }
//     }, [disabled, hasMore, loading]);

//     // Initialize Intersection Observer
//     useEffect(() => {
//         // Button mode does not use Intersection Observer
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
//                 rootMargin: '20px' 
//             }
//         );

//         observer.current.observe(loaderRef.current);

//         return () => {
//             if (observer.current) {
//                 observer.current.disconnect();
//             }
//         };
//     }, [disabled, hasMore, loading, threshold, handleLoadMore, variant]);

//     // If it is disabled and there is no more data, do not render any content
//     if (disabled && !hasMore && !showEndMessage) {
//         return null;
//     }

//     // Button variant
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

//     // Minimal variant
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

//     // Default variant
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
//                             {/* Loading animation */}
//                             <div className="relative">
//                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                 <div className="absolute inset-0 h-8 w-8 animate-pulse bg-primary/20 rounded-full" />
//                             </div>
                            
//                             {/* Loading text */}
//                             <p className="text-sm font-medium text-muted-foreground">
//                                 {loadingText}
//                             </p>
                            
//                             {/* Loading skeleton screen */}
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