"use client"

import React, { useMemo, useEffect } from 'react';
import CardProfile, { 
    CardProfileData, 
    CardProfileFunds, 
    CardProfileState, 
    CardProfileActions 
} from '@/dapp/components/cardProfile';
import { BoxData } from '@dapp/pages/Profile/types/profile.types';

// 导入原有的 hooks 和 stores
import { useFunds } from '@/dapp/pages/Profile/hooks/useFunds';
import { useWithdrawStore, SelectableItem } from '@/dapp/pages/Profile/store/withdrawStore';
import { useWithdraw } from '@/dapp/pages/Profile/hooks/useWithdraw';
import { boxTest_1, boxTest_2, boxTest_3, boxTest_4, boxTest_5 } from '@/dapp/pages/Profile/store/boxProfile_test';

const boxTestList = [boxTest_1, boxTest_2, boxTest_3, boxTest_4, boxTest_5];

export interface CardProfileContainerProps {
    data: BoxData;
    onCardClick?: () => void;
    className?: string;
}

/**
 * CardProfileContainer - 容器组件
 * 
 * 职责：
 * - 管理CardProfile的业务逻辑
 * - 处理数据转换和状态管理
 * - 连接hooks和stores
 * - 提供统一的回调处理
 * 
 * 设计原则：
 * - 业务逻辑与UI分离
 * - 数据转换和适配
 * - 状态管理集中处理
 */
const CardProfileContainer: React.FC<CardProfileContainerProps> = ({
    data,
    onCardClick,
    className
}) => {
    // 获取测试数据
    const randomBoxTest = useMemo(() => {
        const seed = data.tokenId ? parseInt(data.tokenId.toString()) : 0;
        const index = seed % boxTestList.length;
        return boxTestList[index];
    }, [data.tokenId]);

    // 使用业务hooks
    const { funds, hasClaimableFunds } = useFunds(randomBoxTest);
    
    // Withdraw store 相关
    const {
        withdrawData,
        handleRadioSelect,
        handleRadioDeselect,
        isRadioSelected,
        canClaim,
        totalAmount,
        registerSelectableItem,
        unregisterSelectableItem
    } = useWithdrawStore();
    
    const { withdraw, isPending, isSuccessed, error } = useWithdraw();

    // 关键：实现旧版本的注册/取消注册逻辑
    useEffect(() => {
        if (!hasClaimableFunds) return;

        const registerItems = () => {
            // 注册office token项（如果有效）
            if (funds.officeTokenAmount && parseFloat(funds.officeTokenAmount) > 0) {
                const officeItem: SelectableItem = {
                    boxId: data.tokenId,
                    tokenSymbol: funds.officeTokenSymbol,
                    type: funds.type,
                    claimMethod: funds.claimMethod,
                    amount: funds.officeTokenAmount,
                    hasValidAmount: parseFloat(funds.officeTokenAmount) > 0
                };
                registerSelectableItem(officeItem);
            }

            // 注册accepted token项（如果有效）
            if (funds.acceptedTokenAmount && parseFloat(funds.acceptedTokenAmount) > 0) {
                const acceptedItem: SelectableItem = {
                    boxId: data.tokenId,
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
            if (funds.officeTokenAmount && parseFloat(funds.officeTokenAmount) > 0) {
                unregisterSelectableItem(data.tokenId, funds.officeTokenSymbol);
            }
            if (funds.acceptedTokenAmount && parseFloat(funds.acceptedTokenAmount) > 0) {
                unregisterSelectableItem(data.tokenId, funds.acceptedTokenSymbol);
            }
        };
    }, [
        data.tokenId,
        funds.officeTokenSymbol,
        funds.acceptedTokenSymbol,
        funds.type,
        funds.claimMethod,
        funds.officeTokenAmount,
        funds.acceptedTokenAmount,
        hasClaimableFunds,
        registerSelectableItem,
        unregisterSelectableItem
    ]);

    // 数据转换：将原始数据转换为UI组件需要的格式
    const cardData: CardProfileData = useMemo(() => ({
        tokenId: data.tokenId,
        title: data.boxBasedata?.title || `Box #${data.tokenId}`,
        description: data.boxBasedata?.description || 'No description available',
        image: data.boxBasedata?.image,
        status: data.status,
        country: data.boxBasedata?.country,
        state: data.boxBasedata?.state,
        eventDate: data.boxBasedata?.eventDate
    }), [data]);

    // 资金信息转换
    const cardFunds: CardProfileFunds = useMemo(() => ({
        type: funds.type,
        officeToken: funds.officeTokenAmount && parseFloat(funds.officeTokenAmount) > 0 
            ? {
                amount: funds.officeTokenAmount,
                formattedAmount: funds.officeTokenFormat,
                symbol: funds.officeTokenSymbol,
                hasValidAmount: parseFloat(funds.officeTokenAmount) > 0
            }
            : undefined,
        acceptedToken: funds.acceptedTokenAmount && parseFloat(funds.acceptedTokenAmount) > 0
            ? {
                amount: funds.acceptedTokenAmount,
                formattedAmount: funds.acceptedTokenFormat,
                symbol: funds.acceptedTokenSymbol,
                hasValidAmount: parseFloat(funds.acceptedTokenAmount) > 0
            }
            : undefined,
        hasClaimableFunds
    }), [funds, hasClaimableFunds]);

    // 获取当前选择的代币信息
    const selectedTokenSymbol = useMemo((): string => {
        if (isRadioSelected(data.tokenId, funds.officeTokenSymbol)) {
            return funds.officeTokenSymbol;
        }
        if (isRadioSelected(data.tokenId, funds.acceptedTokenSymbol)) {
            return funds.acceptedTokenSymbol;
        }
        return '';
    }, [data.tokenId, withdrawData.selectedBoxes, funds.officeTokenSymbol, funds.acceptedTokenSymbol, isRadioSelected]);

    // 状态管理
    const cardState: CardProfileState = useMemo(() => ({
        selectedTokenSymbol: selectedTokenSymbol,
        canClaim: canClaim(),
        isClaimLoading: isPending,
        selectedCount: withdrawData.selectedBoxes?.length || 0,
        totalAmount: totalAmount().toString(),
        isClaimSuccess: isSuccessed,
        claimError: error?.message
    }), [selectedTokenSymbol, canClaim, isPending, withdrawData.selectedBoxes, totalAmount, isSuccessed, error]);

    // 事件处理器
    const cardActions: CardProfileActions = useMemo(() => ({
        onCardClick,
        onSelect: (tokenSymbol: string) => {
            // 获取对应的金额
            const amount = tokenSymbol === funds.officeTokenSymbol 
                ? funds.officeTokenAmount 
                : funds.acceptedTokenAmount;

            if (amount && parseFloat(amount) > 0) {
                handleRadioSelect(
                    data.tokenId,
                    tokenSymbol,
                    funds.type,
                    funds.claimMethod,
                    amount
                );
            }
        },
        onDeselect: (tokenSymbol: string) => {
            // 取消选择时，应该会将tokenSymbol设置为空
            handleRadioDeselect(data.tokenId);
        },
        onClaim: async () => {
            await withdraw();
        }
    }), [
        onCardClick,
        selectedTokenSymbol,
        funds.officeTokenSymbol,
        funds.officeTokenAmount,
        funds.acceptedTokenAmount,
        funds.type,
        funds.claimMethod,
        data.tokenId,
        handleRadioSelect,
        handleRadioDeselect,
        withdraw
    ]);

    return (
        <CardProfile
            data={cardData}
            funds={cardFunds}
            state={cardState}
            actions={cardActions}
            className={className}
        />
    );
};

export default CardProfileContainer; 