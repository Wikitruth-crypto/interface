/**
 * TypeScript type definitions for TruthMarket Subgraph v1.7.7 Sapphire Beta
 * Generated from schemaNew.graphql
 *
 * This file contains all entity types, enums, and interfaces for the TruthMarket subgraph
 * Updated to support userId-based events and Oasis Sapphire network
 *
 * 架构说明：
 * - 存储类型（*Stored）：扁平化，只包含 ID 引用，实际存储在 store 中
 * - 访问类型（无后缀）：嵌套化，包含完整对象，由 selector 动态组装
 */

// ========== Enums ==========

export enum BoxStatus {
  Storing = "Storing",
  Selling = "Selling", 
  Auctioning = "Auctioning",
  Paid = "Paid",
  Refunding = "Refunding",
  InSecrecy = "InSecrecy",
  Published = "Published",
  Blacklisted = "Blacklisted"
}

export enum FundsType {
  Order = "Order",
  Refund = "Refund"
}

export enum ListedMode {
  Selling = "Selling",
  Auctioning = "Auctioning"
}

export enum PaymentType {
  Buy = "Buy",
  Bid = "Bid", 
  ConfidentialityFee = "ConfidentialityFee"
}

export enum RewardType {
  Minter = "Minter",
  Seller = "Seller",
  Total = "Total"
}

export enum TokenStatus {
  UnExisted = "UnExisted",
  Active = "Active",
  Inactive = "Inactive"
}

// ========== Base Types ==========

export interface BaseEntity {
  id: string;
}

export interface TimestampedEntity extends BaseEntity {
  timestamp: string;
  transactionHash: string;
  blockNumber: string;
}

// ========== Core Entities ==========

export interface GlobalState extends BaseEntity {
  totalSupply: string;
  storingSupply: string;
  sellingSupply: string;
  auctioningSupply: string;
  paidSupply: string;
  refundingSupply: string;
  inSecrecySupply: string;
  publishedSupply: string;
  blacklistedSupply: string;
}

export interface FundManagerState extends BaseEntity {
  // old name: tokenTotalAmounts
  tokenTotalRewardAmounts: TokenTotalRewardAmount[];
}

// ========== 存储类型（Stored Types - 扁平化） ==========

/**
 * User 存储类型
 * 只包含 ID 引用，实际存储在 store 中
 */
export interface UserStored extends BaseEntity {
  id: string; // UserId as string
  isBlacklisted: boolean;

  // Box relationships (只存储 ID)
  ownedBoxIds: string[];
  mintedBoxIds: string[];
  soldBoxIds: string[];
  boughtBoxIds: string[];
  bidBoxIds: string[];
  completedBoxIds: string[];
  publishedBoxIds: string[];

  // Timestamps
  lastMintTimestamp?: string;
  lastActivityTimestamp?: string;

  // Financial relationships (只存储 ID)
  allowanceIds: string[];
  paymentLogIds: string[];
  withdrawLogIds: string[];
  userOrderIds: string[];
  rewardIds: string[];
}

/**
 * User 访问类型
 * 包含完整的嵌套对象，由 selector 动态组装
 */
export interface User extends BaseEntity {
  id: string; // UserId as string
  isBlacklisted: boolean;

  // Box relationships (完整对象)
  ownedBoxes: Box[];
  mintedBoxes: Box[];
  soldBoxes: Box[];
  boughtBoxes: Box[];
  bidBoxes: Box[];
  completedBoxes: Box[];
  publishedBoxes: Box[];

  // Timestamps
  lastMintTimestamp?: string;
  lastActivityTimestamp?: string;

  // Financial relationships (完整对象)
  allowances: Allowance[];
  paymentLogs: Payment[];
  withdrawLogs: Withdraw[];
  userOrders: UserOrder[];
  rewards: UserReward[];
}

/**
 * Box 存储类型
 * 只包含 ID 引用，实际存储在 store 中
 */
export interface BoxStored extends BaseEntity {
  id: string; // boxId as string
  tokenId: string;
  tokenURI?: string;
  boxInfoCID?: string;
  privateKey?: string;
  price: string;
  deadline: string;

  // User relationships (只存储 ID)
  minterId: string;
  ownerId: string;
  publisherId?: string;

  createTimestamp: string;
  sellTimestamp?: string;
  publishTimestamp?: string;

  // State
  isInBlacklist: boolean;
  status: BoxStatus;

  // Exchange Data (只存储 ID)
  sellerId?: string;
  listedMode?: ListedMode;
  acceptedTokenId?: string;
  buyerId?: string;
  bidderIds: string[];
  paymentLogIds: string[];
  refundPermit?: boolean;
  completerId?: string;
  listedTimestamp?: string;
  purchaseTimestamp?: string;
  requestRefundDeadline?: string;
  reviewDeadline?: string;
  completeTimestamp?: string;

  // Order and Reward Data (只存储 ID)
  userOrderIds: string[];
  rewardAmountIds: string[];
}

/**
 * Box 访问类型
 * 包含完整的嵌套对象，由 selector 动态组装
 */
export interface Box extends BaseEntity {
  id: string; // boxId as string
  tokenId: string;
  tokenURI?: string;
  boxInfoCID?: string;
  privateKey?: string;
  price: string;
  deadline: string;

  // User relationships (完整对象)
  minter: User;
  owner: User;
  publisher?: User;

  createTimestamp: string;
  sellTimestamp?: string;
  publishTimestamp?: string;

  // State
  isInBlacklist: boolean;
  status: BoxStatus;

  // Exchange Data (完整对象)
  seller?: User;
  listedMode?: ListedMode;
  acceptedToken?: Token;
  buyer?: User;
  bidders: User[];
  paymentLogs: Payment[];
  refundPermit?: boolean;
  completer?: User;
  listedTimestamp?: string;
  purchaseTimestamp?: string;
  requestRefundDeadline?: string;
  reviewDeadline?: string;
  completeTimestamp?: string;

  // Order and Reward Data (完整对象)
  userOrders: UserOrder[];
  rewardAmounts: RewardAmount[];
}

/**
 * Token 存储类型
 * 只包含 ID 引用，实际存储在 store 中
 */
export interface TokenStored extends BaseEntity {
  id: string; // Token address
  name?: string;
  symbol?: string;
  decimals?: number;
  status: TokenStatus;

  // Relationships (只存储 ID)
  allowanceIds: string[];
  acceptedInBoxIds: string[];
  totalRewardAmountIds: string[];
  userOrderIds: string[];
  rewardAmountIds: string[];
  userRewardIds: string[];
  paymentIds: string[];
  withdrawIds: string[];
}

/**
 * Token 访问类型
 * 包含完整的嵌套对象，由 selector 动态组装
 */
export interface Token extends BaseEntity {
  id: string; // Token address
  name?: string;
  symbol?: string;
  decimals?: number;
  status: TokenStatus;

  // Relationships (完整对象)
  allowances: Allowance[];
  acceptedInBoxes: Box[];
  totalRewardAmounts: TokenTotalRewardAmount[];
  userOrders: UserOrder[];
  rewardAmounts: RewardAmount[];
  userRewards: UserReward[];
  payments: Payment[];
  withdraws: Withdraw[];
}

// ========== Relationship Entities ==========

/**
 * UserOrder 存储类型
 */
export interface UserOrderStored extends BaseEntity {
  id: string; // BoxId-UserId composite key
  boxId: string;
  userId: string;
  tokenId: string;
  amount: string;
  timestamp: string;
}

/**
 * UserOrder 访问类型
 */
export interface UserOrder extends BaseEntity {
  id: string; // BoxId-UserId composite key
  box: Box;
  user: User;
  token: Token;
  amount: string;
  timestamp: string;
}

/**
 * RewardAmount 存储类型
 */
export interface RewardAmountStored extends BaseEntity {
  id: string; // BoxId-RewardType composite key
  boxId: string;
  tokenId: string;
  amount: string;
  rewardType: RewardType;
  timestamp: string;
}

/**
 * RewardAmount 访问类型
 */
export interface RewardAmount extends BaseEntity {
  id: string; // BoxId-RewardType composite key
  box: Box;
  token: Token;
  amount: string;
  rewardType: RewardType;
  timestamp: string;
}

/**
 * UserReward 存储类型
 */
export interface UserRewardStored extends BaseEntity {
  id: string; // UserId-Token composite key
  userId: string;
  tokenId: string;
  totalRewards: string;
  helperRewards: string;
  lastWithdrawTimestamp?: string;
}

/**
 * UserReward 访问类型
 */
export interface UserReward extends BaseEntity {
  id: string; // UserId-Token composite key
  user: User;
  token: Token;
  totalRewards: string;
  helperRewards: string;
  lastWithdrawTimestamp?: string;
}

/**
 * TokenTotalRewardAmount 存储类型
 * old name: TokenTotalAmount
 */
export interface TokenTotalRewardAmountStored extends BaseEntity {
  id: string; // tokenAddress-amountType composite key
  tokenId: string;
  fundManagerId: string;
  amountType: FundsType;
  amount: string; // old name: totalAmount
}

/**
 * TokenTotalRewardAmount 访问类型
 * old name: TokenTotalAmount
 */
export interface TokenTotalRewardAmount extends BaseEntity {
  id: string; // tokenAddress-amountType composite key
  token: Token;
  fundManager: FundManagerState;
  amountType: FundsType;
  amount: string; // old name: totalAmount
}

/**
 * Allowance 存储类型
 */
export interface AllowanceStored extends BaseEntity {
  id: string; // tokenAddress-ownerUserId-spenderAddress composite key
  tokenId: string;
  ownerId: string;
  spender: string; // Address as hex string
  amount: string;
  lastUpdated: string;
}

/**
 * Allowance 访问类型
 */
export interface Allowance extends BaseEntity {
  id: string; // tokenAddress-ownerUserId-spenderAddress composite key
  token: Token;
  owner: User;
  spender: string; // Address as hex string
  amount: string;
  lastUpdated: string;
}

// ========== Transaction Entities ==========

/**
 * Payment 存储类型
 */
export interface PaymentStored extends TimestampedEntity {
  boxId: string;
  payerId: string;
  tokenId: string;
  amount: string;
  paymentType: PaymentType;
}

/**
 * Payment 访问类型
 */
export interface Payment extends TimestampedEntity {
  box: Box;
  payer: User;
  token: Token;
  amount: string;
  paymentType: PaymentType;
}

/**
 * Withdraw 存储类型
 */
export interface WithdrawStored extends TimestampedEntity {
  tokenId: string;
  boxList: string[]; // Array of box IDs
  recipientId: string;
  amount: string;
  withdrawType: FundsType;
}

/**
 * Withdraw 访问类型
 */
export interface Withdraw extends TimestampedEntity {
  token: Token;
  boxList: string[]; // Array of box IDs
  recipient: User;
  amount: string;
  withdrawType: FundsType;
}

// ========== Query Response Types ==========

export interface SubgraphResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  totalCount?: number;
}

// ========== Query Variables ==========

export interface QueryVariables {
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  where?: Record<string, any>;
}

export interface BoxQueryVariables extends QueryVariables {
  status?: BoxStatus;
  minter?: string;
  owner?: string;
  seller?: string;
  buyer?: string;
}

export interface UserQueryVariables extends QueryVariables {
  isBlacklisted?: boolean;
  hasBoxes?: boolean;
}

export interface PaymentQueryVariables extends QueryVariables {
  payer?: string;
  token?: string;
  paymentType?: PaymentType;
  minAmount?: string;
  maxAmount?: string;
}
