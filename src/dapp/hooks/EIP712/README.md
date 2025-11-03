# EIP712 签名 Hook

## 快速开始

```typescript
import { useEIP712_ERC20secret, PermitType } from '@dapp/hooks/EIP712';

function MyComponent() {
  const { signPermit, isLoading } = useEIP712_ERC20secret();
  
  const handleSign = async () => {
    const permit = await signPermit({
      spender: recipientAddress,
      amount: 1000n,
      mode: PermitType.VIEW,
      contractAddress: tokenAddress
    });
    
    if (permit) {
      // 使用签名调用合约
      await balanceOfWithPermit(permit);
    }
  };
}
```

## 签名类型

- **VIEW (0)**: 查询余额/授权额度（只读，金额必须为 0）
- **TRANSFER (1)**: 授权转账操作（修改状态，消耗 gas）
- **APPROVE (2)**: 设置授权额度（修改状态，消耗 gas）

## 文件说明

- `types_ERC20secret.ts` - EIP712 相关类型定义
- `useEIP712_ERC20secret.tsx` - EIP712 签名 Hook 实现
- `index.ts` - 统一导出

## 重要提示

### 1. 类型兼容性

`EIP712Domain` 接口中的 `verifyingContract` 必须使用 `` `0x${string}` `` 类型：

```typescript
export interface EIP712Domain {
    verifyingContract: `0x${string}`;  // ✅ 正确
    // verifyingContract: string;       // ❌ 错误，会导致 viem 类型错误
}
```

### 2. Domain 配置

必须与合约中的配置完全一致：

```typescript
{
  name: 'Secret ERC20 Token',  // 与合约一致
  version: '1',                 // 与合约一致
  chainId: chainId,             // 当前链ID
  verifyingContract: contractAddress
}
```

### 3. 签名重放保护

- 每个签名只能使用一次
- 签名有过期时间（默认 1 小时）
- 合约会记录已使用的签名

## 完整文档

详细文档请参见：[docs/eip712-signature.md](../../../../docs/eip712-signature.md)

## 相关合约

- `ERC20Secret.sol` - 隐私代币合约
- 支持 VIEW/TRANSFER/APPROVE 三种许可类型
- 实现 EIP-712 签名验证

## 常见错误

### 类型错误

```
Type 'string' is not assignable to type '`0x${string}`'
```

**解决方法**：确保 `EIP712Domain` 接口使用正确的类型定义（见上方）。

### 签名验证失败

**可能原因**：
- domain 配置与合约不一致
- 使用了错误的 chainId
- 合约地址不正确

## 测试

建议在 Sapphire 测试网上测试：
1. 连接钱包
2. 生成签名
3. 调用合约方法
4. 验证结果

