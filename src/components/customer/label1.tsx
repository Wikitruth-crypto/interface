

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
    Target,
    BarChart3,
    Clock,
    Eye,
    Lock,
    Network,
    CheckCircle,
    Box,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const impactAreas = [
    {
        title: "经济损失",
        description: "数万亿美元的财富被掠夺",
        icon: DollarSign,
        color: "from-red-500/20 to-orange-500/20"
    },
    {
        title: "生命安全",
        description: "每年数十万人失去生命",
        icon: Heart,
        color: "from-orange-500/20 to-yellow-500/20"
    },
    {
        title: "社会秩序",
        description: "长期犯罪破坏社会稳定",
        icon: Shield,
        color: "from-yellow-500/20 to-green-500/20"
    },
    {
        title: "未来发展",
        description: "犯罪阻碍社会进步",
        icon: Target,
        color: "from-green-500/20 to-blue-500/20"
    }
];

const truthBoxFeatures = [
    {
        icon: Shield,
        title: "区块链存储",
        description: "所有证据信息安全存储在区块链中，不可篡改",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10"
    },
    {
        icon: Lock,
        title: "加密保护",
        description: "高级加密技术确保证据的机密性和完整性",
        color: "text-green-400",
        bgColor: "bg-green-500/10"
    },
    {
        icon: Network,
        title: "去中心化",
        description: "基于Web3技术，实现真正的去中心化证据管理",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10"
    },
    {
        icon: Eye,
        title: "透明可追溯",
        description: "所有操作记录公开透明，全程可追溯",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10"
    }
];


const statusStats = [
    {
        label: "创建数量",
        value: "10,000+",
        description: "已创建的Truth Box总数",
        icon: Box,
        color: "text-blue-400"
    },
    {
        label: "成功率",
        value: "95%",
        description: "成功交付的证据比例",
        icon: CheckCircle,
        color: "text-green-400"
    },
    {
        label: "平均价值",
        value: "$50K",
        description: "每个Truth Box的平均价值",
        icon: DollarSign,
        color: "text-yellow-400"
    },
    {
        label: "活跃用户",
        value: "5,000+",
        description: "平台活跃用户数量",
        icon: Users,
        color: "text-purple-400"
    }
];


const lifecycleStages = [
    {
        stage: "创建",
        duration: "即时",
        description: "上传证据并创建Truth Box",
        icon: FileText,
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        stage: "销售",
        duration: "365天",
        description: "Truth Box进入销售阶段",
        icon: DollarSign,
        color: "from-green-500/20 to-emerald-500/20"
    },
    {
        stage: "拍卖",
        duration: "30天",
        description: "进入拍卖环节，价高者得",
        icon: Target,
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        stage: "交付",
        duration: "7天",
        description: "完成交易并交付证据",
        icon: CheckCircle,
        color: "from-orange-500/20 to-red-500/20"
    }
];



export default function Label1() {
    return (
        <>
            {/* 影响领域 */}
            < div className="space-y-4" >
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    主要影响领域
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {impactAreas.map((area, index) => (
                        <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn("w-6 h-6 rounded-lg bg-gradient-to-br", area.color)}></div>
                                <span className="text-sm font-medium text-white">{area.title}</span>
                            </div>
                            <p className="text-xs text-gray-400">{area.description}</p>
                        </div>
                    ))}
                </div>
            </div >

            {/* 功能特性 */}
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    核心功能特性
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {truthBoxFeatures.map((feature, index) => (
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
            </div>

            {/* 统计数据区域 */}
            <div className="mt-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">平台数据统计</h3>
                        <p className="text-gray-400">Platform Statistics</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statusStats.map((stat, index) => (
                            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 行动号召 */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                        <Heart className="w-5 h-5 text-primary" />
                        <div className="text-left">
                            <p className="text-sm text-white font-medium">加入Wiki Truth，共同守护正义</p>
                            <p className="text-xs text-gray-400">通过区块链技术保护真相，让正义得到伸张</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                </div>


                {/* 生命周期阶段 */}
                <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                阶段时间限制
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {lifecycleStages.map((stage, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn("w-6 h-6 rounded-lg bg-gradient-to-br", stage.color)}></div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-white">{stage.stage}</span>
                                                    <span className="text-xs text-gray-400">{stage.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">{stage.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
        </>
    )
}


