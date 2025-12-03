"use client"

import React, { useMemo, useEffect } from 'react';
import CardProfile, { 
    CardProfileData, 
    CardProfileActions 
} from '@/dapp/components/cardProfile';
import { FundsData } from '@/dapp/components/fundsSection';
import { BoxData } from '@dapp/pages/Profile/types/profile.types';
import { useFunds } from '@/dapp/pages/Profile/hooks/useTestFunds';
import { useWithdrawStore, SelectableItem } from '@/dapp/pages/Profile/store/withdrawStore';

export interface CardProfileContainerProps {
    data: BoxData;
    userId?: string | null;
    onCardClick?: () => void;
    className?: string;
}

const CardProfileContainer: React.FC<CardProfileContainerProps> = ({
    data,
    userId,
    onCardClick,
    className
}) => {
    const { funds, hasClaimableFunds } = useFunds({ box: data, userId });

    const {
        withdrawData,
        handleRadioSelect,
        handleRadioDeselect,
        isRadioSelected,
        registerSelectableItem,
        unregisterSelectableItem
    } = useWithdrawStore();

    useEffect(() => {
        if (!hasClaimableFunds) return;

        const validTokens = funds.tokens.filter((token) => token.hasValidAmount);

        validTokens.forEach((token) => {
            const item: SelectableItem = {
                boxId: data.id,
                tokenSymbol: token.symbol,
                tokenAddress: token.address,
                tokenDecimals: token.decimals,
                type: funds.type,
                claimMethod: funds.claimMethod,
                amount: token.amount,
                hasValidAmount: token.hasValidAmount,
            };
            registerSelectableItem(item);
        });

        return () => {
            validTokens.forEach((token) => {
                unregisterSelectableItem(data.id, token.symbol);
            });
        };
    }, [
        data.id,
        funds.tokens,
        funds.type,
        funds.claimMethod,
        hasClaimableFunds,
        registerSelectableItem,
        unregisterSelectableItem
    ]);

    const cardData: CardProfileData = useMemo(() => ({
        tokenId: data.tokenId,
        title: data.title || `Box #${data.tokenId}`,
        description: data.description || 'No description available',
        boxImage: data.boxImage ?? data.nftImage ?? data.image,
        status: data.status,
        country: data.country,
        state: data.state,
        eventDate: data.eventDate,
    }), [data]);

    const cardFunds: FundsData[] = useMemo(() => (
        funds.tokens.map((token) => ({
            amount: token.amount,
            symbol: token.symbol,
            type: funds.type,
            decimals: token.decimals,
            disabled: !token.hasValidAmount || !hasClaimableFunds,
        }))
    ), [funds.tokens, hasClaimableFunds]);

    const tokenSymbols = useMemo(() => funds.tokens.map((token) => token.symbol), [funds.tokens]);

    const selectedTokenSymbol = useMemo(() => {
        for (const symbol of tokenSymbols) {
            if (isRadioSelected(data.id, symbol)) {
                return symbol;
            }
        }
        return '';
    }, [data.id, tokenSymbols, withdrawData.selectedBoxes, isRadioSelected]);

    const cardActions: CardProfileActions = useMemo(() => ({
        selectedTokenSymbol,
        onCardClick,
        onSelect: (tokenSymbol: string) => {
            const token = funds.tokens.find((item) => item.symbol === tokenSymbol);
            if (!token || !token.hasValidAmount) return;

            handleRadioSelect(
                data.id,
                tokenSymbol,
                funds.type,
                funds.claimMethod,
                token.amount
            );
        },
        onDeselect: () => {
            handleRadioDeselect(data.id);
        }
    }), [
        onCardClick,
        selectedTokenSymbol,
        funds.tokens,
        funds.type,
        funds.claimMethod,
        data.id,
        handleRadioSelect,
        handleRadioDeselect
    ]);

    return (
        <CardProfile
            data={cardData}
            funds={cardFunds}
            actions={cardActions}
            className={className}
        />
    );
};

export default CardProfileContainer;
