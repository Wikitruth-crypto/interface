/**
 * Query Store for TruthMarket v1.7.7 Sapphire
 *
 * 状态管理组件 - 基于 Oasis Nexus 事件数据索引
 *
 * 主要变更：
 * 1. 移除 The Graph 依赖，使用 Oasis Nexus API
 * 2. 更新数据类型以匹配新的 schema.graphql
 * 3. 支持 userId 系统（替代直接使用地址）
 * 4. 新增 RewardAmount 和更新的 UserReward 结构
 * 5. 更新 BoxStatus 枚举（Paid, InSecrecy, Blacklisted）
 * 6. 更新 FundsType 枚举（Order, Refund）
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  GlobalState,
  FundManagerState,
  BoxStored,
  UserStored,
  TokenStored,
  PaymentStored,
  WithdrawStored,
  UserOrderStored,
  UserRewardStored,
  RewardAmountStored,
  TokenTotalRewardAmountStored,
  AllowanceStored,
} from './types';
import { BoxStatus } from './types';
import type { TruthBoxEventStored } from './typesBox';

// ========== 辅助类型定义 ==========

/**
 * 实体元数据
 * 用于存储查询时间戳、错误信息等
 */
interface EntityMeta {
  timestamp: number;
  error?: string;
}

/**
 * 实体状态（集合类型）
 * 用于存储多个实体及其元数据
 */
interface EntityState<T> {
  entities: { [id: string]: T };
  meta: { [id: string]: EntityMeta };
}

/**
 * 单例实体状态
 * 用于存储单个实体（如 GlobalState）及其元数据
 */
interface SingletonEntityState<T> {
  data: T;
  meta: EntityMeta;
}

// ========== 状态接口定义 ==========

/**
 * 查询状态接口
 * 存储从 Oasis Nexus 获取的所有事件数据
 *
 * 架构说明：
 * - 使用 EntityState 模式统一管理实体和元数据
 * - 存储的是扁平化的 *Stored 类型（只包含 ID 引用）
 * - 通过 selector 访问时会组装成嵌套的完整对象
 */
export interface QueryState {
  // ========== 全局状态（单例实体） ==========
  globalState: SingletonEntityState<GlobalState>;
  fundManagerState: SingletonEntityState<FundManagerState>;

  // ========== Token 相关 ==========
  tokens: EntityState<TokenStored>;
  tokenTotalRewardAmounts: EntityState<TokenTotalRewardAmountStored>;

  // ========== Box 相关 ==========
  boxes: EntityState<BoxStored>;

  // ========== User 相关 ==========
  users: EntityState<UserStored>;

  // ========== 交易记录 ==========
  payments: EntityState<PaymentStored>;
  withdraws: EntityState<WithdrawStored>;

  // ========== 订单和奖励 ==========
  userOrders: EntityState<UserOrderStored>;
  userRewards: EntityState<UserRewardStored>;
  rewardAmounts: EntityState<RewardAmountStored>;

  // ========== TruthBox 事件 ==========
  truthBoxEvents: EntityState<TruthBoxEventStored>;

  // ========== 授权记录 ==========
  allowances: EntityState<AllowanceStored>;

}

// ========== Actions 接口定义 ==========

/**
 * 状态修改方法接口
 * 提供更新各类数据的方法
 *
 * 注意：所有 update 方法接收的是扁平化的 *Stored 类型
 */
interface QueryStateActions {
  // ========== 全局状态 ==========
  updateGlobalState: (globalState: GlobalState) => void;
  updateFundManagerState: (fundManagerState: FundManagerState) => void;

  // ========== Token 相关 ==========
  updateTokens: (tokens: TokenStored[]) => void;
  updateToken: (token: TokenStored) => void;
  setTokenError: (id: string, error: string) => void;
  clearTokenError: (id: string) => void;

  updateTokenTotalRewardAmounts: (tokenTotalRewardAmounts: TokenTotalRewardAmountStored[]) => void;
  updateTokenTotalRewardAmount: (tokenTotalRewardAmount: TokenTotalRewardAmountStored) => void;

  // ========== Box 相关 ==========
  updateBoxes: (boxes: BoxStored[]) => void;
  updateBox: (box: BoxStored) => void;
  setBoxError: (id: string, error: string) => void;
  clearBoxError: (id: string) => void;
  // ========== User 相关 ==========
  updateUsers: (users: UserStored[]) => void;
  updateUser: (user: UserStored) => void;
  setUserError: (id: string, error: string) => void;
  clearUserError: (id: string) => void;
  // ========== 交易记录 ==========
  updatePayments: (payments: PaymentStored[]) => void;
  updatePayment: (payment: PaymentStored) => void;
  setPaymentError: (id: string, error: string) => void;
  clearPaymentError: (id: string) => void;

  updateWithdraws: (withdraws: WithdrawStored[]) => void;
  updateWithdraw: (withdraw: WithdrawStored) => void;
  setWithdrawError: (id: string, error: string) => void;
  clearWithdrawError: (id: string) => void;

  // ========== 订单和奖励 ==========
  updateUserOrders: (userOrders: UserOrderStored[]) => void;
  updateUserOrder: (userOrder: UserOrderStored) => void;
  setUserOrderError: (id: string, error: string) => void;
  clearUserOrderError: (id: string) => void;

  updateUserRewards: (userRewards: UserRewardStored[]) => void;
  updateUserReward: (userReward: UserRewardStored) => void;
  setUserRewardError: (id: string, error: string) => void;
  clearUserRewardError: (id: string) => void;

  updateRewardAmounts: (rewardAmounts: RewardAmountStored[]) => void;
  updateRewardAmount: (rewardAmount: RewardAmountStored) => void;
  setRewardAmountError: (id: string, error: string) => void;
  clearRewardAmountError: (id: string) => void;

  // ========== TruthBox 事件 ==========
  ingestTruthBoxEvents: (events: TruthBoxEventStored[]) => void;

  // ========== 授权记录 ==========
  updateAllowances: (allowances: AllowanceStored[]) => void;
  updateAllowance: (allowance: AllowanceStored) => void;
  setAllowanceError: (id: string, error: string) => void;
  clearAllowanceError: (id: string) => void;

  // ========== 重置方法 ==========
  resetAllData: () => void;
  resetBoxData: () => void;
  resetUserData: () => void;
}

// ========== Store 类型定义 ==========

type QueryStateStore = QueryState & QueryStateActions;

// ========== 初始状态 ==========

const initialState: QueryState = {
  // 全局状态（单例实体）
  globalState: {
    data: {
      id: 'global',
      totalSupply: '0',
      storingSupply: '0',
      sellingSupply: '0',
      auctioningSupply: '0',
      paidSupply: '0',
      refundingSupply: '0',
      inSecrecySupply: '0',
      publishedSupply: '0',
      blacklistedSupply: '0',
    },
    meta: {
      timestamp: 0,
    },
  },

  fundManagerState: {
    data: {
      id: 'fundManager',
      tokenTotalRewardAmounts: [],
    },
    meta: {
      timestamp: 0,
    },
  },

  // Token 相关
  tokens: {
    entities: {},
    meta: {},
  },

  tokenTotalRewardAmounts: {
    entities: {},
    meta: {},
  },

  // Box 相关
  boxes: {
    entities: {},
    meta: {},
  },

  // User 相关
  users: {
    entities: {},
    meta: {},
  },

  // 交易记录
  payments: {
    entities: {},
    meta: {},
  },

  withdraws: {
    entities: {},
    meta: {},
  },

  // 订单和奖励
  userOrders: {
    entities: {},
    meta: {},
  },

  userRewards: {
    entities: {},
    meta: {},
  },

  rewardAmounts: {
    entities: {},
    meta: {},
  },

  // TruthBox 事件
  truthBoxEvents: {
    entities: {},
    meta: {},
  },

  // 授权记录
  allowances: {
    entities: {},
    meta: {},
  },
};

const toBlockBigInt = (value: string | number | bigint | undefined): bigint => {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return BigInt(0);
    return BigInt(Math.max(0, Math.floor(value)));
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return BigInt(0);
    try {
      return BigInt(trimmed);
    } catch {
      return BigInt(0);
    }
  }
  return BigInt(0);
};

const BOX_STATUS_BY_INDEX: Record<number, BoxStatus> = {
  0: BoxStatus.Storing,
  1: BoxStatus.Selling,
  2: BoxStatus.Auctioning,
  3: BoxStatus.Paid,
  4: BoxStatus.Refunding,
  5: BoxStatus.InSecrecy,
  6: BoxStatus.Published,
  7: BoxStatus.Blacklisted,
};

const BOX_STATUS_VALUES = new Set(Object.values(BoxStatus));

const toStringValue = (value: string | number | boolean | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    return Math.trunc(value).toString();
  }
  return value ? 'true' : 'false';
};

const toBooleanValue = (value: string | number | boolean | undefined): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return undefined;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    return numeric !== 0;
  }
  return undefined;
};

const resolveStatusFromPayload = (payload: Record<string, string | boolean | number>): BoxStatus | undefined => {
  const rawStatus = payload.status;
  if (typeof rawStatus === 'string' && BOX_STATUS_VALUES.has(rawStatus as BoxStatus)) {
    return rawStatus as BoxStatus;
  }
  if (typeof rawStatus === 'number') {
    const candidate = BOX_STATUS_BY_INDEX[rawStatus];
    if (candidate) return candidate;
  }
  const statusIndexStr = toStringValue(payload.statusIndex);
  if (statusIndexStr) {
    const numeric = Number(statusIndexStr);
    if (Number.isFinite(numeric)) {
      const candidate = BOX_STATUS_BY_INDEX[numeric];
      if (candidate) return candidate;
    }
  }
  return undefined;
};

const createEmptyBoxStored = (boxId: string): BoxStored => ({
  id: boxId,
  tokenId: boxId,
  tokenURI: undefined,
  boxInfoCID: undefined,
  privateKey: undefined,
  price: '0',
  deadline: '0',
  minterId: '',
  ownerId: '',
  publisherId: undefined,
  createTimestamp: '',
  sellTimestamp: undefined,
  publishTimestamp: undefined,
  isInBlacklist: false,
  status: BoxStatus.Storing,
  sellerId: undefined,
  listedMode: undefined,
  acceptedTokenId: undefined,
  buyerId: undefined,
  bidderIds: [],
  paymentLogIds: [],
  refundPermit: undefined,
  completerId: undefined,
  listedTimestamp: undefined,
  purchaseTimestamp: undefined,
  requestRefundDeadline: undefined,
  reviewDeadline: undefined,
  completeTimestamp: undefined,
  userOrderIds: [],
  rewardAmountIds: [],
});

const applyTruthBoxEventToBox = (
  box: BoxStored,
  event: TruthBoxEventStored,
): { box: BoxStored; changed: boolean } => {
  const nextBox: BoxStored = { ...box };
  let changed = false;
  const payload = event.payload ?? {};

  if (nextBox.id !== event.boxId) {
    nextBox.id = event.boxId;
    changed = true;
  }
  if (nextBox.tokenId !== event.boxId) {
    nextBox.tokenId = event.boxId;
    changed = true;
  }

  switch (event.eventType) {
    case 'BoxCreated': {
      const userId = toStringValue(payload.userId);
      if (userId && nextBox.minterId !== userId) {
        nextBox.minterId = userId;
        changed = true;
      }
      if (userId && (!nextBox.ownerId || nextBox.ownerId !== userId)) {
        nextBox.ownerId = userId;
        changed = true;
      }
      if (event.timestamp && nextBox.createTimestamp !== event.timestamp) {
        nextBox.createTimestamp = event.timestamp;
        changed = true;
      }
      break;
    }
    case 'BoxInfoChanged': {
      const cid = toStringValue(payload.boxInfoCID);
      if (cid && nextBox.boxInfoCID !== cid) {
        nextBox.boxInfoCID = cid;
        changed = true;
      }
      break;
    }
    case 'BoxStatusChanged': {
      const statusValue = resolveStatusFromPayload(payload);
      if (statusValue && nextBox.status !== statusValue) {
        nextBox.status = statusValue;
        changed = true;
      }
      const blacklistFlag =
        toBooleanValue(payload.isInBlacklist) ?? (statusValue === BoxStatus.Blacklisted ? true : undefined);
      if (blacklistFlag !== undefined && nextBox.isInBlacklist !== blacklistFlag) {
        nextBox.isInBlacklist = blacklistFlag;
        changed = true;
      }
      break;
    }
    case 'PriceChanged': {
      const price = toStringValue(payload.price);
      if (price !== undefined && nextBox.price !== price) {
        nextBox.price = price;
        changed = true;
      }
      break;
    }
    case 'DeadlineChanged': {
      const deadline = toStringValue(payload.deadline);
      if (deadline !== undefined && nextBox.deadline !== deadline) {
        nextBox.deadline = deadline;
        changed = true;
      }
      break;
    }
    case 'PrivateKeyPublished': {
      const privateKey = toStringValue(payload.privateKey);
      if (privateKey && nextBox.privateKey !== privateKey) {
        nextBox.privateKey = privateKey;
        changed = true;
      }
      break;
    }
    default:
      break;
  }

  return { box: nextBox, changed };
};

// ========== Store 实现 ==========

export const useQueryStore = create<QueryStateStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // ========== 全局状态 ==========
      updateGlobalState: (globalState) => set(
        {
          globalState: {
            data: globalState,
            meta: { timestamp: Date.now() },
          }
        },
        false,
        "updateGlobalState"
      ),

      updateFundManagerState: (fundManagerState) => set(
        {
          fundManagerState: {
            data: fundManagerState,
            meta: { timestamp: Date.now() },
          }
        },
        false,
        "updateFundManagerState"
      ),

      // ========== Token 相关 ==========
      updateTokens: (tokens) => set((state) => {
        const now = Date.now();
        const newEntities = tokens.reduce((acc, token) => ({ ...acc, [token.id]: token }), {});
        const newMeta = tokens.reduce((acc, token) => ({ ...acc, [token.id]: { timestamp: now } }), {});

        return {
          tokens: {
            entities: { ...state.tokens.entities, ...newEntities },
            meta: { ...state.tokens.meta, ...newMeta },
          }
        };
      }, false, "updateTokens"),

      updateToken: (token) => set((state) => ({
        tokens: {
          entities: { ...state.tokens.entities, [token.id]: token },
          meta: { ...state.tokens.meta, [token.id]: { timestamp: Date.now() } },
        }
      }), false, "updateToken"),

      setTokenError: (id, error) => set((state) => ({
        tokens: {
          ...state.tokens,
          meta: {
            ...state.tokens.meta,
            [id]: { ...state.tokens.meta[id], error },
          },
        }
      }), false, "setTokenError"),

      clearTokenError: (id) => set((state) => ({
        tokens: {
          ...state.tokens,
          meta: {
            ...state.tokens.meta,
            [id]: { ...state.tokens.meta[id], error: undefined },
          },
        }
      }), false, "clearTokenError"),

      updateTokenTotalRewardAmounts: (tokenTotalRewardAmounts) => set((state) => {
        const now = Date.now();
        const newEntities = tokenTotalRewardAmounts.reduce((acc, tta) => ({ ...acc, [tta.id]: tta }), {});
        const newMeta = tokenTotalRewardAmounts.reduce((acc, tta) => ({ ...acc, [tta.id]: { timestamp: now } }), {});

        return {
          tokenTotalRewardAmounts: {
            entities: { ...state.tokenTotalRewardAmounts.entities, ...newEntities },
            meta: { ...state.tokenTotalRewardAmounts.meta, ...newMeta },
          }
        };
      }, false, "updateTokenTotalRewardAmounts"),

      updateTokenTotalRewardAmount: (tokenTotalRewardAmount) => set((state) => ({
        tokenTotalRewardAmounts: {
          entities: { ...state.tokenTotalRewardAmounts.entities, [tokenTotalRewardAmount.id]: tokenTotalRewardAmount },
          meta: { ...state.tokenTotalRewardAmounts.meta, [tokenTotalRewardAmount.id]: { timestamp: Date.now() } },
        }
      }), false, "updateTokenTotalRewardAmount"),

      // ========== Box 相关 ==========
      updateBoxes: (boxes) => set((state) => {
        const now = Date.now();
        const newEntities = boxes.reduce((acc, box) => ({ ...acc, [box.id]: box }), {});
        const newMeta = boxes.reduce((acc, box) => ({ ...acc, [box.id]: { timestamp: now } }), {});

        return {
          boxes: {
            entities: { ...state.boxes.entities, ...newEntities },
            meta: { ...state.boxes.meta, ...newMeta },
          }
        };
      }, false, "updateBoxes"),

      updateBox: (box) => set((state) => ({
        boxes: {
          entities: { ...state.boxes.entities, [box.id]: box },
          meta: { ...state.boxes.meta, [box.id]: { timestamp: Date.now() } },
        }
      }), false, "updateBox"),

      setBoxError: (id, error) => set((state) => ({
        boxes: {
          ...state.boxes,
          meta: {
            ...state.boxes.meta,
            [id]: { ...state.boxes.meta[id], error },
          },
        }
      }), false, "setBoxError"),

      clearBoxError: (id) => set((state) => ({
        boxes: {
          ...state.boxes,
          meta: {
            ...state.boxes.meta,
            [id]: { ...state.boxes.meta[id], error: undefined },
          },
        }
      }), false, "clearBoxError"),

      // ========== User 相关 ==========
      updateUsers: (users) => set((state) => {
        const now = Date.now();
        const newEntities = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
        const newMeta = users.reduce((acc, user) => ({ ...acc, [user.id]: { timestamp: now } }), {});

        return {
          users: {
            entities: { ...state.users.entities, ...newEntities },
            meta: { ...state.users.meta, ...newMeta },
          }
        };
      }, false, "updateUsers"),

      updateUser: (user) => set((state) => ({
        users: {
          entities: { ...state.users.entities, [user.id]: user },
          meta: { ...state.users.meta, [user.id]: { timestamp: Date.now() } },
        }
      }), false, "updateUser"),

      setUserError: (id, error) => set((state) => ({
        users: {
          ...state.users,
          meta: {
            ...state.users.meta,
            [id]: { ...state.users.meta[id], error },
          },
        }
      }), false, "setUserError"),

      clearUserError: (id) => set((state) => ({
        users: {
          ...state.users,
          meta: {
            ...state.users.meta,
            [id]: { ...state.users.meta[id], error: undefined },
          },
        }
      }), false, "clearUserError"),

      // ========== 交易记录 ==========
      updatePayments: (payments) => set((state) => {
        const now = Date.now();
        const newEntities = payments.reduce((acc, payment) => ({ ...acc, [payment.id]: payment }), {});
        const newMeta = payments.reduce((acc, payment) => ({ ...acc, [payment.id]: { timestamp: now } }), {});

        return {
          payments: {
            entities: { ...state.payments.entities, ...newEntities },
            meta: { ...state.payments.meta, ...newMeta },
          }
        };
      }, false, "updatePayments"),

      updatePayment: (payment) => set((state) => ({
        payments: {
          entities: { ...state.payments.entities, [payment.id]: payment },
          meta: { ...state.payments.meta, [payment.id]: { timestamp: Date.now() } },
        }
      }), false, "updatePayment"),

      setPaymentError: (id, error) => set((state) => ({
        payments: {
          ...state.payments,
          meta: {
            ...state.payments.meta,
            [id]: { ...state.payments.meta[id], error },
          },
        }
      }), false, "setPaymentError"),

      clearPaymentError: (id) => set((state) => ({
        payments: {
          ...state.payments,
          meta: {
            ...state.payments.meta,
            [id]: { ...state.payments.meta[id], error: undefined },
          },
        }
      }), false, "clearPaymentError"),

      updateWithdraws: (withdraws) => set((state) => {
        const now = Date.now();
        const newEntities = withdraws.reduce((acc, withdraw) => ({ ...acc, [withdraw.id]: withdraw }), {});
        const newMeta = withdraws.reduce((acc, withdraw) => ({ ...acc, [withdraw.id]: { timestamp: now } }), {});

        return {
          withdraws: {
            entities: { ...state.withdraws.entities, ...newEntities },
            meta: { ...state.withdraws.meta, ...newMeta },
          }
        };
      }, false, "updateWithdraws"),

      updateWithdraw: (withdraw) => set((state) => ({
        withdraws: {
          entities: { ...state.withdraws.entities, [withdraw.id]: withdraw },
          meta: { ...state.withdraws.meta, [withdraw.id]: { timestamp: Date.now() } },
        }
      }), false, "updateWithdraw"),

      setWithdrawError: (id, error) => set((state) => ({
        withdraws: {
          ...state.withdraws,
          meta: {
            ...state.withdraws.meta,
            [id]: { ...state.withdraws.meta[id], error },
          },
        }
      }), false, "setWithdrawError"),

      clearWithdrawError: (id) => set((state) => ({
        withdraws: {
          ...state.withdraws,
          meta: {
            ...state.withdraws.meta,
            [id]: { ...state.withdraws.meta[id], error: undefined },
          },
        }
      }), false, "clearWithdrawError"),

      // ========== 订单和奖励 ==========
      updateUserOrders: (userOrders) => set((state) => {
        const now = Date.now();
        const newEntities = userOrders.reduce((acc, userOrder) => ({ ...acc, [userOrder.id]: userOrder }), {});
        const newMeta = userOrders.reduce((acc, userOrder) => ({ ...acc, [userOrder.id]: { timestamp: now } }), {});

        return {
          userOrders: {
            entities: { ...state.userOrders.entities, ...newEntities },
            meta: { ...state.userOrders.meta, ...newMeta },
          }
        };
      }, false, "updateUserOrders"),

      updateUserOrder: (userOrder) => set((state) => ({
        userOrders: {
          entities: { ...state.userOrders.entities, [userOrder.id]: userOrder },
          meta: { ...state.userOrders.meta, [userOrder.id]: { timestamp: Date.now() } },
        }
      }), false, "updateUserOrder"),

      setUserOrderError: (id, error) => set((state) => ({
        userOrders: {
          ...state.userOrders,
          meta: {
            ...state.userOrders.meta,
            [id]: { ...state.userOrders.meta[id], error },
          },
        }
      }), false, "setUserOrderError"),

      clearUserOrderError: (id) => set((state) => ({
        userOrders: {
          ...state.userOrders,
          meta: {
            ...state.userOrders.meta,
            [id]: { ...state.userOrders.meta[id], error: undefined },
          },
        }
      }), false, "clearUserOrderError"),

      updateUserRewards: (userRewards) => set((state) => {
        const now = Date.now();
        const newEntities = userRewards.reduce((acc, userReward) => ({ ...acc, [userReward.id]: userReward }), {});
        const newMeta = userRewards.reduce((acc, userReward) => ({ ...acc, [userReward.id]: { timestamp: now } }), {});

        return {
          userRewards: {
            entities: { ...state.userRewards.entities, ...newEntities },
            meta: { ...state.userRewards.meta, ...newMeta },
          }
        };
      }, false, "updateUserRewards"),

      updateUserReward: (userReward) => set((state) => ({
        userRewards: {
          entities: { ...state.userRewards.entities, [userReward.id]: userReward },
          meta: { ...state.userRewards.meta, [userReward.id]: { timestamp: Date.now() } },
        }
      }), false, "updateUserReward"),

      setUserRewardError: (id, error) => set((state) => ({
        userRewards: {
          ...state.userRewards,
          meta: {
            ...state.userRewards.meta,
            [id]: { ...state.userRewards.meta[id], error },
          },
        }
      }), false, "setUserRewardError"),

      clearUserRewardError: (id) => set((state) => ({
        userRewards: {
          ...state.userRewards,
          meta: {
            ...state.userRewards.meta,
            [id]: { ...state.userRewards.meta[id], error: undefined },
          },
        }
      }), false, "clearUserRewardError"),

      updateRewardAmounts: (rewardAmounts) => set((state) => {
        const now = Date.now();
        const newEntities = rewardAmounts.reduce((acc, ra) => ({ ...acc, [ra.id]: ra }), {});
        const newMeta = rewardAmounts.reduce((acc, ra) => ({ ...acc, [ra.id]: { timestamp: now } }), {});

        return {
          rewardAmounts: {
            entities: { ...state.rewardAmounts.entities, ...newEntities },
            meta: { ...state.rewardAmounts.meta, ...newMeta },
          }
        };
      }, false, "updateRewardAmounts"),

      updateRewardAmount: (rewardAmount) => set((state) => ({
        rewardAmounts: {
          entities: { ...state.rewardAmounts.entities, [rewardAmount.id]: rewardAmount },
          meta: { ...state.rewardAmounts.meta, [rewardAmount.id]: { timestamp: Date.now() } },
        }
      }), false, "updateRewardAmount"),

      setRewardAmountError: (id, error) => set((state) => ({
        rewardAmounts: {
          ...state.rewardAmounts,
          meta: {
            ...state.rewardAmounts.meta,
            [id]: { ...state.rewardAmounts.meta[id], error },
          },
        }
      }), false, "setRewardAmountError"),

      clearRewardAmountError: (id) => set((state) => ({
        rewardAmounts: {
          ...state.rewardAmounts,
          meta: {
            ...state.rewardAmounts.meta,
            [id]: { ...state.rewardAmounts.meta[id], error: undefined },
          },
        }
      }), false, "clearRewardAmountError"),

      ingestTruthBoxEvents: (events) => {
        if (!events?.length) {
          return;
        }
        set((state) => {
          const now = Date.now();
          const truthEntities = { ...state.truthBoxEvents.entities };
          const truthMeta = { ...state.truthBoxEvents.meta };
          const boxesEntities = { ...state.boxes.entities };
          const boxesMeta = { ...state.boxes.meta };

          let truthChanged = false;
          let boxesChanged = false;

          for (const event of events) {
            if (!event?.id) continue;

            const existingEntry = truthEntities[event.id];
            const currentBlock = existingEntry ? toBlockBigInt(existingEntry.blockNumber) : BigInt(0);
            const nextBlock = toBlockBigInt(event.blockNumber);
            if (nextBlock <= currentBlock) {
              continue;
            }

            truthEntities[event.id] = event;
            truthMeta[event.id] = { timestamp: now };
            truthChanged = true;

            const boxId = event.boxId;
            const baseBox = boxesEntities[boxId]
              ? { ...boxesEntities[boxId] }
              : createEmptyBoxStored(boxId);
            const { box: updatedBox, changed } = applyTruthBoxEventToBox(baseBox, event);
            if (changed || !boxesEntities[boxId]) {
              boxesEntities[boxId] = updatedBox;
              boxesMeta[boxId] = { timestamp: now };
              boxesChanged = true;
            }
          }

          if (!truthChanged && !boxesChanged) {
            return state;
          }

          return {
            ...(truthChanged
              ? {
                  truthBoxEvents: {
                    entities: truthEntities,
                    meta: truthMeta,
                  },
                }
              : {}),
            ...(boxesChanged
              ? {
                  boxes: {
                    entities: boxesEntities,
                    meta: boxesMeta,
                  },
                }
              : {}),
          };
        }, false, "ingestTruthBoxEvents");
      },

      // ========== 授权记录 ==========
      updateAllowances: (allowances) => set((state) => {
        const now = Date.now();
        const newEntities = allowances.reduce((acc, allowance) => ({ ...acc, [allowance.id]: allowance }), {});
        const newMeta = allowances.reduce((acc, allowance) => ({ ...acc, [allowance.id]: { timestamp: now } }), {});

        return {
          allowances: {
            entities: { ...state.allowances.entities, ...newEntities },
            meta: { ...state.allowances.meta, ...newMeta },
          }
        };
      }, false, "updateAllowances"),

      updateAllowance: (allowance) => set((state) => ({
        allowances: {
          entities: { ...state.allowances.entities, [allowance.id]: allowance },
          meta: { ...state.allowances.meta, [allowance.id]: { timestamp: Date.now() } },
        }
      }), false, "updateAllowance"),

      setAllowanceError: (id, error) => set((state) => ({
        allowances: {
          ...state.allowances,
          meta: {
            ...state.allowances.meta,
            [id]: { ...state.allowances.meta[id], error },
          },
        }
      }), false, "setAllowanceError"),

      clearAllowanceError: (id) => set((state) => ({
        allowances: {
          ...state.allowances,
          meta: {
            ...state.allowances.meta,
            [id]: { ...state.allowances.meta[id], error: undefined },
          },
        }
      }), false, "clearAllowanceError"),

      // ========== 重置方法 ==========
      resetAllData: () => set(
        initialState,
        false,
        "resetAllData"
      ),

      resetBoxData: () => set(
        {
          boxes: {
            entities: {},
            meta: {},
          },
        },
        false,
        "resetBoxData"
      ),

      resetUserData: () => set(
        {
          users: {
            entities: {},
            meta: {},
          },
        },
        false,
        "resetUserData"
      ),
    }),
    { name: 'query-store-sapphire' }
  )
);

// ========== 导出类型 ==========

export type { EntityMeta, EntityState, SingletonEntityState };
