// import type { BoxDetailData } from '../types/boxDetailData';

// export const useCheckDeadline = (box: BoxDetailData) => {

//     if (!box) {
//         return;
//     }

//     const {
//         deadline,
//         requestRefundDeadline,
//         reviewDeadline,
//     } = box;

//     let isInDeadline = false;
//     let isInRequestRefundPeriod = true;
//     let isInReviewRefundPeriod = true;

//     const now = Math.floor(Date.now() / 1000);

//     if (deadline) {
//         isInDeadline = Number(deadline) > now;
//     }
//     if (requestRefundDeadline) {
//         isInRequestRefundPeriod = Number(requestRefundDeadline) > now;
//     }
//     if (reviewDeadline) {
//         isInReviewRefundPeriod = Number(reviewDeadline) > now;
//     }

//     return {
//         isInRequestRefundPeriod: isInRequestRefundPeriod,
//         isInReviewRefundPeriod: isInReviewRefundPeriod,
//         isInDeadline: isInDeadline,
//     };
// }
