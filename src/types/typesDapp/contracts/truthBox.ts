
export interface CreateArgsType{
    to_: string;
    tokenCID_: string;
    boxInfoCID_: string;
    key_: string;
    price_: number;
}

export interface CreateAndPublishArgsType{
    to_: string;
    tokenCID_: string;
    boxInfoCID_: string;
    key_: string;
}

export type FunctionNameType_TruthBox = 
'create' |
'createAndPublish' |
'publishByMinter' | 
'publishByBuyer' | 
'payConfiFee' |
'addBoxToBlacklist' |
'extendDeadline';


export const boxStatus = [
    'Storing',
    'Selling',
    'Auctioning',
    'Paid',
    'Refunding',
    'InSecrecy',
    'Published',
    'Blacklisted',
] as const;

export type BoxStatus = typeof boxStatus[number];

// get
export interface BoxBasicDataType {
    price: number;
    deadline: number;
    status: BoxStatus;
}

//----

export interface BoxUserDataType {
    minter:string,
    owner:string,
    seller:string,
    buyer:string,
    bidders:string[],
    completer:string,
    // -----
    hasBuyer: boolean,
    hasSeller: boolean,
    hasCompleter: boolean,
    hasBidders: boolean,
}


// NftDetail_two
export interface BoxDetailDataType {
    // deliveryTimestamp:number, // Deleted in new version
    refundRequestTimestamp: number,
    purchaseTimestamp: number,
    overDeadline:boolean,
    isInBlacklist:boolean,
    refundPermit: boolean,
    inRefundDeadline: boolean,
    inReviewDeadline: boolean,
    
    owner:string,
    buyer:string,
    noBuyer: boolean,
    fileUri:string,
}

