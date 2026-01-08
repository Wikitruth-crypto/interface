"use client"

import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useSupportedTokens } from '@dapp/config/contractsConfig';
import { useBoxOrderAmounts } from '@BoxDetail/hooks/useBoxOrderAmounts';
import { ClaimableFund, ClaimMethodType, FundType, TokenData } from '../types/cardProfile.types';
import type { BoxData } from '../types/profile.types';
import { useProfileStore } from '../store/profileStore';
import { BoxRoleType } from '@dapp/types/typesDapp/account';

export interface UseFundsParams {
    box: BoxData;
    userId?: string | null;
}

export interface UseFundsReturn {
    funds: ClaimableFund;
    isLoading: boolean;
    hasClaimableFunds: boolean;
}

const formatTokenAmount = (amount: bigint, decimals: number) => {
    if (amount === BigInt(0)) return '0.000';
    try {
        const value = formatUnits(amount, decimals);
        const [integer, fractional = '0'] = value.split('.');
        const trimmed = fractional.replace(/0+$/, '').slice(0, 4);
        return trimmed ? `${integer}.${trimmed}` : integer;
    } catch {
        return amount.toString();
    }
};

const fallbackSymbol = (address?: string) => {
    if (!address) return 'UNKNOWN';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const createTokenData = (params: {
    amount: bigint;
    symbol: string;
    address?: string;
    decimals: number;
}): TokenData => ({
    amount: params.amount.toString(),
    formattedAmount: formatTokenAmount(params.amount, params.decimals),
    symbol: params.symbol,
    address: params.address,
    decimals: params.decimals,
    hasValidAmount: params.amount > BigInt(0),
});

export const useFunds = ({ box, userId }: UseFundsParams): UseFundsReturn => {
    const supportedTokens = useSupportedTokens();
    const selectedTab = useProfileStore((state) => state.filterState.selectedTab);

    const acceptedTokenMeta = useMemo(() => {
        if (!box.acceptedToken) return null;
        return supportedTokens.find((token) => token.address.toLowerCase() === box.acceptedToken?.toLowerCase());
    }, [box.acceptedToken, supportedTokens]);

    const isOrderTab = selectedTab === 'bought' || selectedTab === 'bade';
    const shouldQuery = Boolean(isOrderTab && userId && box.acceptedToken);

    const { orderAmountsData, isLoading } = useBoxOrderAmounts(
        box.id,
        userId ?? '',
        ['Buyer', 'Bidder'] as BoxRoleType[]
    );

    const result = useMemo(() => {
        const acceptedAddress = box.acceptedToken ?? acceptedTokenMeta?.address;
        const decimals = acceptedTokenMeta?.decimals ?? 18;
        const symbol = acceptedTokenMeta?.symbol ?? fallbackSymbol(acceptedAddress);
        const tokens: TokenData[] = [];

        if (shouldQuery && orderAmountsData && orderAmountsData.length > 0) {
            const totalRaw = orderAmountsData.reduce((acc, item) => {
                try {
                    return acc + BigInt(item.amount || '0');
                } catch {
                    return acc;
                }
            }, BigInt(0));

            if (totalRaw > BigInt(0)) {
                tokens.push(
                    createTokenData({
                        amount: totalRaw,
                        symbol,
                        address: acceptedAddress ?? undefined,
                        decimals,
                    })
                );
            }
        }

        const isRefundEligible = Boolean(
            userId &&
            box.refundPermit &&
            box.buyer?.id &&
            box.buyer.id === userId
        );

        const isOrderEligible = Boolean(
            userId &&
            (!box.buyer?.id || box.buyer.id !== userId) &&
            box.bidders?.some((bidder) => bidder.id === userId)
        );

        const hasAccess = isRefundEligible || isOrderEligible;
        const claimMethod: ClaimMethodType = isRefundEligible ? 'withdrawRefundAmounts' : 'withdrawOrderAmounts';
        const fundType: FundType = isRefundEligible ? 'Refund' : 'Order';

        return {
            funds: {
                boxId: box.id,
                type: fundType,
                claimMethod,
                tokens: hasAccess ? tokens : [],
            },
            hasClaimableFunds: hasAccess && tokens.some((token) => token.hasValidAmount),
        };
    }, [
        acceptedTokenMeta,
        box.id,
        box.acceptedToken,
        box.bidders,
        box.buyer,
        box.refundPermit,
        orderAmountsData,
        shouldQuery,
        userId,
    ]);

    return {
        funds: result.funds,
        isLoading,
        hasClaimableFunds: result.hasClaimableFunds,
    };
};
