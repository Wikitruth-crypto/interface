import { useEffect } from 'react';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { usePeriodRate } from '@dapp/constants/periodRate';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

export const useCheckDeadline = () => {
    const { updateDeadlineCheckState } = useBoxDetailStore();
    const { box } = useBoxDetailContext();
    const periodRate = usePeriodRate();

    const checkDeadline = () => {

        if (!box || !periodRate) {
            return;
        }

        const {
            deadline,
            requestRefundDeadline,
            reviewDeadline,
        } = box;

        let isOverDeadline = false;
        let inRequestRefundPeriod = true;
        let inReviewRefundPeriod = true;

        const now = Math.floor(Date.now()/1000);

        if (deadline) {
            isOverDeadline = Number(deadline) < now;
        }
        if (requestRefundDeadline) {
            inRequestRefundPeriod = Number(requestRefundDeadline) > now;
        }
        if (reviewDeadline) {
            inReviewRefundPeriod = Number(reviewDeadline) > now;
        }

        updateDeadlineCheckState({
            inRequestRefundPeriod: inRequestRefundPeriod,
            requestRefundDeadline: Number(requestRefundDeadline),
            inReviewRefundPeriod: inReviewRefundPeriod,
            reviewRefundDeadline: Number(reviewDeadline),
            isOverDeadline: isOverDeadline,
        });
    }

    useEffect(() => {
        checkDeadline();
    }, [box, periodRate]);

    return {};
};