

export interface DeadlineCheckStateType {
    inRequestRefundPeriod: boolean,
    inReviewRefundPeriod: boolean,
    isOverDeadline: boolean,
    // 卖家发货截止时间
    requestRefundDeadline: number,
    reviewRefundDeadline: number,
    completeOrderDeadline: number,
}

export type ExchangeRoleType = 'Minter' | 'Office DAO' | 'Buyer';
export type ViewFileRoleType = 'Minter' | 'Buyer';

export type ModalType = 
'SellAuction' | 
'ExtendDeadline' |
'ViewFile';


// // Key 值为 ModalType 类型

// export interface ModalStatusType {
//     [key in ModalType]: 'open' | 'close';
// }
