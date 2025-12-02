import { FilterState, BoxData } from './profile.types';

// 定义Tab类型别名
export type ProfileTab = FilterState['selectedTab'];

export type ClaimMethodType = 
    'withdrawRefundAmounts' | 
    'withdrawOrderAmounts' | 
    'withdrawHelperRewards' | 
    'withdrawMinterRewards';

export type FundType = 'Refund' | 'Order' | 'HelperRewards' | 'MinterRewards';

export interface TokenData {
    amount: string;
    formattedAmount: string;
    symbol: string;
    address?: string;
    decimals?: number;
    hasValidAmount: boolean;
}

// 资金类型定义
export interface ClaimableFund {
    boxId: string;
    type: FundType;
    claimMethod: ClaimMethodType;
    tokens: TokenData[];
}

// Box图片组件Props
export interface BoxImageProps {
    src: string;
    alt: string;
    status: string;
    onClick?: () => void;
}

// Box信息组件Props
export interface BoxInfoProps {
    data: BoxData;
}

// 合约方法映射
// export const CONTRACT_METHOD_MAPPING = {
//     minted: 'withdrawMinter',
//     completer: 'withdrawOtherRewards',
//     buyer_refund: 'withdrawRefund',
//     buyer_rewards: 'withdrawOtherRewards',
//     bidder_order: 'withdrawOrder',
// } as const;

// // 资金类型映射
// export const FUND_TYPE_MAPPING = {
//     publicReward: {
//         tokenType: 'officeToken',
//         condition: (box: BoxData, tab: ProfileTab) =>
//             tab === 'published' && box.status === 'Published',
//         claimMethod: 'withdrawPublicRewards'
//     },
//     orderRefund: {
//         tokenType: 'acceptedToken',
//         condition: (box: BoxData, tab: ProfileTab, userAddress: string) =>
//             (tab === 'bought' || tab === 'bade') &&
//             box.status === 'InSecrecy' && // 注意：新架构中 'Completed' 改为 'InSecrecy'
//             box.refundPermit === true,
//         claimMethod: 'withdrawRefund'
//     },
//     orderBid: {
//         tokenType: 'acceptedToken',
//         condition: (box: BoxData, tab: ProfileTab, userAddress: string) =>
//             (tab === 'bought' || tab === 'bade') &&
//             box.buyer?.id !== userAddress.toLowerCase() &&
//             box.listedMode === 'Auctioning',
//         claimMethod: 'withdrawOrder'
//     },
//     minterRewards: {
//         tokenType: 'both',
//         condition: (box: BoxData, tab: ProfileTab, userAddress: string) =>
//             tab === 'minted' &&
//             (box.status === 'InSecrecy' || box.status === 'Published') && // 注意：'Completed' 改为 'InSecrecy'
//             box.minter?.id === userAddress.toLowerCase(),
//         claimMethod: 'withdrawMinter'
//     },
//     otherRewards: {
//         tokenType: 'officeToken',
//         condition: (box: BoxData, tab: ProfileTab) =>
//             (tab === 'sold' || tab === 'completed') &&
//             (box.status === 'InSecrecy' || box.status === 'Published'), // 注意：'Completed' 改为 'InSecrecy'
//         claimMethod: 'withdrawOtherRewards'
//     }
// } as const;