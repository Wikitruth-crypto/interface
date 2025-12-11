import { useBoxDetailStore } from '../store/boxDetailStore';
import { useMemo, useState, useEffect } from 'react';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { BoxInteractionRecord, useAccountStore, AccountStoreState } from '@/dapp/store/accountStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { CHAIN_ID } from '@/dapp/contractsConfig';
import { FunctionNameType } from '@/dapp/types/contracts';

export type ButtonActiveNameType =
  'extendActive' |
  'sellActive' |
  'auctionActive' |
  'buyActive' |
  'bidActive' |
  'requestRefundActive' |
  'cancelRefundActive' |
  'agreeRefundActive' |
  'refuseRefundActive' |
  'completeActive' |
  'payConfiFeeActive' |
  'publishActive' |
  'viewFileActive';

export const useButtonActive = (name: ButtonActiveNameType) => {
  const { boxId, box, deadlineCheckState } = useBoxDetailContext();
  const { userState, modalStatus } = useBoxDetailStore(state => state);
  const { address } = useWalletContext() || {};
  const normalizedAddress = address?.toLowerCase();
  const emptyInteractions: BoxInteractionRecord[] = [];



  const selector = useMemo(() => {
    if (!normalizedAddress || !CHAIN_ID) {
      return () => emptyInteractions;  // 始终返回同一个数组引用
    }
    return (state: AccountStoreState) =>
      state.accounts[CHAIN_ID]?.[normalizedAddress]?.boxInteractions[boxId] ?? emptyInteractions;
  }, [normalizedAddress, boxId]);

  const boxInteractions = useAccountStore(selector);

  return useMemo(() => {
    if (!box) {
      return false;
    }


    const wroteList = boxInteractions.map(interaction => interaction.functionWrote) || [];

    const roles = userState.roles;
    const { isInDeadline, isInRequestRefundDeadline, isInReviewRefundDeadline } = deadlineCheckState || {};

    const isInBlackListed = box.isInBlacklist || false;
    const status = box.status || 'Storing';

    const purchaseTimestamp = Number(box.purchaseTimestamp) || 0;
    const requestRefundDeadline = Number(box.requestRefundDeadline) || 0;
    const reviewDeadline = Number(box.reviewDeadline) || 0;
    const refundPermit = box.refundPermit || false;

    const isMinter = roles.includes('Minter');
    const isAdmin = roles.includes('Admin');
    const isBuyer = roles.includes('Buyer');
    const isBidder = roles.includes('Bidder');
    const isOther = roles.includes('Other');
    const isGuest = roles.length === 0;


    const publishActive_roleCheck = (): boolean => {
      if (status === 'Storing') {
        return isMinter ;
      } else if (status === 'InSecrecy') {
        return isBuyer ;
      }
      return false;
    }
    const sellOrAuction_roleCheck = (): boolean => {
      if (isInDeadline) {
        return isMinter ; // 没过期，则必须是minter
      } else {
        return !isGuest; // 过期了，则只要不是guest就可以
      }
    }

    const agreeRefund_roleCheck = (): boolean => {
      if (isInReviewRefundDeadline) {
        return isAdmin || (isMinter ); // 在审核退款期限内，则必须是admin或minter
      } else {
        return !isGuest; // 过期，则只要不是guest就可以
      }
    }

    const refuseRefund_roleCheck = (): boolean => {
      if (isInReviewRefundDeadline) {
        return isAdmin; // 在审核退款期限内，则必须是admin
      } else {
        return !isGuest; // 过期，则只要不是guest就可以
      }
    }

    const completeOrder_roleCheck = (): boolean => {
      if (isInRequestRefundDeadline) {
        return isBuyer ; // 在请求退款期限内，则必须是buyer
      } else {
        return !isGuest; // 过期，则只要不是guest就可以
      }
    }

    const viewFileActive = (): boolean => {
      if (status === 'Storing' || status === 'Selling' || status === 'Auctioning') {
        return isMinter ;
      } else if (status === 'InSecrecy' || status === 'Paid') {
        return isBuyer ;
      } else if (status === 'Refunding') {
        return !isGuest;
      } else if (status === 'Published') {
        return !isGuest;
      }
      return false;
    };

    // 确保wroteList中不包含数组中的所有functionName
    const wroteListNotInclude = (functionNames: FunctionNameType[]): boolean => {
      return functionNames.every(functionName => !wroteList.includes(functionName));
    }


    switch (name) {
      case 'extendActive':
        return !isInBlackListed &&
          isMinter  &&
          isInDeadline &&
          deadlineCheckState?.isInExtendDeadlineTimeWindow &&
          !wroteList.includes('extendDeadline') &&
          modalStatus.ExtendDeadline === 'close';

      case 'sellActive':
        return !isInBlackListed &&
          status === 'Storing' &&
          sellOrAuction_roleCheck() &&
          wroteListNotInclude(['sell','auction','publishByMinter']) &&
          modalStatus.SellAuction === 'close';

      case 'auctionActive':
        return !isInBlackListed &&
          status === 'Storing' &&
          sellOrAuction_roleCheck() &&
          wroteListNotInclude(['sell','auction','publishByMinter']) &&
          modalStatus.SellAuction === 'close';

      case 'buyActive':
        return !isInBlackListed &&
          purchaseTimestamp === 0 &&
          status === 'Selling' &&
          isOther  &&
          // isInDeadline &&
          wroteListNotInclude(['buy','bid','publishByMinter','publishByBuyer']);

      case 'bidActive':
        return !isInBlackListed &&
          status === 'Auctioning' &&
          (isOther || isBidder)  &&
          isInDeadline &&
          wroteListNotInclude(['buy','bid','publishByMinter','publishByBuyer']);

      case 'requestRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          isInRequestRefundDeadline &&
          reviewDeadline === 0 &&
          status === 'Paid' &&
          isBuyer  &&
          wroteListNotInclude(['requestRefund']);

      case 'cancelRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          isBuyer  &&
          wroteListNotInclude(['cancelRefund']);

      case 'agreeRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          agreeRefund_roleCheck() &&
          wroteListNotInclude(['agreeRefund']);

      case 'refuseRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          refuseRefund_roleCheck() &&
          wroteListNotInclude(['refuseRefund']);

      case 'completeActive':
        return !isInBlackListed &&
          requestRefundDeadline === 0 &&
          reviewDeadline === 0 &&
          !refundPermit &&
          status === 'Paid' &&
          completeOrder_roleCheck() &&
          wroteListNotInclude(['completeOrder']);

      case 'payConfiFeeActive':
        return !isInBlackListed &&
          status === 'InSecrecy' &&
          deadlineCheckState?.isInExtendDeadlineTimeWindow &&
          !isGuest &&
          wroteListNotInclude(['payConfiFee']);

      case 'publishActive':
        return !isInBlackListed &&
          publishActive_roleCheck() &&
          wroteListNotInclude(['publishByMinter','publishByBuyer']) 

      case 'viewFileActive':
        return !isInBlackListed &&
          viewFileActive();

      default:
        return true;
    }
  }, [
    name,
    box,
    normalizedAddress,
    userState.roles,
    boxInteractions,
    modalStatus,
    boxId
  ]);
};
