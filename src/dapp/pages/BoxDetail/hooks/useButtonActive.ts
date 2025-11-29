import { useBoxDetailStore } from '../store/boxDetailStore';
import { useMemo } from 'react';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useAccountStore } from '@/dapp/store/accountStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { CHAIN_ID } from '@/dapp/contractsConfig';

export type ButtonDisabledNameType = 
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

export const useButtonActive= (name: ButtonDisabledNameType) => {
  const { boxId, box } = useBoxDetailContext();
  const { userState, modalStatus} = useBoxDetailStore(state => state);
  const { address } = useWalletContext() || {};
  const normalizedAddress = address?.toLowerCase();

  const boxInteraction = useAccountStore((state) => {
    if (!CHAIN_ID || !normalizedAddress) {
      return [];
    }
    return state.accounts[CHAIN_ID]?.[normalizedAddress]?.boxInteractions[boxId] || [];
  });

  return useMemo(() => {
    if (!box) {
      return true;
    } 

    if (!address) {
      if (name === 'viewFileActive') {
        return false;
      }
      return true;
    }
    const now = Math.floor(Date.now() / 1000);

    const successedList = boxInteraction.map(interaction => interaction.functionName) || [];

    const roles = userState.roles;
    const isInDeadline = Number(box.deadline) > now;
    const isInRequestRefundDeadline = Number(box.requestRefundDeadline) > now;
    const isInReviewRefundDeadline = Number(box.reviewDeadline) > now;

    const isInBlackListed = box.isInBlacklist || false;
    const status = box.status || 'Storing';

    const purchaseTimestamp = Number(box.purchaseTimestamp) || 0;
    const requestRefundDeadline = Number(box.requestRefundDeadline) || 0;
    const reviewDeadline = Number(box.reviewDeadline) || 0;
    const refundPermit = box.refundPermit || false;

    const isMinter = roles.includes('Minter');
    const isAdmin = roles.includes('Admin');
    const isBuyer = roles.includes('Buyer');
    const isGuest = roles.length === 0;


    const publishActive_roleCheck = (): boolean => {
      if (status === 'Storing') {
        return isMinter;
      } else if (status === 'InSecrecy') {
        return isBuyer;
      }
      return false;
    }
    const sellOrAuction_roleCheck = (): boolean => {
      if (isInDeadline) {
        return isMinter; // 没过期，则必须是minter
      } else {
        return !isGuest; // 过期了，则只要不是guest就可以
      }
    }

    const agreeRefund_roleCheck = (): boolean => {
      if (isInReviewRefundDeadline) {
        return isAdmin || isMinter; // 在审核退款期限内，则必须是admin或minter
      } else {
        return !isGuest; // 过期，则只要不是guest就可以
      }
    }

    const refuseRefund_roleCheck = (): boolean => {
      if (isInReviewRefundDeadline) {
        return isAdmin; // 在审核退款期限内，则必须是admin或minter
      } else {
        return !isGuest; // 过期，则只要不是guest就可以
      }
    }

    const completeOrder_roleCheck = (): boolean => {
      if (isInRequestRefundDeadline) {
        return isBuyer; // 在请求退款期限内，则必须是buyer
      } else {
        return !isGuest; // 过期，则只要不是guest就可以
      }
    }

    const payConfiFee_deadlineCheck = (): boolean => {
      // 当前时间，必须距离deadline 30天以内
      return now > Number(box?.deadline) - 30 * 24 * 60 * 60;
    };

    const viewFileActive = (): boolean => {
      if (status === 'Storing' || status === 'Selling' || status === 'Auctioning') {
        return isMinter;
      } else if (status === 'InSecrecy' || status === 'Paid') {
        return isBuyer;
      } else if (status === 'Refunding') {
        return !isGuest;
      } else if (status === 'Published') {
        return !isGuest;
      } 
      return false;
    };


    switch (name) {
      case 'extendActive':
        return !isInBlackListed &&
          isMinter &&
          isInDeadline &&
          !successedList.includes('extendDeadline') && 
          modalStatus.ExtendDeadline === 'close';

      case 'sellActive':
        return !isInBlackListed &&
          status === 'Storing' &&
          sellOrAuction_roleCheck() &&
          !successedList.includes('sell') && 
          modalStatus.SellAuction === 'close';

      case 'auctionActive':
        return !isInBlackListed &&
          status === 'Storing' &&
          sellOrAuction_roleCheck() &&
          !successedList.includes('auction') &&
          modalStatus.SellAuction === 'close';

      case 'buyActive':
        return !isInBlackListed &&
          purchaseTimestamp !== 0 &&
          status === 'Selling' &&
          (isAdmin || isMinter || isBuyer) &&
          // isInDeadline &&
          !successedList.includes('buy');

      case 'bidActive':
        return !isInBlackListed ||
          status === 'Auctioning' &&
          (isAdmin || isMinter || isBuyer) &&
          isInDeadline &&
          !successedList.includes('bid');

      case 'requestRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          isInRequestRefundDeadline &&
          reviewDeadline === 0 &&
          status !== 'Refunding' &&
          isBuyer &&
          !successedList.includes('requestRefund');

      case 'cancelRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          isBuyer &&
          !successedList.includes('cancelRefund');

      case 'agreeRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          agreeRefund_roleCheck() &&
          !successedList.includes('agreeRefund');

      case 'refuseRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          refuseRefund_roleCheck() &&
          !successedList.includes('refuseRefund');

      case 'completeActive':
        return !isInBlackListed &&
          requestRefundDeadline === 0 &&
          reviewDeadline === 0 &&
          !refundPermit &&
          status === 'Paid' &&
          completeOrder_roleCheck() &&
          !successedList.includes('completeOrder');

      case 'payConfiFeeActive':
        return !isInBlackListed &&
          status === 'InSecrecy' &&
          payConfiFee_deadlineCheck() && 
          !isGuest &&
          !successedList.includes('payConfiFee');

      case 'publishActive':
        return !isInBlackListed &&
          publishActive_roleCheck() &&
          !successedList.includes('publishByMinter') &&
          !successedList.includes('publishByBuyer');

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
    boxInteraction,
    modalStatus,
    boxId
  ]);
};

