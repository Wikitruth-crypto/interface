"use client";
import { useState } from "react";
import { Image } from 'antd';
import { Container } from "@/components/Container";
import Paragraph from "../base/paragraph";
import { cn } from "@/lib/utils";
import { 
    Shield, 
    Lock, 
    Database, 
    FileText, 
    Users,
    ArrowRight,
    Zap,
    Globe
} from "lucide-react";

// Tab 数据
const tabs = [
    // {
    //     id: "smart-contracts",
    //     label: "智能合约",
    //     icon: FileText,
    //     active: false
    // },
    {
        id: "encryption",
        label: "加密与存储",
        icon: Lock,
        active: false
    },
    {
        id: "official-key",
        label: "官方密钥保护",
        icon: Database,
        active: false
    },
    {
        id: "privacy-protection",
        label: "隐私保护",
        icon: Shield,
        active: false
    },
    // {
    //     id: "dao-governance",
    //     label: "DAO治理",
    //     icon: Users,
    //     active: true
    // }
];

// 内容数据
const contentData = {
    // "smart-contracts": {
    //     title: "模块化智能合约架构",
    //     subtitle: "EVM兼容链上的去中心化执行",
    //     description: "Wiki Truth采用模块化智能合约架构，部署在EVM兼容链上。通过可升级代理模式，确保代码的可读性、可维护性和安全性，同时支持DAO投票升级业务逻辑。",
    //     image: "/docs/uploadFile.svg",
    //     features: [
    //         "TruthBox.sol - 状态机管理",
    //         "Exchange.sol - 交易逻辑处理",
    //         "FundManager.sol - 资金管理",
    //         "Governance.sol - DAO治理框架"
    //     ]
    // },
    "encryption": {
        title: "多重加密与粉碎存储",
        subtitle: "端到端加密保护",
        description: "采用AES-256-GCM对称加密算法，结合ECDH密钥交换技术，实现证据文件的端到端加密。文件切片分散存储，确保只有密钥持有者才能访问原始内容。",
        image: "/images/docs/uploadFile.svg",
        features: [
            "AES-256-GCM对称加密",
            "ECDH密钥交换算法",
            "文件切片分散存储",
            "多重加密保护机制"
        ]
    },
    "official-key": {
        title: "门槛算法解密官方密钥",
        subtitle: "官方密钥对",
        description: "每一个Truth Box都会生成一个官方密钥对，被门槛算法加密，分配给DAO成员，只有当某些特定条件被触发，DAO成员进行治理投票时，通过门槛算法才能恢复官方密钥，这样确保官方密钥的安全性。整个过程都将在智能合约中实现，公开透明。",
        image: "/images/docs/officialKey.svg",
        features: [
            "门槛算法解密",
            "DAO治理投票",
            "智能合约实现",
            "公开透明"
        ]
    },
    "privacy-protection": {
        title: "完全匿名隐私保护",
        subtitle: "零身份信息收集",
        description: "协议交互完全基于钱包地址，不收集任何个人身份信息。部署在Fleek去中心化平台，无中心化服务器，确保用户隐私的绝对安全。",
        image: "/images/docs/officialKey.svg",
        features: [
            "钱包地址匿名交互",
            "零个人身份信息收集",
            "去中心化部署架构",
            "静态网站无服务器"
        ]
    },
    // "dao-governance": {
    //     title: "DAO社区治理",
    //     subtitle: "去中心化自治组织",
    //     description: "通过TRUTH代币质押获得投票权，参与协议治理。采用加权投票模型，鼓励长期持有和深度参与，实现真正的去中心化治理。",
    //     image: "/images/docs/uploadFile.svg",
    //     features: [
    //         "TRUTH代币质押投票",
    //         "加权投票模型",
    //         "提案讨论与执行",
    //         "社区基金管理"
    //     ]
    // }
};

interface ShowcaseProps {
    className?: string;
}

export default function TechnologySection({ className }: ShowcaseProps) {
    const [activeTab, setActiveTab] = useState("encryption");
    const currentContent = contentData[activeTab as keyof typeof contentData];

    return (
        <section className="w-full py-10 md:py-16">
            <Container className="flex flex-col gap-12">
                {/* 标题和描述 */}
                <div className="w-full max-w-4xl text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {/* <Shield className="w-8 h-8 text-purple-400" /> */}
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">安全与隐私</h2>
                        {/* <Zap className="w-8 h-8 text-yellow-400" /> */}
                    </div>
                    <Paragraph size="lg" color="gray-3" lineClamp="none" className="leading-relaxed max-w-4xl mx-auto">
                        以哈希算法为基础的加密算法，一个巨大优势就是，即使加密数据是公开的，也无法通过哈希值反推出原始数据。只有私钥的持有者，才能解密数据。这是实现数据安全和隐私保护的关键。
                    </Paragraph>
                </div>

                {/* 主要内容区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* 左侧内容 */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-4">
                                {currentContent.title}
                            </h3>
                            {/* <p className="text-orange-400 italic text-lg mb-6">
                                {currentContent.subtitle}
                            </p> */}
                            <Paragraph size="lg" color="gray-3" lineClamp="none" className="leading-relaxed">
                                {currentContent.description}
                            </Paragraph>
                        </div>

                        {/* 特性列表 */}
                        <div className="space-y-3">
                            {currentContent.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-gray-400">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* 对比框 */}
                        {/* <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-white text-sm">传统中心化</p>
                                    <p className="text-gray-400 text-xs">单点故障风险</p>
                                </div>
                                <div className="flex items-center gap-2 mx-4">
                                    <ArrowRight className="w-4 h-4 text-purple-500" />
                                    <Globe className="w-4 h-4 text-purple-500" />
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-purple-500 text-sm font-medium">去中心化</p>
                                    <p className="text-gray-400 text-xs">抗审查保障</p>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* 右侧图片 */}
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-green-500/20 rounded-2xl blur-xl"></div>
                            <Image 
                                src={currentContent.image} 
                                alt={currentContent.title} 
                                width={500} 
                                height={500} 
                                className="relative rounded-2xl border border-white/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Tab 切换 */}
                <div className="flex justify-center">
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                                        "text-sm font-medium",
                                        isActive 
                                            ? "bg-primary text-white shadow-lg" 
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 底部引用 */}
                {/* <div className="text-center">
                    <blockquote className="text-purple-400 text-lg italic">
                        "代码即法律，技术保障正义"
                    </blockquote>
                </div> */}
            </Container>
        </section>
    );
}






