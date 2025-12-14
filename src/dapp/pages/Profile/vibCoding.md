# WikiTruth Profile页面

## 简述
Profile页面实际上就是展示与当前User有关的所有信息，主要与其有关的Box、资金数据、以及实现提款等操作。

## 相关文档说明和组件：
- **合约逻辑文档**：新版本的项目机制做了一些改动，可以阅读`src\dapp\artifacts\PROJECT_LOGIC_CN.md`中FundManager相关的内容。
- **数据库文档**：采用了新的supabase数据库，可以阅读`supabaseDocs`中的内容。
- **查询服务**：实际的查询服务`src\dapp\services\supabase\profile.ts`。

## 业务功能：

1. 根据UserId和UserAddress，从supabase数据库获取与其相关的数据内容，数据会在统计组件进行展示。
2. 通过切换统计组件的tab，来显示不同类型的Box列表，filter则负责排序操作。
3. 每个Box卡片展示一些基础的数据，更重要的是要展示资金数据。
4. 如果有可提取资金，则可以进行批量提取操作。

## 数据获取流程：

### 1. 用户统计数据（UserStats）
通过 `queryUserStats` 函数从supabase获取：
- `totalBoxes`: 用户相关的所有Box总数（去重）
- `ownedBoxes`: 当前拥有的Box数量（基于`owner_address`）
- `mintedBoxes`: 铸造的Box数量（基于`minter_id`）
- `soldBoxes`: 出售的Box数量（基于`seller_id`）
- `boughtBoxes`: 购买的Box数量（基于`buyer_id`）
- `bidBoxes`: 参与竞价的Box数量（基于`box_bidders`表）
- `completedBoxes`: 完成订单的Box数量（基于`completer_id`）
- `publishedBoxes`: 公开的Box数量（基于`publisher_id`）

### 2. Box列表数据
通过 `queryUserBoxes` 函数从supabase获取，支持以下Tab筛选：
- `all`: 所有相关的Box（owner_address 或 userId相关字段）
- `owned`: 当前拥有的Box（基于`owner_address`）
- `minted`: 铸造的Box（基于`minter_id`）
- `sold`: 出售的Box（基于`seller_id`）
- `bought`: 购买的Box（基于`buyer_id`）
- `bade`: 参与竞价的Box（通过`box_bidders`表查询）
- `completed`: 完成订单的Box（基于`completer_id`）
- `published`: 公开的Box（基于`publisher_id`）

### 3. 资金数据获取

#### 3.1 orderAmounts（订单金额）
- **查询方式**：`src\dapp\services\supabase\fundsBox.ts`组件中的`query_OrderAmountsData`
- **用途**：查询用户在指定Box中的订单金额（用于竞价失败退款或退款许可，即`Order，refund`）
- **Order**：竞价失败，`bidders.includ(user) && user !==buyer`。
- **Refund**: 退款，`user === buyer && box.refundPermit === true`。
- **筛选条件**: 只有在bought和bade中才需要查询orderAmounts。

#### 3.2 User总奖励金额
- **查询方式**：`src\dapp\services\supabase\userData.ts`组件中的`query_UserRewardsData`
- **用途**: 展示user所获得的总奖励，
- **reward_type**：`Minter`, `Seller`, `Completer`（supabase tables的定义）
- **token**：支持多代币展示，因为合约机制可能造成每种奖励都可能会有多种代币。

#### 3.3 User总提取金额
- **查询方式**：`src\dapp\services\supabase\userData.ts`组件中的`query_UserWithdrawsData`
- **用途**: 展示user已提取的总金额（奖励），
- **withdraw_type**：`Minter`,`Helper`（supabase tables的定义， Seller和Completer都计入了Helper）
- **token**：支持多代币展示，因为合约机制可能造成每种奖励都可能会有多种代币。


#### 3.4 boxRewards（盒子所产生的奖励）
- **查询方式**：`src\dapp\services\supabase\fundsBoxList.ts`组件中的`query_BoxRewardsDataListByBoxIds`
- **用途**: 查询盒子所产生的总奖励，无其它业务逻辑，仅纯展示。
- **筛选条件**：只有`create`模式，并且`status === InSecry / Pubhish`，并且`buyer !== ''`的box才需要查询。
- **注意**：该功能暂时可以不实现！！！

## 资金类型与提款函数映射：

### 资金类型（FundType）
1. **Refund（退款）**：买家获得退款许可后可提取的退款金额
2. **Order（订单）**：竞价失败后可提取的订单金额
3. **HelperRewards（辅助奖励）**：完成订单等操作获得的奖励（多代币）
4. **MinterRewards（铸造者奖励）**：作为Box铸造者获得的奖励（多代币）

### Tab与资金类型的对应关系：

| Tab | 资金类型 | 提款函数 | 说明 |
|-----|---------|---------|------|
| `bought` / `bade` | Refund | `withdrawRefundAmounts` | 当`refundPermit === true`且用户是buyer时 |
| `bought` / `bade` | Order | `withdrawOrderAmounts` | 当竞价失败（`bidders.includes(user)`且`buyer !== user`）时 |

## 新旧版本差异（重要）：

### 1. withdrawOrderAmounts 函数变化

**旧版本**：
```typescript
// 参数顺序：[boxId数组, token地址, FundType]
args = [selectedBoxes, tokenAddress, selectedType as FundType];
```

**新版本**：
```solidity
function withdrawOrderAmounts(address token_, uint256[] calldata list_) external;
// 参数顺序：[token地址, boxId数组]
// 不再需要 FundType 参数
```

**影响**：
- 参数顺序改变：token在前，boxId数组在后
- 移除了`FundType`参数，合约内部会根据用户身份自动判断是Order还是Refund

### 2. withdrawRefundAmounts 函数

**新版本**：
```solidity
function withdrawRefundAmounts(address token_, uint256[] calldata list_) external;
// 参数顺序：[token地址, boxId数组]
```

**注意**：与`withdrawOrderAmounts`参数结构一致，但用于不同的资金类型

### 3. withdrawHelperRewards 和 withdrawMinterRewards

**新版本**：
```solidity
function withdrawHelperRewards(address token_) external;
function withdrawMinterRewards(address token_) external;
```

**变化**：
- 只需要`token`地址参数
- **不再需要boxId数组**，合约内部会汇总该用户的所有奖励

## UI详细说明：

### 检查UserId
监听UserId，如果当前没有UserId，则进行提示`需要登录`信息。
根据UserId和address从supabase查询相关的数据。

### 统计组件

**User奖励仪表盘**：User的资金统计数据
- 已获得的奖励：根据代币、`reward_type`分别展示
- 已提取的奖励：根据代币、`withdraw_type`分别展示
- 可提取的奖励：同上，但需要检查金额是否大于0。
- 提款：`withdrawHelperRewards` / `withdrawMinterRewards`：只需要传入token地址

**Box统计**：展示与User相关的Box数据统计
- All：所有相关的Box总数
- Minted：铸造的Box数量
- Owned：当前拥有的Box数量
- Sold：出售的Box数量
- Bought：购买的Box数量
- Bade：参与竞价的Box数量
- Completed：完成订单的Box数量
- Published：公开的Box数量

### Box列表卡片组件：

**列表**：
- 分页展示，每页默认10条
- 支持按`tokenId`、`price`、`createTimestamp`排序
- 支持按Box状态筛选

**Box卡片**：
- **基础数据**：Box ID、状态、价格、创建时间等
- **资金数据展示**：
  - 对于`bought`/`bade` Tab：显示`orderAmounts`（订单金额）
- **可提取标识**：当金额大于0时，显示可提取标识

### 提款操作流程：

1. **选择资金**：用户通过Radio选择要提取的资金类型和代币
2. **自动聚合**：系统自动聚合相同`tokenSymbol`、`type`、`claimMethod`的所有Box
3. **批量提款**：
   - `withdrawOrderAmounts` / `withdrawRefundAmounts`：需要传入boxId数组和token地址
   
4. **参数构建**：
   ```typescript
   // Order/Refund类型
   args = [tokenAddress, selectedBoxes] // 注意顺序
   ```

### 注意事项：

1. **批量提款限制**：`withdrawOrderAmounts`和`withdrawRefundAmounts`支持批量操作，但必须是**同一个token**的Box才能批量提取
2. **资金类型判断**：
   - Refund：需要`refundPermit === true`且用户是buyer
   - Order：需要用户是bidders之一但不是buyer
   - 合约会根据用户身份自动判断，前端不需要传递FundType
3. **状态检查**：奖励类资金需要Box状态为`InSecrecy`或`Published`（注意：新版本中`Completed`状态已改为`InSecrecy`）

