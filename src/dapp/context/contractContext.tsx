
//@ts-nocheck

"use client";

import React, {
    // ReactNode,
    // useEffect, 
    // useState 
} from "react";
import { ContractFunctionParams } from "./provider";


export const ContractContext = React.createContext(
    {} as {
        contract: (params: ContractFunctionParams) => Promise<any>; // 与合约交互的函数
        // currentAddress: `0x${string}`; // 当前地址
        // ------------Truth Box-------------------
        getBasicData,
        getStatus,
        getDeadline,
        getPrice,
        // 所有权相关
        getPrivateData,
        // 统计相关
        blacklistSupply,
        completeCounts,
        // 状态查询
        isInBlacklist,
        // ------------Truth NFT-------------------
        name,
        symbol,
        // 密钥查询
        logoURI,
        tokenURI,
        totalSupply,
        ownerOf,
        balanceOf,
        // ------------Exchange-------------------
        refundPermit,
        acceptedToken,
        // 时间戳
        refundReviewDeadline,
        refundRequestDeadline,
        // 状态查询
        isInRequestRefundDeadline,
        isInReviewDeadline,
        // 支付相关
        calcPayMoney,
        // ------------Fund Manager-------------------
        otherRewardRate,
        serviceFeeRate,
        // 金额查询
        orderAmounts,
        minterRewardAmounts,
        helperRewardAmounts,
        // 资金池查询
        // availableServiceFees,
        // cumulativeAllocatedFunds,
        totalRewardAmounts,
        // 状态查询
        isWithdrawPaused,
        slippageProtection,
        // ------------Address Manager-------------------
        getTokenList,
        getTokenByIndex,
        officialToken,
        isTokenSupported,
        isOfficialToken,
        // ------------Siwe Auth-------------------
        getDomainCount,
        getDomainByIndex,
        isSessionValid,
        login,
        getMsgSender,
        getStatement,
        getResources,
        // ------------UserId-------------------
        myUserId,
        isBlacklisted,
        // ------------ERC20-------------------
        allowance,
        balanceOf,
        // 代币基本信息
        decimals,
        name,
        symbol,
        totalSupply,
        // 铸造相关,
        mintDate,
        // mintPeriod,
        // mintAmount,
        // ------------ERC20Secret-------------------
        underlyingToken,
        balanceOfWithPermit,
        allowanceWithPermit,
        DOMAIN_SEPARATOR,
        EIP_PERMIT_TYPEHASH,
        isSignatureUsed,
        
    }
);
