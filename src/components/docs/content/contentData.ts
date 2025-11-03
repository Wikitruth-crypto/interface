// 文档内容数据 - 由白皮书.md结构化生成，支持搜索和组件化
import { PROJECT_NAME } from '@/project';

export interface DocContentData {
    id: string;
    title: string;
    category: string;
    tags: string[];
    content: {
        summary: string;           // 用于搜索
        sections: DocSection[];    // 结构化内容
    };
}

export type ListItem =
  | string
  | {
      text: string;
      link?: { label: string; target: string };
    };

export interface ListContent {
    type: 'bullet' | 'ordered' | 'unordered';
    items: ListItem[];
  }

export interface TextSection {
  type: 'text';
  content: string | Array<string | { link: { label: string; target: string } }>;
  className?: string;
}

export interface ListSection {
  type: 'list';
  content: ListContent;
  className?: string;
}

export interface DocSection {
    type: 'text' | 'heading' | 'list' | 'steps' | 'images' | 'code';
    content: any;
    className?: string;
}

// 按照白皮书.md顺序结构化的所有文档内容数据
export const docsContentData: DocContentData[] = [
    // 初始展示
    {
        id: "overview",
        title: "项目概览",
        category: "项目概览",
        tags: [PROJECT_NAME.full, "Web3", "去中心化", "正义", "区块链"],
        content: {
            summary: `${PROJECT_NAME.full} 是一个基于 Web3 的去中心化正义事业平台，致力于通过区块链技术推动社会正义，让真相和正义在数字时代得到更好的保护和传播。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "项目概览" } },
                { type: 'images', content: {layout: 'single', images: [{src: { default: '/logo/logo-8-2-37.svg', }, alt: '项目logo', caption: ''}]}},
                { type: 'text', content: `${PROJECT_NAME.full} 是一个基于以太坊智能合约和 IPFS 去中心化存储的 Web3.0 真相交易市场，专注于犯罪证据的安全存储、交易和公开。项目通过代币经济和 DAO 治理，激励社会各方参与真相的发现、披露与保护。` },
                { type: 'text', content: "我们不仅是信息披露平台，更是一个经济激励驱动的正义生态系统，致力于让正义成为每个人都能参与和受益的事业。" }
            
            ],
            
        }
    },
    // 1.1 社会痛点
    {
        id: "pain-points",
        title: "社会痛点",
        category: "项目背景",
        tags: ["社会痛点", "司法腐败", "权力滥用"],
        content: {
            summary: "对当前社会中存在的、阻碍正义实现的核心问题进行客观分析。",
            sections: [
                { type: 'heading', content: { level: 3, text: "社会痛点" } },
                { type: 'text', content: "数千年人类文明史，亦是一部与犯罪和不公的斗争史。尽管我们建立了复杂的司法系统，但权力、金钱和裙带关系如藤蔓般腐蚀着这套体系的根基。在权力和财富的阴影下，获取完整的真相变得异常艰难，正义的天平常常向强势一方倾斜。潜规则横行，利益网络无处不在，它们操纵司法、影响舆论，甚至能颠倒黑白，将受害者描绘成加害者。这种系统性的不公，不仅让个体蒙冤，更严重阻碍了社会文明的进程，在社会中营造出一种普遍的恐惧与无力感。" },
                { type: 'list', content: { type: 'bullet', items: [
                    "系统性风险: 中心化的机构（如司法、媒体）容易受到外部压力干预，导致证据处理流程不透明，结果可能被扭曲。",
                    "举报人安全问题: 缺乏有效的、技术保障的匿名机制，使得证据提供者（举报人）面临身份暴露的风险，进而可能遭受人身或财产上的报复。",
                    "证据存续与完整性: 物理或数字证据在中心化存储系统中，存在被篡改、销毁或因服务器关闭而丢失的风险。",
                    "协作效率低下: 尤其在跨国犯罪案件中，不同司法管辖区之间的数据共享和协作存在法律及操作层面的障碍，效率低下。"
                ]}},
                { type: 'heading', content: { level: 4, text: "案例总结" } },
                { type: 'text', content: "历史案例表明，依赖于特定组织或个人道德的证据披露模式不具备系统性的可靠性。需要一个不依赖于信任、由技术保障的解决方案来应对上述挑战，用一句名言：不要相信人，因为人会说谎，相信代码，因为代码不会说谎。" }
            ]
        }
    },
    // 1.2 Web3 破局
    {
        id: "web3-breakthrough",
        title: "Web3 破局",
        category: "项目背景",
        tags: ["Web3", "去中心化", "区块链"],
        content: {
            summary: "阐述 Web3 核心技术如何为解决上述痛点提供技术实现路径。",
            sections: [
                { type: 'heading', content: { level: 3, text: "Web3 破局" } },
                { type: 'text', content: "Web3 技术栈提供了一套解决上述问题的工具集：" },
                { type: 'list', content: { type: 'bullet', items: [
                    "区块链 (Blockchain): 提供了一个不可篡改的、按时间顺序排列的公共交易账本。所有在链上执行的操作（如资产转移、状态变更）都将被永久记录，无法被单方面修改。",
                    "去中心化存储 (Decentralized Storage): IPFS 和 Arweave 等协议将数据分片存储在全球分布的节点网络中。这种结构使数据具备高可用性和抗审查性，单一节点或机构无法删除数据。",
                    "公私钥密码学 (Public-Key Cryptography): 这是实现用户匿名身份和数据加密的基础。用户通过其私钥控制的钱包地址进行交互，无需提供任何个人身份信息 (PII)。",
                    "智能合约 (Smart Contracts): 在区块链上运行的自动化脚本。它们根据预设的、公开的代码逻辑自动执行，移除了对中心化中介机构的需求，实现了“代码即法律” (Code is Law)。",
                    "价值网络：通过代币经济，可以将“说出真相”这一正义行为转化为可量化的经济回报，激励更多人参与。"
                ]}},
                { type: 'text', content: "通过这些技术的组合，可以构建一个去信任 (Trustless) 的、由协议规则驱动的系统。" }
            ]
        }
    },
    // 1.3 核心使命
    {
        id: "mission",
        title: "核心使命",
        category: "项目背景",
        tags: ["使命", "愿景", "正义"],
        content: {
            summary: `定义 ${PROJECT_NAME.full} 项目的核心目标和长期愿景。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "核心使命" } },
                { type: 'text', content: `${PROJECT_NAME.full} 的核心目标是：利用 Web3 技术，构建一个去中心化的、以经济激励为导向的犯罪证据市场，让真相得以安全传播、让正义得以实现的去中心化基础设施。我们相信，当说出真相不再需要担心报复，并且能够带来应有回报时，一个更公平的社会秩序将成为可能。` },
                { type: 'list', content: { type: 'bullet', items: [
                    "保护证据提供者: 通过技术手段提供最高级别的匿名性与安全性。",
                    "激励证据流通: 设计一套经济模型，使提供有价值的证据成为一项可获得经济回报的活动。",
                    "增加信息透明度: 创造一个机制，使得被隐藏的犯罪证据有途径得以批露，并增加掩盖犯罪证据的成本。"
                ]}}
            ]
        }
    },
    // 1.4 行业困境
    {
        id: "industry-dilemma",
        title: "行业困境",
        category: "项目背景",
        tags: ["Web3", "困境", "瓶颈"],
        content: {
            summary: "简要说明Web3行业当前的困境和不足。",
            sections: [
                { type: 'heading', content: { level: 3, text: "行业困境" } },
                { type: 'images', content: { layout: 'single', images: [{ src: "/images/docs/whoBuy.jpg", alt: "Web3行业困境", caption: "Web3行业困境" }] } },
                { type: 'text', content: "自 2021 年 DeFi Summer 后，加密货币行业发展停滞，虽搭建起 Web3 基础设施，却背离了去中心化初衷。区块链与加密货币诞生本是为打破中心化垄断，如今却步入歧途。这个宣称颠覆传统金融、重塑互联网的 Web3.0 时代，现实满是谎言与不堪，加密货币领域沦为 “韭菜” 收割机，令人痛心。通过巨额资金支持无实际应用的项目，借高炒作和回报承诺吸引投资者，初始投资者获利后便抽走资金，留一堆无价值数字货币，让后续投资者希望成泡沫。" },
                { type: 'text', content: "一些项目借 “新叙事”“新概念” 伪装成希望，它们靠改名、包装理念等博关注，加剧市场混乱与信任危机，多数项目无实际价值，只是闹剧。价格下跌、抛售、再下跌的死亡螺旋成加密货币市场常态。散户在波动中被恐慌左右，财富缩水，最后只剩失望。无实际意义的 meme 币在投机市场成部分投资者取乐工具，一个名字，一条狗，一只青蛙都被贴上价值的虚假标签，虽无应用场景却被热炒，嘲讽着真正想借区块链创造价值的人，凸显行业的无奈与疯狂。加密货币乱象让人质疑：为何行业如此不堪？为何利益至上主导市场？Web3 初衷是重构互联网信任与价值体系，如今却在泡沫中挣扎。行业需反思重建，让有价值项目回归，走向健康正轨。而监管缺失是乱象关键，传统金融监管难在加密货币领域落地，匿名交易、跨境流转让不法分子有机可乘，纵容了项目方，让投资者缺乏保护，加速信任崩塌。" }
            ]
        }
    },
    // 2.1 项目介绍
    {
        id: "introduce",
        title: "项目介绍",
        category: "项目介绍",
        tags: [`${PROJECT_NAME.full}`, "Web3", "去中心化", "正义", "区块链"],
        content: {
            summary: `${PROJECT_NAME.full} 是一个基于 Web3 的去中心化正义事业平台，致力于通过区块链技术推动社会正义，让真相和正义在数字时代得到更好的保护和传播。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "项目介绍" } },
                { type: 'text', content: `${PROJECT_NAME.full} 是一个部署在以太坊虚拟机 (EVM) 兼容链上的去中心化应用 (DApp)。它不是一个简单的信息发布平台，而是一个融合了加密存储、NFT资产、代币激励和博弈论的复杂经济生态系统。致力于开创一个全新的“犯罪真相经济”（Crime Truth Economy）。我们旨在利用区块链的匿名性、不可篡改性以及精巧的代币经济学，为全球范围内的犯罪证据提供一个安全的上传、存储、交易和曝光的去中心化市场。` },
                { type: 'heading', content: { level: 4, text: "平台组成" } },
                { type: 'text', content: "基于完全去中心化理念，构建无需信任的正义基石，平台由以下主要部分组成：" },
                { type:'images', content: {layout: 'single', images: [{src: '/images/docs/mainComponents.svg', alt: '平台组成', caption: '平台组成'}]}},
                { type: 'list', content:{type: 'bullet', items: [
                    "智能合约: 在区块链上执行所有业务逻辑。",
                    "去中心化存储层: IPFS/AR去中心化存储协议，用于存储加密后的证据文件。",
                    "前端 DApp: 部署在Fleek去中心化平台上，用户与协议交互的图形化界面， 包含对称加密模块和门槛算法模块。",
                    "The Graph: 区块链数据索引协议，实现数据快速访问。"
                ]}},
            ],
            
        }
    },
    // 2.2 运行流程
    {
        id: "process",
        title: "运行流程",
        category: "项目介绍",
        tags: ["运行流程", "流程", "Truth Box"],
        content: {
            summary: `${PROJECT_NAME.full} 的简要流程包括用户上传证据、铸造 Truth Box、交易、公开等。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "运行流程" } },
                { type: 'text', content: "以下是一张简要流程图，大致展示了项目是如何运作的。" },
                { type: 'images', content: {layout: 'single', images: [{src: '/images/docs/symbolProcess.svg', alt: '运行流程', caption: `${PROJECT_NAME.full} 运行流程`}]}},
                { type: 'text', content: "首先，我们假定一个罪犯（buyer）进行了一场犯罪活动，并且有某个人(minter)掌握了犯罪证据。" },
                { type: 'list', content:{type: 'bullet', items: [
                    "  数据加密: 用户在本地客户端（dapp）使用加密工具对证据文件进行加密处理。",
                    "  上传至存储网络: 加密后的文件包被上传至 IPFS，并返回一个唯一的内容标识符 (CID)，并再次对文件的CID和密码进行加密处理，获得最终的加密数据。",
                    "  铸造 Truth Box: 用户调用智能合约，将 加密数据及其他元数据记录上链，铸造一个唯一的Truth Box，并获得铸造数据。",
                    "  交易: 用户可以随时将该Truth Box进行挂单交易。如果交易中发生退款申请，则需要DAO介入，通过投票对退款进行审核。",
                    "  保密期：交易完成的Truth Box，将处于保密状态中， 买家需要按时缴纳保密费。",
                    "  公开Truth Box：超过保密期限的Truth Box将会被公开，即犯罪证据被公开。"
                ]}},
                { type: 'text', content: "${PROJECT_NAME.full}创造价值的过程就是：罪犯为了掩盖犯罪证据，逃避法律制裁，不得不花钱购买Truth Box，并支付高昂的保密费，而用户、DAO等参与者则获得收益的过程， 配合区块链代币经济， 这种价值将会辐射给所有${PROJECT_NAME.full}生态的参与者， 包括Token的持有者。" },
            ]
        }
    },
    // 2.3 核心特性
    {
        id: "features",
        title: "核心特性",
        category: "项目介绍",
        tags: ["创新点", "核心特性", "亮点"],
        content: {
            summary: `${PROJECT_NAME.full} 的核心特性包括去中心化、匿名性、安全性、经济激励和社区自治。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "核心特性" } },
                { type: 'list', content: { type: 'bullet', items: [
                    "去中心化：核心业务逻辑由链上智能合约执行，不受任何单一实体控制。消除权力垄断，防止信息被单点操控。",
                    "匿名性：交互仅需钱包地址，协议不收集任何个人身份信息。保护举报人和证据上传者的身份安全。",
                    "安全性：证据数据在用户本地进行加密，确保只有密钥持有者才能访问原始内容。多重加密与智能合约保障数据与资产安全。",
                    "经济激励：使用原生代币 (TRUTH) 对生态系统内的积极行为（如提供证据）进行奖励。",
                    "社区自治：DAO 治理，集体决策，透明公开。",
                    {
                        text: "创新保密费机制：一项创新的经济博弈机制，用于增加长期隐瞒证据的成本，倒逼罪犯自首，保护证据安全。详情请阅读：",
                        link: { label: "rewards-fee", target: "rewards-fee" } // target为章节id
                    },
                    // "创新保密费机制：一项创新的经济博弈机制，用于增加长期隐瞒证据的成本，倒逼罪犯自首，保护证据安全。详情请阅读：6.2.3。"
                ]}}
            ]
        }
    },
    // 3.1 用户群体
    {
        id: "user-group",
        title: "用户群体",
        category: "目标用户群",
        tags: ["用户群体", "Hacker", "Witness", "Accomplice", "Principal", "Police", "Victim", "Public"],
        content: {
            summary: `${PROJECT_NAME.full} 生态系统中的关键角色及其职责。`,
            // TODO 这里的图片需要优化调整
            sections: [
                { type: 'heading', content: { level: 3, text: "生态角色" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/userGroup.svg", alt: "用户群体", caption: "用户群体" }]
                }},
                { type: 'text', content: "供应方（Minter）：证据的提供者和 Truth Box 的创建者。" },
                { type: 'list', content: { type: 'bullet', items: [
                    "Hacker（黑客）：攻击系统，获取证据。",
                    "Witness（证人）：提供证据，掌握第一手证据的人。",
                    "Accomplice（共犯）：为了自身安全，污点证人，获取（保留）证据。",
                ]}},
                { type: 'text', content: "需求方（Buyer）：对证据有需求的实体，包括司法部门、媒体、罪犯等。" },
                { type: 'list', content: { type: 'bullet', items: [
                    "Police（警察）：调查犯罪。",
                    "Victim（受害者）：被犯罪侵害的人。",
                    "Principal（主犯）：犯罪的主谋。",
                    "Public（公众）：关注犯罪，提供证据。"
                ]}},
            ]
        }
    },
    // 3.2 社会学原理
    {
        id: "social-principle",
        title: "社会学原理",
        category: "目标用户群",
        tags: ["社会学原理", "人性",],
        content: {
            summary: `说明 ${PROJECT_NAME.full} 利用的社会学原理和人性。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "社会与人性" } },
                { type: 'heading', content: { level: 4, text: "人性的正义面" } },
                { type: 'list', content: { type: 'ordered', items: [
                    "道德良知：在面对邪恶时，知情人常常感受到巨大的恐惧与内心的道德挣扎。",
                    "匿名性与安全保障：中心化权力制度下，权力与罪犯经常勾连在一起，这使得举报者面临风险和报复。许多人因揭露真相而遭到报复。",
                    "利益回报与动力激励：许多国家设有对犯罪举报人的奖励政策，这表现出社会对真相和正义的重视。只有建立合理的利益模型，才能激励更多人参与正义行动。",
                    "真相的强大能量：真相是最强大的武器，无论罪犯掌握多大的权力，一旦犯罪真相被公之于众，便会瞬间丧失权威性。",
                    "正义心与社会现实：绝大多数人内心都渴望正义， 但是中心化权力的垄断现实，人们内心的恐惧总是大于追求真相的勇气。",
                ]}},
                { type: 'heading', content: { level: 4, text: "罪犯的心理" } },
                { type: 'list', content: { type: 'ordered', items: [
                    "恐惧与逃避：罪犯担心一旦犯罪证据被公开，将面临法律制裁和公众谴责。",
                    "利益驱动：罪犯可能出于对自身利益的考虑，选择购买 Truth Box 以掩盖犯罪证据。",
                    "侥幸心理：罪犯可能认为，只要能长期隐瞒证据，就能避免被发现。",
                    "道德困境：罪犯可能面临道德与法律的冲突，内心挣扎。",
                    "社会压力：罪犯可能感受到来自社会的压力，担心被揭露后失去社会地位。",
                    "罪犯的内部博弈：在犯罪团伙中，成员间缺乏信任，不同程度的犯罪会导致相互间的猜忌与背叛。作为弱势方，从犯可能保留证据以自保。",
                    "真还是假：谁也无法提前知晓Truth Box中的犯罪证据是否为真，也许是假的，但万一是真的呢？罪犯们不会容忍",
                ]}}
            ]
        }
    },

    // 4.1 智能合约
    {
        id: "contracts",
        title: "智能合约",
        category: "技术文档",
        tags: ["智能合约", "以太坊", "安全性", "去中心化"],
        content: {
            summary: `${PROJECT_NAME.full} 智能合约架构，包括核心合约功能、安全机制和升级策略。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "智能合约架构" } },
                { type: 'text', content: `${PROJECT_NAME.full} 的后端采用模块化智能合约架构，部署于 EVM 兼容链。该设计旨在提高代码的可读性、可维护性和安全性。核心合约通过可升级代理模式 (Proxy Pattern) 部署，允许在不影响现有数据和合约地址的情况下，由 DAO 投票对业务逻辑进行升级。` },
                { type: 'heading', content: { level: 4, text: "核心合约模块" } },
                { type: 'images', content: { layout: 'single', images: [{ src: "/images/docs/smartContracts.svg", alt: "核心合约模块", caption: "核心合约模块" }] } },
                { type: 'list', content: { type: 'unordered', items: [
                    "TruthBox.sol: 管理 Truth Box 的铸造、所有权、价格、期限等基本信息数据。内置状态机，记录每个 Box 的当前生命周期状态（如 `Storing`, `Selling`）。",
                    "TruthNFT.sol: ERC-721标准,管理 Truth NFT 的铸造、所有权和元数据。铸造Truth Box的同时被铸造，与其它NFT一样，可以自由进行发送和交易。",
                    "Exchange.sol: 处理所有交易逻辑，包括固定价格销售和英式拍卖。管理订单的创建、发货、退款（审核）和完成交易等所有交易过程。",
                    "TruthCoin.sol: ERC-20,实现平台原生代币 TRUTH 的发行、转账和余额查询。",
                    "FundManager.sol: 处理所有项目中的资金管理，包括交易资金、服务费、奖励分配和保密费用等等， 同时它也与Uniswap等DEX合约交互，实现第三方代币与 TRUTH 的互换。",
                    "TokenRegistry.sol: 管理项目支持的第三方代币，比如：BTC、ETH、USTC等等。",
                    "Staking.sol: 管理锁仓量，获取DAO治理权限，和投票权限等级，并且获得锁仓奖励。",
                    "Governance.sol: 实现 DAO 治理框架，包括提案的创建、投票和执行。管理协议参数的变更和合约升级。",
                    "Treasury.sol: 作为 DAO 财库，通常实现为多签钱包，由 `Governance.sol` 合约控制，用于安全地管理平台收入和社区基金。",
                ]}},
            ]
        }
    },
    // 4.2 安全性
    {
        id: "safety",
        title: "安全性",
        category: "技术文档",
        tags: ["安全性", "隐私保护", "加密", "审计", "技术"],
        content: {
            summary: `${PROJECT_NAME.full} 的技术安全架构和隐私保护机制，确保用户数据和资产的绝对安全。`,
            // TODO 这里增加图片，Fleek 等等
            sections: [
                { type: 'heading', content: { level: 3, text: "用户隐私保护" } },
                { type: 'list', content: { type: 'unordered', items: [
                    "完全去中心化部署: 完全去中心化运行，项目部署在Fleek平台上，一个基于IPFS的去中心化网络的Web3服务商，去中心化部署是完全静态的，我们不会部署任何中心化服务器，没有服务器应用程序和数据库，所以不会抓取和存储任何数据。",
                    "身份匿名: 协议交互完全基于用户的钱包地址，不要求或收集任何个人身份信息 (PII)。",
                ]}},
                { type: 'heading', content: { level: 4, text: "数据完整性" } },
                { type: 'list', content: { type: 'unordered', items: [
                    "内容寻址: 存储在 IPFS 上的文件由其内容的哈希值（CID）唯一确定。这保证了任何人从网络中检索到的文件都未经篡改，否则其 CID 将会改变。",
                    "端到端加密 (E2EE): 证据文件在用户本地的客户端（浏览器）进行加密，使用的是 AES-256-GCM 等标准化对称加密算法。原始未加密数据不会被传输到任何中心化服务器。",
                    "密钥交换: 对称加密的密钥通过 ECDH (椭圆曲线迪菲-赫尔曼密钥交换) 算法进行安全交换。在“发货”环节，卖方使用买方的公钥来加密会话密钥，确保只有买方能用其私钥解密。",
                    "交叉分散存储: 文件打包后就将其直接切片粉碎成多个子文件，并进行随机的分散存储（AR, IPFS），这样一来就实现了只能通过原始密钥对加密数据进行解密，才能同时获得所有子文件的存储地址。",
                    "多重加密: 只进行一层加密是完全不够的，CID和文件本身的解压密码也都会进行对称加密技术，以增强安全性。"
                ]}},
            ]
        }
    },
    
    // 5.1 状态机制
    {
        id: "status-mechanism",
        title: "状态机制",
        category: "核心功能",
        tags: ["Truth Box", "状态机制", "状态机", "生命周期"],
        content: {
            summary: "Truth Box 的生命周期状态流转及其业务含义。",
            sections: [
                { type: 'heading', content: { level: 3, text: "Truth Box 状态机详解" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/statusDuration.svg", alt: "Truth Box 状态机", caption: "Truth Box 的状态流转" }]
                }},
                { type: 'text', content: "一个 Truth Box 会经历以下一个或多个状态，每个状态都由智能合约严格定义，确保了整个业务流程的严谨、有序和防欺诈。" },
                { type: 'list', content: { type: 'ordered', items: [
                    "Storing：铸造后的初始状态。默认有 365 天保密期，Minter 可随时延长。",
                    "Selling / Auctioning：Box 正在市场上交易。",
                    "Pending: 交易已支付或者交易到期，等待处理。",
                    "Delivered：买家付款后，卖家已将解密证据所需的信息用买家的公钥加密后上链。",
                    "Refunding：买家发起了退款申请。此操作的前提是买家必须公开自己的私钥，从而将证据公开。",
                    "Secrecy：交易成功。买家获得对加密证据的访问权，并进入缴纳保密费的周期。",
                    "TimeOut：超时状态，表示Box的deadline期限已过。",
                    "Published：证据已被解密并向全世界公开。此为 Truth Box 的最终状态。"
                ]}},
                { type: 'text', content: "关于TimeOut：如果Box的合约状态为Storing，那么表示其它用户可以代理出售（Seller），如果Box的合约状态为Secrecy,那么表示其它用户可以执行Public操作（Publisher）。" },
                { type: 'heading', content: { level: 3, text: "状态流程图" } },
                { type: 'text', content: "Truth Box 合约状态是如何转换的，如下图：" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/statusProcessMap.svg", alt: "Truth Box 状态流程图", caption: "Truth Box 的完整生命周期" }]
                }},
                { type: 'list', content: { type: 'ordered', items: [
                    " 在铸造Box时，就可以选择两种模式：Store、Publish。",
                    " 只有Storing状态的Box可以Sell或Auction。",
                    " 在出售期限内，如果没有买家下单，那么Box就会公开，如果有买家则需要发货。",
                    " 发货完成后，买家可以选择申请退款或者完成订单，申请退款则会导致Box被公开，完成订单的Box则进入Secrecy状态。",
                    " 买家支付保密费以维持Box的Secrecy状态，如果未按时支付，那么Box将被公开。",
                ]}},
                { type: 'heading', content: { level: 3, text: "状态期限" } },
                { type: 'text', content: "每个 Truth Box 的状态都是有时间限制的，如下图：" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/statusPeriod.svg", alt: "Truth Box 状态期限", caption: "Truth Box 的完整生命周期" }]
                }},
                { type: 'list', content: { type: 'ordered', items: [
                    "Storing: 初始有365天的期限， minter可以延长期限。",
                    "Selling: 固定365天的期限。",
                    "Auctioning: 初始30天期限， 每次竞拍会增加30天。",
                    "Pending: 15天期限，超时则会产生退款率，如果超时100天，那么buyer可以获得100%退款。",
                    "申请退款期限: 7天的期限，超时则无法申请退款，并且其它用户可以执行‘完成订单‘操作 。",
                    "审核退款期限: 30天的期限， 超出期限未审核，那么buyer可以自行获得退款许可。",
                    "Secrecy: 初始为365天，每次可以增加的保密期限为365天，超出期限，Box将会被公开。",

                ]}},
            ]
        }
    },
    // 5.2 角色说明
    {
        id: "roles", // 这是 "核心功能" 分组下的 roles
        title: "角色说明",
        category: "核心功能",
        tags: ["角色", "Minter", "Buyer", "DAO","Seller","Publisher", "生态"],
        content: {
            summary: `详细说明 ${PROJECT_NAME.full} 生态系统中的关键角色及其在业务流程中的具体职责。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "生态系统关键角色详解" } },
                { type: 'text', content: `每个角色在 ${PROJECT_NAME.full} 生态中都扮演着不可或缺的角色，共同构成了平台的动态博弈网络。` },
                { type: 'list', content: { type: 'bullet', items: [
                    "Minter ：证据的提供者和 Truth Box 的创建者，是生态价值的源头, minter可以随时出售Box。",
                    "Buyer ：对证据有需求的实体，其身份和动机多样，可能是司法部门、媒体，也可能是罪犯本人，共同构成了市场的需求方。",
                    "Seller ：Truth Box 的代理出售的第三方用户， 如果成功交易，可以获得小额奖励（3%）。",
                    "Completer: 执行完成订单的第三方用户， 可以获得小额奖励（3%）。",
                    "Publisher: 执行公开Truth Box的用户，通常只有持有私钥解密数据的人才能执行此操作， 可以获得公开奖励（5%）。",
                    "DAO (去中心化自治组织)：由 TRUTH 代币持有者组成的社区，是平台的最高治理机构，负责审核、投票、资金管理等。",
                ]}},
                { type: 'heading', content: { level: 3, text: "权限机制" } },
                { type: 'text', content: "Seller、Completer、Publisher等角色执行相关的操作的权限，是受条件限制的：" },
                { type: 'list', content: { type: 'bullet', items: [
                    "Seller: 当Box的deadline期限超时，第三方用户才能代理出售。",
                    "Completer：当Box处于Delivered状态，并且在request refund期限内没有申请退款，那么第三方用户才能执行完成订单。",
                    "Publisher：当完成交易的Box的deadline期限超时，才能执行公开操作，而且只有密钥才能解密并公开，也就是说只有minter、buyer、DAO才能执行这项操作。",
                ]}},
            ]
        }
    },
    // 5.3 角色权限
    {
        id: "role-permission",
        title: "角色权限",
        category: "核心功能",
        tags: ["角色权限", "status", "权限", "roles"],
        content: {
            summary: "描述一个 Truth Box 的相关角色与权限对应的关系图。",
            sections: [
                { type: 'heading', content: { level: 3, text: "角色与权限对应关系" } },
                { type: 'text', content: "这张图简单直观的展示了角色与权限的关系图：" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/roles2.svg", alt: "角色与权限", caption: "Truth Box 角色与权限" }]
                }},
                { type: 'text', content: "下图是一张更加详细的角色与权限对应的关系图：" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/roles.svg", rotate: 90, alt: "角色与权限", caption: "Truth Box 角色与权限" }]
                }},
            ]
        }
    },

    // 5.4 业务流程
    {
        id: "workflow",
        title: "业务流程",
        category: "核心功能",
        tags: ["业务流程", "NFT", "Truth Box", "加密", "流程"],
        content: {
            summary: "描述一个 Truth Box 从创建到最终状态的完整生命周期流程。",
            sections: [
                { type: 'heading', content: { level: 3, text: "Truth Box业务流程" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/projectWorkflow.svg", alt: "业务流程", caption: "Truth Box 业务流程" }]
                }},
                { type: 'list', content: { type: 'ordered', items: [
                    "Mint: Minter 上传加密证据，铸造 Truth Box NFT。",
                    "Sell/Auction: Minter/Seller 将 Truth Box 在市场上以固定价格或拍卖形式出售。",
                    "Buy/Bid: Buyer 使用 TRUTH 代币支付，资金由FundManager合约托管。",
                    "Deliver: Minter/DAO 将解密信息（用 Buyer 公钥加密后）提交上链。",
                ]}},
                { type: 'text', content: "选项1：直接完成订单：" },
                { type: 'list', content: { type: 'ordered', items: [
                    "Complete Order: Buyer 确认收货，或在规定时限后自动确认，托管资金转给 Seller。",
                    "Secrecy: 交易完成后，Buyer (现持有者) 进入保密费支付周期。",
                    "Publish: 若保密费逾期未付、初始无人购买或持有者主动选择，证据将被公开。",
                ]}},
                { type: 'text', content: "选项2：申请退款：" },
                { type: 'list', content: { type: 'ordered', items: [
                    "Request Refund: Buyer 公开私钥，触发退款流程。",
                    "Rview Refund: DAO 对退款申请进行审核，并进行投票表决，表决完成后，Box的状态更新为Published。",
                ]}},
            ]
        }
    },
    // 5.5 详细流程
    {
        id: "detailed-flow",
        title: "详细流程",
        category: "核心功能",
        tags: ["详细流程", "Truth Box", "加密", "流程", "NFT", "支付", "保密费", "退款"],
        content: {
            summary: "详细拆解 Truth Box 的运行流程、技术应用和资金流转。",
            sections: [
                { type: 'heading', content: { level: 3, text: "铸造和出售" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/01image.svg", alt: "铸造和出售", caption: "Truth Box 铸造和出售" }]
                }},
                { type: 'list', content: { type: 'bullet', items: [
                    " Mint: Minter上传证据，通过加密压缩，然后上传至IPFS/AR网络，并获得CID。生成密钥对，并再次使用对称加密技术对CID和密码进行加密，将加密数据整合为元数据后，再上传至IPFS，随后将metadata CID和基础数据作为参数铸造Truth Box 和NFT，并且生成Minter data文件本地保存。",
                    " Sell/Auction: Minter随时可以执行此操作，如果Box的deadline超时，那么第三方用户可以代理出售，成为Seller。",
                ]}},
                { type: 'heading', content: { level: 3, text: "购买和发货" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/02image.svg", alt: "购买和发货", caption: "Truth Box 购买和发货" }]
                }},
                { type: 'list', content: { type: 'bullet', items: [
                    "  下单与支付: 首先会生成密钥对，然后将包含公钥的Buyer data上传至IPFS/AR,获得CID，再执行下单操作并同时支付代币，最后生成Buyer data文件本地保存。",
                    "  发货: Minter需要使用私钥进行解密数据，并使用买家的公钥进行加密，生成Deliver data数据上传至IPFS，获得CID，再上传至智能合约执行Deliver，当然DAO也可以通过门槛算法，使用官方密钥进行Deliver操作。",
                ]}},
                { type: 'heading', content: { level: 3, text: "完成和支付保密费" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/03image.svg", alt: "完成和支付保密费", caption: "Truth Box 完成和支付保密费" }]
                }},
                { type: 'list', content: { type: 'bullet', items: [
                    " Complete Order: Deliver后，Buyer可以直接完成订单，如果超出退款申请期限，Buyer仍然没有完成订单，那么Minter或者第三方用户就可以执行此操作，注意：只有第三方用户才能成为Completer。",
                    "  保密费周期: 交易完成后，开始为该 Box 计时（初始365天），持有者需在保密期限内支付保密费。若逾期，该合约的状态将允许任何人执行公开操作。",
                ]}},
                { type: 'heading', content: { level: 3, text: "退款和审核" } },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/03image.svg", alt: "退款和审核", caption: "Truth Box 退款和审核" }]
                }},
                { type: 'list', content: { type: 'bullet', items: [
                    " 退款：如果Buyer选择申请退款，那么需要将Buyer data上传至IPFS/AR，也就说买家的私钥需要公开，这相当于将Box公开。",
                    " 审核退款：申请退款后，DAO会进行投票决定同意或拒绝退款，而Minter可以选择直接同意退款，Buyer可以取消退款，如果超出审核期限DAO没有进行投票，那么Buyer可以自行获取退款许可。",
                ]}},
            ]
        }
    },
    // 6.1 代币经济模型
    {
        id: "tokenomics",
        title: "代币经济模型",
        category: "代币经济",
        tags: ["代币经济", "Truth Coin", "分配", "经济模型"],
        content: {
            summary: "Truth Coin (TRUTH) 的经济模型设计，包括代币分配、使用场景和价值捕获机制。",
            sections: [
                { type: 'heading', content: { level: 3, text: "原生代币 TRUTH" } },
                { type: 'text', content: `Truth Coin (TRUTH) 是 ${PROJECT_NAME.full} 生态系统的原生代币，用于所有平台内的交易、治理和激励。代币总供应量固定，通过多种机制确保价值稳定增长。其设计旨在驱动平台内的经济活动并协调各方参与者的利益。` },
                { type: 'heading', content: { level: 4, text: "代币分配方案" } },
                { type: 'text', content: "注意：当前的代币方案并不是最终的方案，只是一个大致的分配草案，可能会有细微的调整。" },
                { type: 'text', content: "TRUTH 的总供应量固定，以防止通货膨胀。初始分配草案如下：" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/tokenAllocation.svg", alt: "代币分配图", caption: "Truth Coin 的详细分配方案" }]
                }},
                { type: 'list', content: { type: 'unordered', items: [
                    "Liquidity(3%): 初始流动性，实现DEX代币兑换，保证交易体验。",
                    "Airdrop (4%): 空投奖励，测试网参与者空投。",
                    "公募/众筹 (5%): 通过公平发射机制向公众分发。",
                    "Truth 100 (5%): 奖励给主网上线后，前100个真实有效的Truth Box 铸造者",
                    "A轮 (10%): 分配给投资者。",
                    "种子轮 (10%): 分配给早期战略投资者。",
                    "开发团队 (15%): 分配给核心贡献者，附带线性解锁计划（例如，2年锁仓，1年悬崖期），以确保长期利益一致。",
                    "生态发展基金 (20%): 由 DAO 管理，用于资助合作伙伴、开发者 grants 和市场推广活动。",
                    `未分配 (20%): 这部分将有DAO社区管理，用于流动性挖矿、Staking 奖励和 Minter 激励计划，以促进生态系统的启动和用户增长等促进${PROJECT_NAME.full}发展的一切行动。`,
                ]}},
                { type: 'heading', content: { level: 4, text: "代币解锁" } },
                { type: 'text', content: "TRUTH 的解锁时间为两年，以保护投资者的权益。解锁时间线草案如下：" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/tokenUnlock.svg", alt: "代币解锁时间线", caption: "Truth Coin 代币解锁时间线" }]
                }},
            ]
        }
    },
    // 6.2 奖励与费用
    {
        id: "rewards-fee",
        title: "奖励与费用",
        category: "代币经济",
        tags: ["奖励", "平台费率", "激励机制", "保密费", "费率", "激励"],
        content: {
            summary: `${PROJECT_NAME.full} 的平台费率结构与多层次激励模型，以及递增保密费机制。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "交易资金分配" } },
                { type: 'text', content: `${PROJECT_NAME.full} 的交易资金分配机制旨在激励各方积极参与，确保公平和透明。` },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/rewardsAllocation.svg", alt: "交易资金分配", caption: `${PROJECT_NAME.full} 交易资金分配` }]
                }},
                { type: 'list', content: { type: 'bullet', items: [
                    "交易费：所有成功交易，平台收取 5% 进入 DAO 财库。",
                    "滞纳金：若卖家超过发货期限，将开始产生每日 1% 的滞纳金，退还给买家。",
                    "Minter 奖励: Minter 作为证据提供者，将获得交易金额的主要部分（扣除平台费和可能的贡献者奖励后）。",
                    "生态贡献者奖励 (各 3%): 第三方用户在特定条件下执行代理发货或完成订单操作，将获得交易额 3% 的奖励。",
                    "公开者奖励 (5%): 在 Truth Box 保密期结束后，首位成功触发公开操作的用户，将获得该 Box 初始售价 5% 的奖励。",
                ]}},
                { type: 'heading', content: { level: 4, text: "保密费分配" } },
                { type: 'text', content: "与交易资金不同，保密费只会分配给DAO、Minter、Publisher。" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/confidentFee.svg", alt: "保密费分配", caption: `${PROJECT_NAME.full} 保密费分配` }]
                }},
                { type: 'heading', content: { level: 4, text: "递增保密费机制" } },
                { type: 'text', content: "这是 ${PROJECT_NAME.full} 最具威慑力的机制。为维持保密状态，买家必须每年支付指数级增长的保密费。这个‘经济时间炸弹’旨在迫使罪犯在‘财务破产’和‘主动自首’之间做出选择。" },
                { type: 'images', content: {
                    layout: 'single',
                    images: [{ src: "/images/docs/confidentFeeMech.svg", alt: "保密费机制图", caption: "保密费随时间递增的机制设计" }]
                }},
                { type: 'text', content: "备注：费率均可以通过DAO治理合约投票调整。" },
                
            ]
        }
    },
    // 7.1 路线图
    {
        id: "roadmap",
        title: "路线图",
        category: "路线图",
        tags: ["路线图", "发展计划", "里程碑"],
        content: {
            summary: `${PROJECT_NAME.full} 的发展路线图，展示从项目启动到功能完善的完整历程。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "发展路线图" } },
                { type: 'steps', content: {
                    current: 5,
                    items: [
                        { title: "项目启动与研究", status: "finished", description: "完成项目概念设计和技术可行性分析， 确定基础技术路线和系统架构。" },
                        { title: "智能合约 v1.0 - v1.2", status: "finished", description: "完成核心合约的多个版本迭代、重构与内部脚本测试。" },
                        { title: "Web DApp 开发", status: "finished", description: "实现前端 DApp 的基本交互功能，并与测试网合约集成。" },
                        { title: "智能合约 v1.3 测试版", status: "finished", description: "在测试网上进行实际场景测试，发现当前方案的不足和缺点。" },
                        { title: "智能合约 V1.4 V1.5版本调试与完善", status: "finished", description: "为了尝试更多方案，探索更多的可能性，分别延申出多个不同测试版本。" },
                        { title: "智能合约 V1.6测试版本", status: "progress", description: "这是调试出的最终测试版，它的设计更加简洁、轻量化，合约数量削减了3个，并且实现方案更加科学。增加第三方代币支持，与测试网UniswapV4实现代币交换。" },
                        { title: "社区运营，公开测试", status: "waiting", description: "启动最终测试版的公开测试，并且开始建立社区， 这个过程可能需要2~3个月。" },
                        { title: "主网上线与空投", status: "waiting", description: "正式部署主网，创建流动性池，早鸟空投" },
                        { title: "DAO治理合约开发测试", status: "waiting", description: "DAO 治理合约测试，实现门槛算法，确定分布式管理官方密钥解决方案，" },
                        { title: "质押与 DAO 治理", status: "waiting", description: "引入 DAO 治理结构和去中心化自治系统" },
                        { title: "DAO 社区基金", status: "waiting", description: "建立运营发展基金，支持技术升级和社区活动" },
                        { title: "功能扩展", status: "waiting", description: "赏金板块、跨链支持等功能的开发和测试" }
                    ]
                }}
            ]
        }
    },
    // 8.1 治理机制
    {
        id: "dao",
        title: "DAO社区治理",
        category: "治理机制",
        tags: ["DAO", "去中心化治理", "投票", "社区"],
        content: {
            summary: `${PROJECT_NAME.full} DAO 治理机制，让社区成员参与平台重大决策，实现真正的去中心化治理。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "治理模型" } },
                { type: 'text', content: `${PROJECT_NAME.full} 采用去中心化自治组织（DAO）模式，协议的控制权最终归属于质押 TRUTH 代币的社区成员。通过透明的投票机制，社区可以决定平台的发展方向、参数调整和重要升级。` },
                { type: 'list', content: { type: 'ordered', items: [
                    "治理范围: DAO 有权通过投票对协议的关键参数进行修改，例如交易费率、保密费增长系数、合约升级等。",
                    "投票机制: 采用加权投票模型，投票权重与用户质押的 TRUTH 数量和质押时长相关 (veToken 模型)，以鼓励长期持有和深度参与。",
                ]}},
                { type: 'heading', content: { level: 4, text: "提案与投票流程" } },
                { type: 'list', content: { type: 'ordered', items: [
                    "提案: 任何满足最低代币持有门槛的用户都可以提交治理提案。",
                    "讨论: 提案将进入为期 7 天的社区公开讨论期。",
                    "投票: 讨论期结束后，进入为期 3 天的链上投票期。",
                    "执行: 若提案获得法定多数票，将进入时间锁 (Timelock) 队列，在一段延迟后自动执行。"
                ]}},
                { type: 'heading', content: { level: 4, text: "DAO基金" } },
                { type: 'list', content: { type: 'ordered', items: [
                    " 污点证人基金: 任何满足最低代币持有门槛的用户都可以提交治理提案。",
                    " 法律顾问基金: 提案将进入为期 7 天的社区公开讨论期。",
                    " 生态发展基金: 讨论期结束后，进入为期 3 天的链上投票期。",
                ]}},
            ]
        }
    },
    // 8.2 黑名单
    {
        id: "blacklist",
        title: "黑名单",
        category: "治理机制",
        tags: ["黑名单", "风险管理", "合规"],
        content: {
            summary: `${PROJECT_NAME.full} 的黑名单机制，用于维护生态健康和合规。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "黑名单机制" } },
                { type: 'text', content: "平台设有黑名单机制，对恶意上传虚假证据、攻击平台、洗钱等行为进行限制和惩罚。黑名单的添加与移除由 DAO 社区投票决定，确保治理的公开透明与公平性。" },
                { type: 'text', content: "决策: 黑名单的添加与移除，完全由 DAO 社区通过标准治理流程投票决定，确保过程的透明和公正。" },
                { type: 'heading', content: { level: 3, text: "黑名单条例" } },
                
                { type: 'list', content: { type: 'ordered', items: [
                    " 个人隐私保护：不得涉及任何个人隐私信息，须尊重个人隐私权利。",
                    " 军事信息限制：不得涉及任何军事相关信息。",
                    " 商业信息保护：不得涉及合法的商业信息，包括专利技术等。",
                    " 与犯罪无关：不得包含与犯罪无关的信息。",
                    " 信息一致性：标题或描述与内容信息必须一致。",
                    " 防止重复铸造：已完成交易的有效 Truth Box 不得被重复铸造。",
                    " 虚假信息禁止：不得传播经过伪造或篡改的虚假身份或误导内容。",
                    " 违法内容限制：不得涉及任何形式的违法活动，如贩毒、赌博等。",
                    " 恶意软件传播禁止：不得传播恶意软件、病毒或其他损害系统的内容。",
                    " 骚扰与歧视禁止：不得包含任何形式的骚扰、攻击性言论或歧视性内容。",
                    " 欺诈行为禁止：不得涉及任何类型的欺诈行为，确保合法交易。",
                    " 垃圾信息限制：不得包含重复发布的内容或没有价值的广告信息。",
                    " 不当内容禁止：不得包含淫秽、猥亵或威胁性的语言和图像。",
                ]}},
                { type:'text', content: '备注：黑名单的规则我们会继续完善，如果你有什么好的提议，可以参与我们的社区。' },
            ]
        }
    },
    // 8.3 安全性
    {
        id: "safety", // 这是 "治理机制" 分组下的 safety
        title: "安全性（治理层面）",
        category: "治理机制",
        tags: ["安全性", "风险管理", "合规", "治理"],
        content: {
            summary: "从治理层面保障平台安全，包括风险评估、应急响应和法律合规。",
            sections: [
                { type: 'heading', content: { level: 3, text: "治理层面的安全保障" } },
                { type: 'heading', content: { level: 4, text: "风险与合规" } },
                { type: 'text', content: "将设立法律顾问基金，与多家法律顾问团队合作，密切关注全球各主要司法辖区的法律法规变化，确保平台运营的合规性。DAO 社区会定期对潜在的法律风险进行评估并制定应对策略。" },
                { type: 'heading', content: { level: 4, text: "应急响应机制" } },
                { type: 'text', content: "平台设有由多签控制的应急基金，并制定了详细的应急响应计划。一旦发生严重安全事件，DAO 将立即启动预案，最大程度保护用户资产和平台稳定。" }
            ]
        }
    },
    // 9.1 投资价值
    {
        id: "value",
        title: "投资价值",
        category: "项目愿景",
        tags: ["投资价值", "市场机遇", "回报预期", "风险评估"],
        content: {
            summary: `分析 ${PROJECT_NAME.full} 的投资价值和市场机遇，展示项目的长期价值潜力。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "投资价值分析" } },
                { type: 'text', content: `${PROJECT_NAME.full} 结合了 Web3 技术和社会正义需求，创造了一个由‘奖励’和‘恐惧’驱动的、真实且刚性的全新价值市场。随着全球对透明度和正义的需求不断增长，平台具有巨大的市场潜力。` },
                { type: 'text', content: `${PROJECT_NAME.full} 的创新保密费机制、去中心化架构和强大的安全保障构成了显著的竞争优势。我们不仅解决了传统举报机制的问题，还创造了可持续的经济模型。` },
                { type: 'text', content: "随着更多有价值的证据进入平台，其对各类需求方的吸引力将呈指数级增长。" }
            ]
        }
    },
    // 8.2 未来展望
    {
        id: "future",
        title: "未来展望",
        category: "项目愿景",
        tags: ["未来展望", "愿景", "发展规划", "社会影响"],
        content: {
            summary: `展望 ${PROJECT_NAME.full} 的未来发展方向和对社会正义事业的长远影响。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "未来展望" } },
                { type: 'text', content: `${PROJECT_NAME.full} 的愿景是创建一个更加透明、公正的世界。我们相信通过技术创新和经济激励，可以激发更多人参与到维护社会正义的行动中来。` },
                { type: 'heading', content: { level: 4, text: "技术发展方向" } },
                { type: 'list', content: { type: 'unordered', items: [
                    "AI 集成: 探索使用 AI 工具对加密证据进行初步的、非侵入式的特征分析和分类，以提高市场效率和真实性。",
                    "跨链互操作性: 通过 LayerZero 等协议实现跨链部署，让更多公链的用户能够参与进来。",
                    "隐私计算: 引入 MPC (多方安全计算) 或 FHE (全同态加密) 等技术，实现更复杂的、保护隐私的数据协作。",
                ]}},
                { type: 'heading', content: { level: 4, text: "前沿技术探索" } },
                { type: 'text', content: "零知识证明 (ZKP): 正在研究在未来版本中引入 ZKP 的可行性。例如，允许 Minter 生成一个证明，证实其加密文件中包含特定格式或关键词，而无需揭露文件内容本身。这将能在不牺牲隐私的前提下，增加证据的可信度。" },
                { type: 'text', content: "隐私交易: 我们正在探索能否将 XMR 的技术引用至项目中，实现交易数据（CID，密码）的完全链上隐私托管，这样就可以绕过Deliver步骤，buyer下单购买即可获的交易数据。" },

                { type: 'heading', content: { level: 4, text: "生态系统愿景" } },
                { type: 'text', content: `未来的 ${PROJECT_NAME.full} 将是一个完整的正义生态系统，包括证据收集、验证、交易、披露、法律援助等全流程服务。我们将与全球的法律机构、媒体组织和公益团体建立合作关系。` }
            ]
        }
    },
    // 10.1 FAQ
    {
        id: "faq",
        title: "常见问题解答",
        category: "附录",
        tags: ["FAQ", "常见问题", "新手指南"],
        content: {
            summary: "解答用户和投资人最关心的常见问题。",
            sections: [
                { type: 'heading', content: { level: 3, text: "常见问题解答" } },
                { type: 'list', content: { type: 'bullet', items: [
                    "Q: ${PROJECT_NAME.full} 如何保护举报人隐私？\nA: 采用端到端加密和钱包地址匿名机制，平台无法获取用户真实身份。",
                    "Q: 平台如何防止恶意上传虚假证据？\nA: 通过社区举报、DAO 审核和黑名单机制，严厉打击恶意行为。",
                    "Q: DAO 治理的投票机制是怎样的？\nA: 投票权与质押代币数量和时长挂钩，所有提案需经过公开讨论和链上投票。",
                    "Q: 保密费机制如何运作？\nA: 买家需定期支付递增保密费，未支付则证据自动公开。",
                    "Q: 投资 ${PROJECT_NAME.full} 有哪些风险？\nA: 包括政策风险、技术风险、市场波动等，平台已采取多重措施降低风险。"
                ]}}
            ]
        }
    },
    // 9.2 致谢
    {
        id: "thanks",
        title: "致谢",
        category: "附录",
        tags: ["致谢", "团队", "合作伙伴"],
        content: {
            summary: `感谢所有为 ${PROJECT_NAME.full} 贡献力量的团队成员、合作伙伴和社区用户。`,
            sections: [
                { type: 'heading', content: { level: 3, text: "致谢" } },
                { type: 'text', content: `感谢所有为 ${PROJECT_NAME.full} 贡献力量的团队成员、合作伙伴、投资人和社区用户。正是有了你们的支持与信任，${PROJECT_NAME.full} 才能不断前行，推动社会正义事业的发展。` }
            ]
        }
    }
];

// 获取所有搜索数据
export const getSearchData = () => {
    return docsContentData.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content.summary,
        category: doc.category,
        tags: doc.tags.join(' ')
    }));
};

// 根据ID获取内容数据
export const getContentById = (id: string) => {
    return docsContentData.find(doc => doc.id === id);
}; 