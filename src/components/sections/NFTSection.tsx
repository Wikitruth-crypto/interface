import { Button, Typography } from 'antd';
import { Container } from "@/components/Container";
import {
    Image as ImageIcon,
    // Palette, 
    // Shield, 
    // Zap, 
    // Users, 
    // DollarSign, 
    // ArrowRight,
    ExternalLink,
    // Star,
    // Heart,
    // Target,
    // BarChart3,
    // Clock,
    // CheckCircle,
    // TrendingUp,
    Globe,
    // Lock,
    Eye,
    Clock,
    User,
    Calendar,
    TrendingUp,
    Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import nft from "@/assets/nft/nft-light-2.jpg";




const marketplaceLinks = [
    {
        name: "OpenSea",
        url: "https://opensea.io",
        icon: ExternalLink,
        description: "全球最大的NFT交易平台",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10"
    },
    {
        name: "Blur",
        url: "https://blur.io",
        icon: ExternalLink,
        description: "专业NFT交易平台",
        color: "from-orange-500 to-yellow-500",
        bgColor: "bg-orange-500/10"
    },
    {
        name: "LooksRare",
        url: "https://looksrare.org",
        icon: ExternalLink,
        description: "社区驱动的NFT市场",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-500/10"
    }
];

// NFT 数据模拟
const nftData = {
    name: "Truth NFT #001",
    description: "Wiki Truth 首个NFT作品，代表正义与真相的力量",
    image: nft,
    price: "0.5 ETH",
    floorPrice: "0.2 ETH",
    minter: "0x1234...5678",
    mintTime: "2024-01-15",
    lastTrade: "2024-01-20",
    // likes: 128,
    // views: 2048,
    // rarity: "Legendary",
    collection: "Wiki Truth Collection"
};



export default function NFTSection() {
    // const { brandColor } = useBrandColorStore();

    return (
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
            {/* 背景装饰 */}
            {/* <div className="absolute inset-0 bg-black"></div> */}

            <Container className="relative z-10">
                {/* 标题区域 */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Typography.Title level={2} className="text-white font-semibold">Truth NFT</Typography.Title>
                    </div>
                    <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
                        每个Truth Box被铸造的同时都会生成一个NFT
                    </p>
                </div>

                {/* 主要内容区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* 左侧 NFT 展示 */}
                    <div className="space-y-6">
                        {/* NFT 预览卡片 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">NFT</h3>
                                    <p className="text-gray-400 text-sm">Featured Collection</p>
                                </div>
                            </div>

                            {/* NFT 主要内容区域 */}
                            <div className="space-y-4">
                                {/* NFT 图片 */}
                                <div className="relative group items-center justify-center ">
                                    <div className="relative overflow-hidden rounded-xl bg-black p-1">
                                        <img
                                            src={nftData.image}
                                            alt={nftData.name}
                                            className="w-max-3xl h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        
                                    </div>
                                </div>

                                {/* NFT 信息 */}
                                <div className="space-y-4">
                                    {/* 标题和描述 */}
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{nftData.name}</h4>
                                        <p className="text-sm text-gray-400">{nftData.description}</p>
                                    </div>

                                    {/* 价格信息 */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">当前价格</p>
                                            <p className="text-lg font-bold text-primary">{nftData.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">地板价</p>
                                            <p className="text-sm text-gray-300">{nftData.floorPrice}</p>
                                        </div>
                                    </div>

                                    {/* 统计信息 */}
                                    {/* <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                            <Heart className="w-4 h-4 text-red-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">喜欢</p>
                                                <p className="text-sm font-medium text-white">{nftData.likes}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                            <Eye className="w-4 h-4 text-blue-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">浏览</p>
                                                <p className="text-sm font-medium text-white">{nftData.views}</p>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* 详细信息 */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400">铸造者</span>
                                            </div>
                                            <span className="text-white font-mono">{nftData.minter}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400">铸造时间</span>
                                            </div>
                                            <span className="text-white">{nftData.mintTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400">最后交易</span>
                                            </div>
                                            <span className="text-white">{nftData.lastTrade}</span>
                                        </div>
                                        {/* <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400">稀有度</span>
                                            </div>
                                            <span className="text-yellow-400 font-medium">{nftData.rarity}</span>
                                        </div> */}
                                    </div>

                                    {/* 操作按钮 */}
                                    {/* <div className="flex gap-3 pt-2">
                                        <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                                            购买
                                        </Button>
                                        <Button variant="outlined" className="flex-1">
                                            出价
                                        </Button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧统计和市场 */}
                    <div className="space-y-8">

                        {/* 市场链接 */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-primary" />
                                交易市场
                            </h4>
                            <div className="space-y-3">
                                {marketplaceLinks.map((marketplace, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center", marketplace.color)}>
                                                    <marketplace.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium text-white">{marketplace.name}</h5>
                                                    <p className="text-xs text-gray-400">{marketplace.description}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => window.open(marketplace.url, "_blank")}
                                                className="flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部行动号召 */}
                {/* <div className="text-center">
                    <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                        <Heart className="w-5 h-5 text-primary" />
                        <div className="text-left">
                            <p className="text-sm text-white font-medium">加入Truth NFT社区</p>
                            <p className="text-xs text-gray-400">拥有独特的数字艺术品，支持正义事业</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                </div> */}
            </Container>
        </section>
    );
}


