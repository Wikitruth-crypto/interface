
import {
    Shield,
    Lock,
    Key,
    Database,
    Zap,
    CheckCircle,
    AlertTriangle,
    FileText,
    Cpu,
    Network
} from "lucide-react";


export default function Label2() {

    // 安全等级数据
    const securityLevels = [
        { level: "文件加密", status: "active", icon: FileText },
        { level: "密钥管理", status: "active", icon: Key },
        { level: "分布式存储", status: "active", icon: Database },
        { level: "访问控制", status: "active", icon: Shield },
    ];

    return (
        <>
            {/* 安全等级指示器 */}
            <div className="w-full max-w-4xl mb-8">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">安全等级状态</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {securityLevels.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <Icon className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="text-sm text-white font-medium">{item.level}</p>
                                        <p className="text-xs text-green-400">已激活</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* 加密流程说明 */}
            <div className="w-full max-w-4xl mb-8">
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <Cpu className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">加密处理流程</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-white font-medium mb-2">文件处理</h4>
                            <p className="text-sm text-gray-400">压缩打包，生成唯一标识</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Lock className="w-6 h-6 text-green-400" />
                            </div>
                            <h4 className="text-white font-medium mb-2">多重加密</h4>
                            <p className="text-sm text-gray-400">AES-256 + RSA-4096 双重加密</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Network className="w-6 h-6 text-purple-400" />
                            </div>
                            <h4 className="text-white font-medium mb-2">分布式存储</h4>
                            <p className="text-sm text-gray-400">IPFS 去中心化存储</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}