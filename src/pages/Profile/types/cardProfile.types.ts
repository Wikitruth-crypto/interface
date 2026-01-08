import { FilterState, BoxData } from './profile.types';

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

export interface ClaimableFund {
    boxId: string;
    type: FundType;
    claimMethod: ClaimMethodType;
    tokens: TokenData[];
}

export interface BoxImageProps {
    src: string;
    alt: string;
    status: string;
    onClick?: () => void;
}

export interface BoxInfoProps {
    data: BoxData;
}
