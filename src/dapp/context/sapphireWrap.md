# Sapphire Provider Wrap 工具

## 概述

根据 Oasis 官方文档，前端在与 Sapphire 网络进行交互时，需要使用 Oasis 官方的加密库（`@oasisprotocol/sapphire-paratime`）对 Ethereum provider 进行 wrap，以启用加密调用和交易功能。

## 功能说明

### `isSapphireNetwork(chainId: number | undefined): boolean`

检查给定的 chainId 是否是 Sapphire 网络（Testnet 或 Mainnet）。

### `wrapSapphireProvider(provider: any, chainId?: number): any`

Wrap EIP-1193 provider（如 `window.ethereum`）以启用 Sapphire 加密功能。仅在 Sapphire 网络上进行 wrap。

### `initializeSapphireWrap(chainId?: number): void`

初始化并 wrap Sapphire provider。在应用启动时调用，或者在检测到 Sapphire 网络时调用。

## 自动集成

`WalletContext` 组件已经自动集成了 wrap 功能：

1. **自动检测**：当用户连接到 Sapphire 网络时，自动检测 chainId
2. **自动 wrap**：自动 wrap `window.ethereum` provider
3. **避免重复**：通过 `_sapphireWrapped` 标记避免重复 wrap

## 使用方式

### 自动模式（推荐）

无需手动操作，`WalletContext` 会自动处理：

```tsx
// 在应用中使用 WalletProvider
<WalletProvider>
  <App />
</WalletProvider>
```

当用户连接到 Sapphire 网络时，provider 会自动被 wrap。

### 手动模式

如果需要手动控制，可以使用工具函数：

```typescript
import { wrapSapphireProvider, isSapphireNetwork } from '@/dapp/utils/sapphireWrap';

// 检查是否是 Sapphire 网络
if (isSapphireNetwork(chainId)) {
  // Wrap provider
  const wrappedProvider = wrapSapphireProvider(window.ethereum, chainId);
}
```

## 工作原理

1. **检测网络**：通过 chainId 判断是否连接到 Sapphire 网络
2. **Wrap Provider**：使用 `@oasisprotocol/sapphire-paratime` 的 `wrap` 函数包装 `window.ethereum`
3. **启用加密**：Wrapped provider 会自动处理加密调用和交易

## Oasis 官方推荐的连接器方案

### 核心方案：使用 EIP-6963 自动发现

Oasis 官方推荐使用 `createSapphireConfig` 的 EIP-6963 自动发现功能，而不是手动添加每个连接器。

当前配置已启用该功能：

```typescript
const wagmiConfig = createSapphireConfig({
  sapphireConfig: {
    replaceProviders: true  // ✅ 这会自动发现所有 EIP-6963 兼容的钱包
  },
  chains,
  connectors: [injectedWithSapphire()], // 基础连接器
  transports
})
```

### 工作原理

当 `replaceProviders: true` 时：
1. 自动发现：自动检测所有支持 EIP-6963 标准的钱包（MetaMask、Coinbase Wallet、Brave Wallet 等）
2. 自动包装：为每个发现的钱包自动创建 Sapphire 加密包装的连接器
3. 无需手动添加：不需要手动添加每个钱包的连接器

### 优化建议

如果需要更精细的控制，可以使用 `wrappedProvidersFilter`：

```typescript
const wagmiConfig = createSapphireConfig({
  sapphireConfig: {
    replaceProviders: false,
    // 只包装指定的钱包
    wrappedProvidersFilter: (rdns) => [
      'io.metamask',           // MetaMask
      'com.coinbase.wallet',   // Coinbase Wallet
      'com.brave.wallet',      // Brave Wallet
      // 添加更多钱包的 RDNS...
    ].includes(rdns)
  },
  chains,
  connectors: [injectedWithSapphire()],
  transports
})
```

### 总结

- 推荐方案：使用 `createSapphireConfig` + `replaceProviders: true`（已配置）
- 核心连接器：`injectedWithSapphire()`（已配置）
- 自动发现：EIP-6963 兼容钱包会自动被发现和包装
- 无需手动添加：不需要为每个钱包创建连接器

### 当前状态

你的配置已经符合 Oasis 官方推荐：
- 使用 `createSapphireConfig`
- 使用 `injectedWithSapphire()`
- 启用 `replaceProviders: true` 自动发现

如果 UI 中看不到所有钱包，可能是：
1. 钱包未安装：只有已安装的钱包才会被发现
2. 钱包不支持 EIP-6963：某些旧版钱包可能不支持


## 注意事项

- Wrap 操作仅在 Sapphire 网络上执行
- 如果 wrap 失败，会回退到原始 provider，不会影响正常功能
- 所有通过 wagmi 的合约调用都会自动使用 wrapped provider（如果已 wrap）

## 相关文档

- [Oasis Sapphire Browser Support](https://docs.oasis.io/dapp/sapphire/develop/browser)
- [@oasisprotocol/sapphire-paratime](https://github.com/oasisprotocol/sapphire-paratime)

