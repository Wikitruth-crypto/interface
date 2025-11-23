import { FilterState, BoxData } from './profile.types';

// 定义Tab类型别名
export type ProfileTab = FilterState['selectedTab'];

export type ClaimMethodType = 'withdrawPublicRewards' | 
    'withdrawOrderAmounts' | 
    'withdrawHelperRewards' | 
    'withdrawMinterRewards';

export type FundType = 'Refund' | 'Order' | 'HelperRewards' | 'MinterRewards';

// 资金类型定义
export interface ClaimableFund {
    boxId: string;
    type: FundType;
    officeTokenAmount: string;
    officeTokenFormat: string;
    officeTokenSymbol: string;
    acceptedTokenAmount: string;
    acceptedTokenFormat: string;
    acceptedTokenSymbol: string;
    claimMethod: ClaimMethodType;
}

// 资金展示数据
export interface CardFundsData {
    availableFunds: ClaimableFund[];
    totalClaimable: {
        officeToken: string;
        acceptedToken: string;
    };
    canClaim: boolean;
}

// 资金计算结果
export interface FundsCalculationResult {
    publicReward?: ClaimableFund;
    orderFunds: ClaimableFund[];
    rewardFunds: ClaimableFund[];
    totalAmount: bigint;
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

// Box状态标识Props
export interface BoxStatusProps {
    status: string;
    className?: string;
}

// Claim按钮Props
export interface ClaimButtonProps {
    selectedCount: number;
    canClaim: boolean;
    isLoading: boolean;
    onClaim: () => Promise<void>;
}

// 合约方法映射
export const CONTRACT_METHOD_MAPPING = {
    minted: 'withdrawMinter',
    completer: 'withdrawOtherRewards',
    buyer_refund: 'withdrawRefund',
    buyer_rewards: 'withdrawOtherRewards',
    bidder_order: 'withdrawOrder',
    published: 'withdrawPublicRewards',
} as const;

// 资金类型映射
export const FUND_TYPE_MAPPING = {
    publicReward: {
        tokenType: 'officeToken',
        condition: (box: BoxData, tab: ProfileTab) =>
            tab === 'published' && box.status === 'Published',
        claimMethod: 'withdrawPublicRewards'
    },
    orderRefund: {
        tokenType: 'acceptedToken',
        condition: (box: BoxData, tab: ProfileTab, userAddress: string) =>
            (tab === 'bought' || tab === 'bade') &&
            box.status === 'InSecrecy' && // 注意：新架构中 'Completed' 改为 'InSecrecy'
            box.refundPermit === true,
        claimMethod: 'withdrawRefund'
    },
    orderBid: {
        tokenType: 'acceptedToken',
        condition: (box: BoxData, tab: ProfileTab, userAddress: string) =>
            (tab === 'bought' || tab === 'bade') &&
            box.buyer?.id !== userAddress.toLowerCase() &&
            box.listedMode === 'Auctioning',
        claimMethod: 'withdrawOrder'
    },
    minterRewards: {
        tokenType: 'both',
        condition: (box: BoxData, tab: ProfileTab, userAddress: string) =>
            tab === 'minted' &&
            (box.status === 'InSecrecy' || box.status === 'Published') && // 注意：'Completed' 改为 'InSecrecy'
            box.minter.id === userAddress.toLowerCase(),
        claimMethod: 'withdrawMinter'
    },
    otherRewards: {
        tokenType: 'officeToken',
        condition: (box: BoxData, tab: ProfileTab) =>
            (tab === 'sold' || tab === 'completed') &&
            (box.status === 'InSecrecy' || box.status === 'Published'), // 注意：'Completed' 改为 'InSecrecy'
        claimMethod: 'withdrawOtherRewards'
    }
} as const;