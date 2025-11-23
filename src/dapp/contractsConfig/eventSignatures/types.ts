import { ContractName, SupportedChainId } from '../types';

/**
 * 事件名称枚举
 */
export enum EventName {
    // Exchange 事件
    Box_Listed = 'BoxListed',
    Box_Purchased = 'BoxPurchased',
    Bid_Placed = 'BidPlaced',
    Completer_Assigned = 'CompleterAssigned',
    Request_Deadline_Changed = 'RequestDeadlineChanged',
    Review_Deadline_Changed = 'ReviewDeadlineChanged',
    Refund_Permit_Changed = 'RefundPermitChanged',

    // FundManager 事件
    Order_Amount_Paid = 'OrderAmountPaid',
    Order_Amount_Withdraw = 'OrderAmountWithdraw',
    Reward_Amount_Added = 'RewardAmountAdded',
    Helper_Rewrds_Withdraw = 'HelperRewrdsWithdraw',
    Rewards_Withdraw = 'RewardsWithdraw',

    // TruthBox 事件
    Box_Created = 'BoxCreated',
    Box_Status_Changed = 'BoxStatusChanged',
    Price_Changed = 'PriceChanged',
    Deadline_Changed = 'DeadlineChanged',
    Private_Key_Published = 'PrivateKeyPublished',

    // UserId 事件
    Blacklist = 'Blacklist',

    // TruthNFT 事件
    Transfer = 'Transfer',
}

/**
 * 事件配置接口
 */
export interface EventConfig {
    name: EventName;
    original: string;
    signature: string;
    onlyOnce: boolean;
    contract: ContractName;
    chainId: number[];
    network: string[];
    layer: string[];
    description?: string;
}

/**
 * 合约事件映射
 */
export type ContractEventMap = {
    [key in ContractName]?: EventConfig[];
};

/**
 * 网络事件配置映射
 */
export type NetworkEventMap = {
    [chainId in SupportedChainId]: ContractEventMap;
};

