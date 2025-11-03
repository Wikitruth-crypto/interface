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
export interface QueryStatus {

  boxWaitUpdates: string[]; // 等待更新的 Box ID 列表
  userWaitUpdates: string[]; // 等待更新的 User ID 列表
  allowanceWaitUpdates: string[]; // 等待更新的 Allowance ID 列表
  // ========== 查询状态 ==========
  isLoading_truthBox: boolean;
  lastSyncTimestamp: number;
  syncErrors: string[];
}

// ========== Actions 接口定义 ==========

/**
 * 状态修改方法接口
 * 提供更新各类数据的方法
 *
 * 注意：所有 update 方法接收的是扁平化的 *Stored 类型
 */
interface QueryStatusActions {

  addBoxWaitUpdates: (id: string) => void;
  removeBoxWaitUpdates: (id: string) => void;

  addUserWaitUpdates: (id: string) => void;
  removeUserWaitUpdates: (id: string) => void;

  addAllowanceWaitUpdates: (id: string) => void;
  removeAllowanceWaitUpdates: (id: string) => void;

  // ========== 查询状态 ==========
  setIsLoading_truthBox: (isLoading: boolean) => void;
  updateLastSyncTimestamp: () => void;
  addSyncError: (error: string) => void;
  clearSyncErrors: () => void;

  // ========== 重置方法 ==========
  resetAllData: () => void;
}

// ========== Store 类型定义 ==========

type QueryStatusStore = QueryStatus & QueryStatusActions;

// ========== 初始状态 ==========

const initialState: QueryStatus = {

  boxWaitUpdates: [],

  userWaitUpdates: [],

  allowanceWaitUpdates: [],

  // 查询状态
  isLoading_truthBox: true, // 初始为true，防止初始化时的问题。
  lastSyncTimestamp: 0,
  syncErrors: [],
};


// ========== Store 实现 ==========

export const useQueryStatus = create<QueryStatusStore>()(
  devtools(
    (set) => ({
      ...initialState,

      addBoxWaitUpdates: (id) => set((state) => ({
        boxWaitUpdates: state.boxWaitUpdates.includes(id)
          ? state.boxWaitUpdates
          : [...state.boxWaitUpdates, id]
      }), false, "addBoxWaitUpdates"),

      removeBoxWaitUpdates: (id) => set((state) => ({
        boxWaitUpdates: state.boxWaitUpdates.filter(boxId => boxId !== id)
      }), false, "removeBoxWaitUpdates"),


      addUserWaitUpdates: (id) => set((state) => ({
        userWaitUpdates: state.userWaitUpdates.includes(id)
          ? state.userWaitUpdates
          : [...state.userWaitUpdates, id]
      }), false, "addUserWaitUpdates"),

      removeUserWaitUpdates: (id) => set((state) => ({
        userWaitUpdates: state.userWaitUpdates.filter(userId => userId !== id)
      }), false, "removeUserWaitUpdates"),


      addAllowanceWaitUpdates: (id) => set((state) => ({
        allowanceWaitUpdates: state.allowanceWaitUpdates.includes(id)
          ? state.allowanceWaitUpdates
          : [...state.allowanceWaitUpdates, id]
      }), false, "addAllowanceWaitUpdates"),

      removeAllowanceWaitUpdates: (id) => set((state) => ({
        allowanceWaitUpdates: state.allowanceWaitUpdates.filter(allowanceId => allowanceId !== id)
      }), false, "removeAllowanceWaitUpdates"),

      // ========== 查询状态 ==========
      setIsLoading_truthBox: (isLoading) => set(
        { isLoading_truthBox: isLoading },
        false,
        "setIsLoading_truthBox"
      ),

      updateLastSyncTimestamp: () => set(
        { lastSyncTimestamp: Date.now() },
        false,
        "updateLastSyncTimestamp"
      ),

      addSyncError: (error) => set((state) => ({
        syncErrors: [...state.syncErrors, error]
      }), false, "addSyncError"),

      clearSyncErrors: () => set(
        { syncErrors: [] },
        false,
        "clearSyncErrors"
      ),

      // ========== 重置方法 ==========
      resetAllData: () => set(
        initialState,
        false,
        "resetAllData"
      ),


    }),
    { name: 'query-store-sapphire' }
  )
);

// ========== 导出类型 ==========

export type { EntityMeta, EntityState, SingletonEntityState };
