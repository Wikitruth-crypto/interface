# WikiTruth Event Sapphire 数据管理模块

## 📚 概述

本模块负责管理 WikiTruth 项目在 Oasis Sapphire 网络上的事件数据索引和状态管理。

### 核心特性

- ✅ **扁平化存储**：避免循环引用，提升性能
- ✅ **嵌套化访问**：像 The Graph 一样便捷的数据访问
- ✅ **类型安全**：完整的 TypeScript 支持
- ✅ **智能选择器**：自动组装关联数据
- ✅ **性能优化**：按需加载，自动缓存

---

## 📁 文件结构

```
src/dapp/event_sapphire/
├── types.ts                          # TypeScript 类型定义
├── schemas.ts                        # normalizr Schema 定义
├── selectors.ts                      # 智能选择器函数
├── useQueryStore.ts                  # Zustand 状态管理
├── schemaNew.graphql                 # GraphQL Schema 定义
│
├── 改进文档.md                       # 架构改进文档
├── MIGRATION_NOTES.md                # 迁移说明
├── USAGE_EXAMPLES.md                 # 使用示例
├── PHASE1_COMPLETION_SUMMARY.md      # 阶段 1 完成总结
├── TEST_COMPONENT_EXAMPLE.tsx        # 测试组件示例
└── README.md                         # 本文档
```

---

## 🚀 快速开始

### 1. 基础用法

```typescript
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import { selectBox } from '@/dapp/event_sapphire/selectors';

const MyComponent: React.FC = () => {
  // 🎉 自动组装嵌套数据
  const box = useQueryStore(selectBox(tokenId));

  return (
    <div>
      <p>Minter: {box.minter.id}</p>
      <p>Owner: {box.owner.id}</p>
      <p>Price: {box.price} {box.acceptedToken?.symbol}</p>
    </div>
  );
};
```

### 2. 高级用法

```typescript
import { selectBoxesByStatus, selectUserWithBoxes } from '@/dapp/event_sapphire/selectors';

// 筛选特定状态的 Box
const sellingBoxes = useQueryStore(selectBoxesByStatus('Selling'));

// 获取用户及其所有 Box
const user = useQueryStore(selectUserWithBoxes(userId));
```

---

## 📖 核心概念

### 存储层 vs 访问层

#### 存储层（扁平化）

```typescript
// ✅ 在 Zustand Store 中，数据是扁平化存储的
interface QueryState {
  boxes: { [boxId]: Box };
  users: { [userId]: User };
  tokens: { [tokenId]: Token };
}
```

**优点：**
- 避免循环引用
- 每个实体只存储一次
- 更新独立
- 内存效率高

#### 访问层（嵌套化）

```typescript
// ✅ 通过 selector 自动组装嵌套数据
const box = useQueryStore(selectBox(tokenId));

// 🎉 可以直接访问嵌套字段
console.log(box.minter.id);
console.log(box.acceptedToken.symbol);
```

**优点：**
- 代码简洁
- 类型安全
- 像 The Graph 一样便捷

---

## 🔧 可用的 Selectors

### 基础 Selectors

| Selector | 说明 | 返回类型 |
|----------|------|----------|
| `selectBox(boxId)` | 获取带完整关联数据的 Box | `Box \| undefined` |
| `selectBoxes(boxIds)` | 批量获取 Box | `Box[]` |
| `selectAllBoxes()` | 获取所有 Box | `Box[]` |
| `selectUser(userId)` | 获取 User | `User \| undefined` |
| `selectUserLight(userId)` | 获取轻量级 User（避免循环引用） | `Partial<User>` |
| `selectUserWithBoxes(userId)` | 获取带完整 Box 数据的 User | `User \| undefined` |
| `selectToken(tokenId)` | 获取 Token | `Token \| undefined` |
| `selectAllTokens()` | 获取所有 Token | `Token[]` |

### 高级 Selectors

| Selector | 说明 | 返回类型 |
|----------|------|----------|
| `selectBoxesByStatus(status)` | 根据状态筛选 Box | `Box[]` |
| `selectUserOwnedBoxes(userId)` | 获取用户拥有的 Box | `Box[]` |
| `selectUserMintedBoxes(userId)` | 获取用户铸造的 Box | `Box[]` |
| `selectUserPayments(userId)` | 获取用户的支付记录 | `Payment[]` |

---

## 💡 使用场景

### 场景 1：NFT 详情页

```typescript
const box = useQueryStore(selectBox(tokenId));

// ✅ 直接访问所有关联数据
<div>
  <p>Minter: {box.minter.id}</p>
  <p>Owner: {box.owner.id}</p>
  <p>Bidders: {box.bidders.length}</p>
  <p>Token: {box.acceptedToken?.symbol}</p>
</div>
```

### 场景 2：Marketplace 列表

```typescript
const sellingBoxes = useQueryStore(selectBoxesByStatus('Selling'));

// ✅ 自动筛选并组装数据
{sellingBoxes.map(box => (
  <BoxCard 
    key={box.id}
    tokenId={box.tokenId}
    minter={box.minter.id}
    price={box.price}
  />
))}
```

### 场景 3：用户 Profile

```typescript
const user = useQueryStore(selectUserWithBoxes(userId));

// ✅ 获取用户的所有 Box
<div>
  <h3>Owned Boxes: {user.ownedBoxes.length}</h3>
  <h3>Minted Boxes: {user.mintedBoxes.length}</h3>
</div>
```

---

## ⚡ 性能优化

### 使用 useShallow 避免不必要的重新渲染

```typescript
import { useShallow } from 'zustand/react/shallow';

const { price, status } = useQueryStore(
  useShallow(state => {
    const box = selectBox(boxId)(state);
    return {
      price: box?.price,
      status: box?.status,
    };
  })
);
```

### 批量查询

```typescript
// ❌ 不好：多次查询
boxes.map(box => {
  const fullBox = useQueryStore(selectBox(box.id));
  return <BoxCard box={fullBox} />;
});

// ✅ 好：批量查询
const boxIds = boxes.map(b => b.id);
const fullBoxes = useQueryStore(selectBoxes(boxIds));
fullBoxes.map(box => <BoxCard box={box} />);
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [改进文档.md](./改进文档.md) | 详细的架构改进方案和技术选型 |
| [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) | 完整的使用示例和最佳实践 |
| [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) | 从旧版本迁移的说明 |
| [PHASE1_COMPLETION_SUMMARY.md](./PHASE1_COMPLETION_SUMMARY.md) | 阶段 1 完成总结 |
| [TEST_COMPONENT_EXAMPLE.tsx](./TEST_COMPONENT_EXAMPLE.tsx) | 测试组件示例 |

---

## 🎯 开发路线图

### ✅ 阶段 1（已完成）

- ✅ 安装 normalizr
- ✅ 创建 schemas 定义
- ✅ 实现 selectors 系统
- ✅ 提供使用文档

### ⏳ 阶段 2（计划中）

- ⏳ 引入 React Query
- ⏳ 集成 Supabase
- ⏳ 实现多数据源融合

### 🔮 阶段 3（未来）

- 🔮 后台服务器集成
- 🔮 搜索功能实现
- 🔮 离线支持

---

## 🤝 贡献指南

### 添加新的 Selector

1. 在 `selectors.ts` 中添加新的 selector 函数
2. 确保类型定义正确
3. 添加 JSDoc 注释
4. 在 `USAGE_EXAMPLES.md` 中添加使用示例

### 更新 Schema

1. 修改 `schemaNew.graphql`
2. 更新 `types.ts` 中的类型定义
3. 更新 `schemas.ts` 中的 normalizr schema
4. 运行 TypeScript 检查确保无错误

---

## 📝 常见问题

### Q: 为什么需要 normalizr？

A: normalizr 帮助我们实现数据归一化，避免循环引用，同时提供便捷的嵌套访问。

### Q: 什么时候使用 selectUserLight？

A: 当在 Box 中引用 User 时，使用 `selectUserLight` 避免循环引用。

### Q: 如何优化性能？

A: 使用 `useShallow` 只订阅需要的字段，使用批量查询避免多次查询。

### Q: 如何处理循环引用？

A: 使用 `selectUserLight` 获取轻量级 User，或使用 `selectUserWithBoxes` 获取完整数据。

---

## 📞 联系方式

如有问题或建议，请联系 WikiTruth 开发团队。

---

**文档版本：** v1.0  
**更新日期：** 2025-10-14  
**作者：** WikiTruth 开发团队

