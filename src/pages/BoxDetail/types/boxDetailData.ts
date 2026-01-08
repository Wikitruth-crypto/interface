
/**
 * Converted Box data (contains nested related data)
 * Used for front-end display, containing User objects and Token objects
 */
export interface BoxDetailData {
    id: string;
    tokenId: string;
    tokenURI?: string | null;
    boxInfoCID?: string | null;
    privateKey?: string | null;
    price: string;
    deadline: string;
    minterId: string;
    ownerAddress: string;
    publisherId?: string;
    sellerId?: string;
    buyerId?: string;
    completerId?: string;
    acceptedToken?: string;
    status: string;
    listedMode?: string | null;
    refundPermit?: boolean | null;
    isInBlacklist?: boolean;
    createTimestamp: string;
    sellTimestamp?: string | null;
    publishTimestamp?: string | null;
    listedTimestamp?: string | null;
    purchaseTimestamp?: string | null;
    completeTimestamp?: string | null;
    requestRefundDeadline?: string | null;
    reviewDeadline?: string | null;
}

export interface DeadlineCheckStateType {
    isInRequestRefundDeadline: boolean,
    isInReviewRefundDeadline: boolean,
    isInDeadline: boolean,
    isInExtendDeadlineTimeWindow: boolean,
}

// const initialDeadlineCheckState: DeadlineCheckStateType = {
//     isInRequestRefundDeadline: true,
//     isInReviewRefundDeadline: true,
//     isInDeadline: false,
//     completeOrderDeadline: 0,
// }
