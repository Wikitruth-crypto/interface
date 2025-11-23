## 前端页面数据应用
注意：以下数据字段可能会有增加，所以不必严格按照定义的来。
      另外，这只是描述了部分页面的需求，但是它展示了大致的查询需求，有助于设计数据库的tables。

### 1. Marketplace页面
#### 1.1 统计数据
展示Box的综合数据和综合交易数据
  - `totalSupply`: 全网 Box 总供应量
  - `totalStoring`: 处于 Storing 的 Box 数量
  - `totalOnSale`: OnSale = Selling + Auctioning 的合计数量
  - `totalSwaping`: Swaping = Paid + Refunding 的合计数量
  - `totalInSecrecy`: InSecrecy 数量
  - `totalPublished`: Published 数量
  - `total_gtv`: 总金额表（包含存入 - 提出 + 奖励,获取`token_total_amounts`数据进行计算）

#### 1.2 列表数据（MarketplaceList）
用于展示卡片列表
- 单项结构： `Box` + `metadataBox`
  - 基础（来自 `Box`）：`boxId`、`price`、`status`、`deadline`、`boxInfoCID` 等等
  - 元数据（metadtaBox）：`title`、`description`、`nftImage`、`boxImage`、`country`、`state`、`eventDate`、`typeOfCrime`等等


#### 1.3 筛选（搜索）
- 排序应该支持递增/递减
- `search?: string`（可以搜索包含了box和metadata的内容，然后返回相关的box和metadata）
- `country?: string` 
- `state?: string`
- `status?: BoxStatus | 'Default'`
- `sort?: 'Default' | 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'id_asc' | 'id_desc'`
- `priceRange?: { min?: number; max?: number }`
- `dateRange?: { start?: string; end?: string }`（eventData`Box`）
- `idRange?: { start?: number; end?: number }`


#### 1.4 分页
与常规的一样使用`limit`和`offset`获取指定页面的数据，开始值、页面数量。


### 2. BoxDetail页面
这个页面会获取当前Box的所有相关的数据，包含：与box相关的支付记录。
这些数据会被用于展示不同的内容

#### 2.1 详情数据
用于展示单个 Box 的完整详情信息，

- 基础数据（来自 `Box`）：
  - `boxId`、`price`、`status`、`deadline`、`boxInfoCID`
  - `minter`、`owner`、`publisher`、`seller`、`buyer`、`completer`（User对象，包含 `id` 等）
  - `bidders`（User数组）
  - `acceptedToken`（Token对象，包含 `id`、`symbol`、`decimals` 等）
  - `listedMode`、`isInBlacklist`、`refundPermit`
  - `createTimestamp`、`sellTimestamp`、`publishTimestamp`、`listedTimestamp`、`purchaseTimestamp`
  - `requestRefundDeadline`、`reviewDeadline`、`completeTimestamp`
  - `paymentLogs`、`userOrders`、`rewardAmounts` 等等

- 元数据（来自 `metadataBox`）：
  - `title`、`description`、`nftImage`、`boxImage`
  - `country`、`state`、`eventDate`、`createDate`、`typeOfCrime`、`label`
  - `fileList`（文件CID列表）
  - 加密相关字段（`encryptionSlicesMetadataCID`、`encryptionFileCID`、`encryptionPasswords`、`publicKey` 等）等等

### 3. Profile页面

#### 3.1 设计思路
这个页面相对更加复杂，是展示与User相关的所有数据，会将与User相关的Box划分成多个分类（Tab）。主要特点：

- **数据组织方式**：根据用户在不同Box中的角色（minter、owner、seller、buyer、bidder、completer、publisher），将Box划分成不同的分类
- **分类展示**：通过Tab切换，展示不同分类的Box列表，每个Tab显示对应的统计数量
- **资金管理**：每个Box卡片显示资金信息（支持多个Token），包含是否有可提取的orderAmount/refundAmount，以及该Box累计的总奖励。
- **筛选排序**：支持按状态筛选、按字段排序（boxId、price、createTimestamp）
- **分页加载**：支持分页或Load More模式加载更多数据

#### 3.2 用户统计数据（UserStats）
这里分成两部分：
1. 展示用户已提取和未提取的奖励资金：
  - `HelperRewards`: 已提取、未提取的奖励
  - `MinterRewards`: 创建者奖励（minter）已提取、未提取的奖励。

2. 展示用户在各个分类中的Box数量统计：

- `totalBoxes`: 所有Box总数（去重）
- `ownedBoxes`: 拥有的Box数量（owner = userAddress）
- `mintedBoxes`: 创建的Box数量（minter = userId）
- `soldBoxes`: 出售的Box数量（seller = userId）
- `boughtBoxes`: 购买的Box数量（buyer = userId）
- `bidBoxes`: 参与竞拍的Box数量（bidder 中包含 userId）
- `completedBoxes`: 完成的Box数量（completer = userId）
- `publishedBoxes`: 发布的Box数量（publisher = userId）


#### 3.3 Box分类（Tab）
用于筛选和展示不同类别的Box：

- `all`: 所有Box（不筛选）
- `owned`: 拥有的Box（`box.owner.id === userAddress`）
- `minted`: 创建的Box（`box.minter.id === userId`）
- `sold`: 出售的Box（`box.seller?.id === userId`）
- `bought`: 购买的Box（`box.buyer?.id === userId`）
- `bade`: 参与竞拍的Box（`box.bidders` 中包含 `userId`）
- `completed`: 完成的Box（`box.completer?.id === userId`）
- `published`: 发布的Box（`box.publisher?.id === userId`）

#### 3.4 列表数据（ProfileList）
用于展示卡片列表，每个卡片包含：

- **基础数据**（来自 `Box`）：`boxId`、`price`、`status`、`deadline`、`boxInfoCID`、`minter`、`owner`、`seller`、`buyer`、`completer`、`publisher`、`bidders`、`acceptedToken`、`listedMode`、`refundPermit` 等等
- **元数据**（来自 `metadataBox`）：`title`、`description`、`nftImage`、`boxImage`、`country`、`state`、`eventDate`、`typeOfCrime` 等等
- **资金数据**（Funds）：每个Box的可提取资金信息
  - `officeToken`: 平台代币（officeToken）的金额、符号、格式化金额
  - `acceptedToken`: 接受的代币（acceptedToken）的金额、符号、格式化金额
  - `rewards`：Box奖励资金统计（根据奖励类型和代币来分别展示）。
  - `refundAmounts`: 这个是展示当前User在Box中是否有退款资金（与`refundPermit`相关）
  - `orderAmounts`: 这个是展示当前User在Box中是否有order可提取资金，这就是竞拍失败的资金。

#### 3.5 筛选和排序
排序方式与Marketplace有部分相似之处，后续可能也会扩展至精确搜索功能。
- **Tab筛选**：通过 `selectedTab` 选择要展示的分类
- **状态筛选**：`selectedStatus?: BoxStatus`（可选）
- **排序**：
  - `orderBy`: `'boxId' | 'price' | 'createTimestamp'`
  - `orderDirection`: `'asc' | 'desc'`

#### 3.6 资金提取（refund和order资金）

对于`refundAmounts`和`orderAmounts`支持批量选择多个Box的资金进行统一提取：

- **选择机制**：每个Box可以单选一个代币类型（officeToken 或 acceptedToken）进行提取
- **批量选择**：可以同时选择多个Box的资金，统一提取
- **提取方法**：根据资金类型和Box状态，调用对应的合约方法
  - `withdrawOrderAmounts`: 订单金额（拍卖未中标的订单）
  - `withdrawRefundAmounts`: 订单金额（获得退款许可的订单）
  
