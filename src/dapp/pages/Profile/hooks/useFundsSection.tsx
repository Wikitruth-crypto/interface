"use client"

import React, { useState, useEffect } from 'react';
import { ClaimableFund, } from '@dapp/pages/Profile/types/cardProfile.types';
import {
    Radio,
    RadioChangeEvent,
} from 'antd';
// import { TokenRegistry } from '@/dapp/constants/token';
import { useWithdrawStore, SelectableItem } from '@dapp/pages/Profile/store/withdrawStore';
// 资金展示区域Props
export interface FundsSectionProps {
    tokenId: string;
    funds: ClaimableFund;
    disabled: boolean;
}

export const useFundsSection= ({
    tokenId,
    funds,
    disabled
}: FundsSectionProps) => {
    // 使用withdrawStore的方法
    const {
        withdrawData,
        handleRadioSelect,
        handleRadioDeselect,
        isRadioSelected,
        registerSelectableItem,
        unregisterSelectableItem
    } = useWithdrawStore();

    const [value, setValue] = useState('');

    // 检查是否有可用资金
    const hasOfficeToken = funds.officeTokenAmount && funds.officeTokenAmount !== '0' && parseFloat(funds.officeTokenAmount) > 0;
    const hasAcceptedToken = funds.acceptedTokenAmount && funds.acceptedTokenAmount !== '0' && parseFloat(funds.acceptedTokenAmount) > 0;

    // 组件注册机制：在挂载时注册可选择项
    useEffect(() => {
        if (!disabled) {
            const registerItems = () => {
                // 注册office token项（如果有效）
                if (hasOfficeToken) {
                    const officeItem: SelectableItem = {
                        boxId: tokenId,
                        tokenSymbol: funds.officeTokenSymbol,
                        type: funds.type,
                        claimMethod: funds.claimMethod,
                        amount: funds.officeTokenAmount,
                        hasValidAmount: parseFloat(funds.officeTokenAmount) > 0
                    };
                    registerSelectableItem(officeItem);
                }

                // 注册accepted token项（如果有效）
                if (hasAcceptedToken) {
                    const acceptedItem: SelectableItem = {
                        boxId: tokenId,
                        tokenSymbol: funds.acceptedTokenSymbol,
                        type: funds.type,
                        claimMethod: funds.claimMethod,
                        amount: funds.acceptedTokenAmount,
                        hasValidAmount: parseFloat(funds.acceptedTokenAmount) > 0
                    };
                    registerSelectableItem(acceptedItem);
                }
            };

            registerItems();

            // 清理函数：组件卸载时取消注册
            return () => {
                if (hasOfficeToken) {
                    unregisterSelectableItem(tokenId, funds.officeTokenSymbol);
                }
                if (hasAcceptedToken) {
                    unregisterSelectableItem(tokenId, funds.acceptedTokenSymbol);
                }
            };
        }
    }, [
        tokenId,
        funds.officeTokenSymbol,
        funds.acceptedTokenSymbol,
        funds.type,
        funds.claimMethod,
        funds.officeTokenAmount,
        funds.acceptedTokenAmount,
        hasOfficeToken,
        hasAcceptedToken,
        disabled,
        registerSelectableItem,
        unregisterSelectableItem
    ]);

    // 监听全局状态变化，自动更新本地Radio状态
    useEffect(() => {
        // 检查当前Radio是否应该被选中
        const shouldBeSelectedOffice = withdrawData.selectedTokenSymbol === funds.officeTokenSymbol &&
            isRadioSelected(tokenId, funds.officeTokenSymbol);

        const shouldBeSelectedAccepted = withdrawData.selectedTokenSymbol === funds.acceptedTokenSymbol &&
            isRadioSelected(tokenId, funds.acceptedTokenSymbol);

        // 更新本地Radio状态
        if (shouldBeSelectedOffice) {
            setValue(funds.officeTokenSymbol);
        } else if (shouldBeSelectedAccepted) {
            setValue(funds.acceptedTokenSymbol);
        } else {
            setValue('');
        }
    }, [withdrawData.selectedTokenSymbol, withdrawData.selectedBoxes, tokenId, funds.officeTokenSymbol, funds.acceptedTokenSymbol, isRadioSelected]);

    // Radio选择变化处理
    const onChange = (e: RadioChangeEvent) => {
        const selectedToken = e.target.value;
        if (selectedToken === value) {
            setValue('');
            handleRadioDeselect(tokenId);
        } else {
            const amount = selectedToken === funds.officeTokenSymbol ?
                funds.officeTokenAmount : funds.acceptedTokenAmount;

            // 只有amount > 0才允许选择
            if (amount && parseFloat(amount) > 0) {
                handleRadioSelect(
                    tokenId,
                    selectedToken,
                    funds.type,
                    funds.claimMethod,
                    amount
                );
            } else {
                console.warn('Cannot select radio with zero amount:', amount);
            }
        }
    };

    return {value, onChange, hasOfficeToken, hasAcceptedToken};
};