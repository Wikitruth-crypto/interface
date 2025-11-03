

import { 
    Image, 
    Palette, 
    Shield, 
    Zap, 
    Users, 
    DollarSign, 
    ArrowRight,
    ExternalLink,
    Star,
    Heart,
    Target,
    BarChart3,
    Clock,
    CheckCircle,
    TrendingUp,
    Globe,
    Lock,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";


const nftCollection = [
    {
        id: 1,
        name: "Truth Guardian #001",
        rarity: "Legendary",
        price: "2.5 ETH",
        image: "/assets/nft/nft-green-1.JPG",
        color: "from-green-500/20 to-emerald-500/20"
    },
    {
        id: 2,
        name: "Justice Seeker #042",
        rarity: "Epic",
        price: "1.8 ETH",
        image: "/assets/nft/nft-purple-1.JPG",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        id: 3,
        name: "Freedom Fighter #128",
        rarity: "Rare",
        price: "1.2 ETH",
        image: "/assets/nft/nft-green-bg.JPG",
        color: "from-blue-500/20 to-cyan-500/20"
    }
];

const nftFeatures = [
    {
        icon: Shield,
        title: "独特认证",
        description: "每个NFT都有独特的区块链认证，确保真实性和稀缺性",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10"
    },
    {
        icon: Palette,
        title: "艺术价值",
        description: "由专业艺术家设计的独特视觉作品，具有收藏价值",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10"
    },
    {
        icon: Lock,
        title: "安全存储",
        description: "基于区块链技术，确保NFT的安全性和不可篡改性",
        color: "text-green-400",
        bgColor: "bg-green-500/10"
    },
    {
        icon: Users,
        title: "社区权益",
        description: "持有者享有平台治理权和特殊权益",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10"
    }
];

const nftStats = [
    {
        label: "总供应量",
        value: "10,000",
        description: "限量发行",
        icon: Image,
        color: "text-blue-400"
    },
    {
        label: "地板价",
        value: "0.5 ETH",
        description: "当前最低价格",
        icon: DollarSign,
        color: "text-green-400"
    },
    {
        label: "持有者",
        value: "3,500+",
        description: "活跃持有者",
        icon: Users,
        color: "text-purple-400"
    },
    {
        label: "交易量",
        value: "2,500 ETH",
        description: "累计交易量",
        icon: TrendingUp,
        color: "text-orange-400"
    }
];


export default function Label3() {
    return (
        <>

{/* NFT 网格展示 */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {nftCollection.map((nft) => (
                                    <div key={nft.id} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                                        <div className="aspect-square relative">
                                            <div className={cn("absolute inset-0 bg-gradient-to-br", nft.color)}></div>
                                            <div className="absolute inset-2 bg-black/20 rounded-lg"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                                    <Image className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-white">{nft.name}</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                                    {nft.rarity}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">{nft.price}</span>
                                                <Eye className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

        {/* NFT 特性 */}
                        {/* <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                NFT 特性
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {nftFeatures.map((feature, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", feature.bgColor)}>
                                                <feature.icon className={cn("w-3 h-3", feature.color)} />
                                            </div>
                                            <span className="text-sm font-medium text-white">{feature.title}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}


        {/* NFT 统计数据 */}
                        {/* <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">NFT 数据统计</h3>
                                    <p className="text-gray-400 text-sm">Collection Statistics</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {nftStats.map((stat, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                                        </div>
                                        <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                                        <p className="text-xs text-gray-500">{stat.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}
        
        </>
    )
}

