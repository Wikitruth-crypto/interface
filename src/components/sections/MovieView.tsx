// import { useState } from "react"
// import TitleLabel from "../customer/TitleLabel"
// import { Button } from "@/components/ui/button"
// import AdaptiveButton from "@/components/base/AdaptiveButton"
// import { Card, CardContent } from "@/components/ui/card"
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel"
// import { Container } from "../Container"
// import { cn } from "@/lib/utils"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { useIsMobile } from "@/hooks/use-mobile"

// // list1 - Overheard 2
// import img1_1 from '@/assets/case/1/1.jpg';
// import img1_2 from '@/assets/case/1/2.jpg';
// import img1_3 from '@/assets/case/1/3.jpg';
// import img1_4 from '@/assets/case/1/4.jpg';
// import img1_5 from '@/assets/case/1/5.jpg';
// import img1_6 from '@/assets/case/1/6.jpg';
// import img1_7 from '@/assets/case/1/7.jpg';
// import img1_8 from '@/assets/case/1/8.jpg';
// import img1_9 from '@/assets/case/1/9.jpg';
// import img1_10 from '@/assets/case/1/10.jpg';
// import img1_11 from '@/assets/case/1/11.jpg';

// // list2 - Inside Men
// import img2_1 from '@/assets/case/2/1.jpg';
// import img2_2 from '@/assets/case/2/2.jpg';
// import img2_3 from '@/assets/case/2/3.jpg';
// import img2_4 from '@/assets/case/2/4.jpg';
// import img2_5 from '@/assets/case/2/5.jpg';
// import img2_6 from '@/assets/case/2/6.jpg';
// import img2_7 from '@/assets/case/2/7.jpg';
// import img2_8 from '@/assets/case/2/8.jpg';
// import img2_9 from '@/assets/case/2/9.jpg';
// import img2_10 from '@/assets/case/2/10.jpg';
// import img2_11 from '@/assets/case/2/11.jpg';
// import img2_12 from '@/assets/case/2/12.jpg';
// import img2_13 from '@/assets/case/2/13.jpg';
// import img2_14 from '@/assets/case/2/14.jpg';
// import img2_15 from '@/assets/case/2/15.jpg';

// // 电影数据配置
// const movies = [
//     {
//         id: 'overheard2',
//         title: 'Overheard 2',
//         images: [img1_1, img1_2, img1_3, img1_4, img1_5, img1_6, img1_7, img1_8, img1_9, img1_10, img1_11]
//     },
//     {
//         id: 'insidemen',
//         title: 'Inside Men', 
//         images: [img2_1, img2_2, img2_3, img2_4, img2_5, img2_6, img2_7, img2_8, img2_9, img2_10, img2_11, img2_12, img2_13, img2_14, img2_15]
//     }
// ]

// /**
//  * 重构的电影图片浏览组件
//  * 支持电影切换、图片导航和全屏查看
//  */
// export default function MovieViewSection() {
//     const [selectedMovie, setSelectedMovie] = useState(movies[0])
//     const [currentIndex, setCurrentIndex] = useState(0)
//     const isMobile = useIsMobile()

//     // 切换电影时重置图片索引
//     const handleMovieChange = (movie: typeof movies[0]) => {
//         setSelectedMovie(movie)
//         setCurrentIndex(0)
//     }

//     // 图片导航
//     const handlePrevious = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex(currentIndex - 1)
//         }
//     }

//     const handleNext = () => {
//         if (currentIndex < selectedMovie.images.length - 1) {
//             setCurrentIndex(currentIndex + 1)
//         }
//     }

//     // 直接跳转到指定图片
//     const handleImageSelect = (index: number) => {
//         setCurrentIndex(index)
//     }

    

//     return (
//         <section className="w-full">
//             <Container className="flex flex-col items-center justify-center space-y-8 px-0 md:px-0 ">
//                 {/* 标题 */}
//                 <TitleLabel>Movie Gase</TitleLabel>

//                 {/* 电影选择按钮 */}
//                 <div className="flex flex-wrap gap-4 justify-center">
//                     {movies.map((movie) => (
//                         <Button
//                             key={movie.id}
//                             onClick={() => handleMovieChange(movie)}
//                             variant={selectedMovie.id === movie.id ? "default" : "outline"}
//                             className={cn(
//                                 "px-6 py-2 text-sm font-medium transition-all",
//                                 selectedMovie.id === movie.id
//                                     ? "bg-primary text-primary-foreground"
//                                     : "hover:bg-accent hover:text-accent-foreground"
//                             )}
//                         >
//                             {movie.title}
//                         </Button>
//                     ))}
//                 </div>

//                 {/* 主图片显示区域 */}
//                 <Card className="w-full max-w-4xl bg-black/80 border-gray-700">
//                     <CardContent className="px-2 md:px-6">
//                         <div className="relative">
//                             {/* 主图片 */}
//                             <div className="relative bg-black rounded-lg overflow-hidden">
//                                 <image
//                                     src={selectedMovie.images[currentIndex]}
//                                     alt={`${selectedMovie.title} - Image ${currentIndex + 1}`}
//                                     width={800}
//                                     height={600}
//                                     className="w-full h-auto object-contain"
//                                     priority
//                                 />
//                             </div>

//                             {/* 图片导航控制 */}
//                             <div className="flex items-center justify-between mt-6">
//                                 <AdaptiveButton
//                                     onClick={handlePrevious}
//                                     icon={<ChevronLeft className="h-4 w-4" />}
//                                     disabled={currentIndex === 0}
//                                     variant="outline"
//                                     size="sm"
                                    
//                                 >
//                                     Previous
//                                 </AdaptiveButton>

//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                     <span className="font-medium text-foreground">
//                                         {currentIndex + 1}
//                                     </span>
//                                     <span>/</span>
//                                     <span>{selectedMovie.images.length}</span>
//                                 </div>

//                                 <AdaptiveButton
//                                     onClick={handleNext}
//                                     direction="right"
//                                     icon={<ChevronRight className="h-4 w-4" />}
//                                     disabled={currentIndex === selectedMovie.images.length - 1}
//                                     variant="outline"
//                                     size="sm"
//                                 >
//                                     Next
//                                 </AdaptiveButton>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* 缩略图轮播  移动端不显示这个*/}
//                 {!isMobile &&
//                 <div className="w-full max-w-4xl">
//                     <Carousel className="w-full">
//                         <CarouselContent className="-ml-2">
//                             {selectedMovie.images.map((image, index) => (
//                                 <CarouselItem key={index} className="pl-2 basis-1/3 md:basis-1/4 lg:basis-1/6">
//                                     <button
//                                         onClick={() => handleImageSelect(index)}
//                                         className={cn(
//                                             "relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
//                                             currentIndex === index
//                                                 ? "border-primary ring-2 ring-primary/20"
//                                                 : "border-transparent hover:border-gray-300"
//                                         )}
//                                     >
//                                         <image
//                                             src={image}
//                                             alt={`${selectedMovie.title} thumbnail ${index + 1}`}
//                                             width={120}
//                                             height={90}
//                                             className="w-full h-full object-cover"
//                                         />
//                                         {currentIndex === index && (
//                                             <div className="absolute inset-0 bg-primary/20" />
//                                         )}
//                                     </button>
//                                 </CarouselItem>
//                             ))}
//                         </CarouselContent>
//                         <CarouselPrevious className="left-0" />
//                         <CarouselNext className="right-0" />
//                     </Carousel>
//                 </div>
//                 }
//             </Container>
//         </section>
//     )
// }





