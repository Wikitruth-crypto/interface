import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useMemo } from 'react';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useAccountStore } from '@/dapp/store/accountStore';
import { selectBox } from '@/dapp/store_sapphire/selectors';
import { useBoxContext } from '../contexts/BoxContext';

type ButtonDisabledNameType = 
'extendDisabled' | 
'sellDisabled' | 
'auctionDisabled' | 
'buyDisabled' | 
'bidDisabled' | 
'cancelRefundDisabled' | 
'agreeRefundDisabled' | 
'refuseRefundDisabled' | 
'completeDisabled' | 
'requestRefundDisabled' | 
'payConfiFeeDisabled' | 
'publishDisabled' | 
'viewFileDisabled';

export const useButtonDisabled = (name: ButtonDisabledNameType) => {
  const { boxId } = useBoxContext();
  const { userState, deadlineCheckState, modalStatus} = useBoxDetailStore(state => state);
  const box = useQueryStore(selectBox(boxId));
  const { address } = useWalletContext() || {};

  // 导入accountStore中记录的写入成功列表
  const boxInteraction = useAccountStore(state => state.getBoxInteractions(boxId));

  return useMemo(() => {
    if (!box) {
      return true;
    } 

    if (!address) {
      if (name === 'viewFileDisabled') {
        return false;
      }
      return true;
    }
    const successedList = boxInteraction.map(interaction => interaction.functionName) || [];

    const roles = userState.roles;
    const isOverDeadline = deadlineCheckState.isOverDeadline;
    const inRequestRefundPeriod = deadlineCheckState.inRequestRefundPeriod;
    const inReviewRefundPeriod = deadlineCheckState.inReviewRefundPeriod;

    const isInBlackListed = box.isInBlacklist || false;
    const status = box.status || 'Storing';

    const purchaseTimestamp = Number(box.purchaseTimestamp) || 0;
    const reviewDeadline = Number(box.reviewDeadline) || 0;
    const refundPermit = box.refundPermit || false;

    const isMinter = roles.includes('Minter');
    const isAdmin = roles.includes('Admin');
    const isBuyer = roles.includes('Buyer');
    const isUnRole = roles.length === 0;

    const buyer = box.buyer;
    const noBuyer = buyer === undefined || buyer === null;

    const publicInStatus = (): boolean => {
      if (status === 'Storing') {
        return isMinter;
      } else if (status === 'Selling' || status === 'Auctioning') {
        return noBuyer && isOverDeadline && (isMinter || isAdmin);
      } else if (status === 'InSecrecy') {
        return isBuyer || (isOverDeadline && (isMinter || isAdmin));
      }
      return false;
    }

    // 只计算需要的那个按钮的禁用状态
    switch (name) {
      case 'extendDisabled':
        console.log(
          '=== extendDisabled ===',
          `
          isMinter: ${isMinter},
          isOverDeadline: ${isOverDeadline},
          `
        );
        
        return isInBlackListed ||
          !isMinter ||
          isOverDeadline ||
          isUnRole ||
          (successedList.includes('extendDeadline') && modalStatus.ExtendDeadline === 'close');

      case 'sellDisabled':
        console.log(
          '=== sellDisabled ===',
          `
          status: ${status},
          isMinter: ${isMinter},
          isOverDeadline: ${isOverDeadline},
          `
        );
        
        return isInBlackListed ||
          status !== 'Storing' ||
          !isMinter ||
          isUnRole ||
          (successedList.includes('sell') && modalStatus.SellAuction === 'close');

      case 'auctionDisabled':
        console.log(
          '=== auctionDisabled ===',
          `
          status: ${status},
          isMinter: ${isMinter},
          isOverDeadline: ${isOverDeadline},
          `
        );
        
        return isInBlackListed ||
          status !== 'Storing' ||
          !isMinter ||
          isUnRole ||
          (successedList.includes('auction') && modalStatus.SellAuction === 'close');

      case 'buyDisabled':
        console.log(
          '=== buyDisabled ===',
          `
          purchaseTimestamp: ${purchaseTimestamp},
          status: ${status},
          isAdmin: ${isAdmin},
          isMinter: ${isMinter},
          isOverDeadline: ${isOverDeadline},
          `
        );
        
        return isInBlackListed ||
          purchaseTimestamp !== 0 ||
          status !== 'Selling' ||
          isAdmin ||
          isMinter ||
          isUnRole ||
          isOverDeadline ||
          (successedList.includes('buy'));

      case 'bidDisabled':
        console.log(
          '=== bidDisabled ===',
          `status: ${status},
          isAdmin: ${isAdmin},
          isMinter: ${isMinter},
          isBuyer: ${isBuyer},
          isOverDeadline: ${isOverDeadline},
          `
        );
        return isInBlackListed ||
          status !== 'Auctioning' ||
          isAdmin ||
          isMinter ||
          isBuyer ||
          isUnRole ||
          isOverDeadline ||
          (successedList.includes('bid'));

      case 'requestRefundDisabled':
        console.log(
          '=== requestRefundDisabled ===',
          `
          refundPermit: ${refundPermit},
          inRequestRefundPeriod: ${inRequestRefundPeriod},
          reviewDeadline: ${reviewDeadline},
          status: ${status},
          isBuyer: ${isBuyer},
          `
        );
        
        return isInBlackListed ||
          refundPermit ||
          !inRequestRefundPeriod ||
          reviewDeadline > 0 ||
          status !== 'Refunding' ||
          !isBuyer ||
          (successedList.includes('requestRefund') );

      case 'cancelRefundDisabled':
        console.log(
          '=== cancelRefundDisabled ===',
          `
          refundPermit: ${refundPermit},
          reviewDeadline: ${reviewDeadline},
          status: ${status},
          isBuyer: ${isBuyer},
          `
        );
        
        return isInBlackListed ||
          refundPermit ||
          reviewDeadline === 0 ||
          status !== 'Refunding' ||
          !isBuyer ||
          isUnRole ||
          successedList.includes('cancelRefund');

      case 'agreeRefundDisabled':
        console.log(
          '=== agreeRefundDisabled ===',
          `
          refundPermit: ${refundPermit},
          reviewDeadline: ${reviewDeadline},
          status: ${status},
          isAdmin: ${isAdmin},
          isMinter: ${isMinter},
          inReviewRefundPeriod: ${inReviewRefundPeriod},
          `
        );
        
        return isInBlackListed ||
          refundPermit ||
          reviewDeadline === 0 ||
          status !== 'Refunding' ||
          (!isAdmin && !isMinter && inReviewRefundPeriod) ||
          isUnRole ||
          successedList.includes('agreeRefund');

      case 'refuseRefundDisabled':
        console.log(
          '=== refuseRefundDisabled ===',
          `
          refundPermit: ${refundPermit},
          reviewDeadline: ${reviewDeadline},
          status: ${status},
          isAdmin: ${isAdmin},
          isMinter: ${isMinter},
          inReviewRefundPeriod: ${inReviewRefundPeriod},
          `
        );
        
        return isInBlackListed ||
          refundPermit ||
          reviewDeadline === 0 ||
          status !== 'Refunding' ||
          isMinter ||
          isUnRole ||
          (!isAdmin && inReviewRefundPeriod) ||
          successedList.includes('refuseRefund');

      case 'completeDisabled':
        console.log(
          '=== completeDisabled ===',
          `
          reviewDeadline: ${reviewDeadline},
          refundPermit: ${refundPermit},
          status: ${status},
          isBuyer: ${isBuyer},
          inRequestRefundPeriod: ${inRequestRefundPeriod},
          `
        );
        
        return isInBlackListed ||
          reviewDeadline !== 0 ||
          refundPermit ||
          status !== 'Refunding' ||
          (!isBuyer && inRequestRefundPeriod) ||
          isUnRole ||
          successedList.includes('completeOrder');

      case 'payConfiFeeDisabled':
        console.log(
          '=== payConfiFeeDisabled ===',
          `
          status: ${status},
          isBuyer: ${isBuyer},
          isOverDeadline: ${isOverDeadline},
          `
        );
        
        return isInBlackListed ||
          status !== 'InSecrecy' ||
          !isBuyer ||
          isOverDeadline ||
          isUnRole ||
          successedList.includes('payConfiFee');

      case 'publishDisabled':
        console.log(
          '=== publishDisabled ===',
          `
          status: ${status},
          `
        );
        return isInBlackListed ||
          !publicInStatus() ||
          isUnRole ||
          (successedList.includes('publishByMinter') || successedList.includes('publishByBuyer'));

      case 'viewFileDisabled':
        return isInBlackListed ||
          status === 'Published';

      default:
        return true;
    }
  }, [
    name, 
    box, 
    address,
    userState.roles, 
    deadlineCheckState.isOverDeadline,
    deadlineCheckState.inRequestRefundPeriod,
    deadlineCheckState.inReviewRefundPeriod,
    boxInteraction,
    modalStatus,
    boxId
  ]);
};
