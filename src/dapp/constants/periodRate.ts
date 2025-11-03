// import {
//     usePublicClient,
// } from "wagmi";

import { useWalletContext } from "../context/useAccount/WalletContext";
import { useMemo } from 'react';

export interface PeriodRateType {
    storingTime: number; // 首次mint的保密有效期（秒）
    sellingTime: number; // 出售的有效期（秒）
    auctioningTime: number; // 设置拍卖后，首次竞拍的有效时间（秒）
    bidTime: number; // 每次竞拍，增加的时间（秒）
    completeTime: number; // 交易完成后，增加的保密时间（秒）

    // deliveryPeriod: number; // 购买后的发货期限（秒）
    refundRequestPeriod: number; // 买家申请退款期限（秒）
    refundReviewPeriod: number; // DAO审核退款期限（秒）

    // refundRateTime: number; // 发货超时后，每超时这个期限，会产生1%的退款费率（秒）
    // deliverOverdue: number; // 发货超时到达这个期限后，买家可全额退款（秒）

    extendDeadlineByMinter: number; // 未出售Box，minter每次最多可延长的保密期（秒）
    payConfiFeeExtendDeadline: number; // 交易完成后，买家支付一次保密费可延长的保密期（秒）

    bidIncrementRate: number; // 每次竞价增幅（%）
    incrementRate: number; // 买家每次支付保密费，保密费增加幅度（%）
    serviceFeeRate: number; // 交易费率（%）
    // publicRewardRate: number; // 公开奖励费率（%）
    helperRewardRate: number; // 其它操作者奖励费率（%）
}

const SEPOLIA_PERIOD_RATE: PeriodRateType = {
    storingTime: 15 * 24 * 3600,  
    sellingTime: 15 * 24 * 3600, 
    auctioningTime: 5 * 24 * 3600, 
    bidTime: 5 * 24 * 3600,
    completeTime: 5 * 24 * 3600, 

    // deliveryPeriod: 7 * 24 * 3600, 
    refundRequestPeriod: 7 * 24 * 3600, 
    refundReviewPeriod: 7 * 24 * 3600,

    // refundRateTime: 6 * 3600, 
    // deliverOverdue: 15 * 24 * 3600, 

    extendDeadlineByMinter: 15 * 24 * 3600, 
    payConfiFeeExtendDeadline: 15 * 24 * 3600, 

    bidIncrementRate: 110, 
    incrementRate: 200, 
    serviceFeeRate: 3, 
    // publicRewardRate: 5, 
    helperRewardRate: 1, 
};

const MAINNET_PERIOD_RATE: PeriodRateType = {
    storingTime: 365 * 24 * 3600,
    sellingTime: 365 * 24 * 3600,
    auctioningTime: 30 * 24 * 3600,
    bidTime: 30 * 24 * 3600,
    completeTime: 30 * 24 * 3600,

    // deliveryPeriod: 15 * 24 * 3600, // 已删除
    refundRequestPeriod: 7 * 24 * 3600,
    refundReviewPeriod: 15 * 24 * 3600,

    // refundRateTime: 1* 24 * 3600,
    // deliverOverdue: 100 * 24 * 3600,

    extendDeadlineByMinter: 365 * 24 * 3600,
    payConfiFeeExtendDeadline: 365 * 24 * 3600,

    bidIncrementRate: 110,
    incrementRate: 200,
    serviceFeeRate: 3,
    // publicRewardRate: 5, // 已删除
    helperRewardRate: 1, 
};

// 11155111: sepolia, 1: mainnet
export function getPeriodRate(chainId?: number): PeriodRateType {
    if (chainId === 1) return MAINNET_PERIOD_RATE;
    // 默认sepolia
    return SEPOLIA_PERIOD_RATE;
}

// React Hook，自动根据钱包context返回当前网络的常量
export function usePeriodRate(): PeriodRateType {
    const { publicClient } = useWalletContext();
    // publicClient.chain?.id 可能为undefined，默认sepolia
    const chainId = publicClient?.chain?.id;
    return useMemo(() => getPeriodRate(chainId), [chainId]);
}


