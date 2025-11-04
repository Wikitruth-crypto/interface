import { useEffect } from 'react';
// import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
// import { BoxRoleType } from '@dapp/types/account';
import { useBoxDetailStore } from '../store/boxDetailStore';
// import { useMetadataStore } from '@/dapp/store/metadataStore';
import { usePeriodRate } from '@dapp/constants/periodRate';
import { useBoxContext } from '../contexts/BoxContext';

export const useCheckDeadline = (tokenId: string) => {
    const { updateDeadlineCheckState } = useBoxDetailStore();
    // const { address, isConnected} = useWalletContext() || {};
    const { box } = useBoxContext();
    // const metadata = useMetadataStore.getState();
    const periodRate = usePeriodRate();

    const checkDeadline = () => {
        // const box = useQueryStore.getState().boxes[tokenId];

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