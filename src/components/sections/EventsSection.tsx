"use client";

import { Container } from "@/components/Container";
import EventCard, { EventData,} from "@/components/customer/eventCard";

// 真实事件数据
const eventsData: EventData[] = [
    {
        id: "1",
        description: "俄罗斯对乌克兰首都基辅发动大规模空袭，造成重大人员伤亡和基础设施破坏",
        date: "2024-01-15",
        location: "乌克兰基辅",
        image: "/images/events/polyMarket.jpg",
        link: "https://example.com/event1",
    },
    {
        id: "2",
        description: "某银行高管涉嫌挪用公款数十亿元，涉及多个省市，影响范围广泛",
        date: "2024-01-20",
        location: "中国上海",
        image: "/images/events/wikitruth.jpg",
        link: "https://example.com/event2",
    },
    {
        id: "3",
        description: "某市发生连环凶杀案，警方正在全力追查凶手，呼吁市民提高警惕",
        date: "2024-01-25",
        location: "中国北京",
        image: "/images/events/susan_gu.jpg",
        link: "https://example.com/event3",
    },
    {
        id: "4",
        description: "某化工厂发生严重爆炸事故，造成多人伤亡，周边环境受到污染",
        date: "2024-02-01",
        location: "中国深圳",
        image: "/images/events/01.jpg",
        link: "https://example.com/event4",
    },
    {
        id: "5",
        description: "某省高官涉嫌严重违纪违法，接受纪律审查和监察调查",
        date: "2024-02-05",
        location: "中国杭州",
        image: "/images/events/02.jpg",
        link: "https://example.com/event5",
    },
    {
        id: "6",
        description: "某地区发生强烈地震，造成重大人员伤亡和财产损失，救援工作正在进行",
        date: "2024-02-10",
        location: "中国成都",
        image: "/images/events/03.jpg",
        link: "https://example.com/event6",
    },
    {
        id: "7",
        description: "某航空公司客机在起飞后不久发生坠机事故，机上人员全部遇难",
        date: "2024-02-15",
        location: "中国广州",
        image: "/images/events/01.jpg",
        link: "https://example.com/event7",
    },
    {
        id: "8",
        description: "某国边境地区发生武装冲突，造成双方人员伤亡，局势紧张",
        date: "2024-02-20",
        location: "中东地区",
        image: "/images/events/02.jpg",
        link: "https://example.com/event8",
    },
    {
        id: "9",
        description: "某上市公司涉嫌财务造假，虚增利润数十亿元，投资者损失惨重",
        date: "2024-02-25",
        location: "中国深圳",
        image: "/images/events/03.jpg",
        link: "https://example.com/event9",
    }
];


export default function EventsSection() {
    return (
        <section className="w-full py-6 sm:py-8 md:py-12 lg:py-16">
            <Container>
                {/* 标题区域 */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                        重大事件追踪
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        关注现实中的重大事件，追踪真相，维护正义
                    </p>
                </div>

                {/* Coming Soon 提示 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-primary font-medium">事件上传功能即将上线</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                        用户可以提交和验证真实事件，共同构建真相数据库
                    </p>
                </div>

                {/* 动态网格布局 - 瀑布流效果 */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                    {eventsData.map((event) => (
                        <div key={event.id} className="break-inside-avoid mb-4 md:mb-6">
                            <EventCard 
                                event={event}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>

                {/* 底部提示 */}
                <div className="text-center mt-8 md:mt-12">
                    <p className="text-gray-400 text-sm">
                        更多事件信息持续更新中，请关注我们的最新动态
                    </p>
                </div>
            </Container>
        </section>
    );
}
