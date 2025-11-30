import {
    useChainId,
} from "wagmi";
import { SupportedChainId } from "./types";


export interface ProtocolConstantsType {
    storingTime: number; // 首次mint的保密有效期（秒）
    sellingTime: number; // 出售的有效期（秒）
    auctioningTime: number; // 设置拍卖后，首次竞拍的有效时间（秒）
    bidTime: number; // 每次竞拍，增加的时间（秒）
    completeTime: number; // 交易完成后，增加的保密时间（秒）

    refundRequestPeriod: number; // 买家申请退款期限（秒）
    refundReviewPeriod: number; // DAO审核退款期限（秒）
    
    extendDeadlineTimeWindow: number; // 距离deadline多长时间内可执行延长deadline操作（秒）
    extendDeadlineByMinter: number; // 未出售Box，minter每次最多可延长的保密期（秒）
    payConfiFeeExtendDeadline: number; // 交易完成后，买家支付一次保密费可延长的保密期（秒）

    bidIncrementRate: number; // 每次竞价增幅（%）
    incrementRate: number; // 买家每次支付保密费，保密费增加幅度（%）
    serviceFeeRate: number; // 交易费率（%）
    helperRewardRate: number; // 其它操作者奖励费率（%）
}

export const SAPPHIRE_TESTNET_CONSTANTS: ProtocolConstantsType = {
    storingTime: 15 * 24 * 3600,  
    sellingTime: 15 * 24 * 3600, 
    auctioningTime: 5 * 24 * 3600, 
    bidTime: 5 * 24 * 3600,
    completeTime: 5 * 24 * 3600, 

    refundRequestPeriod: 7 * 24 * 3600, 
    refundReviewPeriod: 7 * 24 * 3600,

    extendDeadlineTimeWindow: 3 * 24 * 3600,
    extendDeadlineByMinter: 15 * 24 * 3600, 
    payConfiFeeExtendDeadline: 15 * 24 * 3600, 

    bidIncrementRate: 110, 
    incrementRate: 200, 
    serviceFeeRate: 3, 
    helperRewardRate: 1, 
};

export const SAPPHIRE_MAINNET_CONSTANTS: ProtocolConstantsType = {
    storingTime: 365 * 24 * 3600,
    sellingTime: 365 * 24 * 3600,
    auctioningTime: 30 * 24 * 3600,
    bidTime: 30 * 24 * 3600,
    completeTime: 30 * 24 * 3600,

    refundRequestPeriod: 7 * 24 * 3600,
    refundReviewPeriod: 15 * 24 * 3600,

    extendDeadlineTimeWindow: 30 * 24 * 3600,
    extendDeadlineByMinter: 365 * 24 * 3600,
    payConfiFeeExtendDeadline: 365 * 24 * 3600,

    bidIncrementRate: 110,
    incrementRate: 200,
    serviceFeeRate: 3,
    helperRewardRate: 1, 
};

export function getProtocolConstants(chainId?: number): ProtocolConstantsType {
    if (chainId === SupportedChainId.SAPPHIRE_TESTNET) return SAPPHIRE_TESTNET_CONSTANTS;
    if (chainId === SupportedChainId.SAPPHIRE_MAINNET) return SAPPHIRE_MAINNET_CONSTANTS;
    return SAPPHIRE_TESTNET_CONSTANTS;
}

// React Hook，自动根据钱包context返回当前网络的常量
export function useProtocolConstants(): ProtocolConstantsType {
    const chainId = useChainId();
    return getProtocolConstants(chainId);
}


