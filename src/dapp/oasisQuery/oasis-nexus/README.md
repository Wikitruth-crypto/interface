# Nexus API 说明

**版本**: v1

## 概述

Nexus 是 Oasis 网络的索引服务，提供链上数据的查询接口。本项目包含两个 API 层：

- **`generated/api.ts`**: 由 OpenAPI 规范自动生成的底层 API 客户端，提供基础的 HTTP 请求封装和 React Query hooks
- **`api.ts`**: 应用层封装，对底层 API 返回的数据进行格式化、类型增强和业务逻辑处理

### 核心限制

- **过滤粒度有限**: 目前 Nexus v1 的过滤粒度主要是「单地址 + 可选 topic + 块/交易定位」
- **参数筛选**: 要做更细的事件参数筛选（如按 `boxId`、`userId` 等），需要客户端先批量抓取再解码过滤
- **格式要求严格**: 参数格式必须与 API 文档严格一致，否则会被静默忽略
- **合约验证**: `evm_log_signature` 等高级过滤只对 Nexus 标记为「已验证」的合约生效

## 文件结构

### `generated/api.ts`
- **来源**: 由 OpenAPI 规范自动生成（使用 orval）
- **功能**: 
  - 提供所有 Nexus REST API 的 TypeScript 类型定义
  - 生成 React Query hooks（`useGet...`）
  - 基础的 HTTP 请求封装（通过 `replaceNetworkWithBaseURL`）
- **特点**: 
  - 返回的数据格式与 Nexus API 原始响应一致
  - 所有金额、时间戳等字段保持原始格式（base units、RFC 3339 字符串等）

### `api.ts`
- **功能**: 应用层封装，提供数据增强和格式化
- **主要处理**:
  - 金额单位转换（`fromBaseUnits`）
  - 地址格式转换（checksum、Bech32 ↔ EVM 地址）
  - 添加业务字段（`network`、`layer`、`ticker` 等）
  - EVM 事件解码和参数格式化
  - 自定义查询选项（`enabled`、`staleTime` 等）
- **导出**: 重新导出所有 `generated/api.ts` 的内容，并覆盖部分 hooks

## 缓存机制

所有查询接口都基于 **React Query (TanStack Query)**，具有以下特性：

### 缓存键（Query Key）
- 由 `network`、`runtime`、参数对象等组成
- 参数变化 → 新的缓存键 → 新的请求
- 相同参数 → 复用缓存（在 `staleTime` 和 `cacheTime` 范围内）

### 缓存行为
- **默认 `staleTime`**: 0（数据立即变为"陈旧"，但不会自动重新请求）
- **默认 `cacheTime`**: 5 分钟（查询卸载后缓存保留时间）
- **自动去重**: 相同 `queryKey` 的并发请求会被合并为一次 HTTP 调用
- **按需分页**: 每次请求只返回当前页的数据，不会自动拉取全部数据

React Query 的默认行为：
staleTime: 0 — 数据立即被视为“陈旧”
refetchOnMount: true — 组件挂载时重新获取
refetchOnWindowFocus: true — 窗口聚焦时重新获取
refetchOnReconnect: true — 网络重连时重新获取

### 缓存策略建议
- **已验证合约**: 可直接使用 React Query 缓存，配合 `evm_log_signature` 实现精确查询
- **未验证/代理合约**: 需要自定义缓存策略，在应用层维护格式化后的数据索引

## 网络和运行时

### 支持的网络
- `mainnet`: 主网
- `testnet`: 测试网
- `localnet`: 本地网络

### 支持的运行时（Runtime）
- `emerald`: Emerald ParaTime
- `sapphire`: Sapphire ParaTime
- `pontusxtest`: PontusX 测试网
- `pontusxdev`: PontusX 开发网
- `cipher`: Cipher ParaTime

## 通用参数字段

### `limit`
- **类型**: `number`
- **范围**: 1-1000
- **说明**: 返回的最大记录数
- **默认**: 通常为 20 或 50

### `offset`
- **类型**: `number`
- **说明**: 分页偏移量，从第几条记录开始返回
- **计算**: `offset = (page - 1) * limit`
- **默认**: 0

### `block` / `round`
- **类型**: `number`
- **说明**: 
  - **Consensus**: 使用 `block` 表示区块高度
  - **Runtime**: 使用 `block` 表示 runtime round（注意：API 参数名是 `block`，不是 `round`）
- **注意**: 在 Runtime 查询中，`round` 输入框的值应映射到 `block` 参数

### `rel`
- **类型**: `StakingAddress` (Consensus) 或 `EthOrOasisAddress` (Runtime)
- **说明**: 过滤与指定地址相关的数据
  - **Events**: 返回所有涉及该地址的事件（作为发送者、接收者、合约地址等）
  - **Transactions**: 返回所有涉及该地址的交易
- **限制**: 
  - 只能指定单个地址
  - 不支持多地址组合查询
  - 需要多地址时，应分多次请求后在前端合并

### `tx_hash`
- **类型**: `string`
- **格式**: **不带 `0x` 前缀的 64 位小写十六进制字符串**
- **示例**: `"facbc564eb916d1c6e8cc3102db4192977b2d56304d287200a15491b5638648d"`
- **说明**: 
  - 服务器返回的 hash 也是不带前缀的格式
  - 对于 Runtime 交易，可以匹配 `tx_hash` 或 `eth_tx_hash`

### `tx_index`
- **类型**: `number`
- **说明**: 交易在区块中的索引位置（0-based）
- **限制**: 必须同时指定 `block` 参数
- **用途**: 与 `block` 组合使用，等同于指定 `tx_hash`

### `after` / `before`
- **类型**: `string` (RFC 3339 格式)
- **说明**: 时间范围过滤
  - `after`: 最小时间（包含）
  - `before`: 最大时间（不包含）
- **示例**: `"2025-09-08T16:43:51Z"`

### `from` / `to`
- **类型**: `number`
- **说明**: 区块高度范围过滤
  - `from`: 最小高度（包含）
  - `to`: 最大高度（包含）

## Consensus 层接口

### 区块查询

#### `GetConsensusBlocksParams`
```typescript
{
  limit?: number;        // 1-1000
  offset?: number;
  from?: number;          // 最小区块高度（包含）
  to?: number;            // 最大区块高度（包含）
  after?: string;         // 最小时间（RFC 3339）
  before?: string;        // 最大时间（RFC 3339）
  hash?: string;          // 区块哈希
  proposed_by?: StakingAddress;  // 提议者地址
}
```

#### `GetConsensusBlocksHeight`
- **路径**: `/consensus/blocks/{height}`
- **说明**: 根据高度查询单个区块

### 交易查询

#### `GetConsensusTransactionsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  block?: number;         // 区块高度
  method?: ConsensusTxMethod;  // 交易方法（如 'staking.Transfer'）
  sender?: StakingAddress;     // 发送者地址
  rel?: string;           // 相关账户
  after?: string;         // 最小时间
  before?: string;        // 最大时间
}
```

#### `GetConsensusTransactionsTxHash`
- **路径**: `/consensus/transactions/{txHash}`
- **说明**: 根据交易哈希查询单个交易

### 事件查询

#### `GetConsensusEventsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  block?: number;         // 区块高度
  tx_index?: number;      // 交易索引（需同时指定 block）
  tx_hash?: string;       // 交易哈希
  rel?: StakingAddress;   // 相关账户
  type?: ConsensusEventType;  // 事件类型
}
```

### 账户查询

#### `GetConsensusAccountsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
}
```

#### `GetConsensusAccountsAddress`
- **路径**: `/consensus/accounts/{address}`
- **说明**: 查询单个账户详情（包含余额、委托、统计等）

### 验证者查询

#### `GetConsensusValidatorsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  name?: string;         // 验证者名称过滤（子串匹配）
}
```

### 提案查询

#### `GetConsensusProposalsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  submitter?: StakingAddress;  // 提案提交者
  state?: ProposalState;      // 提案状态
}
```

## Runtime 层接口

### 区块查询

#### `GetRuntimeBlocksParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  from?: number;          // 最小 round（包含）
  to?: number;            // 最大 round（包含）
  after?: string;         // 最小时间（RFC 3339）
  before?: string;        // 最大时间（RFC 3339）
  hash?: string;          // 区块哈希
}
```

### 交易查询

#### `GetRuntimeTransactionsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  block?: number;         // Runtime round
  after?: string;         // 最小时间
  before?: string;        // 最大时间
  rel?: EthOrOasisAddress;  // 相关账户（EVM 或 Oasis 地址）
  method?: string;        // 交易方法
                        // 特殊值:
                        // - 'native_transfers': 原生代币转账
                        // - 'evm.Call_no_native': 非原生转账的 EVM 调用
}
```

### 事件查询

#### `GetRuntimeEventsParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  block?: number;         // Runtime round（注意：参数名是 block，不是 round）
  tx_index?: number;      // 交易索引（需同时指定 block）
  tx_hash?: string;       // 交易哈希（不带 0x，64 位十六进制）
  type?: RuntimeEventType;  // 事件类型（如 'evm.log', 'accounts.transfer'）
  rel?: EthOrOasisAddress;  // 相关账户
  evm_log_signature?: string;  // EVM 事件签名（32 字节 hex，不带 0x）
  contract_address?: EthOrOasisAddress;  // 合约地址（Bech32 或 Base64）
  nft_id?: string;       // NFT 实例 ID（需同时指定 contract_address）
}
```

**重要说明**:
- `evm_log_signature`: 
  - **格式**: 32 字节十六进制字符串，**不带 `0x` 前缀**
  - **限制**: 只对 Nexus 标记为「已验证」的合约生效
  - **示例**: `"ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"` (ERC-20 Transfer)
- `contract_address`:
  - **格式**: Oasis Bech32 地址（`oasis1...`）或 Base64 编码
  - **注意**: 不是 EVM 地址（`0x...`）
  - **替代方案**: 如需按 EVM 地址过滤，使用 `rel` 参数
- `nft_id`:
  - 目前仅支持 ERC-721 Transfer 事件
  - 建议同时指定 `evm_log_signature` 以避免匹配到其他事件类型

### 账户查询

#### `GetRuntimeAccountsAddress`
- **路径**: `/runtime/{runtime}/accounts/{address}`
- **说明**: 查询单个 runtime 账户详情
- **返回**: 
  - 原生代币余额（`balances`）
  - EVM 代币余额（`evm_balances`，最多 1000 条）
  - 账户统计（`stats`）
  - 合约信息（如果是合约账户）

### Token 查询

#### `GetRuntimeEvmTokensParams`
```typescript
{
  limit?: number;         // 1-1000
  offset?: number;
  name?: string[];        // Token 名称或符号过滤（子串匹配，最多 6 个）
  sort_by?: 'total_holders' | 'market_cap';  // 排序字段
  type?: EvmTokenType;    // Token 类型（'ERC20', 'ERC721' 等）
}
```

#### `GetRuntimeEvmTokensAddress`
- **路径**: `/runtime/{runtime}/evm_tokens/{address}`
- **说明**: 查询单个 Token 合约详情

#### `GetRuntimeEvmTokensAddressHolders`
- **路径**: `/runtime/{runtime}/evm_tokens/{address}/holders`
- **说明**: 查询 Token 持有者列表（最多 1000 条）

#### `GetRuntimeAccountsAddressNfts`
- **路径**: `/runtime/{runtime}/accounts/{address}/nfts`
- **说明**: 查询账户持有的 NFT 列表
- **参数**:
  ```typescript
  {
    limit?: number;       // 1-1000
    offset?: number;
    token_address?: EthOrOasisAddress;  // 可选的 Token 合约地址过滤
  }
  ```

## 数据格式说明

### 金额字段
- **API 返回**: `TextBigInt`（字符串格式的 base units）
- **应用层处理**: `api.ts` 中的 hooks 会自动转换为可读格式（通过 `fromBaseUnits`）
- **示例**: `"2000000000000000000"` → `"2"` (18 decimals)

### 地址字段
- **StakingAddress**: Oasis Bech32 格式（`oasis1...`）
- **EthOrOasisAddress**: 可以是 EVM 地址（`0x...`）或 Oasis 地址
- **转换**: `api.ts` 会自动处理地址格式转换和 checksum

### 时间字段
- **API 返回**: RFC 3339 格式字符串（`"2025-09-08T16:43:51Z"`）
- **应用层**: 保持字符串格式，由 UI 层负责格式化显示

### EVM 事件数据
- **原始格式**: `topics` 和 `data` 为 Base64 编码
- **已验证合约**: Nexus 会提供 `evm_log_name` 和 `evm_log_params`（解码后的参数）
- **未验证合约**: 只有原始 `topics` 和 `data`，需要客户端自行解码

## 使用示例

### 基础查询（使用 generated API）

```typescript
import { useGetRuntimeEvents } from './oasis-nexus/generated/api'

// 查询合约事件
const { data, isLoading } = useGetRuntimeEvents(
  'testnet',
  'sapphire',
  {
    contract_address: 'oasis1...',  // Bech32 地址
    limit: 20,
    offset: 0,
  }
)
```

### 增强查询（使用封装 API）

```typescript
import { useGetRuntimeEvents } from './oasis-nexus/api'

// 自动处理数据格式化
const { data, isLoading } = useGetRuntimeEvents(
  'testnet',
  'sapphire',
  {
    rel: '0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94',  // EVM 地址
    evm_log_signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    limit: 20,
  }
)

// data.data.events 中的金额字段已转换为可读格式
// 地址字段已添加 network、layer 等业务字段
```

### 直接调用（不使用 React Query）

```typescript
import { fetchRuntimeAccountEvents } from './app/services/nexus/runtimeAccountFetcher'

const result = await fetchRuntimeAccountEvents(
  {
    network: 'testnet',
    layer: 'sapphire',
    address: '0x...',
    maxRecords: 100,
    offset: 0,
  }
)
```

## 常见问题

### 1. 为什么 `evm_log_signature` 过滤不生效？
- **原因**: 合约未被 Nexus 验证
- **解决**: 
  - 使用 Sourcify 验证合约
  - 或使用 `rel` + `contract_address` 过滤，然后在客户端解码筛选

### 2. 为什么查询返回空数据？
- 检查参数格式（特别是 `tx_hash` 和 `evm_log_signature` 是否带 `0x` 前缀）
- 检查合约是否已验证（对于 `evm_log_signature`）
- 检查网络和 runtime 是否正确
- 某些 testnet 端点可能存在 500 错误（后端问题）

### 3. 如何实现事件参数的精确筛选？
- **已验证合约**: 使用 `evm_log_signature` + `contract_address` 组合
- **未验证合约**: 
  1. 使用 `rel` 或 `contract_address` 批量拉取
  2. 在客户端解码 `topics` 和 `data`
  3. 按参数值筛选

### 4. 缓存如何工作？
- React Query 按 `queryKey` 缓存
- 参数变化 → 新的 `queryKey` → 新的请求
- 相同参数 → 复用缓存（在有效期内）
- 默认缓存 5 分钟

### 5. `round` 和 `block` 的区别？
- **API 参数名**: 统一使用 `block`
- **Consensus**: `block` 表示区块高度
- **Runtime**: `block` 表示 runtime round
- **注意**: 不要在参数中使用 `round`，应使用 `block`
