import type { BoxDetailData, DeadlineCheckStateType } from '../types/boxDetailData';
import { PROTOCOL_CONSTANTS } from '@dapp/config/contractsConfig';

export const useCheckDeadline = (box: BoxDetailData): DeadlineCheckStateType | undefined => {

    if (!box) {
        return undefined;
    }

    const {
        deadline,
        requestRefundDeadline,
        reviewDeadline,
    } = box;

    let isInDeadline = false;
    let isInRequestRefundDeadline = true;
    let isInReviewRefundDeadline = true;

    const now = Math.floor(Date.now() / 1000);

    if (deadline) {
        isInDeadline = Number(deadline) > now;
    }
    if (requestRefundDeadline) {
        isInRequestRefundDeadline = Number(requestRefundDeadline) > now;
    }
    if (reviewDeadline) {
        isInReviewRefundDeadline = Number(reviewDeadline) > now;
    }

    const isInExtendDeadlineTimeWindow = now > Number(deadline) - PROTOCOL_CONSTANTS.deadlineExtensionWindow;

    return {
        isInRequestRefundDeadline: isInRequestRefundDeadline,
        isInReviewRefundDeadline: isInReviewRefundDeadline,
        isInDeadline: isInDeadline,
        isInExtendDeadlineTimeWindow: isInExtendDeadlineTimeWindow,
    };
}
