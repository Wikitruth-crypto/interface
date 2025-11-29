# Create 模块架构文档

## 📋 模块概述

Create模块是WikiTruth DApp的核心功能，负责NFT的创建和铸造。该模块采用分层架构设计，包含表单管理、状态管理、工作流编排、UI组件等核心功能。

## 🏗️ 整体架构

```
Create/
├── 📁 components/          # UI组件层
├── 📁 containers/          # 容器组件层  
├── 📁 context/            # React上下文
├── 📁 hooks/              # 自定义Hooks
├── 📁 store/              # 状态管理
├── 📁 types/              # 类型定义
├── 📁 workflow/           # 工作流系统
├── 📁 validation/         # 数据验证
└── 📁 ModalDialog/        # 模态对话框
```

## 🔧 核心功能模块

### 1. 表单管理 (`context/` + `hooks/`)

**职责**: 统一管理表单状态和验证

**核心文件**:
- `context/CreateFormContext.tsx` - React表单上下文
- `hooks/Input/` - 各种输入组件的Hooks
- `hooks/useInputChangeTracker.ts` - 输入变更追踪

**功能**:
- 表单状态统一管理
- 实时验证和错误提示
- 输入变更自动追踪

### 2. 状态管理 (`store/`)

**职责**: 全局状态管理，数据持久化

**核心文件**:
- `store/useNFTCreateStore.ts` - NFT创建状态管理
- `store/useCreateWorkflowStore.ts` - 工作流状态管理
- `types/stateType.ts` - 状态类型定义

**功能**:
- 表单数据存储
- 文件数据管理
- 工作流状态追踪
- 变更字段追踪

### 3. 工作流系统 (`workflow/`)

**职责**: 智能编排NFT创建流程

**核心文件**:
- `config/workflowConfig.ts` - 工作流配置和智能编排
- `core/` - 工作流核心逻辑
- `steps/` - 具体执行步骤
- `hooks/useIntelligentWorkflow.ts` - 工作流Hook

**功能**:
- 智能编排执行计划
- 支持三种场景：初次执行、继续执行、数据变更--------不需要场景设置
- 步骤依赖管理
- 错误处理和重试

### 4. UI组件层 (`components/` + `containers/`)

**职责**: 用户界面展示和交互

**核心文件**:
- `containers/formContainer.tsx` - 主表单容器
- `components/` - 各种输入组件
- `ModalDialog/mintProgress/` - 进度显示模态框

**功能**:
- 表单输入组件
- 文件上传组件
- 进度显示
- 用户交互反馈

### 5. 数据验证 (`validation/`)

**职责**: 数据完整性验证

**核心文件**:
- `validation/schemas.ts` - 验证规则定义

**功能**:
- 表单数据验证
- 文件类型验证
- 必填字段检查

## 🔄 数据流架构

### 1. 用户输入流程
```
用户输入 → 表单组件 → useFormInput Hook → CreateFormContext → useNFTCreateStore
```

### 2. 工作流执行流程
```
用户点击创建 → useIntelligentWorkflow → SmartWorkflowOrchestrator → 步骤执行 → 状态更新
```

### 3. 状态同步流程
```
Store状态变更 → UI组件重新渲染 → 进度显示更新 → 用户反馈
```

## 📊 核心数据结构

### 1. 表单数据 (`BoxInfoFormType`)
```typescript
interface BoxInfoFormType {
  title: string;           // 标题
  description: string;     // 描述
  typeOfCrime: string;    // 犯罪类型
  country: string;         // 国家
  state: string;           // 州/省
  eventDate: string;       // 事件日期
  createDate: string;      // 创建日期
  timestamp: string;       // 时间戳
  nftOwner: string;        // NFT所有者
  price: string;           // 价格
  mintMethod: MintMethod;  // 铸造方式
}
```

### 2. 文件数据 (`MintFileStoreType`)
```typescript
interface MintFileStoreType {
  zipFile: Blob | null;        // 压缩文件
  sliceFileList: Blob[] | null; // 分片文件
  nftImage: File | null;       // NFT图片
  metadataBox: File | null;    // Box元数据
  metadataNFT: File | null;    // NFT元数据
  resultData: File | null;     // 结果数据
}
```

### 3. 工作流状态 (`WorkflowStatus`)
```typescript
type WorkflowStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';
```

## 🎯 智能工作流系统

### 工作流步骤 (`allSteps`)
```typescript
const allSteps = [
  'compressFiles',    // 压缩文件
  'uploadFiles',     // 上传文件
  'encryptData',     // 加密数据
  'uploadBoxImage',  // 上传Box图片
  'setTimestamp',    // 设置时间戳
  'createNFTImage',  // 创建NFT图片
  'uploadNFTImage',  // 上传NFT图片
  'createMetadata',  // 创建元数据
  'uploadMetadata',  // 上传元数据
  'mint',           // 铸造NFT
  'uploadResultData' // 上传结果数据
];
```

### 智能编排场景

**场景1: 初次执行**
- 执行所有步骤
- 完整流程创建

**场景2: 继续执行**
- 从失败步骤开始
- 跳过已完成的步骤

**场景3: 数据变更**
- 根据变更字段计算影响范围
- 只重新执行受影响的步骤

### 字段影响映射
```typescript
const FIELD_IMPACT_MAP = {
  'fileList': ['compressFiles', 'uploadFiles', 'encryptData'],
  'typeOfCrime': ['createNFTImage', 'uploadNFTImage', 'createMetadata', ...],
  'title': ['createNFTImage', 'uploadNFTImage', 'createMetadata', ...],
  // ... 其他字段影响
};
```

## 🔧 关键Hooks

### 1. `useIntelligentWorkflow`
```typescript
const {
  startWorkflow,    // 开始工作流
  cancelWorkflow,   // 取消工作流
  resetWorkflow,    // 重置工作流
  checkData,        // 检查数据完整性
  canStart,         // 是否可以开始
  canCancel,        // 是否可以取消
  workflowStatus,   // 工作流状态
  changedFields     // 变更字段
} = useIntelligentWorkflow();
```

### 2. `useInputChangeTracker`
- 追踪用户输入变更
- 更新变更字段列表
- 支持智能重试

## 📱 UI组件说明

### 主要组件
- `formContainer.tsx` - 主表单容器
- `mintButton.tsx` - 创建按钮
- `progressCreate.tsx` - 进度显示
- `fileUploadCreate.tsx` - 文件上传
- `imageUploadCreate.tsx` - 图片上传

### 输入组件
- `inputTitleCreate.tsx` - 标题输入
- `inputTypeOfCrime.tsx` - 犯罪类型选择
- `countrySelectorCreate.tsx` - 国家选择
- `dateSelectorCreate.tsx` - 日期选择
- `inputPriceCreate.tsx` - 价格输入

## 🚀 使用方式

### 1. 基本使用
```typescript
import { useIntelligentWorkflow } from './hooks/useIntelligentWorkflow';

function CreateComponent() {
  const { startWorkflow, canStart } = useIntelligentWorkflow();
  
  return (
    <button 
      onClick={startWorkflow}
      disabled={!canStart}
    >
      开始创建
    </button>
  );
}
```

### 2. 状态监听
```typescript
const { workflowStatus, changedFields } = useIntelligentWorkflow();

useEffect(() => {
  if (workflowStatus === 'processing') {
    // 显示进度
  }
}, [workflowStatus]);
```

## 🔍 调试和监控

### 1. 状态监控
- 使用React DevTools查看Store状态
- 控制台输出工作流执行日志
- 进度条显示当前执行步骤

### 2. 错误处理
- 自动错误捕获和显示
- 支持重试机制
- 详细的错误信息提示

## 📈 性能优化

### 1. 状态管理优化
- 使用Zustand进行状态管理
- 避免不必要的重新渲染
- 状态更新批处理

### 2. 工作流优化
- 智能编排减少不必要的步骤
- 支持断点续传
- 异步步骤执行

## 🔮 未来规划

### 1. 功能增强
- 支持更多文件类型
- 增加批量创建功能
- 优化用户体验

### 2. 架构优化
- 进一步简化工作流配置
- 增强错误处理机制
- 提升性能表现

---

**文档版本**: v1.0  
**最后更新**: 2024年12月  
**维护者**: WikiTruth开发团队
