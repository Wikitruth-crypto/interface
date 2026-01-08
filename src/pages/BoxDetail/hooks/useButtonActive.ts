import { useBoxDetailStore } from '../store/boxDetailStore';
import { useMemo,} from 'react';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { BoxInteractionRecord, useAccountStore, AccountStoreState } from '@dapp/store/accountStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { CHAIN_ID } from '@dapp/config/contractsConfig';
import { FunctionNameType } from '@dapp/types/typesDapp/contracts';

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

export const buttonActiveConfig: Record<ButtonActiveNameType, FunctionNameType[]>  = {
  extendActive: ['sell','auction','publishByMinter'],
  sellActive: ['sell','auction','publishByMinter'],
  auctionActive: ['sell','auction','publishByMinter'],
  buyActive: ['buy','bid','publishByMinter'],
  bidActive: ['buy','bid','publishByMinter'],
  requestRefundActive: ['requestRefund','completeOrder'],
  cancelRefundActive: ['cancelRefund','agreeRefund','refuseRefund'],
  agreeRefundActive: ['agreeRefund','cancelRefund','refuseRefund'],
  refuseRefundActive: ['agreeRefund','cancelRefund','refuseRefund'],
  completeActive: ['completeOrder','requestRefund','agreeRefund','refuseRefund'],
  payConfiFeeActive: ['payConfiFee','publishByBuyer'],
  publishActive: ['publishByMinter','publishByBuyer','sell','auction'],
  viewFileActive: ['viewFile'],
}

export const useButtonActive = (name: ButtonActiveNameType) => {
  const { boxId, box, deadlineCheckState } = useBoxDetailContext();
  const { userState, modalStatus } = useBoxDetailStore(state => state);
  const { address } = useWalletContext() || {};
  const normalizedAddress = address?.toLowerCase();
  const emptyInteractions: BoxInteractionRecord[] = [];



  const selector = useMemo(() => {
    if (!normalizedAddress || !CHAIN_ID) {
      return () => emptyInteractions;  // Always return the same array reference
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
    // const requestRefundDeadline = Number(box.requestRefundDeadline) || 0;
    const reviewDeadline = Number(box.reviewDeadline) || 0;
    const refundPermit = box.refundPermit || false;

    const buyerIsEmpty = !box.buyerId || box.buyerId === '';

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
        return isMinter ; // If not expired, must be minter
      } else {
        return !isGuest; // If expired, as long as it is not guest
      }
    }

    const agreeRefund_roleCheck = (): boolean => {
      if (isInReviewRefundDeadline) {
        return isAdmin || (isMinter ); // If within the review refund deadline, must be admin or minter
      } else {
        return !isGuest; // If expired, as long as it is not guest
      }
    }

    const refuseRefund_roleCheck = (): boolean => {
        return isAdmin; // Must be admin/DAO
    }

    const completeOrder_roleCheck = (): boolean => {
      if (isInRequestRefundDeadline) {
        return isBuyer ; // If within the request refund deadline, must be buyer
      } else {
        return !isGuest; // If expired, as long as it is not guest
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

    // Ensure wroteList does not contain all functionNames in the array
    const wroteListNotInclude = (functionNames: FunctionNameType[]): boolean => {
      return functionNames.every(functionName => !wroteList.includes(functionName));
    }


    switch (name) {
      case 'extendActive':
        return !isInBlackListed &&
          isMinter  &&
          isInDeadline &&
          deadlineCheckState?.isInExtendDeadlineTimeWindow &&
          wroteListNotInclude(buttonActiveConfig.extendActive)&&
          modalStatus.ExtendDeadline === 'close';

      case 'sellActive':
        return !isInBlackListed &&
          status === 'Storing' &&
          sellOrAuction_roleCheck() &&
          wroteListNotInclude(buttonActiveConfig.sellActive) &&
          modalStatus.SellAuction === 'close';

      case 'auctionActive':
        return !isInBlackListed &&
          status === 'Storing' &&
          sellOrAuction_roleCheck() &&
          wroteListNotInclude(buttonActiveConfig.auctionActive) &&
          modalStatus.SellAuction === 'close';

      case 'buyActive':
        return !isInBlackListed &&
          purchaseTimestamp === 0 &&
          buyerIsEmpty &&
          status === 'Selling' &&
          isOther  &&
          // isInDeadline &&
          wroteListNotInclude(buttonActiveConfig.buyActive);

      case 'bidActive':
        return !isInBlackListed &&
          status === 'Auctioning' &&
          (isOther || isBidder)  &&
          isInDeadline &&
          wroteListNotInclude(buttonActiveConfig.bidActive);

      case 'requestRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          isInRequestRefundDeadline &&
          reviewDeadline === 0 &&
          status === 'Paid' &&
          isBuyer  &&
          wroteListNotInclude(buttonActiveConfig.requestRefundActive);

      case 'cancelRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          isBuyer  &&
          wroteListNotInclude(buttonActiveConfig.cancelRefundActive);

      case 'agreeRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          agreeRefund_roleCheck() &&
          wroteListNotInclude(buttonActiveConfig.agreeRefundActive);

      case 'refuseRefundActive':
        return !isInBlackListed &&
          !refundPermit &&
          status === 'Refunding' &&
          refuseRefund_roleCheck() &&
          wroteListNotInclude(buttonActiveConfig.refuseRefundActive);

      case 'completeActive':
        return !isInBlackListed &&
          reviewDeadline === 0 &&
          !refundPermit &&
          status === 'Paid' &&
          completeOrder_roleCheck() &&
          wroteListNotInclude(buttonActiveConfig.completeActive);

      case 'payConfiFeeActive':
        return !isInBlackListed &&
          status === 'InSecrecy' &&
          deadlineCheckState?.isInExtendDeadlineTimeWindow &&
          !isGuest &&
          wroteListNotInclude(buttonActiveConfig.payConfiFeeActive);

      case 'publishActive':
        return !isInBlackListed &&
          publishActive_roleCheck() &&
          wroteListNotInclude(buttonActiveConfig.publishActive);

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
