"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import { Typography, Button } from 'antd';
import StatusStep from "@/dapp/components/statusStep";
import { Container } from "@/components/Container";
import { testBox2 } from "@dapp/store/testBox";
import TruthBoxCard from "@dapp/components/truthBoxCard";
import { 
    Box, 
    // Shield, 
    // Clock, 
    // FileText, 
    // Lock, 
    // Network, 
    // ArrowRight,
    // Zap,
    // Target,
    // Users,
    // DollarSign,
    // CheckCircle,
    AlertTriangle,
    BarChart3,
    // Globe,
    Eye,
    // Heart
} from "lucide-react";
import { cn } from "@/lib/utils";



export default function TruthBoxSection() {

    return (
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
            {/* 背景装饰 */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5"></div> */}
            
            <Container className="relative z-10">
                {/* 标题区域 */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        
                        <Typography.Title level={2} className="text-white font-semibold">Truth Box</Typography.Title>
                        
                    </div>
                    <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
                        上传犯罪证据，创建一个安全的Truth Box，所有信息存储在区块链中，
                        <br />
                        Truth Box在生命周期内会经历多种状态，每个阶段都有严格的时间限制机制。
                    </p>
                </div>

                {/* 主要内容区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* 左侧 Truth Box 卡片 */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Box className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Truth Box 示例</h3>
                                    <p className="text-gray-400 text-sm">Live Example</p>
                                </div>
                            </div>
                            <TruthBoxCard data={testBox2} />
                        </div>

                        
                    </div>

                    {/* 右侧状态流程 */}
                    <div className="space-y-8">
                        {/* 状态步骤 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">生命周期流程</h3>
                                    <p className="text-gray-400 text-sm">Lifecycle Process</p>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <StatusStep
                                    status="Selling"
                                    size="md"
                                    className="border border-border/50"
                                    showBackground={true}
                                    enableHorizontalScroll={true}
                                />
                            </div>
                        </div>

                        

                        {/* 详细说明 */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20">
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                                    时间限制机制
                                </h5>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    每个状态都有对应的时间限制机制。例如，在销售状态下，Truth Box有365天的限制，
                                    在拍卖状态下有30天的限制。每次拍卖时，限制可以延长30天。
                                </p>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        window.open("https://www.localhost:3000/whitepaper", "_blank");
                                    }}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    查看详细时间机制
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                
            </Container>
        </section>
    );
}


