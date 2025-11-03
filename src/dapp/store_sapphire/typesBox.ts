/**
 * Box-specific TypeScript type definitions for TruthMarket v1.7.7 Sapphire Beta
 *
 * This file contains detailed Box-related types, interfaces, and utilities
 * for working with TruthBox NFTs in the frontend application
 */

import { BaseEntity, BoxStatus, ListedMode, PaymentType, RewardType } from './types';

// ========== Box Core Types ==========

export interface BoxCore {
    id: string; // boxId as string
    tokenId: string; // tokenId == id(boxId)
    tokenURI?: string;
    boxInfoCID?: string;
    price: string;
    deadline: string;
    createTimestamp: string;
    status: BoxStatus;
    isInBlacklist: boolean; // status == BoxStatus.blacklisted
}

export interface BoxUsers {
    minterId: string;
    ownerId: string;
    publisherId?: string;
    sellerId?: string;
    buyerId?: string;
    completerId?: string;
    bidderIds: string[];
}

export interface BoxTimestamps {
    createTimestamp: string;
    sellTimestamp?: string;
    publishTimestamp?: string;
    listedTimestamp?: string;
    purchaseTimestamp?: string;
    completeTimestamp?: string;
}

export interface BoxExchangeData {
    listedMode?: ListedMode;
    acceptedTokenAddress?: string;
    refundPermit?: boolean;
    requestRefundDeadline?: string;
    reviewDeadline?: string;
}

export interface BoxFinancialData {
    totalOrderAmount: string;
    totalRewardAmount: string;
    rewardsByType: Record<RewardType, string>;
    paymentCount: number;
    lastPaymentTimestamp?: string;
}

// ========== Complete Box Interface ==========

export interface BoxDetailed extends BoxCore {
    users: BoxUsers;
    timestamps: BoxTimestamps;
    exchangeData: BoxExchangeData;
    financialData: BoxFinancialData;
}

// ========== Box Event Data ==========

export interface BoxCreatedEvent {
    boxId: string;
    userId: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

export interface BoxStatusChangedEvent {
    boxId: string;
    status: BoxStatus;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

export interface BoxInfoChangedEvent {
    boxId: string;
    boxInfoCID: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

export interface BoxListedEvent {
    boxId: string;
    userId: string;
    acceptedToken: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

export interface BoxPurchasedEvent {
    boxId: string;
    userId: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

export interface BoxPublishedEvent {
    boxId: string;
    userId: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

// ========== Box Query Types ==========

export interface BoxFilters {
    status?: BoxStatus[];
    minterId?: string;
    ownerId?: string;
    sellerId?: string;
    buyerId?: string;
    isInBlacklist?: boolean;
    hasRewards?: boolean;
    priceRange?: {
        min?: string;
        max?: string;
    };
    deadlineRange?: {
        from?: string;
        to?: string;
    };
}

export interface BoxSortOptions {
    field: 'createTimestamp' | 'price' | 'deadline' | 'publishTimestamp';
    direction: 'asc' | 'desc';
}

export interface BoxQueryOptions {
    filters?: BoxFilters;
    sort?: BoxSortOptions;
    pagination?: {
        first?: number;
        skip?: number;
    };
}

// ========== Box Statistics ==========

export interface BoxStatistics {
    totalBoxes: number;
    boxesByStatus: Record<BoxStatus, number>;
    averagePrice: string;
    totalVolume: string;
    activeListings: number;
    completedSales: number;
}

export interface UserBoxStatistics {
    userId: string;
    mintedCount: number;
    ownedCount: number;
    soldCount: number;
    boughtCount: number;
    completedCount: number;
    totalEarnings: string;
    totalSpent: string;
}

// ========== Box Utility Types ==========

export interface BoxMetadata {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    external_url?: string;
}

export interface BoxPriceHistory {
    boxId: string;
    priceChanges: Array<{
        price: string;
        timestamp: string;
        transactionHash: string;
    }>;
}

export interface BoxActivityLog {
    boxId: string;
    activities: Array<{
        type: 'created' | 'listed' | 'purchased' | 'published' | 'status_changed';
        userId?: string;
        timestamp: string;
        transactionHash: string;
        details?: Record<string, any>;
    }>;
}

// ========== Box Validation ==========

export interface BoxValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface BoxCreationData {
    boxInfoCID: string;
    price: string;
    deadline: string;
    encryptedKey: string;
}

// ========== TruthBox Event Storage ==========

export type TruthBoxEventName =
    | 'BoxInfoChanged'
    | 'BoxCreated'
    | 'BoxStatusChanged'
    | 'PriceChanged'
    | 'DeadlineChanged'
    | 'PrivateKeyPublished';

export interface TruthBoxEventStored extends BaseEntity {
    eventType: TruthBoxEventName;
    boxId: string;
    tokenId: string;
    blockNumber: string;
    transactionHash?: string;
    timestamp: string;
    payload: Record<string, string | boolean | number>;
}

// All types are already exported with their interface declarations above
