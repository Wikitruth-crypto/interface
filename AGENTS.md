# WikiTruth Agent 指南

## 项目概览
- WikiTruth 是一个围绕链上真相市场的去中心化应用，本仓库提供 React 19 + Vite 6 构建的前端界面。
- 入口文件位于 `src/main.tsx` 与 `src/App.tsx`，项目名称常量集中在 `src/project.ts`。
- 主要依赖包含 Ant Design、TailwindCSS、Zustand、TanStack Query、RainbowKit/Wagmi、Viem/Ethers，以及 three.js 可视化栈。

## 目录与模块职责
- `src/`：前端源码根目录。
  - `components/`：通用组件库，按照 `base/`、`ui/`、`sections/`、`earth3d/` 等子目录划分。顶层的 `Header.tsx`、`Footer.tsx`、`dappHeader.tsx` 负责全局布局。
  - `pages/`：路由级页面，组织高阶布局与页面逻辑。
  - `hooks/`：跨模块共享的自定义 Hook。
  - `contexts/` 与 `store/`：React Context 与 Zustand 切片，集中处理全局状态与会话信息。
  - `config/`、`types/`、`styles/`、`assets/`：运行配置、类型定义、样式体系与静态资源。
  - `dapp/`：链上交互的核心域，包括：
    - `pages/`：Create、Marketplace、BoxDetail、Profile、Token、Staking、Dao 等业务页面。
    - `components/`、`hooks/`、`services/`、`utils/`：链路复用组件、EVM 交互 hooks、后台服务封装与常用工具。
    - `contractsConfig/`：多网络合约地址/ABI 配置；`artifacts/` 存放自动生成的编译产物，避免手工修改。
    - `store_sapphire/`：Oasis Sapphire 事件监听与消费逻辑，还包含了处理和存储metadataStore数据。
    - `oasisQuery/`：迁移自 Oasis Explorer 的查询客户端（`app/`、`oasis-nexus/`、`types/`），视为 vendored 代码，修改需同步上游。
  - `lib/`：纯函数工具与跨域共享逻辑。
- `public/`：静态资源，构建时直接复制。
- `docs/`：产品流程、技术方案与排障笔记（如加密架构、表单校验、合约配置等），功能改动时务必同步更新。
- 工程化配置集中在根目录：`vite.config.ts`（含模块别名 `@`, `@dapp` 等）、`tailwind.config.js`、`postcss.config.mjs`、`eslint.config.mjs`、`tsconfig.json`。

## 开发与构建命令
- `npm install`：安装依赖；如 lockfile 变更需重新执行。
- `npm run dev`：开启本地开发服务器（默认 `http://localhost:3000` 且自动打开浏览器）。
- `npm run build`：执行 TypeScript 检查并产出 `dist/` 构建。
- `npm run preview`：基于构建产物进行本地验收。
- `npm run lint`：运行 ESLint（配置详见 `eslint.config.mjs`）。
- `npx vitest` / `npx vitest run`：执行 Vitest 测试（仓库未定义 `npm run test`，需要显式调用）。

## 代码风格与命名
- 全量使用 TypeScript。组件与页面采用 PascalCase，hooks/工具方法使用 camelCase，样式文件维持 kebab-case。
- 默认使用单引号、2 空格缩进、尾随逗号；交由 ESLint 与 Tailwind 插件校验。
- UI 组合优先使用 Tailwind 原子类与 Ant Design 组件，避免冗长内联样式。
- 共享逻辑尽量抽离为 hooks / services，减少页面层链上调用重复。
- 新增路径别名时同步更新 `vite.config.ts`、`tsconfig.json` 与 ESLint 设置。

## 测试约定
- 单元测试采用 Vitest，测试文件放置在被测模块同级的 `__tests__/` 目录，命名为 `*.test.ts` / `*.test.tsx`。
- 快照文件置于 `__snapshots__/`；更新快照请运行 `npx vitest -u` 并一并提交。
- 新增 hooks / services / store 切片需至少提供一条核心逻辑用例；如无法覆盖，需在 PR 中说明原因与手动验证流程。
- 涉及 `src/dapp/oasisQuery` 的改动须保持 PowerShell/Bash 辅助脚本一致性。

## 文档与协作流程
- 功能、架构或接口调整必须同步刷新 `docs/` 目录内对应文档，并在 PR 描述中链接。
- 引入新的环境变量时更新 `.env.example`，说明用途与默认值；实际密钥通过团队安全渠道共享。
- 提交前确认 `npm run lint`、必要单测和构建通过；如依赖上游仓库（例如 oasisQuery），需在 PR 中备注同步状态。
- Commit 信息保持简短祈使句，可选 scope（如 `feat: marketplace`、`fix: header`），限制在 72 字符内，禁止使用 `WIP`。
- PR 模板建议包含：变更摘要、风险/回滚方案、本地验证（`npm run build`、`npm run lint`、`npx vitest run` 等）、相关 Issue/文档链接，以及 UI 变更的截图或 GIF。

## 环境安全与其他约束
- 首次开发前将 `.env.example` 复制为 `.env`，仅存放本地测试所需配置，切勿提交真实秘钥。
- 构建产物输出在 `dist/`，不要纳入版本控制。
- 依赖升级或工程配置调整需评估对链上交互、文档与团队工作流的影响，并在 PR 中列出迁移步骤。
- 如果发现已有代码存在未同步的本地改动，先与仓库维护者确认后再处理，避免误回滚团队成员的工作。
