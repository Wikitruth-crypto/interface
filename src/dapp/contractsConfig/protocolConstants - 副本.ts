
// import { SupportedChainId } from "./types";
import type { RuntimeScope } from '../oasisQuery/types/searchScope'

/**
 * 协议配置接口
 * 定义协议的各种时间参数和费率参数
 */
export interface ProtocolConstants {
    initialPrivacyPeriod: number; // 首次mint的保密有效期（秒）
    saleValidityPeriod: number; // 出售的有效期（秒）
    initialAuctionPeriod: number; // 设置拍卖后，首次竞拍的有效时间（秒）
    bidExtensionPeriod: number; // 每次竞拍，增加的时间（秒）
    postCompletionPrivacyPeriod: number; // 交易完成后，增加的保密时间（秒）

    refundRequestPeriod: number; // 买家申请退款期限（秒）
    refundReviewPeriod: number; // DAO审核退款期限（秒）
    
    deadlineExtensionWindow: number; // 距离deadline多长时间内可执行延长deadline操作（秒）
    minterPrivacyExtension: number; // 未出售Box，minter每次最多可延长的保密期（秒）
    confidentialityFeeExtensionPeriod: number; // 交易完成后，买家支付一次保密费可延长的保密期（秒）

    bidIncrementRate: number; // 每次竞价增幅（%）
    incrementRate: number; // 买家每次支付保密费，保密费增加幅度（%）
    serviceFeeRate: number; // 交易费率（%）
    helperRewardRate: number; // 其它操作者奖励费率（%）
}

/**
 * 测试网协议配置
 */
export const SAPPHIRE_TESTNET: ProtocolConstants = {
    initialPrivacyPeriod: 15 * 24 * 3600,  
    saleValidityPeriod: 15 * 24 * 3600, 
    initialAuctionPeriod: 5 * 24 * 3600, 
    bidExtensionPeriod: 5 * 24 * 3600,
    postCompletionPrivacyPeriod: 5 * 24 * 3600, 

    refundRequestPeriod: 7 * 24 * 3600, 
    refundReviewPeriod: 7 * 24 * 3600,

    deadlineExtensionWindow: 3 * 24 * 3600,
    minterPrivacyExtension: 15 * 24 * 3600, 
    confidentialityFeeExtensionPeriod: 15 * 24 * 3600, 

    bidIncrementRate: 110, 
    incrementRate: 200, 
    serviceFeeRate: 3, 
    helperRewardRate: 1, 
};

/**
 * 主网协议配置
 */
export const SAPPHIRE_MAINNET: ProtocolConstants = {
    initialPrivacyPeriod: 365 * 24 * 3600,
    saleValidityPeriod: 365 * 24 * 3600,
    initialAuctionPeriod: 30 * 24 * 3600,
    bidExtensionPeriod: 30 * 24 * 3600,
    postCompletionPrivacyPeriod: 30 * 24 * 3600,

    refundRequestPeriod: 7 * 24 * 3600,
    refundReviewPeriod: 15 * 24 * 3600,

    deadlineExtensionWindow: 30 * 24 * 3600,
    minterPrivacyExtension: 365 * 24 * 3600,
    confidentialityFeeExtensionPeriod: 365 * 24 * 3600,

    bidIncrementRate: 110,
    incrementRate: 200,
    serviceFeeRate: 3,
    helperRewardRate: 1, 
};

/**
 * 根据链ID获取对应的协议配置
 * @param chainId 链ID，可选
 * @returns 协议配置对象
 */
export function getProtocolConstants(scope: RuntimeScope): ProtocolConstants {
    if (scope.network === 'testnet' && scope.layer === 'sapphire') return SAPPHIRE_TESTNET;
    if (scope.network === 'mainnet' && scope.layer === 'sapphire') return SAPPHIRE_MAINNET;
    return SAPPHIRE_TESTNET;
}

