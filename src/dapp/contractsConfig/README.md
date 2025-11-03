# WikiTruth 合约配置系统

> 一套完善、类型安全且易于扩展的多网络合约配置管理系统

## 🎯 核心特性

- ✅ **自动网络切换** - 钱包切换网络时自动更新配置
- ✅ **类型安全** - 完整的 TypeScript 类型定义
- ✅ **集中管理** - 统一的配置管理，易于维护
- ✅ **易于扩展** - 添加新合约或网络只需修改少量代码
- ✅ **向后兼容** - 保留旧接口，平滑迁移

## 📁 目录结构

```
contract/
├── types.ts              # 类型定义
├── chains.ts             # 链配置（RPC、区块浏览器等）
├── abis.ts               # ABI 统一导入
├── contracts/            # 合约地址配置
│   ├── index.ts
│   ├── testnet.ts       # Sapphire Testnet (23295)
│   └── mainnet.ts       # Sapphire Mainnet (23293)
├── tokens.ts             # Token 配置
├── config.ts             # 配置管理器（核心）
├── hooks.ts              # React Hooks
├── constants.ts          # 全局常量
├── index.ts              # 统一导出
├── ConfigDemo.tsx        # 演示组件
├── USAGE_EXAMPLES.md     # 详细使用示例
└── README.md            # 本文件
```

## 🚀 快速开始

### 在 React 组件中使用

```tsx
import { useContractConfig, ContractName } from '@/dapp/contract';

function MyComponent() {
  // 自动跟随钱包网络
  const truthBoxConfig = useContractConfig(ContractName.TRUTH_BOX);
  
  if (!truthBoxConfig) {
    return <div>合约未部署</div>;
  }
  
  return <div>地址: {truthBoxConfig.address}</div>;
}
```

### 获取所有合约地址

```tsx
import { useContractAddresses } from '@/dapp/contract';

function AddressList() {
  const addresses = useContractAddresses();
  return <div>{addresses.TruthBox}</div>;
}
```

### 在非组件代码中使用

```typescript
import { getContractConfig, ContractName } from '@/dapp/contract';

// 获取当前网络配置
const config = getContractConfig(ContractName.EXCHANGE);

// 或指定网络
const testnetConfig = getContractConfig(ContractName.EXCHANGE, 23295);
```

## 📖 文档

- **[完整文档](../../../docs/contract-system.md)** - 详细的系统说明和最佳实践
- **[使用示例](./USAGE_EXAMPLES.md)** - 常见场景的完整代码示例
- **[演示组件](./contractDemo.tsx)** - 可运行的演示代码

## 🔄 迁移指南

### 从旧配置迁移

```tsx
// ❌ 旧方式（硬编码 chainId）
import { Config_TruthBox } from '@/dapp/contract/contractsConfig';
const config = Config_TruthBox;

// ✅ 新方式（自动切换）
import { useContractConfig, ContractName } from '@/dapp/contract';
const config = useContractConfig(ContractName.TRUTH_BOX);
```

**注意**：旧的导出已标记为 `@deprecated`，但仍可使用以保持向后兼容。

## 🛠 扩展方法

### 添加新合约

1. 在 `types.ts` 的 `ContractName` 枚举中添加名称
2. 在 `abis.ts` 中导入 ABI 并添加到 `ABIS` 对象
3. 在 `contracts/testnet.ts` 和 `mainnet.ts` 中添加地址

### 添加新网络

1. 在 `types.ts` 的 `SupportedChainId` 枚举中添加 chainId
2. 在 `chains.ts` 中创建链配置并添加到 `CHAINS` 对象
3. 创建 `contracts/new-network.ts` 文件定义合约地址
4. 在 `contracts/index.ts` 中添加到 `NETWORK_CONTRACTS` 映射

## 📋 可用的 Hooks

| Hook | 说明 |
|------|------|
| `useChainId()` | 获取当前链ID |
| `useContractAddresses()` | 获取所有合约地址 |
| `useContractConfig(name)` | 获取单个合约配置 |
| `useAllContractConfigs()` | 获取所有合约配置 |
| `useTokenRegistry()` | 获取 Token 列表 |
| `useIsTestnet()` | 检查是否为测试网 |
| `useContractAddress(name)` | 获取单个合约地址 |

## 📋 可用的工具函数

| 函数 | 说明 |
|------|------|
| `getContractConfig(name, chainId?)` | 获取合约配置 |
| `getContractAddress(name, chainId?)` | 获取合约地址 |
| `getContractAddresses(chainId?)` | 获取所有地址 |
| `getAllContractConfigs(chainId?)` | 获取所有配置 |
| `isContractDeployed(name, chainId?)` | 检查是否已部署 |
| `getChainConfig(chainId)` | 获取链配置 |
| `isSupportedChain(chainId)` | 检查是否支持 |

## 🎨 支持的合约

### Token 合约
- `OfficialToken` - 官方 Token (WTC)
- `ERC20Secret` - 机密 ERC20
- `WroseSecret` - 包装的 ROSE

### 核心合约
- `TruthNFT` - 真相 NFT
- `Exchange` - 交易所
- `FundManager` - 资金管理
- `TruthBox` - 真相盒子
- `AddressManager` - 地址管理
- `SiweAuth` - SIWE 认证
- `UserId` - 用户ID

## 🌐 支持的网络

- **Sapphire Testnet** (23295) - 测试环境
- **Sapphire Mainnet** (23293) - 生产环境

## ⚠️ 注意事项

1. **主网地址待更新** - `contracts/mainnet.ts` 中的地址目前为空，合约部署后需要更新
2. **自动切换依赖钱包** - 系统依赖 `WalletContext` 提供的 chainId
3. **错误处理** - 使用前请检查合约是否已部署（配置是否为 `undefined`）

## 🧪 测试演示

运行演示组件查看配置系统的工作效果：

```tsx
import { ConfigDemo } from '@/dapp/contract/contractDemo';

function App() {
  return <ConfigDemo />;
}
```

## 💡 最佳实践

1. ✅ **优先使用 Hooks** - 在 React 组件中使用 Hooks 获得自动更新
2. ✅ **检查部署状态** - 使用前检查合约是否已部署
3. ✅ **使用枚举** - 使用 `ContractName` 而非字符串
4. ✅ **错误处理** - 妥善处理配置不存在的情况
5. ✅ **类型安全** - 利用 TypeScript 避免错误

## 🔗 相关链接

- [Oasis Sapphire 文档](https://docs.oasis.io/dapp/sapphire/)
- [Wagmi 文档](https://wagmi.sh/)
- [Viem 文档](https://viem.sh/)

## 📝 更新日志

### 2025-10-10 - v1.0.0
- ✅ 初始版本发布
- ✅ 支持 Sapphire Testnet 和 Mainnet
- ✅ 自动网络切换功能
- ✅ 完整的类型定义
- ✅ 详细的文档和示例

## 📄 许可证

遵循项目主许可证

---

**维护者**: WikiTruth Team  
**最后更新**: 2025-10-10

