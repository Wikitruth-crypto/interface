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

## 注意事项

- Wrap 操作仅在 Sapphire 网络上执行
- 如果 wrap 失败，会回退到原始 provider，不会影响正常功能
- 所有通过 wagmi 的合约调用都会自动使用 wrapped provider（如果已 wrap）

## 相关文档

- [Oasis Sapphire Browser Support](https://docs.oasis.io/dapp/sapphire/develop/browser)
- [@oasisprotocol/sapphire-paratime](https://github.com/oasisprotocol/sapphire-paratime)

