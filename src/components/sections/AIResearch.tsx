import { useState } from "react"
import { Button, Card } from 'antd';
import TitleLabel from "../customer/TitleLabel"
import AdaptiveButton from "@/components/base/AdaptiveButton"

import { Container } from "../Container"
import { cn } from "@/lib/utils"
import {
    ChevronLeft,
    ChevronRight,
    Brain,
    Heart,
    Target,
    Users,
    // Zap,
    ArrowRight,
    Play,
    // ExternalLink
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// 研究实验图片
import img1_1 from '@/assets/case/aiReserch/aiReserch.jpg';
import img1_2 from '@/assets/case/aiReserch/02.jpg';


// 博文内容配置
const blogPosts = [
    /**
     * 


     */
    {
        id: 'ai-altruism-research',
        title: '利他主义与自私主义的AI实验',
        subtitle: '探索人工智能的道德决策机制',
        author: 'Pemex',
        date: '2021年1月',
        videoUrl: 'https://www.youtube.com/watch?v=goePYJ74Ydg&t=190s',
        images: [img1_1, img1_2],
        content: {
            introduction: `这是一个非常火热的AI实验，我们认为它非常适合用来向大家展示我们这个项目的核心理念。尽管它并不是直接与犯罪相关，但是已经非常接近了。非常感谢Pemex团队允许我们分享这个实验。`,
            
            videoGuide: `视频的核心观点是，简单、无差别的利他行为在进化中是脆弱的，很容易被自私的个体利用而消亡。为了让利他主义能够存续，需要满足更复杂的条件。
                视频通过逐步增加模拟复杂性的方式，展示了以下几个关键发现：`,
            
            keyFindings: [
                `无目标的利他行为会失败：当利他者无差别地帮助群体中的任何成员（包括自私者）时，
                自私者能享受到帮助的好处却无需付出任何代价。最终导致利他主义灭绝。`,
                `“绿胡子”效应的成功：如果利他行为有一个可识别的标记（绿胡子），
                并且利他者只帮助同样拥有这个标记的个体，那么利他主义就能成功。`,
                `“骗子”的威胁：然而，“绿胡子”效应在一个更现实的设定下会崩溃。“骗子”——它们拥有绿胡子标记，
                能接受别人的帮助，但自己却不帮助别人。这些骗子最终导致整个利他体系的崩溃。`,
            ],
        },
        // stats: {
        //     participants: '1,000+',
        //     duration: '6个月',
        //     accuracy: '94.2%',
        //     impact: '高'
        // }
    }
]

/**
 * AI研究实验博文展示组件
 * 展示利他主义与自私主义AI研究的详细内容
 */
export default function AIResearchBlogSection() {
    const [selectedPost, setSelectedPost] = useState(blogPosts[0])
    const [currentIndex, setCurrentIndex] = useState(0)
    const isMobile = useIsMobile()

    // 图片导航
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < selectedPost.images.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    // 直接跳转到指定图片
    // const handleImageSelect = (index: number) => {
    //     setCurrentIndex(index)
    // }

    return (
        <section className="w-full py-16 md:py-24">
            <Container className="flex flex-col items-center justify-center space-y-12">
                {/* 标题区域 */}
                <div className="space-y-4 w-full">
                    <TitleLabel>AI Research Case</TitleLabel>
                </div>

                {/* 博文卡片 */}
                <Card className="w-full max-w-6xl bg-white/5 backdrop-blur-sm border-white/10">
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 左侧：图片轮播 */}
                            <div className="space-y-6">
                                {/* 主图片显示 */}
                                <div className="relative bg-black rounded-xl overflow-hidden">
                                    <img
                                        src={selectedPost.images[currentIndex]}
                                        alt={`${selectedPost.title} - Image ${currentIndex + 1}`}
                                        className="w-full h-auto object-contain"
                                        loading="eager"
                                    />
                                    
                                    {/* 图片导航控制 */}
                                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                                        <AdaptiveButton
                                            onClick={handlePrevious}
                                            icon={<ChevronLeft className="h-5 w-5" />}
                                            disabled={currentIndex === 0}
                                            variant="outline"
                                            size="sm"
                                            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                                        >
                                            --
                                        </AdaptiveButton>
                                        <AdaptiveButton
                                            onClick={handleNext}
                                            direction="right"
                                            icon={<ChevronRight className="h-5 w-5" />}
                                            disabled={currentIndex === selectedPost.images.length - 1}
                                            variant="outline"
                                            size="sm"
                                            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                                        >
                                            --
                                        </AdaptiveButton>
                                    </div>
                                </div>

                                {/* 图片计数器 */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                    <span className="font-medium text-white">
                                        {currentIndex + 1}
                                    </span>
                                    <span>/</span>
                                    <span>{selectedPost.images.length}</span>
                                </div>
                            </div>

                            {/* 右侧：博文内容 */}
                            <div className="space-y-6">
                                {/* 博文头部信息 */}
                                <div className="space-y-4">
                                    {/* <div className="flex items-center gap-2 text-sm text-primary">
                                        <Target className="w-4 h-4" />
                                        <span>{selectedPost.category}</span>
                                    </div> */}
                                    
                                    <p className="text-xl md:text-2xl font-semibold text-white leading-tight">
                                        {selectedPost.title}
                                    </p>
                                    
                                    <p className="text-md text-gray-300 font-medium">
                                        {selectedPost.subtitle}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>{selectedPost.author}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{selectedPost.date}</span>
                                    </div>
                                </div>

                                

                                {/* 博文内容 */}
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>{selectedPost.content.introduction}</p>
                                    <div className="space-y-3">
                                        {/* <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Target className="w-5 h-5 text-primary" />
                                            Key Findings
                                        </h3> */}
                                        <ul className="space-y-2 pl-4">
                                            {selectedPost.content.keyFindings.map((finding, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                    <span>{finding}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    
                                    {/* <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <ArrowRight className="w-5 h-5 text-primary" />
                                            结论
                                        </h3>
                                        <p>{selectedPost.content.conclusion}</p>
                                    </div> */}
                                </div>

                                {/* 行动按钮 */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button 
                                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                        onClick={() => window.open(selectedPost.videoUrl, '_blank')}
                                    >
                                        <Play className="w-4 h-4" />
                                        To Youtube
                                    </Button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 底部装饰 */}
                {/* <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">探索AI的道德边界</span>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                </div> */}
            </Container>
        </section>
    )
}





