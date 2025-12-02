# WikiTruth Profile 页面设计指南

## 1. 页面目标
Profile 页面用于展示与当前登录用户（wallet address + userId）相关的链上 Box 与资金流，并提供集中化的提现工具。核心业务覆盖如下：

1. 通过 Supabase 汇总用户的 Box 统计、订单资金、奖励资金以及提现记录。
2. 为不同角色（buyer/bidder/minter/helper）提供可视化的资金卡片，支持批量选择与提款。
3. 将链上 FundManager 合约的多种 withdraw* 方法封装在统一的 UI 交互中，减少重复的按钮与逻辑。

> **注意**：整个页面的数据源均来自最新的 Supabase 表结构：
> - `boxes`/`metadata_boxes`：获取 Box 基础信息与元数据。
> - `box_user_order_amounts`：记录 buyer/bidder 针对某个 Box 的资金余额（订单或退款）。
> - `user_rewards` / `user_withdraws`：记录 minter/helper 累计奖励与历史提现。

## 2. 数据流与 Hooks

| 模块 | Hook/Store | 作用 |
|------|------------|------|
| 用户身份 | `useGetMyUserId` | 解析钱包绑定的 userId，无 userId 时仅能查询 `owned` tab。|
| 统计数据 | `useUserProfile` | 通过 `queryUserStats` 汇总各类型 Box 数量并驱动顶部 Tab。|
| Box 列表 | `useUserBoxes` | 结合 filters 与 Supabase 分页，返回包含元数据的 Box 列表。|
| 订单资金 | `useFunds` | 针对 `bought/bade` tab 查询 `box_user_order_amounts`，计算可提金额并返回 `ClaimableFund`。|
| 奖励资金 | `useUserRewardsSummary` | 汇总 `user_rewards` / `user_withdraws`，按代币展示 minter/helper 奖励。|
| 提现状态 | `useWithdrawStore` | 统一管理所有被选中的 Box/token，记录 token 地址、精度、claim method 等。|
| 合约交互 | `useWithdraw` / `useRewardsWithdraw` | 包装 FundManager 合约，分别处理订单/退款与奖励提现。

### ClaimableFund 类型
```
interface TokenData {
  amount: string;
  formattedAmount: string;
  symbol: string;
  address?: string;
  decimals?: number;
  hasValidAmount: boolean;
}
interface ClaimableFund {
  boxId: string;
  type: 'Refund' | 'Order' | 'HelperRewards' | 'MinterRewards';
  claimMethod: ClaimMethodType;         // withdrawOrderAmounts / withdrawRefundAmounts / ...
  tokens: TokenData[];                  // 当前场景通常只有一个 token，但结构允许扩展
}
```
> 不再区分 `officeToken` / `acceptedToken`，所有代币均以 `TokenData` 表示，便于扩展多 token 奖励场景。

## 3. UI 结构

1. **UserIdAlert + ProfileContainer**：容器负责获取 userId、装载全部子组件并传递 state。
2. **UserDataBar**：展示 `useUserProfile` 返回的统计指标，点击 Tab 触发列表重载。
3. **ProfileRewardsPanel**：集中展示 `user_rewards` / `user_withdraws` 聚合的 Helper/Minter 奖励，并提供 `withdrawHelperRewards` / `withdrawMinterRewards` 操作。
4. **CardProfileContainer 列表**：
   - `CardProfile` 渲染单个 Box 的图文信息与资金 Radio；
   - `CardProfileContainer` 使用 `useFunds` 计算 `ClaimableFund`，并把可选 token 注册到 `useWithdrawStore`。
5. **ProfileWithdrawPanel**：一旦用户在 Box 卡片中选择了订单/退款资金，就在列表下方展示聚合金额与统一的提现按钮。

### 卡片与提现联动
- 每个 Box 仅负责“选择/取消”某个代币（Radio），不再渲染独立的 Claim 按钮。
- `useWithdrawStore` 根据 token symbol + claimMethod 自动聚合同类 Box，确保批量提现参数满足合约要求（同一 token + boxId 列表）。
- `ProfileWithdrawPanel` 从 store 读取：
  - `selectedBoxes` → 传给合约的 boxId 数组；
  - `selectedTokenAddress/selectedTokenDecimals` → 用于展示与组装合约参数；
  - `totalAmount()` → BigInt，始终使用 store 中的注册数据累加。

## 4. Supabase 查询与过滤

### Box 列表过滤逻辑
- `useProfileTable`/`useProfileStore` 管理 `selectedTab`、排序字段与状态筛选；
- `useUserBoxes` 根据 Tab 组合条件：
  - `owned` 用 `owner_address`；`minted/sold/bought/...` 使用 userId 字段；
  - `bade` 先查询 `box_bidders` 获得 boxId 列表再 `in` 查询。

### 订单金额：`box_user_order_amounts`
- 仅在 `bought` / `bade` Tab 启用查询；
- 请求参数：`box_id`、`user_id`、`token`（来自 Box 的 `accepted_token`）；
- 业务判断：
  - Refund → `refundPermit = true` 且 `buyerId === userId`；
  - Order → 竞拍失败（bidders 包含 userId 且 buyerId !== userId）。

### 奖励金额：`user_rewards` / `user_withdraws`
- `useUserRewardsSummary` 按 rewardType（Minter / Helper）与 token 聚合：
  - `earned` = `user_rewards.amount`；
  - `withdrawn` = `user_withdraws.amount`；
  - `claimable` = `earned - withdrawn`。
- 仅当 `claimable > 0` 才允许提现按钮。

## 5. 合约交互映射

| 资金类型 | Claim Method | 参数格式 |
|----------|--------------|----------|
| Order | `withdrawOrderAmounts` | `[tokenAddress, boxId[]]` |
| Refund | `withdrawRefundAmounts` | `[tokenAddress, boxId[]]` |
| Helper Rewards | `withdrawHelperRewards` | `[tokenAddress]` |
| Minter Rewards | `withdrawMinterRewards` | `[tokenAddress]` |

实现要点：
- `useWithdraw` 根据 store 中的 `selectedClaimMethod` 自动组装参数；
- `useRewardsWithdraw` 单独处理 Helper/Minter 奖励提现，并在成功后 `invalidateQueries(['profile-user-rewards', ...])` 刷新数据。

## 6. 交互细则

1. **登录态**：用户未绑定 userId 时，展示提示并阻止非 owned tab/提现操作。
2. **选择逻辑**：再次点击相同 token 视为取消，store 会重置所有状态。
3. **金额格式**：所有 BigInt 金额通过 `formatAmount(amount, decimals, precision)` 格式化，默认展示 4 位小数，超过千/百万时自动转化为 K/M。
4. **异常处理**：
   - Supabase 请求失败 → ProfileContainer 显示错误模块并提供 “Reload”。
   - 合约调用失败 → Rewards/Withdraw 面板使用 `WithdrawCard` 的 error 状态提示并允许重试。
5. **扩展性**：
   - `ClaimableFund.tokens` 支持未来的多币种奖励；
   - `FundsSection` 仅依赖 `FundsData[]`，不再关注 office/accepted 的历史概念。

---
以上文档描述了 Profile 页面端到端的数据流、核心组件与提现流程，供后续扩展或复用时查阅。
