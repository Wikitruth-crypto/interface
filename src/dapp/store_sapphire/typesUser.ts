/**
 * User-specific TypeScript type definitions for TruthMarket v1.7.7 Sapphire Beta
 *
 * This file contains detailed User-related types, interfaces, and utilities
 * for working with userId-based user management in the frontend application
 */

import { FundsType, PaymentType, RewardType } from './types';

// ========== User Core Types ==========

export interface UserCore {
    id: string; // UserId as string
    isBlacklisted: boolean;
    lastMintTimestamp?: string;
    lastActivityTimestamp?: string;
}

export interface UserStatistics {
    userId: string;

    // Box statistics
    mintedBoxesCount: number;
    ownedBoxesCount: number;
    soldBoxesCount: number;
    boughtBoxesCount: number;
    completedBoxesCount: number;
    publishedBoxesCount: number;
    bidBoxesCount: number;

    // Financial statistics
    totalEarnings: string;
    totalSpent: string;
    totalRewards: string;
    totalOrders: string;

    // Activity statistics
    totalTransactions: number;
    lastTransactionTimestamp?: string;
    joinTimestamp: string;
}

export interface UserFinancialSummary {
    userId: string;

    // Balances by token
    tokenBalances: Array<{
        tokenAddress: string;
        tokenSymbol: string;
        balance: string;
        rewards: string;
        orders: string;
    }>;

    // Total values
    totalPortfolioValue: string;
    totalRewardsValue: string;
    totalOrdersValue: string;

    // Recent activity
    recentPayments: UserPaymentSummary[];
    recentWithdrawals: UserWithdrawalSummary[];
}

// ========== User Activity Types ==========

export interface UserActivity {
    id: string;
    userId: string;
    type: UserActivityType;
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
    details: Record<string, any>;
}

export enum UserActivityType {
    BoxCreated = "BoxCreated",
    BoxListed = "BoxListed",
    BoxPurchased = "BoxPurchased",
    BoxPublished = "BoxPublished",
    BidPlaced = "BidPlaced",
    PaymentMade = "PaymentMade",
    RewardsWithdrawn = "RewardsWithdrawn",
    OrderWithdrawn = "OrderWithdrawn",
    CompleterAssigned = "CompleterAssigned",
    Blacklisted = "Blacklisted",
    BlacklistRemoved = "BlacklistRemoved"
}

export interface UserPaymentSummary {
    id: string;
    boxId: string;
    tokenAddress: string;
    amount: string;
    paymentType: PaymentType;
    timestamp: string;
    transactionHash: string;
}

export interface UserWithdrawalSummary {
    id: string;
    tokenAddress: string;
    amount: string;
    withdrawType: FundsType;
    boxIds: string[];
    timestamp: string;
    transactionHash: string;
}

export interface UserRewardSummary {
    userId: string;
    tokenAddress: string;
    totalRewards: string;
    helperRewards: string;
    availableRewards: string;
    lastWithdrawTimestamp?: string;
    rewardsByType: Record<RewardType, string>;
}

// ========== User Event Types ==========

export interface UserBlacklistEvent {
    userId: string;
    userAddress: string; // Original address from event
    status: boolean; // true = blacklisted, false = removed from blacklist
    timestamp: string;
    transactionHash: string;
    blockNumber: string;
}

// ========== User Query Types ==========

export interface UserFilters {
    isBlacklisted?: boolean;
    hasBoxes?: boolean;
    hasRewards?: boolean;
    hasOrders?: boolean;
    minActivity?: number;
    joinedAfter?: string;
    joinedBefore?: string;
}

export interface UserSortOptions {
    field: 'lastActivityTimestamp' | 'joinTimestamp' | 'totalEarnings' | 'mintedBoxesCount';
    direction: 'asc' | 'desc';
}

export interface UserQueryOptions {
    filters?: UserFilters;
    sort?: UserSortOptions;
    pagination?: {
        first?: number;
        skip?: number;
    };
}

// ========== User Relationship Types ==========

export interface UserBoxRelationship {
    userId: string;
    boxId: string;
    relationshipType: UserBoxRelationshipType;
    timestamp: string;
    isActive: boolean;
}

export enum UserBoxRelationshipType {
    Minter = "Minter",
    Owner = "Owner",
    Seller = "Seller",
    Buyer = "Buyer",
    Bidder = "Bidder",
    Completer = "Completer",
    Publisher = "Publisher"
}

export interface UserTokenInteraction {
    userId: string;
    tokenAddress: string;
    interactionType: UserTokenInteractionType;
    amount: string;
    timestamp: string;
    transactionHash: string;
    relatedBoxId?: string;
}

export enum UserTokenInteractionType {
    Payment = "Payment",
    Withdrawal = "Withdrawal",
    RewardReceived = "RewardReceived",
    RewardWithdrawn = "RewardWithdrawn",
    OrderPlaced = "OrderPlaced",
    OrderWithdrawn = "OrderWithdrawn"
}

// ========== User Validation Types ==========

export interface UserValidationResult {
    isValid: boolean;
    canMint: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    restrictions: string[];
    warnings: string[];
}

export interface UserPermissions {
    userId: string;
    canMintBoxes: boolean;
    canListBoxes: boolean;
    canBuyBoxes: boolean;
    canBidOnBoxes: boolean;
    canCompleteBoxes: boolean;
    canWithdrawFunds: boolean;
    canWithdrawRewards: boolean;
    isBlacklisted: boolean;
    lastPermissionCheck: string;
}

// ========== User Analytics Types ==========

export interface UserAnalytics {
    userId: string;

    // Performance metrics
    successfulSales: number;
    successfulPurchases: number;
    completionRate: number; // Percentage of boxes completed
    averageBoxPrice: string;
    averageTimeToSale: number; // In seconds

    // Engagement metrics
    totalActiveDays: number;
    averageSessionLength: number;
    lastActiveDate: string;

    // Financial metrics
    profitLoss: string;
    roi: number; // Return on investment percentage
    totalVolume: string;

    // Reputation metrics
    reputationScore: number;
    trustLevel: UserTrustLevel;
}

export enum UserTrustLevel {
    New = "New",
    Bronze = "Bronze",
    Silver = "Silver",
    Gold = "Gold",
    Platinum = "Platinum",
    Blacklisted = "Blacklisted"
}

// ========== User Preferences Types ==========

export interface UserPreferences {
    userId: string;

    // Display preferences
    preferredCurrency: string;
    language: string;
    timezone: string;

    // Notification preferences
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationTypes: UserNotificationType[];

    // Trading preferences
    defaultListingDuration: number; // In seconds
    autoAcceptBids: boolean;
    preferredTokens: string[]; // Token addresses

    // Privacy preferences
    showActivity: boolean;
    showStatistics: boolean;
    allowDirectMessages: boolean;
}

export enum UserNotificationType {
    BoxSold = "BoxSold",
    BoxPurchased = "BoxPurchased",
    BidReceived = "BidReceived",
    BidAccepted = "BidAccepted",
    BoxCompleted = "BoxCompleted",
    RewardsReceived = "RewardsReceived",
    PaymentReceived = "PaymentReceived",
    RefundProcessed = "RefundProcessed"
}