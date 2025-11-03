import MemberCard from "@/components/customer/memberCard";
import { Typography } from 'antd';
import { Container } from "@/components/Container";
import { Users, Shield, Eye, Star } from "lucide-react";

export default function TeamSection() {

    const teamMembers = [
        { name: 'Liu', role: 'CEO & Founder', avatar: '/images/avatar/1.png' },
        { name: 'Wen', role: 'Developer', avatar: '/images/avatar/2.png' },
        { name: 'Zhou', role: 'Developer', avatar: '/images/avatar/3.png' },
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* 背景装饰 */}
            {/* <div className="absolute inset-0 bg-black"></div> */}
            
            <Container className="relative z-10">
                {/* 标题区域 */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
                        <Typography.Title level={2} className="text-white font-semibold">Our Team</Typography.Title>
                    </div>
                    <p className="text-gray-400 text-center mb-6 md:mb-10 text-md md:text-lg max-w-4xl mx-auto leading-relaxed">
                        In a chat, we touched on the topic of crime, which is a heavy subject. We talked about the collapse of FTX 
                        and the various dark secrets in the real world. A bad reality is that in this world, 
                        bad people seem to be constantly profiting, while the interests of good people are being unilaterally violated. 
                        The monopoly of centralized power in reality also adds layers of resistance to seeking justice and truth. 
                        So we proposed the idea of creating a "crime evidence trading platform", combining crime, justice, 
                        blockchain privacy features, and token economics, in an attempt to break this deadlock. 
                        It's great! It's indeed a very meaningful thing.
                    </p>

                    {/* 匿名说明 */}
                    <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-primary/20 mb-12">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white">匿名团队</h3>
                            <Eye className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-gray-300 text-center text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                            Since Wiki Truth involves very sensitive topics, it may anger certain interest groups.
                            Therefore, our team currently exists anonymously.
                            <br />
                            This is not only for security but also to ensure the normal development and operation of the project.
                        </p>
                    </div>
                </div>

                {/* 团队成员 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {teamMembers.map((member, index) => (
                        <MemberCard key={index} data={member} index={index} />
                    ))}
                </div>

                {/* 底部装饰 */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">Building the future of justice</span>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

