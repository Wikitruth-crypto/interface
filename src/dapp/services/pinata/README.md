# Pinata IPFS 上传服务

快速参考文档。完整文档请查看：[docs/service-pinata.md](../../../../docs/service-pinata.md)

## 快速开始

### 1. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```env
VITE_IPFS_PINTA_JWT=your_pinata_jwt_token
VITE_IPFS_PINTA_Gateway=https://your-gateway.mypinata.cloud
```

### 2. 使用示例

```typescript
import { pinataService } from '@dapp/services/pinata';

// 测试网上传文件（默认）
const result = await pinataService.uploadFile(file, {
  groupType: 'Evidence',
  network: 'testnet', // 可选，默认 'testnet'
  setProgress: (p) => console.log(`Progress: ${p}%`)
});

// 主网上传文件
const mainnetResult = await pinataService.uploadFile(file, {
  groupType: 'Evidence',
  network: 'mainnet', // 主网 Evidence 支持 500MB
  setProgress: (p) => console.log(`Progress: ${p}%`)
});

console.log('IPFS URL:', result.url);
console.log('CID:', result.cid);
```

## 文件结构

```
pinata/
├── index.ts          # 模块入口，导出公共 API
├── types.ts          # TypeScript 类型定义
├── config.ts         # 配置管理和 Group 映射
├── pinataService.ts  # 核心上传服务实现
└── README.md         # 本文件
```

## API 方法

- `pinataService.uploadFile(file, options)` - 上传文件到 IPFS
- `pinataService.uploadJSON(data, options)` - 上传 JSON 到 IPFS
- `pinataService.getFileUrl(hash)` - 生成 IPFS URL

## 网络隔离和 Group 类型

### 测试网 (testnet，默认)
- `MintData` - 铸造数据（最大 24KB）
- `ResultData` - 结果数据（最大 24KB）
- `Evidence` - 证据文件（最大 5MB）
- `Custom` - 自定义（最大 5MB）

### 主网 (mainnet)
- `MintData` - 铸造数据（最大 24KB）
- `ResultData` - 结果数据（最大 24KB）
- `Evidence` - 证据文件（最大 **500MB**）⭐
- `Custom` - 自定义（最大 5MB）

**预配置 Group 管理：** 使用环境变量中预配置的 Pinata Group IDs，无需动态创建。

## 更多信息

查看完整文档：[docs/service-pinata.md](../../../../docs/service-pinata.md)

