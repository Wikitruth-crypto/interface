// "use client"

// import { useEffect } from 'react';
// import CardProfileContainer from '@Profile/containers/CardProfileContainer';
// import SkeletonProfile from '@/components/base/skeletonProfile';
// import { testBoxProfileList } from "@dapp/store/testBox";
// // import { Container } from "@/components/Container";
// import ProgressiveRevealCard from '@dapp/components/progressiveRevealCard/progressiveRevealCard';
// import { useProgressiveReveal } from '@dapp/components/progressiveRevealCard/useProgressiveReveal';


// interface Props {
//     page?: number;
//     pageSize?: number;
// }

// export default function ProfileList({ page = 1, pageSize = 24 }: Props) {
//     // Use professional progressive reveal Hook
//     const {
//         items,
//         startReveal,
//         reset,
//         isRevealing,
//         revealedCount,
//         progress
//     } = useProgressiveReveal({
//         revealDelay: 200,           // 200ms interval per card
//         transitionDuration: 300,    // 300ms transition duration
//         initialCount: pageSize,     // Initial skeleton count
//         cleanupOnUnmount: true      // Cleanup timer on unmount
//     });

//     // Simulate data loading and start progressive reveal
//     useEffect(() => {
//         const loadData = async () => {
//             // Simulate API request delay (5s)
//             await new Promise(resolve => setTimeout(resolve, 5000));
            
//             // Start progressive reveal
//             startReveal(testBoxProfileList);
//         };

//         loadData();
//     }, []);

//     return (

//             <div className="w-full">
//                 {/* Optional: Show loading progress (dev only) */}
//                 {process.env.NODE_ENV === 'development' && (
//                     <div className="mb-4 p-3 bg-black/20 rounded-lg">
//                         <div className="text-sm text-muted-foreground mb-2">
//                             Progressive reveal status: {isRevealing ? 'In Progress' : 'Completed'} 
//                             ({revealedCount}/{items.length})
//                         </div>
//                         <div className="w-full bg-gray-700 rounded-full h-2">
//                             <div 
//                                 className="bg-primary h-2 rounded-full transition-all duration-300"
//                                 style={{ width: `${progress * 100}%` }}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 {/* Single column list layout */}
//                 <div className="w-full space-y-3 sm:space-y-4 md:space-y-6">
//                     {items.map((item) => (
//                         <div 
//                             key={`profile-card-${item.index}`}
//                             className="w-full"
//                         >
//                             <ProgressiveRevealCard
//                                 item={item}
//                                 skeletonComponent={SkeletonProfile}
//                                 contentComponent={CardProfileContainer}
//                                 animationType="slide-up"
//                                 transitionDuration={300}
//                             />
//                         </div>
//                     ))}
//                 </div>
                
//                 {/* Empty state - Show only when confirmed no data */}
//                 {!isRevealing && revealedCount === 0 && testBoxProfileList.length === 0 && (
//                     <div className="flex flex-col items-center justify-center py-12 text-center">
//                         <div className="text-muted-foreground text-lg mb-2">
//                             No Users
//                         </div>
//                         <div className="text-muted-foreground text-sm">
//                             User list is empty, please try again later
//                         </div>
//                         {/* Optional: Retry button */}
//                         <button
//                             onClick={() => {
//                                 reset();
//                                 // Reload data logic
//                                 setTimeout(() => startReveal(testBoxProfileList), 100);
//                             }}
//                             className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//                         >
//                             Retry
//                         </button>
//                     </div>
//                 )}
//             </div>
//     );
// }