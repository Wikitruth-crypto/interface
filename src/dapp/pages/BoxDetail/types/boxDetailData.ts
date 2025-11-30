
/**
 * 转换后的 Box 数据（包含嵌套的关联数据）
 * 用于前端展示，包含 User 对象和 Token 对象
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
    biddersIds: string[];
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

export interface BoxRewardData {
    id: string;
    boxId: string;
    rewardType: string;
    token: string;
    rewardAmount: string;
}

export interface BoxUserOrderAmountData {
    id: string;
    userId: string;
    boxId: string;
    token: string;
    amount: string;
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
