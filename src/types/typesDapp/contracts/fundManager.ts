
// enum RewardType { Minter, Seller, Completer, Total }
// enum FundsType { Order, Refund }
export const rewardType = [
    'Minter',
    'Seller',
    'Completer',
    'Total',
] as const;

export type RewardType = typeof rewardType[number];


export const fundsType = [
    'Order',
    'Refund',
] as const;

export type FundsType = typeof fundsType[number];

export type FunctionNameType_FundManager = 
'withdrawOrderAmounts' | 
'withdrawRefundAmounts' |
'withdrawHelperRewards' |
'withdrawMinterRewards' ;

// import { RewardType } from '@/dapp/types/contractData/fundManager';
// RewardType.Minter