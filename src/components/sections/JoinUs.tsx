"use client"

import React, { useState } from "react";
import { Container } from "../Container";
import TitleText from "../base/titleText";
import AdaptiveButton from "../base/AdaptiveButton";
import { cn } from "@/lib/utils";
import {
    Users,
    // Rocket,
    // Heart,
    // Target,
    // ArrowRight,
    Mail,
    // MapPin,
    // Clock,
    // Building,
    // Zap,
    // Shield,
    // Globe,
    // Star,
    // CheckCircle,
    // TrendingUp,
    // Award,
    // Briefcase,
    // Calendar,
    // DollarSign,
    // Shield,
    // BookOpen,
    // Coffee,
    // Gamepad2
} from "lucide-react";

// interface JobPosition {
//     id: number;
//     title: string;
//     department: string;
//     location: string;
//     type: string;
//     description: string;
//     requirements: string[];
//     benefits: string[];
//     salary: string;
//     experience: string;
//     icon: any;
//     color: string;
//     bgColor: string;
// }

// const jobPositions: JobPosition[] = [
//     {
//         id: 1,
//         title: "开发工程师",
//         department: "技术部",
//         location: "远程/北京",
//         type: "全职",
//         description: "负责智能合约开发、DApp前端开发，熟悉Solidity、Web3.js等技术栈",
//         requirements: [
//             "精通Solidity智能合约开发",
//             "熟悉Web3.js/Ethers.js",
//             "具备React/Next.js开发经验",
//             "了解区块链底层原理"
//         ],
//         benefits: [
//             "具有竞争力的薪资",
//             "灵活的工作时间",
//             "技术培训机会",
//             "股权激励计划"
//         ],
//         salary: "25K-45K",
//         experience: "3-5年",
//         icon: Zap,
//         color: "text-blue-400",
//         bgColor: "bg-blue-500/10"
//     },
//     {
//         id: 2,
//         title: "社区运营",
//         department: "市场部",
//         location: "远程",
//         type: "全职/兼职",
//         description: "负责社区建设、用户增长、内容运营，具备Web3社区运营经验",
//         requirements: [
//             "2年以上社区运营经验",
//             "熟悉Discord/Telegram",
//             "具备内容创作能力",
//             "了解Web3文化"
//         ],
//         benefits: [
//             "灵活工作时间",
//             "社区建设成就感",
//             "内容创作支持",
//             "行业人脉拓展"
//         ],
//         salary: "15K-25K",
//         experience: "2-4年",
//         icon: Users,
//         color: "text-orange-400",
//         bgColor: "bg-orange-500/10"
//     }
// ];

// const companyValues = [
//     {
//         icon: Rocket,
//         title: "创新驱动",
//         description: "拥抱前沿技术，推动Web3创新发展",
//         color: "text-blue-400",
//         bgColor: "bg-blue-500/10"
//     },
//     {
//         icon: Heart,
//         title: "分布式协作",
//         description: "去中心化，人人参与，人人受益",
//         color: "text-green-400",
//         bgColor: "bg-green-500/10"
//     },
//     {
//         icon: Target,
//         title: "正义使命",
//         description: "致力于构建更公正透明的数字世界",
//         color: "text-purple-400",
//         bgColor: "bg-purple-500/10"
//     }
// ];

// const companyStats = [
//     {
//         label: "团队成员",
//         value: "50+",
//         description: "来自全球的精英",
//         icon: Users,
//         color: "text-blue-400"
//     },
//     {
//         label: "项目完成",
//         value: "100+",
//         description: "成功交付的项目",
//         icon: CheckCircle,
//         color: "text-green-400"
//     },
//     {
//         label: "用户覆盖",
//         value: "10K+",
//         description: "活跃用户群体",
//         icon: Globe,
//         color: "text-purple-400"
//     },
//     {
//         label: "融资轮次",
//         value: "A轮",
//         description: "获得资本支持",
//         icon: TrendingUp,
//         color: "text-orange-400"
//     }
// ];

// 技术标签数据
const worksTags = [
    { name: "Developers", icon: Users, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { name: "Community", icon: Users, color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { name: "Lawyers", icon: Users, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { name: "Media", icon: Users, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    { name: "Investors", icon: Users, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
];

export default function JoinUsSection() {
    // const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

    return (
        <section className="py-8 md:py-12 relative overflow-hidden">
            {/* 背景装饰 */}
            {/* <div className="absolute inset-0 bg-black"></div> */}

            <Container className="relative z-10">
                {/* 标题区域 */}
                {/* <div className="text-center mb-12 md:mb-16">
                    <div className="flex items-center justify-center gap-3 mb-5 md:mb-8">
                        <Users className="w-6 h-6 text-primary" />
                        <TitleText
                            size="h2"
                            color="white"
                        >
                            Join Us
                        </TitleText>
                        <Star className="w-6 h-6 text-yellow-400" />
                    </div>
                    <TitleText 
                        size="h4"
                        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        共同构建Web3正义事业的未来，与志同道合的伙伴一起推动区块链技术的社会价值
                    </TitleText>
                </div> */}

                {/* 公司统计数据 */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {companyStats.map((stat, index) => (
                        <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                            <p className="text-xs text-gray-500">{stat.description}</p>
                        </div>
                    ))}
                </div> */}

                {/* 职位列表 */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
                    {jobPositions.map((position, index) => (
                        <div 
                            key={index}
                            className={cn(
                                "bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10",
                                "hover:border-primary/40 hover:bg-white/10 transition-all duration-300 cursor-pointer",
                                "shadow-lg hover:shadow-glow"
                            )}
                            onClick={() => setSelectedJob(selectedJob?.id === position.id ? null : position)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", position.bgColor)}>
                                        <position.icon className={cn("w-6 h-6", position.color)} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                                            {position.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{position.department}</p>
                                    </div>
                                </div>
                                <ArrowRight className={cn(
                                    "w-5 h-5 text-gray-400 transition-transform duration-300",
                                    selectedJob?.id === position.id && "rotate-90"
                                )} />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                    <MapPin className="w-3 h-3" />
                                    {position.location}
                                </span>
                                <span className="flex items-center gap-1 bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                                    <Clock className="w-3 h-3" />
                                    {position.type}
                                </span>
                                <span className="flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                                    <DollarSign className="w-3 h-3" />
                                    {position.salary}
                                </span>
                                <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                                    <Briefcase className="w-3 h-3" />
                                    {position.experience}
                                </span>
                            </div>

                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                                {position.description}
                            </p>

                            {selectedJob?.id === position.id && (
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div>
                                        <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            岗位要求
                                        </h5>
                                        <ul className="space-y-1">
                                            {position.requirements.map((req, idx) => (
                                                <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-yellow-400" />
                                            福利待遇
                                        </h5>
                                        <ul className="space-y-1">
                                            {position.benefits.map((benefit, idx) => (
                                                <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div> */}

                {/* <p className="text-center text-gray-600 text-lg md:text-xl ">
                    "我们是一群敢于颠覆的孤勇者！"
                </p> */}

                {/* 联系方式 */}
                <div className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-primary/20 mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
                        {/* <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-primary" />
                        </div> */}
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to Join Us?</h3>
                            {/* <p className="text-gray-400 text-sm">Ready to Join Us?</p> */}
                        </div>
                    </div>
                    <p className="text-gray-300 text-base md:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                        我们正在寻找志同道合的伙伴，一起推动Web3正义事业的发展。
                        如果你对我们的使命感兴趣，欢迎投递简历或与我们联系。
                    </p>

                    {/* 技术标签 */}
                    <div className="w-full max-w-4xl mb-8">
                        <div className="flex flex-wrap justify-center gap-3">
                            {worksTags.map((tag, index) => {
                                const Icon = tag.icon;
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full border",
                                            "text-sm font-medium",
                                            tag.color
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tag.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <AdaptiveButton
                            icon={<Mail className="w-4 h-4" />}
                            variant="solid"
                            size="lg"
                            className="px-8 py-3 text-white md:text-lg"
                            hideTextOnMobile={false}
                        >
                            Join
                        </AdaptiveButton>
                        <div className="flex items-center gap-4 text-gray-400">
                            <a
                                href="mailto:hr@wikitruth.io"
                                className="text-primary hover:text-primary/80 transition-colors text-sm md:text-base font-medium"
                            >
                                hr@wikitruth.io
                            </a>
                        </div>
                    </div>
                </div>

                {/* 公司文化 */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {companyValues.map((value, index) => (
                        <div key={index} className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", value.bgColor)}>
                                <value.icon className={cn("w-8 h-8", value.color)} />
                            </div>
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2">{value.title}</h4>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div> */}

            </Container>
        </section>
    );
}
