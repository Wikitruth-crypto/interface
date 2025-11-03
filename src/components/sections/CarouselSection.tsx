"use client";
import * as React from "react";
import { Typography,Image } from 'antd';
import { Container } from "@/components/Container";
import { 
    // ChevronLeft, 
    // ChevronRight, 
    Shield, 
    Eye, 
    AlertTriangle, 
    DollarSign,
    // Zap,
    // ArrowRight,
    CheckCircle,
    // Users,
    // Target,
    // Heart,
    // ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

import img01 from "@/assets/image/01.jpg";
import img02 from "@/assets/image/02.jpg";
import img03 from "@/assets/image/03.jpg";
import img04 from "@/assets/image/04.jpg";
import img05 from "@/assets/image/05.jpg";

const data = [
    {
        title: "社会正义危机",
        subtitle: "The Justice Crisis of Society",
        description: "我们的社会正面临严重的正义危机。坏人为了利益相互勾结，垄断权力、资源和信息。他们相互保护，制造谎言，掩盖真相，破坏正义和道德。",
        image: img01,
        icon: Shield,
        color: "from-red-500/20 to-orange-500/20",
        iconColor: "text-red-400",
        bgColor: "bg-red-500/10",
        features: [
            "权力垄断",
            "信息控制", 
            "真相掩盖"
        ],
        stats: {
            label: "正义缺失",
            value: "85%",
            description: "社会正义指数"
        }
    },
    {
        title: "坏人害怕真相",
        subtitle: "The Bad Guys Fear the Truth",
        description: "坏人之所以强大，是因为真相不为人知。无论坏人多么强大，在真相面前都会变得脆弱。因此，对抗坏人的最好方法就是让犯罪真相公开。",
        image: img03,
        icon: Eye,
        color: "from-blue-500/20 to-purple-500/20",
        iconColor: "text-blue-400",
        bgColor: "bg-blue-500/10",
        features: [
            "真相揭露",
            "证据收集",
            "公开透明"
        ],
        stats: {
            label: "真相力量",
            value: "100%",
            description: "真相揭露率"
        }
    },
    {
        title: "知情者处于危险",
        subtitle: "You Know, So You Are in Danger",
        description: "事实上，那些掌握犯罪证据的人处于非常危险的境地。同时，坏人内部也存在矛盾。我们建议：将你知道的犯罪真相上传到Wiki Truth，不要独自承担所有风险。",
        image: img04,
        icon: AlertTriangle,
        color: "from-yellow-500/20 to-orange-500/20",
        iconColor: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        features: [
            "风险分散",
            "集体保护",
            "安全上传"
        ],
        stats: {
            label: "保护机制",
            value: "99%",
            description: "安全保障率"
        }
    },
    {
        title: "无钱无工作",
        subtitle: "No Money No Work",
        description: "人们没有义务为正义牺牲。想想看，警察免费吗？律师免费吗？法官免费吗？为什么你要免费？金钱是生存的基础。如果正义不能产生价值，人们就不会促进正义。",
        image: img05,
        icon: DollarSign,
        color: "from-green-500/20 to-emerald-500/20",
        iconColor: "text-green-400",
        bgColor: "bg-green-500/10",
        features: [
            "价值激励",
            "经济基础",
            "可持续发展"
        ],
        stats: {
            label: "价值创造",
            value: "∞",
            description: "正义价值"
        }
    },
];

export default function CarouselSection() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [currentX, setCurrentX] = React.useState(0);
    const carouselRef = React.useRef<HTMLDivElement>(null);

    // 自动播放
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating && !isDragging) {
                nextSlide();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, isAnimating, isDragging]);

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % data.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToSlide = (index: number) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    // 拖拽功能
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setCurrentX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setCurrentX(e.clientX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50; // 最小滑动距离

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        setIsDragging(false);
        setStartX(0);
        setCurrentX(0);
    };

    // 触摸事件
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        setIsDragging(false);
        setStartX(0);
        setCurrentX(0);
    };

    const currentItem = data[currentIndex];

    return (
        <section className="w-full py-8 md:py-14 relative overflow-hidden">
            {/* 背景装饰 */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div> */}
            
            <Container className="relative z-10">
                {/* 标题区域 */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Typography.Title level={2} className="text-white font-semibold">Why we do this?</Typography.Title>
                    </div>
                    {/* <p className="text-gray-400 max-w-2xl mx-auto">
                        我们致力于通过技术手段解决社会正义问题，让真相得到保护，让正义得到伸张
                    </p> */}
                </div>

                {/* 轮播内容 */}
                <div 
                    ref={carouselRef}
                    className="relative max-w-6xl mx-auto cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* 主要内容卡片 */}
                    <div className={cn(
                        "relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden",
                        "transition-all duration-500 ease-in-out",
                        isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100",
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                    )}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* 左侧内容 */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                            currentItem.bgColor
                                        )}>
                                            <currentItem.icon className={cn("w-6 h-6", currentItem.iconColor)} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                {currentItem.title}
                                            </h3>
                                            <p className="text-gray-400 italic">
                                                {currentItem.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-300 leading-relaxed mb-6">
                                        {currentItem.description}
                                    </p>
                                </div>

                                {/* 特性列表 */}
                                <div className="mb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {currentItem.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-sm text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 统计数据 */}
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{currentItem.stats.value}</div>
                                        <div className="text-xs text-gray-400">{currentItem.stats.label}</div>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-300">{currentItem.stats.description}</div>
                                    </div>
                                </div>
                            </div>

                            {/* 右侧图片 */}
                            <div className="relative lg:h-96 h-64">
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br",
                                    currentItem.color
                                )}></div>
                                <Image
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 精美指示器 */}
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        {data.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "relative w-5 h-1.5 rounded-full transition-all duration-300 overflow-hidden",
                                    index === currentIndex 
                                        ? "bg-gradient-to-r from-primary to-primary/70" 
                                        : "border border-primary hover:bg-primary/30"
                                )}
                            >
                                {index === currentIndex && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent animate-pulse">

                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 底部信息 */}
                {/* <div className="text-center mt-8">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">加入我们，共同维护社会正义</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div> */}
            </Container>
        </section>
    );
}


