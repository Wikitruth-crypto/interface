"use client";

import Image from "@/components/ui/Image";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// 事件类型枚举
// export type EventType = 
//     | "attack"      // 空袭/袭击
//     | "murder"      // 凶杀
//     | "accident"    // 事故
//     | "financial"   // 金融事件
//     | "disaster"    // 灾难
//     | "corruption"  // 腐败
//     | "other";      // 其他

// 事件数据接口
export interface EventData {
    id: string;
    // title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    link: string;
    // casualties?: number;    // 伤亡人数
    // damage?: string;        // 损失金额
}


interface EventCardProps {
    event: EventData;
    className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {

    const handleClick = () => {
        window.open(event.link, "_blank");
    };

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-primary/30",
                className
            )}
            onClick={handleClick}
        >
            {/* 事件图片容器 - 动态高度，根据图片原始尺寸 */}
            <div className="relative w-full overflow-hidden">
                <Image
                    src={event.image}
                    alt={event.description}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* 状态标签 */}
                

                {/* 底部信息覆盖层 - 部分覆盖 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-4 space-y-3">
                        {/* 事件标题 */}
                        {/* <h3 className="text-lg font-bold text-white line-clamp-2">
                            {event.title}
                        </h3> */}
                        
                        {/* 事件描述 */}
                        <p className="text-sm text-gray-300 line-clamp-2">
                            {event.description}
                        </p>
                        
                        {/* 基本信息 */}
                        <div className="flex items-center gap-4 text-xs text-gray-300">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                            </div>
                        </div>

                        {/* 额外信息（如果有） */}
                        {/* {(event.casualties || event.damage) && (
                            <div className="flex items-center gap-4 text-xs">
                                {event.casualties && (
                                    <div className="flex items-center gap-1 text-red-300">
                                        <Users className="w-3 h-3" />
                                        <span>伤亡: {event.casualties}人</span>
                                    </div>
                                )}
                                {event.damage && (
                                    <div className="flex items-center gap-1 text-yellow-300">
                                        <DollarSign className="w-3 h-3" />
                                        <span>损失: {event.damage}</span>
                                    </div>
                                )}
                            </div>
                        )} */}

                        {/* 查看详情提示 */}
                        {/* <div className="flex items-center gap-2 text-primary font-medium text-sm">
                            <ExternalLink className="w-4 h-4" />
                            <span>查看详情</span>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* 移动端显示的基本信息 */}
            <div className="p-4 md:hidden">

                {/* <h3 className="text-sm font-medium text-white mb-2 line-clamp-1">
                    {event.title}
                </h3> */}
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {event.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
