// import { StaticImageData } from "@/types/image";
import { Image } from "antd";
import TitleText from "../base/titleText";
import { cn } from "@/lib/utils";
import { Star, Shield } from "lucide-react";

interface Member {
    avatar: string;
    name: string;
    role: string;
}

interface MemberCardProps { 
    data: Member;
    index?: number;
    
}

export default function MemberCard({  data ,index,}: MemberCardProps) {

    return (
        <div
            key={index}
            className={cn(
                "relative group bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10",
                "hover:border-primary/40 hover:bg-white/10 transition-all duration-300",
                "shadow-lg hover:shadow-glow"
            )}
        >
            {/* 装饰性背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* 头像区域 */}
            <div className="relative z-10 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    {/* 头像背景装饰 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    
                    {/* 头像 */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary/40 transition-colors duration-300">
                        <Image 
                            src={data.avatar} 
                            alt={data.name} 
                            width={96} 
                            height={96} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* 装饰性图标 */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-primary" />
                    </div>
                </div>
                
                {/* 姓名 */}
                <TitleText 
                    size="h4"
                    className="mb-2 group-hover:text-primary transition-colors duration-300"
                >
                    {data.name}
                </TitleText>
                
                {/* 职位 */}
                <div className="flex items-center justify-center gap-2">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <p className="text-gray-400 text-sm font-medium">{data.role}</p>
                    <Star className="w-3 h-3 text-yellow-400" />
                </div>
            </div>
            
            {/* 底部装饰线 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    )
}

