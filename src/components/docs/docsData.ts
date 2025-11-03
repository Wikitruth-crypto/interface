export interface DocSection {
    id: string;
    title: string;
    icon?: string;
    children?: DocSection[];
}

/**
 * 这个是导航数据，用于生成左侧导航栏
 */

export const docsNavigation: DocSection[] = [
    {
        id: "overview",
        title: "项目概览",
        children: [
            { id: "overview", title: "项目概览" },
        ]
    },
    {
        id: "background",
        title: "项目背景",
        children: [
            { id: "pain-points", title: "社会痛点" },
            { id: "web3-breakthrough", title: "Web3 破局" },
            { id: "mission", title: "核心使命" },
            { id: "industry-dilemma", title: "行业困境" }
        ]
    },
    {
        id: "introduction",
        title: "项目介绍",
        children: [
            { id: "introduce", title: "项目介绍" },
            { id: "process", title: "运行流程" },
            { id: "features", title: "核心特性" },
        ]
    },
    {
        id: "user-group",
        title: "目标用户群",
        children: [
            { id: "user-group", title: "用户群体" },
            { id: "social-principle", title: "社会学原理" },
            
        ]
    },
    {
        id: "technical",
        title: "技术文档",
        children: [
            { id: "contracts", title: "智能合约" },
            { id: "safety", title: "安全性" } // 讲解加密技术： 对称加密技术，门槛算法
        ]
    },
    {
        id: "core-function",
        title: "核心功能",
        children: [
            { id: "status-mechanism", title: "状态机制" },
            { id: "roles", title: "角色说明" },
            { id: "role-permission", title: "角色权限" },
            { id: "workflow", title: "业务流程" },
            { id: "process", title: "详细流程" },
        ]
    },
    {
        id: "tokenomics",
        title: "代币经济",
        children: [
            { id: "tokenomics", title: "代币经济模型" },
            { id: "rewards-fee", title: "奖励与费用" },
        ]
    },
    {
        id: "roadmap",
        title: "路线图",
    },
    {
        id: "governance",
        title: "治理机制",
        children: [
            { id: "dao", title: "DAO社区治理" },
            { id: "blacklist", title: "黑名单" },
            { id: "safety", title: "安全性" }
        ]
    },
    {
        id: "vision",
        title: "项目愿景",
        children: [
            { id: "value", title: "投资价值" },
            { id: "future", title: "未来展望" },
        ]
    },
    { id: "faq", title: "常见问题解答" },
    { id: "thanks", title: "致谢" }
];

export const getDocById = (id: string): DocSection | undefined => {
    const findDoc = (sections: DocSection[]): DocSection | undefined => {
        for (const section of sections) {
            if (section.id === id) return section;
            if (section.children) {
                const found = findDoc(section.children);
                if (found) return found;
            }
        }
        return undefined;
    };
    return findDoc(docsNavigation);
}; 