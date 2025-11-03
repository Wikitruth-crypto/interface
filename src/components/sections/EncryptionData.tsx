"use client";
import { useState } from "react";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import BoxGradientBorder from "../base/boxGradientBorder";
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

/**
 * 加密数据结构
 * "KeyPair":{
        "index": 0,
        "publicKey_office": "",
        "publicKey_minter": ""
    },
    "encryptionData":{
        "fileCID_encryption": "",
        "fileCID_iv": "",
        "password_encryption": "",
        "password_iv": ""
    },
 */

interface EncryptionDataProps {
    className?: string;
}

// 这是一个代码展示的组件，用于展示加密后的数据）
export default function EncryptionData({ className }: EncryptionDataProps) {
    const [copied, setCopied] = useState(false);
    const [activeData, setActiveData] = useState<'AES' | 'VSS'>('AES');

    // 复制功能
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getCurrentData());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const AES = `{

    // 密钥对
    "publicKey": "0x3059301306072a8648ce3d020106082a8648ce3d03010703420004c376b8ecf8570850fe77ad004eb3067d3d74c7914054d4ba18b16d5b6668a52623cfc7430de12d47fd07a22ea1fc70ee498c363d0eaa6bf7c38444553a8b6e93", 
    "privateKey": "0x308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420bcfcdaaf5a53b6ea6df2c8fcb375dc1911c03c5aaf685ae76eadbb67b01f7770a14403420004c376b8ecf8570850fe77ad004eb3067d3d74c7914054d4ba18b16d5b6668a52623cfc7430de12d47fd07a22ea1fc70ee498c363d0eaa6bf7c38444553a8b6e93",

    // 公钥对
    "KeyPair": {
        "index": 0,
        "publicKey_official": "0x3059301306072a8648ce3d020106082a8648ce3d0301070342000411f3c5238ed10f09b1ea2c24268ec9461fd72b8f042b57f5f498d27c4c66ca9b15f40b44f42c325d4894e6372895083902db7aa5faf416403d24517fb5cce2e3", 
        "publicKey_minter": "0x3059301306072a8648ce3d020106082a8648ce3d03010703420004c376b8ecf8570850fe77ad004eb3067d3d74c7914054d4ba18b16d5b6668a52623cfc7430de12d47fd07a22ea1fc70ee498c363d0eaa6bf7c38444553a8b6e93" 
    },
    
    // 加密数据
    "encryptionData": {
        "fileCID_encryption": "0x4d2dc472c583fb1238e70996687bf0ccb4837c1180eb2baaad3678c5a50cce858bb720efebb02d65bd84c2edbd72fa713f9dbb21eaaa09bd9c1066c75c6f579b6d9770d183f533ef77404c", 
        "fileCID_iv": "0x8bb2030afe1ed7e5900d1593",
        "password_encryption": "0x3af046f7be48fcc47dfb8922121099066b33e6ba5d0b9b480f89c044394d2b08e9e7d33d0a64e9e4554685bde2bf9d57322a23849e09f6d851bcfeedc12b5650dc464a12ee292818e61c58a931bbf427",
        "password_iv": "0x9a5bc3ecd47e62eb2f6f3447"
    },
}`;

    // VSS门限算法数据
    const VSS = `{

    // VSS系统配置
    "vssConfig": {
        "threshold": 3,
        "totalParticipants": 5,
        "primeField": "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
        "generator": "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
        "curve": "secp256k1"
    },

    // 官方密钥（原始秘密）
    "originalSecret": "0x2a8c7c8f9e1d3b5a7c9e2f4d6b8a0c2e4f6d8b0a2c4e6f8d0b2a4c6e8f0d2b4a6c8",

    // 多项式系数（用于生成份额）
    "polynomialCoefficients": [
        "0x2a8c7c8f9e1d3b5a7c9e2f4d6b8a0c2e4f6d8b0a2c4e6f8d0b2a4c6e8f0d2b4a6c8",
        "0x1b5a7c9e2f4d6b8a0c2e4f6d8b0a2c4e6f8d0b2a4c6e8f0d2b4a6c8e0f2a4c6e8f0",
        ...
    ],

    // 承诺值（用于验证份额）
    "commitments": [
        "0x04c376b8ecf8570850fe77ad004eb3067d3d74c7914054d4ba18b16d5b6668a52623cfc7430de12d47fd07a22ea1fc70ee498c363d0eaa6bf7c38444553a8b6e93",
        "0x0411f3c5238ed10f09b1ea2c24268ec9461fd72b8f042b57f5f498d27c4c66ca9b15f40b44f42c325d4894e6372895083902db7aa5faf416403d24517fb5cce2e3",
        "0x04a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6",
        "0x04f1e2d3c4b5a6978899aabbccddeeff00112233445566778899aabbccddeeff"
    ],

    // DAO成员份额
    "daoShares": [
        {
            "memberId": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            "shareId": 1,
            "shareValue": "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
            "proof": "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
            "isValid": true
        },
        {
            "memberId": "0x8f4d35Cc6634C0532925a3b8D4C9db96C4b4d8b7",
            "shareId": 2,
            "shareValue": "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
            "proof": "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
            "isValid": true
        },
        {
            "memberId": "0x9e5d35Cc6634C0532925a3b8D4C9db96C4b4d8b8",
            "shareId": 3,
            "shareValue": "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
            "proof": "0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c",
            "isValid": true
        },
        ...
    ],

    // 验证参数
    "verificationParams": {
        "challenge": "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
        "response": "0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
        "randomness": "0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f"
    },

    // 重构参数（用于拉格朗日插值）
    "reconstructionParams": {
        "lagrangeCoefficients": [
            "0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
            ...
        ],
        "reconstructedSecret": "0x2a8c7c8f9e1d3b5a7c9e2f4d6b8a0c2e4f6d8b0a2c4e6f8d0b2a4c6e8f0d2b4a6c8",
        "verificationHash": "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e"
    }
}`;

    // 技术标签数据
    const techTags = [
        { name: "AES-256", icon: Lock, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
        { name: "RSA-4096", icon: Key, color: "bg-green-500/20 text-green-400 border-green-500/30" },
        { name: "EDCH", icon: Database, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
        { name: "VSS门限算法", icon: Shield, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    ];

    // 获取当前显示的数据
    const getCurrentData = () => {
        return activeData === 'AES' ? AES : VSS;
    };

    // 获取当前文件名
    const getCurrentFileName = () => {
        return activeData === 'AES' ? 'aes_encryption.json' : 'vss_threshold.json';
    };


    return (
        <>
            {/* 自定义滚动条样式 */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(17, 24, 39, 0.3);
                    border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(75, 85, 99, 0.6);
                    border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.8);
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(75, 85, 99, 0.6) rgba(17, 24, 39, 0.3);
                }
            `}</style>
            
            <section className={cn("w-full py-12 md:py-20 relative overflow-hidden", className)}>
                <Container className="flex flex-col gap-6 sm:gap-8">
                    {/* <div className="flex items-center gap-2 mb-4"> */}
                        {/* <AlertTriangle className="w-5 h-5 text-yellow-400" /> */}
                        {/* <h3 className="text-lg font-semibold text-white">加密数据结构示例</h3> */}
                    {/* </div> */}
                    <BoxGradientBorder
                        color="white"
                        direction="to-b"
                        opacity={{ start: 0.4, middle: 0.2, end: 0 }}

                        className={cn(
                            "w-full",
                            "rounded-2xl",
                        )}

                        className2={cn(
                            // 90度方向：底部0透明度，顶部100透明度
                            // 渐变背景
                            "bg-gradient-to-b from-gray-400/10 to-gray-400/0",
                            "overflow-hidden ",
                            // 渐变边框
                            // "border", 
                            // "rounded-2xl", 
                            "p-8",
                            "w-full flex flex-col items-center justify-center",
                        )}>



                        {/* 技术标签 */}
                        <div className="w-full max-w-4xl mb-8">
                            <div className="flex flex-wrap justify-center gap-3">
                                {techTags.map((tag, index) => {
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

                        {/* 数据切换按钮 */}
                        <div className="w-full max-w-4xl mb-6">
                            <div className="flex justify-center">
                                <div className="flex bg-white/10 rounded-lg p-1 border border-white/20">
                                    <button
                                        onClick={() => setActiveData('AES')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                            activeData === 'AES'
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-gray-300 hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            <span>AES + EDCH</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveData('VSS')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                            activeData === 'VSS'
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-gray-300 hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            <span>VSS 门限算法</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 代码展示 */}
                        <div className="w-full flex flex-col max-w-4xl gap-6 sm:gap-8">

                            {/* 数据说明 */}
                            <div className="text-center">
                                {activeData === 'AES' ? (
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        对称加密算法：使用AES-256加密文件CID和密码，EDCH进行密钥交换
                                    </p>
                                ) : (
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        可验证秘密共享：将官方密钥分割为n份额，需要t个份额即可重构原始密钥
                                    </p>
                                )}
                            </div>

                            <div className="relative w-full">
                                {/* 代码容器 */}
                                <div className="relative w-full bg-white/5 border border-primary/20 rounded-xl overflow-hidden">
                                    {/* 文件头部 */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-primary/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="text-sm text-gray-400 font-mono">
                                            {getCurrentFileName()}
                                        </div>
                                    </div>

                                    {/* 代码内容区域 - 添加最大高度和滚动 */}
                                    <div className="max-h-80 sm:max-h-96 lg:max-h-[35rem] overflow-y-auto custom-scrollbar">
                                        <pre className="p-3 sm:p-4 lg:p-6">
                                            <code className="text-xs sm:text-sm leading-relaxed font-mono text-emerald-500/80 block">
                                                {getCurrentData().split('\n').map((line, index) => {
                                                    // 简单的语法高亮逻辑
                                                    const highlightedLine = line
                                                        .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>') // 注释
                                                        .replace(/"([^"]+)":/g, '<span class="text-blue-400/80">"$1"</span>:') // 键名
                                                        .replace(/: "([^"]*)"/g, ': <span class="text-emerald-500/80">"$1"</span>') // 字符串值
                                                        .replace(/: (true|false)/g, ': <span class="text-orange-500">$1</span>') // 布尔值
                                                        .replace(/(\[|\])/g, '<span class="text-cyan-500/80">$1</span>') // 数组符号
                                                        // .replace(/(?<!:)"([^"]*)"(?!:)/g, '<span class="text-emerald-500/80">"$1"</span>') // 字符串值（数组内）
                                                        // 符号
                                                        .replace(/(\,|\.)/g, '<span class="text-pink-500/80">$1</span>') 
                                                        // 数字
                                                        .replace(/: (\d+)/g, ': <span class="text-yellow-500/80">$1</span>') // 数字值
                                                        // .replace(/(\[|])/g, '<span class="text-cyan-500/80">$1</span>') // 数组符号 数组符号
                                                        .replace(/(\{|\})/g, '<span class="text-purple-500/80">$1</span>'); // 括号

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="whitespace-pre-wrap break-words"
                                                            dangerouslySetInnerHTML={{ __html: highlightedLine }}
                                                        />
                                                    );
                                                })}
                                            </code>
                                        </pre>
                                        
                                        {/* 滚动提示 */}
                                        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-primary/10 to-transparent h-8 flex items-center justify-center">
                                            <div className="text-xs text-gray-400 px-2 py-1 rounded-full border border-gray-700/50">
                                                ↓ 滚动查看更多内容
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BoxGradientBorder>
                </Container>
            </section>
        </>
    );
}





