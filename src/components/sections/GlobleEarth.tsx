"use client";
import BoxGrandientBorder from "@/components/base/boxGradientBorder";
import Earth3D from "@/components/earth3d/Earth3D";
import { Container } from "@/components/Container";
import MapWord from "@/components/customer/mapWord";
import { Typography } from 'antd';
import {
    Globe,
    DollarSign,
    Heart,
    AlertTriangle,
    TrendingDown,
    Users,
    Shield,
    ArrowRight,
    Zap,
    // 诈骗与银行欺诈
    CreditCard,
    Target,
    BarChart3,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { useBrandColorStore } from "@/store/storeBrandColor";

const crimeStats = [
    {
        icon: DollarSign,
        value: "$3.1T",
        label: "全球金融犯罪总规模",
        description: "纳斯达克 Verafin 2024 全球金融犯罪报告",
        link: "https://www.nasdaq.com/global-financial-crime-report",
        color: "text-red-400",
        bgColor: "bg-red-500/10"
    },
    {
        icon: Heart,
        value: "$782.9B",
        label: "毒品贩运",
        description: "联合国毒品和犯罪问题办公室",
        link: "https://www.unodc.org/unodc/en/frontpage/2025/June/wdr25.html",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10"
    },
    {
        icon: Users,
        value: "$346.7B",
        label: "人口贩卖",
        description: "联合国毒品和犯罪问题办公室",
        link: "https://www.unodc.org/unodc/en/data-and-analysis/glotip.html",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10"
    },
    {
        icon: CreditCard,
        value: "$485.6B",
        label: "诈骗与银行欺诈",
        description: "Verafin 报告整理全球欺诈性交易和诈骗趋势",
        link: "https://www.nasdaq.com/global-financial-crime-report",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10"
    }
];



export default function GlobleEarth() {

    return (
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
            {/* 背景装饰 */}
            {/* <div className="absolute inset-0 bg-black"></div> */}

            <Container className="relative z-10">

                {/* 主要内容区域 */}
                <BoxGrandientBorder
                    color="cyan"
                    opacity={{ start: 0.4, middle: 0.2, end: 0 }}
                    direction="to-b"
                    className="w-full rounded-2xl overflow-hidden"
                >
                    {/* 地图背景 */}
                    <MapWord type="map1" size="sm" opacity={0.1} className="absolute inset-0" />

                    <div className="relative z-10 p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* 左侧内容 */}
                            <div className="space-y-8">
                                {/* 主要描述 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">犯罪危机现状</h3>
                                            <p className="text-gray-400">Global Crime Crisis</p>
                                        </div>
                                    </div>

                                    <p className="text-lg text-gray-300 leading-relaxed">
                                        每年，层出不穷的犯罪事件，让我们的世界损失数万亿美元，每一次犯罪，
                                        都在直接和间接的掠夺人们的正当利益，长期的犯罪会让所有人变得更加贫穷和痛苦。
                                        更糟糕的是，每年有几十万人因此失去生命。犯罪背后的巨大利益，导致犯罪不会停止，我们会长期处于与犯罪的斗争当中！
                                    </p>
                                </div>

                                {/* 统计数据网格， 点击跳转 */}
                                <div className="grid grid-cols-2 gap-4">
                                    {crimeStats.map((stat, index) => (
                                        <a
                                            key={index}
                                            href={stat.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bgColor)}>
                                                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                                                </div>
                                                <div>
                                                    <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">{stat.value}</div>
                                                    <div className="text-xs text-gray-400">{stat.label}</div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">{stat.description}</p>
                                        </a>
                                    ))}
                                </div>



                                {/* 行动号召 */}
                                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20">
                                    <a href="https://ourworldindata.org/" target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-white font-medium">更多数据</p>
                                                <p className="text-xs text-gray-400">Our World in Data</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-primary ml-auto" />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* 右侧地球 */}
                            <div className="relative">
                                <div className="h-[500px] lg:h-[600px] relative">
                                    {/* 地球容器装饰 */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                                    <div className="absolute inset-4 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl"></div>

                                    {/* 地球组件 */}
                                    <div className="relative z-10 h-full">
                                        <Earth3D
                                            themeColor='0xc6a9fc'
                                            isWaveLevelOpen={true}
                                            isDisableZoom={true} />
                                    </div>

                                    {/* 装饰元素 */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                        <Globe className="w-3 h-3 text-blue-400" />
                                        <span className="text-gray-300 text-xs">模拟地球</span>
                                    </div>

                                    {/* <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                        <Clock className="w-3 h-3 text-blue-400" />
                                        <span className="text-xs text-gray-300">24/7 监控</span>
                                    </div> */}
                                </div>

                            </div>
                        </div>
                    </div>
                </BoxGrandientBorder>
            </Container>
        </section>
    );
}





