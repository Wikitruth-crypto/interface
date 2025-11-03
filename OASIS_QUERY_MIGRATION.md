# Oasis Query 模块迁移完成报告

## ✅ 迁移完成

已成功将 Oasis Explorer 的查询模块从 `oasisQuery/` 迁移到 `src/dapp/oasisQuery/`。

---

## 📦 迁移内容

### 1. **核心文件**

已迁移的文件和目录：

```
src/dapp/oasisQuery/
├── oasis-nexus/              # Oasis Nexus API 封装
│   ├── api.ts               # API 封装和工具函数（1764 行）
│   ├── generated/           # 自动生成的 API 类型
│   │   └── api.ts          # 完整的 API 类型定义
│   ├── orval.config.mjs    # API 生成配置
│   ├── package.json        # 子包配置
│   └── ...                 # 其他配置文件
│
├── types/                   # 类型定义（13 个文件）
│   ├── network.ts          # 网络类型（mainnet, testnet）
│   ├── searchScope.ts      # 搜索范围类型
│   ├── ticker.ts           # 代币类型
│   ├── layers.ts           # 层级类型
│   ├── tokens.ts           # 代币配置
│   └── ...                 # 其他类型定义
│
├── utils/                   # 工具函数（26 个文件）
│   ├── helpers.ts          # 地址转换等辅助函数
│   ├── number-utils.ts     # 数字处理工具
│   ├── transaction.ts      # 交易处理工具
│   ├── contract-utils.ts   # 合约工具
│   ├── balance-utils.ts    # 余额工具
│   └── ...                 # 其他工具函数
│
├── config.ts                # 网络配置（226 行）
├── index.ts                 # 模块入口
├── README.md                # 使用文档
└── EXAMPLES.md              # 使用示例
```

**总计：** 约 50+ 个文件

### 2. **新增依赖**

已安装的 npm 包：

```json
{
  "@oasisprotocol/client": "1.2.0",
  "@oasisprotocol/client-rt": "1.2.0",
  "bignumber.js": "9.1.2",
  "js-yaml": "4.1.0",
  "@ethereumjs/util": "9.1.0",
  "date-fns": "3.6.0"
}
```

**注意：** 使用了 `--legacy-peer-deps` 来解决 React 19 的依赖冲突。

### 3. **配置调整**

- ✅ 移除了 `@mui/material` 依赖（注释掉 Theme 相关代码）
- ✅ 保持了与现有项目的兼容性
- ✅ 导出了常用的配置和工具函数

---

## 🚀 主要功能

### 支持的查询类型

1. **账户查询**
   - 账户信息和余额
   - 账户交易历史
   - ERC20 代币余额
   - NFT 持有情况

2. **交易查询**
   - 单个交易详情
   - 交易列表
   - 交易事件

3. **区块查询**
   - 区块详情
   - 区块列表
   - 最新区块

4. **智能合约查询**
   - ERC20 代币信息
   - ERC721 NFT 信息
   - 合约事件日志
   - 合约交互历史

5. **NFT 查询**
   - NFT 集合信息
   - 单个 NFT 详情
   - NFT 持有者
   - NFT 转移记录

### 支持的网络

- **Sapphire** (主要使用)
  - Mainnet: `000000000000000000000000000000000000000000000000f80306c9858e7279`
  - Testnet: `000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c`

- **Emerald**
  - Mainnet: `000000000000000000000000000000000000000000000000e2eaa99fc008f87f`
  - Testnet: `00000000000000000000000000000000000000000000000072c8215e60d5bca7`

- **Cipher**
  - Mainnet: `000000000000000000000000000000000000000000000000e199119c992377cb`
  - Testnet: `0000000000000000000000000000000000000000000000000000000000000000`

---

## 📝 使用方法

### 基础导入

```typescript
// 导入查询 Hooks
import { 
  useGetRuntimeAccountsAddress,
  useGetRuntimeTransactionsTxHash,
  useGetRuntimeBlocks,
} from '@/dapp/oasisQuery';

// 导入配置
import { 
  paraTimesConfig,
  getTokensForScope,
} from '@/dapp/oasisQuery';

// 导入工具函数
import { 
  fromBaseUnits,
  toBaseUnits,
  isValidEthAddress,
} from '@/dapp/oasisQuery';
```

### 快速示例

```typescript
// 查询账户余额
const { data, isLoading } = useGetRuntimeAccountsAddress(
  'sapphire',
  'testnet',
  '0x...'
);

// 查询交易
const { data: tx } = useGetRuntimeTransactionsTxHash(
  'sapphire',
  'testnet',
  '0x...'
);

// 查询 NFT
const { data: nfts } = useGetRuntimeEvmTokensAddressNfts(
  'sapphire',
  'testnet',
  '0x...',
  { limit: 20 }
);
```

详细示例请查看 `src/dapp/oasisQuery/EXAMPLES.md`。

---

## ⚠️ 注意事项

### 1. React Query 版本差异

- **原始版本**: `@tanstack/react-query@4.36.1`
- **当前版本**: `@tanstack/react-query@5.81.2`

**可能的影响：**
- API 调用方式可能略有不同
- 某些配置选项可能需要调整
- 建议参考 [React Query v5 迁移指南](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)

### 2. 环境变量

如果需要自定义 API 端点，可以添加环境变量：

```env
# .env
VITE_OASIS_NEXUS_API_URL=https://nexus.oasis.io/v1/
```

### 3. 数据筛选和处理

当前模块提供原始查询功能，**需要自行实现**：

- ✅ 数据筛选逻辑（类似 The Graph 的 where 条件）
- ✅ 数据聚合和统计
- ✅ 分页加载优化
- ✅ 本地缓存策略

### 4. 错误处理

建议在使用时添加完整的错误处理：

```typescript
const { data, isLoading, error, refetch } = useGetRuntimeAccountsAddress(
  'sapphire',
  'testnet',
  address
);

if (error) {
  console.error('查询失败:', error);
  // 显示错误提示
  // 提供重试按钮
}
```

---

## 🔧 后续工作建议

### 1. 实现数据筛选方案

创建自定义 Hooks 来实现类似 The Graph 的筛选功能：

```typescript
// 示例：筛选特定状态的 Box
function useFilteredBoxes(status: string) {
  const { data } = useGetRuntimeAccountsAddressTransactions(...);
  
  // 实现筛选逻辑
  const filtered = useMemo(() => {
    return data?.transactions?.filter(tx => {
      // 解析交易数据，筛选特定状态的 Box
      return tx.status === status;
    });
  }, [data, status]);
  
  return filtered;
}
```

### 2. 实现数据聚合

创建聚合查询来获取统计数据：

```typescript
// 示例：统计用户的 Box 数量
function useUserBoxStats(address: string) {
  const { data } = useGetRuntimeAccountsAddress(...);
  
  const stats = useMemo(() => {
    // 计算各种统计数据
    return {
      totalBoxes: data?.stats?.num_txns || 0,
      // ... 其他统计
    };
  }, [data]);
  
  return stats;
}
```

### 3. 优化缓存策略

配置 React Query 的缓存策略：

```typescript
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,        // 30 秒内使用缓存
      cacheTime: 300000,       // 缓存保留 5 分钟
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});
```

### 4. 实现事件监听

如果需要实时更新，可以实现轮询或 WebSocket：

```typescript
// 轮询示例
function useRealtimeBlocks() {
  const { data, refetch } = useGetRuntimeBlocks(...);
  
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // 每 5 秒刷新
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  return data;
}
```

---

## 📚 参考文档

### 官方文档

- [Oasis Explorer GitHub](https://github.com/oasisprotocol/explorer)
- [Oasis Nexus API](https://nexus.oasis.io/v1/)
- [Oasis 官方文档](https://docs.oasis.io/)
- [Sapphire ParaTime](https://docs.oasis.io/dapp/sapphire/)

### 项目文档

- `src/dapp/oasisQuery/README.md` - 完整使用文档
- `src/dapp/oasisQuery/EXAMPLES.md` - 详细使用示例

### API 规范

- [HTML 规范](https://nexus.oasis.io/v1/spec/v1.html)
- [YAML 规范](https://nexus.oasis.io/v1/spec/v1.yaml)

---

## ✨ 总结

### 已完成

- ✅ 成功迁移 Oasis Query 模块到 `src/dapp/oasisQuery/`
- ✅ 安装所有必要的依赖包
- ✅ 移除不兼容的依赖（MUI）
- ✅ 创建完整的使用文档和示例
- ✅ 导出常用的配置和工具函数

### 待实现

- ⏳ 数据筛选和过滤方案
- ⏳ 数据聚合和统计功能
- ⏳ 本地缓存优化
- ⏳ 实时数据更新机制

### 下一步

1. 根据项目需求实现自定义的数据筛选逻辑
2. 创建适合项目的数据聚合 Hooks
3. 优化查询性能和缓存策略
4. 集成到现有的页面组件中

---

**迁移完成时间**: 2025-10-05

**迁移状态**: ✅ 成功

如有任何问题，请参考 `src/dapp/oasisQuery/README.md` 或查看示例代码。

