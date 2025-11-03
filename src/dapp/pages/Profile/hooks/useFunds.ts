"use client"

import { useEffect, useState } from "react";
import { BoxTestType } from "../store/boxProfile_test";
import { useWalletContext } from "@/dapp/context/useAccount/WalletContext";
import { useSupportedTokens } from "@/dapp/contractsConfig";
import { formatEther,} from "ethers";
// import { SelectedTabType } from "../types/profile.types";
import { ClaimableFund, FundType, ClaimMethodType } from "../types/cardProfile.types";
import { useProfileStore } from "../store/profileStore";

export interface UseFundsReturn {
    funds: ClaimableFund;
    isLoading: boolean;
    hasClaimableFunds: boolean;
}

/**
 * 这个hooks 是用来处理box中的funds数据，并且返回CardProfile组件所需要的数据
 * @param box 
 */
export const useFunds = (box: BoxTestType): UseFundsReturn => {
    const { address } = useWalletContext();
    const supportedTokens = useSupportedTokens();
    const selectedTab = useProfileStore(state => state.filterState.selectedTab);

    const [funds, setFunds] = useState<ClaimableFund>({
        boxId: box.id,
        type: 'MinterRewards',
        officeTokenAmount: '0',
        officeTokenFormat: '0.000',
        officeTokenSymbol: supportedTokens[0].symbol,
        acceptedTokenAmount: '0',
        acceptedTokenFormat: '0.000',
        acceptedTokenSymbol: supportedTokens[0].symbol,
        claimMethod: 'withdrawMinterRewards'
    });

    const [hasClaimableFunds, setHasClaimableFunds] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        if (address) {
            setIsLoading(true);
            let hasClaimableFunds = false;
            let officeTokenSymbol = supportedTokens[0].symbol;
            let acceptedTokenSymbol = supportedTokens[0].symbol;
            let officeTokenAmount = '0';
            let acceptedTokenAmount = '0';
            let officeTokenFormat = '0.000';
            let acceptedTokenFormat = '0.000';
            let fundType: FundType = 'Order';
            let claimMethod: ClaimMethodType = 'withdrawOrderAmounts';
            
            // 获取acceptedToken的symbol
            const acceptedToken = supportedTokens.find(token => token.address === box.acceptedToken);
            if (acceptedToken && acceptedToken.symbol !== supportedTokens[0].symbol) {
                acceptedTokenSymbol = acceptedToken.symbol;
            }

            // 1. 处理 publicRewardAmount
            if (selectedTab === 'published') {
                if (
                    box.publicRewardAmount &&
                    box.publicRewardAmount !== '0'
                ) {
                    hasClaimableFunds = true;
                    fundType = "HelperRewards";
                    officeTokenAmount = box.publicRewardAmount;
                    claimMethod = 'withdrawPublicRewards';
                }

            } else if (
                (selectedTab === 'bought' || selectedTab === 'bade') &&
                address
            ) {
                // 获取用户订单
                const userOrder = box.userOrders.find(order =>
                    order.user.toLowerCase() === address.toLowerCase()
                );

                if (userOrder && userOrder.amount && userOrder.amount !== '0') {
                    hasClaimableFunds = true;
                    
                    if (
                        box.refundPermit === true &&
                        box.buyer.toLowerCase() === address.toLowerCase()
                    ) {
                        fundType = 'Refund';
                        acceptedTokenAmount = userOrder.amount;
                        claimMethod = 'withdrawOrderAmounts';
                    } else if (
                        box.listedMode === 'Auctioning' &&
                        box.buyer.toLowerCase() !== address.toLowerCase()
                    ) {
                        fundType = 'Order';
                        acceptedTokenAmount = userOrder.amount;
                        claimMethod = 'withdrawOrderAmounts';
                    }
                }

            } else if (
                (box.status === 'Completed' || box.status === 'Published') &&
                address
            ) {
                const userReward = box.userRewards.find(reward =>
                    reward.user.toLowerCase() === address.toLowerCase()
                );

                if (userReward) {
                    // 如果是minter（tab为minted），可能有两种代币奖励
                    if (selectedTab === 'minted') {
                        fundType = 'MinterRewards';
                        officeTokenAmount = userReward.officeToken;
                        acceptedTokenAmount = userReward.acceptedToken;
                        claimMethod = 'withdrawMinterRewards';
                        if (
                            (userReward.officeToken && userReward.officeToken !== '0') ||
                            (userReward.acceptedToken && userReward.acceptedToken !== '0')
                        ) {
                            hasClaimableFunds = true;
                        }
                    } else if (selectedTab === 'sold' || selectedTab === 'completed') {
                        // 非minter，只有officeToken奖励
                        fundType = 'HelperRewards';
                        officeTokenAmount = userReward.officeToken;
                        claimMethod = 'withdrawHelperRewards';
                        if (userReward.officeToken && userReward.officeToken !== '0') {
                            hasClaimableFunds = true;
                        }
                    }
                }
            }

            officeTokenFormat = formatAmount(officeTokenAmount, officeTokenSymbol);
            acceptedTokenFormat = formatAmount(acceptedTokenAmount, acceptedTokenSymbol);
            
            setFunds({
                boxId: box.id,
                type: fundType,
                officeTokenAmount,
                acceptedTokenAmount,
                officeTokenFormat,
                acceptedTokenFormat,
                officeTokenSymbol,
                acceptedTokenSymbol,
                claimMethod
            });
            setHasClaimableFunds(hasClaimableFunds);
            setIsLoading(false);
        }

    }, [selectedTab, box, address]);


    // 格式化金额显示，依据TokenRegistry的symbol和decimals, 最多显示3位小数
    const formatAmount = (amount: string, tokenSymbol: string): string => {
        if (!amount || amount === '0') return '0.000';

        try {
            const token = supportedTokens.find(item => item.symbol === tokenSymbol);
            const symbol = token?.symbol || 'Unknown';
            const decimals = token?.decimals || 18;

            const value = parseFloat(amount);
            if (value === 0) return '0.000';

            // 根据代币类型格式化
            if (symbol !== 'Unknown') {
                // 从wei转换为代币单位
                const tmcValue = value / 10 ** decimals;
                // 转换为字符串，最多显示3位小数
                const formattedValue = tmcValue.toFixed(3);

                return formattedValue;
            } else {
                // ETH类代币，从wei转换，最多显示3位小数
                return '0.000';
            }
        } catch {
            return '0.000';
        }
    };

    return {
        funds,
        isLoading,
        hasClaimableFunds,
    };
};