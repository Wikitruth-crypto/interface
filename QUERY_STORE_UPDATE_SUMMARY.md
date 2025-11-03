# Query Store 更新总结

## ✅ 任务完成

已成功将 `src/dapp/event_sapphire/useQueryStore.ts` 从 The Graph 索引协议迁移到 Oasis Nexus API 数据源。

**更新日期**: 2025-10-11

---

## 📋 完成的工作

### 1. **类型系统更新** ✅

#### 导入更新
- ❌ 移除所有 The Graph 相关导入
- ✅ 使用本地 `types.ts` 中的类型定义

```typescript
// 旧版本
import { BoxAllDataQuery } from '../theGraphQuery/box';
import { GlobalStateType } from '../theGraphQuery/globalState';

// 新版本
import type {
  GlobalState,
  Box,
  User,
  Token,
  Payment,
  Withdraw,
  UserOrder,
  UserReward,
  RewardAmount,
  TokenTotalAmount,
  Allowance,
} from './types';
```

### 2. **状态接口重构** ✅

#### 新增状态
- ✅ `tokens` - Token 实体管理
- ✅ `rewardAmounts` - 奖励金额管理
- ✅ `isLoading` - 加载状态
- ✅ `lastSyncTimestamp` - 最后同步时间
- ✅ `syncErrors` - 同步错误列表

#### 移除状态
- ❌ `boxProfiles` - 不再需要
- ❌ `boxesBaseData` - 不再需要
- ❌ `boxProfileQueryTimestamp` - 不再需要
- ❌ `boxBaseQueryTimestamp` - 不再需要
- ❌ `errorBoxProfiles` - 不再需要
- ❌ `boxProfileWaitUpdates` - 不再需要

#### 更新状态
- ✅ `globalState` - 更新字段名（paidSupply, inSecrecySupply, blacklistedSupply）
- ✅ `fundManagerState` - 简化结构
- ✅ `tokenTotalAmounts` - 从数组改为对象映射

### 3. **Actions 方法更新** ✅

#### 新增方法

**Token 管理：**
```typescript
updateTokens: (tokens: Token[]) => void;
updateToken: (token: Token) => void;
updateErrorTokens: (errorTokens: string[]) => void;
```

**TokenTotalAmount 管理：**
```typescript
updateTokenTotalAmount: (tokenTotalAmount: TokenTotalAmount) => void;
```

**RewardAmount 管理：**
```typescript
updateRewardAmounts: (rewardAmounts: RewardAmount[]) => void;
updateRewardAmount: (rewardAmount: RewardAmount) => void;
updateErrorRewardAmounts: (errorRewardAmounts: string[]) => void;
```

**查询状态管理：**
```typescript
setIsLoading: (isLoading: boolean) => void;
updateLastSyncTimestamp: () => void;
addSyncError: (error: string) => void;
clearSyncErrors: () => void;
```

**重置方法：**
```typescript
resetAllData: () => void;
resetBoxData: () => void;
resetUserData: () => void;
```

**移除等待更新：**
```typescript
removeBoxWaitUpdates: (id: string) => void;
removeUserWaitUpdates: (id: string) => void;
removeAllowanceWaitUpdates: (id: string) => void;
```

#### 移除方法
- ❌ `updateBoxProfiles`
- ❌ `updateBoxProfile`
- ❌ `updateErrorBoxProfiles`
- ❌ `updateBoxesBaseData`
- ❌ `updateBoxBaseData`

### 4. **初始状态更新** ✅

```typescript
const initialState: QueryState = {
  // 全局状态 - 更新字段名
  globalState: {
    id: 'global',
    totalSupply: '0',
    storingSupply: '0',
    sellingSupply: '0',
    auctioningSupply: '0',
    paidSupply: '0',           // ✅ 新增
    refundingSupply: '0',
    inSecrecySupply: '0',      // ✅ 新增
    publishedSupply: '0',
    blacklistedSupply: '0',    // ✅ 新增
  },
  
  // FundManager - 简化结构
  fundManagerState: {
    id: 'fundManager',
    tokenTotalAmounts: [],
  },
  
  // 新增 Token 管理
  tokens: {},
  tokenQueryTimestamp: {},
  errorTokens: [],
  
  // TokenTotalAmounts 改为对象映射
  tokenTotalAmounts: {},
  tokenTotalAmountsQueryTimestamp: 0,
  
  // 新增 RewardAmount
  rewardAmounts: {},
  rewardAmountQueryTimestamp: {},
  errorRewardAmounts: [],
  
  // 新增查询状态
  isLoading: false,
  lastSyncTimestamp: 0,
  syncErrors: [],
};
```

### 5. **Store 实现更新** ✅

所有方法都已更新以匹配新的类型定义：

- ✅ 全局状态更新方法
- ✅ Token 管理方法
- ✅ Box 管理方法
- ✅ User 管理方法
- ✅ 交易记录管理方法
- ✅ 订单和奖励管理方法
- ✅ 授权记录管理方法
- ✅ 查询状态管理方法
- ✅ 重置方法

### 6. **文档创建** ✅

创建了详细的迁移文档：
- 📄 `src/dapp/event_sapphire/MIGRATION_NOTES.md` - 完整的迁移说明

---

## 🔍 关键变更对比

### GlobalState

| 字段 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| deliveredSupply | ✅ | ❌ | 移除 |
| completedSupply | ✅ | ❌ | 移除 |
| blacklistSupply | ✅ | ❌ | 移除 |
| paidSupply | ❌ | ✅ | 新增 |
| inSecrecySupply | ❌ | ✅ | 新增 |
| blacklistedSupply | ❌ | ✅ | 新增（命名规范化） |

### FundManagerState

| 字段 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| cumulativeAllocatedFunds | ✅ | ❌ | 移除 |
| availableServiceFees | ✅ | ❌ | 移除 |
| tokenTotalAmounts | ✅ | ✅ | 保留 |

### Box

| 字段 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| publicDataCID | ✅ | ❌ | 移除 |
| boxInfoCID | ❌ | ✅ | 新增 |
| publicTimestamp | ✅ | ❌ | 移除 |
| publishTimestamp | ❌ | ✅ | 新增 |
| buyerInfoCID | ✅ | ❌ | 移除 |
| deliverInfoCID | ✅ | ❌ | 移除 |
| refundInfoCID | ✅ | ❌ | 移除 |
| sellTimestamp | ❌ | ✅ | 新增 |
| requestRefundDeadline | ❌ | ✅ | 新增 |
| reviewDeadline | ❌ | ✅ | 新增 |

### User

| 字段 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| id | 地址 (0x...) | userId (uint256) | ID 格式变更 |
| isBlacklisted | ❌ | ✅ | 新增 |
| lastActivityTimestamp | ❌ | ✅ | 新增 |

### UserReward

| 字段 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| box | ✅ | ❌ | 移除（改为按用户聚合） |
| officeTokenRewards | ✅ | ❌ | 移除 |
| otherTokenRewards | ✅ | ❌ | 移除 |
| totalRewards | ❌ | ✅ | 新增 |
| helperRewards | ❌ | ✅ | 新增 |
| lastWithdrawTimestamp | ❌ | ✅ | 新增 |

---

## 📊 数据结构变更

### 新增实体

#### 1. Token
```typescript
interface Token {
  id: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  status: TokenStatus;
  addedTimestamp: string;
  removedTimestamp?: string;
}
```

#### 2. RewardAmount
```typescript
interface RewardAmount {
  id: string; // BoxId-RewardType
  box: Box;
  token: Token;
  amount: string;
  rewardType: RewardType; // Minter, Seller, Completer, Total
  timestamp: string;
}
```

### 枚举变更

#### BoxStatus
```typescript
// 旧版本
enum BoxStatus {
  Storing, Selling, Auctioning, Delivered, Refunding, Completed, Published
}

// 新版本
enum BoxStatus {
  Storing, Selling, Auctioning, Paid, Refunding, InSecrecy, Published, Blacklisted
}
```

#### FundsType
```typescript
// 旧版本
enum FundsType { Order, Reward }

// 新版本
enum FundsType { Order, Refund }
```

#### PaymentType
```typescript
// 旧版本
enum PaymentType { Purchase, Bid, ConfidentialityFee }

// 新版本
enum PaymentType { Buy, Bid, ConfidentialityFee }
```

#### 新增枚举
```typescript
enum RewardType { Minter, Seller, Completer, Total }
enum TokenStatus { UnExisted, Active, Inactive }
```

---

## 🎯 使用指南

### 基本用法

```typescript
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';

// 获取状态
const boxes = useQueryStore(state => state.boxes);
const users = useQueryStore(state => state.users);
const isLoading = useQueryStore(state => state.isLoading);

// 更新状态
const updateBoxes = useQueryStore(state => state.updateBoxes);
const updateUsers = useQueryStore(state => state.updateUsers);
const setIsLoading = useQueryStore(state => state.setIsLoading);
```

### 数据同步示例

```typescript
const syncBoxData = async () => {
  const { setIsLoading, updateBoxes, addSyncError, updateLastSyncTimestamp } = 
    useQueryStore.getState();
  
  setIsLoading(true);
  
  try {
    // 从 Oasis Nexus 获取数据
    const boxes = await fetchBoxesFromNexus();
    
    // 更新状态
    updateBoxes(boxes);
    updateLastSyncTimestamp();
  } catch (error) {
    addSyncError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### 错误处理

```typescript
const syncErrors = useQueryStore(state => state.syncErrors);
const clearSyncErrors = useQueryStore(state => state.clearSyncErrors);

// 显示错误
if (syncErrors.length > 0) {
  console.error('Sync errors:', syncErrors);
  // 清除错误
  clearSyncErrors();
}
```

---

## ⚠️ 重要注意事项

### 1. ID 格式变更

**务必注意 ID 格式的变化：**

- **Box ID**: `tokenId` → `boxId`
- **User ID**: `address (0x...)` → `userId (uint256)`

### 2. 复合 ID 格式

```typescript
// UserOrder
id: `${boxId}-${userId}`

// RewardAmount
id: `${boxId}-${rewardType}`

// UserReward
id: `${userId}-${tokenAddress}`

// TokenTotalAmount
id: `${tokenAddress}-${amountType}`

// Allowance
id: `${tokenAddress}-${ownerUserId}-${spenderAddress}`
```

### 3. 数据同步策略

由于不再使用 The Graph 的实时订阅，需要实现：

- ✅ 轮询机制（定期更新）
- ✅ 事件监听（监听合约事件）
- ✅ 手动刷新（用户触发）

### 4. 性能优化建议

- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数
- 避免频繁的全量更新
- 使用增量更新（单个实体更新）

---

## 📚 相关文件

| 文件 | 说明 |
|------|------|
| `src/dapp/event_sapphire/useQueryStore.ts` | ✅ 已更新 |
| `src/dapp/event_sapphire/types.ts` | 类型定义 |
| `src/dapp/event_sapphire/schemaNew.graphql` | Schema 定义 |
| `src/dapp/event_sapphire/MIGRATION_NOTES.md` | 迁移说明 |
| `src/dapp/artifacts/interfacesAll/IEvents.sol` | 事件定义 |
| `src/dapp/v1.6.3_sepolia/` | 旧版本参考 |

---

## ✅ TypeScript 检查

```bash
✅ 无 TypeScript 错误
✅ 所有类型定义正确
✅ 所有方法签名匹配
```

---

## 🚀 下一步工作

### 建议的后续任务

1. **实现数据获取层**
   - 创建 Oasis Nexus API 调用函数
   - 实现事件数据解析
   - 实现数据转换逻辑

2. **实现同步机制**
   - 轮询更新
   - 事件监听
   - 增量同步

3. **更新 UI 组件**
   - 适配新的数据结构
   - 更新 ID 引用
   - 更新枚举值

4. **测试**
   - 单元测试
   - 集成测试
   - E2E 测试

---

**更新完成！** 🎉

`useQueryStore.ts` 已成功迁移到新版本，可以配合 Oasis Nexus API 使用。

