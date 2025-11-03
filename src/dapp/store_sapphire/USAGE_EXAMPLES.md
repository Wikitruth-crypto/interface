# Selectors 使用示例

本文档展示如何在组件中使用新的 selector 系统来访问嵌套数据。

## 📚 核心概念

### 存储层 vs 访问层

```typescript
// ❌ 旧方式：手动查找关联数据
const box = useQueryStore(state => state.boxes[tokenId]);
const minter = useQueryStore(state => state.users[box.minter.id]); // 繁琐！

// ✅ 新方式：自动组装嵌套数据
const box = useQueryStore(selectBox(tokenId));
console.log(box.minter.id); // 直接访问！
```

### 避免循环引用

```typescript
// ✅ 在 Box 中访问 User（轻量级）
const box = useQueryStore(selectBox(tokenId));
console.log(box.minter.id);
console.log(box.minter.isBlacklisted);

// ✅ 在 User 中访问 Box（完整数据）
const user = useQueryStore(selectUserWithBoxes(userId));
console.log(user.ownedBoxes[0].price);
```

---

## 🎯 使用示例

### 1. 在 NFT 详情页中使用

```typescript
// src/dapp/pages/NftDetailPage/containers/left.tsx
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import { selectBox } from '@/dapp/event_sapphire/selectors';

const LeftContainer: React.FC = () => {
  const tokenId = useNftDetailPageStore(state => state.tokenId);
  
  // 🎉 自动组装好关联数据！
  const box = useQueryStore(selectBox(tokenId));

  if (!box) return <div>Loading...</div>;

  return (
    <div>
      {/* 🎉 可以直接访问嵌套字段 */}
      <div>Minter: {box.minter.id}</div>
      <div>Owner: {box.owner.id}</div>
      <div>Price: {box.price}</div>
      
      {/* 🎉 访问 Token 信息 */}
      {box.acceptedToken && (
        <div>
          Token: {box.acceptedToken.symbol}
        </div>
      )}
      
      {/* 🎉 访问 Bidders */}
      <div>Bidders: {box.bidders.length}</div>
      {box.bidders.map(bidder => (
        <div key={bidder.id}>
          {bidder.isBlacklisted ? '🚫' : '✅'} {bidder.id}
        </div>
      ))}
    </div>
  );
};
```

### 2. 在 Marketplace 列表中使用

```typescript
// src/dapp/pages/Marketplace/components/MarketplaceListV2.tsx
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import { selectBoxesByStatus } from '@/dapp/event_sapphire/selectors';

const MarketplaceList: React.FC = () => {
  // 🎉 获取所有在售的 Box
  const sellingBoxes = useQueryStore(selectBoxesByStatus('Selling'));

  return (
    <div>
      {sellingBoxes.map(box => (
        <div key={box.id}>
          <h3>{box.tokenId}</h3>
          <p>Minter: {box.minter.id}</p>
          <p>Price: {box.price} {box.acceptedToken?.symbol}</p>
        </div>
      ))}
    </div>
  );
};
```

### 3. 在 Profile 页面中使用

```typescript
// src/dapp/pages/Profile/containers/ProfileContainer.tsx
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import { selectUserWithBoxes, selectUserPayments } from '@/dapp/event_sapphire/selectors';

const ProfileContainer: React.FC = () => {
  const userId = useAccount().address; // 假设这是当前用户的 userId
  
  // 🎉 获取用户及其所有 Box
  const user = useQueryStore(selectUserWithBoxes(userId));
  
  // 🎉 获取用户的支付记录
  const payments = useQueryStore(selectUserPayments(userId));

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Profile: {user.id}</h2>
      
      {/* 拥有的 Box */}
      <section>
        <h3>Owned Boxes ({user.ownedBoxes.length})</h3>
        {user.ownedBoxes.map(box => (
          <div key={box.id}>
            <p>Token ID: {box.tokenId}</p>
            <p>Status: {box.status}</p>
            <p>Price: {box.price}</p>
          </div>
        ))}
      </section>
      
      {/* 铸造的 Box */}
      <section>
        <h3>Minted Boxes ({user.mintedBoxes.length})</h3>
        {user.mintedBoxes.map(box => (
          <div key={box.id}>
            <p>Token ID: {box.tokenId}</p>
            <p>Current Owner: {box.owner.id}</p>
          </div>
        ))}
      </section>
      
      {/* 支付记录 */}
      <section>
        <h3>Payment History ({payments.length})</h3>
        {payments.map(payment => (
          <div key={payment.id}>
            <p>Amount: {payment.amount} {payment.token.symbol}</p>
            <p>Type: {payment.paymentType}</p>
            <p>Box: {payment.box.tokenId}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
```

### 4. 自定义 Selector

```typescript
// 创建自定义 selector
const selectMyCustomData = (userId: string) => (state: QueryState) => {
  const user = selectUser(userId)(state);
  const ownedBoxes = selectUserOwnedBoxes(userId)(state);
  
  return {
    user,
    ownedBoxes,
    totalValue: ownedBoxes.reduce((sum, box) => sum + BigInt(box.price), 0n),
  };
};

// 在组件中使用
const MyComponent: React.FC = () => {
  const data = useQueryStore(selectMyCustomData(userId));
  
  return (
    <div>
      <p>Total Value: {data.totalValue.toString()}</p>
    </div>
  );
};
```

---

## 🔧 高级用法

### 1. 组合多个 Selector

```typescript
const MyComponent: React.FC = () => {
  const box = useQueryStore(selectBox(tokenId));
  const minterBoxes = useQueryStore(selectUserMintedBoxes(box?.minter.id || ''));
  
  return (
    <div>
      <p>This box was minted by: {box?.minter.id}</p>
      <p>Minter has created {minterBoxes.length} boxes in total</p>
    </div>
  );
};
```

### 2. 条件查询

```typescript
const MyComponent: React.FC = () => {
  const userId = useAccount().address;
  
  // 只在用户登录时查询
  const user = useQueryStore(state => 
    userId ? selectUser(userId)(state) : undefined
  );
  
  return user ? <UserProfile user={user} /> : <LoginPrompt />;
};
```

### 3. 性能优化（使用 useShallow）

```typescript
import { useShallow } from 'zustand/react/shallow';

const MyComponent: React.FC = () => {
  // 🎉 只在 box 的特定字段变化时重新渲染
  const { price, status } = useQueryStore(
    useShallow(state => {
      const box = selectBox(tokenId)(state);
      return {
        price: box?.price,
        status: box?.status,
      };
    })
  );
  
  return (
    <div>
      <p>Price: {price}</p>
      <p>Status: {status}</p>
    </div>
  );
};
```

---

## 📊 性能对比

### 旧方式（手动查找）

```typescript
// ❌ 需要多次查询 store
const box = useQueryStore(state => state.boxes[tokenId]);
const minter = useQueryStore(state => state.users[box.minter.id]);
const owner = useQueryStore(state => state.users[box.owner.id]);
const token = useQueryStore(state => state.tokens[box.acceptedToken.id]);

// ❌ 代码繁琐，容易出错
// ❌ 多次订阅，可能导致不必要的重新渲染
```

### 新方式（Selector）

```typescript
// ✅ 一次查询，自动组装
const box = useQueryStore(selectBox(tokenId));

// ✅ 代码简洁，类型安全
// ✅ 单次订阅，性能更好
console.log(box.minter.id);
console.log(box.owner.id);
console.log(box.acceptedToken.symbol);
```

---

## 🎯 最佳实践

### 1. 选择合适的 Selector

```typescript
// ✅ 在 Box 详情页：使用 selectBox（包含完整关联）
const box = useQueryStore(selectBox(tokenId));

// ✅ 在 User 详情页：使用 selectUserWithBoxes（包含完整 Box 数组）
const user = useQueryStore(selectUserWithBoxes(userId));

// ✅ 在列表中引用 User：使用 selectUserLight（避免循环引用）
const minter = useQueryStore(selectUserLight(minterId));
```

### 2. 避免过度查询

```typescript
// ❌ 不好：在循环中使用 selector
boxes.map(box => {
  const fullBox = useQueryStore(selectBox(box.id)); // 每次都查询！
  return <BoxCard box={fullBox} />;
});

// ✅ 好：使用批量 selector
const boxIds = boxes.map(b => b.id);
const fullBoxes = useQueryStore(selectBoxes(boxIds));
fullBoxes.map(box => <BoxCard box={box} />);
```

### 3. 类型安全

```typescript
// ✅ Selector 返回的数据是完全类型化的
const box = useQueryStore(selectBox(tokenId));

if (box) {
  // TypeScript 知道 box.minter 是 User 类型
  console.log(box.minter.id); // ✅ 类型安全
  console.log(box.minter.isBlacklisted); // ✅ 类型安全
}
```

---

## 🚀 迁移指南

### 从旧代码迁移到新 Selector

#### 步骤 1：识别手动查找的代码

```typescript
// 旧代码
const box = useQueryStore(state => state.boxes[tokenId]);
const minter = useQueryStore(state => state.users[box.minter.id]);
```

#### 步骤 2：替换为 Selector

```typescript
// 新代码
import { selectBox } from '@/dapp/event_sapphire/selectors';

const box = useQueryStore(selectBox(tokenId));
// box.minter 已经是完整的 User 对象！
```

#### 步骤 3：更新访问方式

```typescript
// 旧代码
<div>Minter: {minter.id}</div>

// 新代码
<div>Minter: {box.minter.id}</div>
```

---

## 📝 总结

**核心优势：**

1. ✅ **代码简洁**：像 The Graph 一样便捷的嵌套访问
2. ✅ **类型安全**：完整的 TypeScript 支持
3. ✅ **性能优化**：扁平化存储 + 按需组装
4. ✅ **避免循环引用**：智能处理双向关联
5. ✅ **易于维护**：统一的数据访问模式

**下一步：**

- 在 1-2 个组件中测试新的 selector
- 逐步迁移现有代码
- 根据实际使用情况优化 selector

---

**文档版本：** v1.0  
**更新日期：** 2025-10-14

