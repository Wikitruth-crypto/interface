# WikiTruth 核心业务逻辑说明文档

本文档详细说明 WikiTruth 项目的核心智能合约业务逻辑，重点阐述 **TruthBox (资产)**、**Exchange (交易)** 和 **FundManager (资金)** 之间的交互与生命周期管理。
另外，一些外围合约并不是特别重要，比如：**UserId（用户Id）**、**SiweAuth（SIWE令牌）**、**TruthNFT（nft合约）**、**AddressManager（地址管理合约）**，这些合约并未直接参与核心业务逻辑，所以不多做陈述。
---

## 1. 核心概念与合约架构

项目基于 **Oasis Sapphire** 隐私公链构建，利用其隐私计算特性实现了“加密信息交易”的独特业务。

*   **TruthBox.sol**: 核心资产合约。管理信息的存储（加密数据）、状态流转、定价与有效期。
*   **Exchange.sol**: 交易逻辑合约。管理挂单（Sell/Auction）、购买（Buy/Bid）、退款（Refund）与订单完成（Complete）。
*   **FundManager.sol**: 资金管理合约。处理多币种支付、DEX 自动兑换、手续费扣除与收益分发。
*   **UserId.sol**：用户Id注册管理合约，在多个场景（前端、合约事件日志）中替代真实的address，保证用户的隐私性。
*   **SiweAuth.sol**：Oasis sapphire隐私公链交互必备的（msg.sender）身份验证实现。
*   **AddressManager.sol**：管理项目中的合约地址，以及代币管理。
*   **TruthNFT.sol**：nft合约，与Box对应的ERC721资产（不重要）。
---

## 2. TruthBox：真相盒 (核心资产)

TruthBox 是平台交易的基本单元，每个 Box 包含公开信息与加密机密信息。

### 2.1 数据结构
```solidity
struct PublicData {
    Status _status; 
    uint256 _price; 
    uint256 _deadline; 
}

struct SecretData {
    address _minter;
    bytes _encryptedData; // Encrypted data (private key)
    bytes32 _nonce;// Encrypted nonce, decryption required
}
```
*   **公开数据 (Public Data)**:
    *   `Status`: 当前状态 (如出售中、已支付、公示中等)。
    *   `Price`: 当前价格。
    *   `Deadline`: 保护期截止时间。在此时间之前，非 Minter 持有者无法转售。
*   **机密数据 (Secret Data)** (仅特定权限可见):
    *   `EncryptedData`: 使用 Sapphire 隐私公钥加密的内容。
    *   `Nonce`: 解密所需的随机数。
    *   `Minter`: 原始铸造者地址。

### 2.2 状态生命周期 (Status Lifecycle)
```solidity
enum Status {Storing, Selling, Auctioning, Paid, Refunding, InSecrecy, Published, Blacklisted}

```
Box 的状态流转是业务的核心：

1.  **Storing (存储中)**: 初始状态，或者从市场下架后的闲置状态。只有在此状态下可以发起 `sell` 或 `auction`。
2.  **Selling (一口价出售中)**: 正在市场上以固定价格出售。
3.  **Auctioning (拍卖中)**: 正在市场上进行拍卖。
4.  **Paid (已支付/待交割)**: 买家已付款，等待确认或申请退款。
5.  **Refunding (退款仲裁中)**: 买家发起了退款申请，等待 Minter 或 DAO 处理。
6.  **InSecrecy (私密持有中)**: 交易完成，Box 归买家所有，内容仅买家可见。
7.  **Published (已公开)**: 信息被完全公开，任何人（包括未付费用户）均可查看解密内容。
8.  **Blacklisted (黑名单)**: 因违规被 DAO 封禁。
9.  

### 2.3 主要功能函数

```solidity
function getPrivateData(uint256 boxId_, bytes memory siweToken_) external view returns (bytes memory)；

function extendDeadline(uint256 boxId_ , uint256 time_) external；
function payConfiFee(uint256 boxId_) external；
```
1. **getPrivateData**: 读取私密数据（privateKey）, 需要siwe令牌验证当前用户。
   - `box.status === Storing/Selling/Auctioning`时，只有minter可以查看。
   - `box.status === Paid/InSecrecy`时，只有buyer可以查看。
   - `box.status === Refunding/Published`时，所有人均可查看。
2. **extendDeadline**：延迟deadline，
   - `box.status === Storing`，并且`now < box.deadline`(未到期)，只有minter有该权限。
3. **payConfiFee**：支付保密费，
   - `box.status === InSecrecy`, 并且`now <= box.deadline - 30 days`(距离到期小于30天)，所有人都可以代为支付保密费。
---

## 3. Exchange：交易引擎

Exchange 合约不仅处理买卖，还通过严格的权限控制管理 Box 的流转。

- 主要功能函数
```solidity
function sell(uint256 boxId_,address acceptedToken_,uint256 price_) external;
function auction(uint256 boxId_,address acceptedToken_,uint256 price_) external;
function buy(uint256 boxId_) external;
function bid(uint256 boxId_) external;
function calcPayMoney(uint256 boxId_) external view returns (uint256);
function requestRefund(uint256 boxId_) external;
function agreeRefund(uint256 boxId_) external;

function cancelRefund(uint256 boxId_) external;
function completeOrder(uint256 boxId_) external;
```

### 3.1 出售 (Sell) 与 拍卖 (Auction)
这是项目中权限差异最明显的环节。

*   **Minter (铸造者) 的特权**:
    *   **随时出售**: 只要 Box 处于 `Storing` 状态，Minter 随时可以上架。
    *   **自定义代币**: Minter 可以指定接收特定的 ERC20 代币（`acceptedToken`）。
    *   **自定义价格**: Minter 可以随意设定新的价格。

*   **其他持有者 (Secondary Owner) 的限制**:
    *   **必须等待 Deadline**: 只有当 `block.timestamp > deadline` (保护期结束) 后，当前持有人才能发起出售。
    *   **不可更改代币**: 无法自定义接收代币，沿用之前的设置或官方代币。
    *   **不可更改价格**: 代码逻辑中强制 `price_ = 0`，这意味着调用 `TruthBox.setPrice` 时会忽略更新，必须沿用 Box 原有的定价（或由其他逻辑控制）。

> **设计意图**: 这种机制保护了创作者 (Minter) 的初期利益，防止“黄牛”在信息发布的早期（保护期内）进行倒卖，同时确保信息的定价权在早期掌握在创作者手中。

### 3.2 购买与竞价
*   **Buy (购买)**: 针对 `Selling` 状态。支付定价金额，状态立即变更为 `Paid`，并设置退款申请截止期 (`refundRequestDeadline`)。
*   **Bid (竞价)**: 针对 `Auctioning` 状态。
    *   每次出价必须高于当前价格一定比例（如 10%）。
    *   出价成功会延长拍卖时间（防止狙击）。
    *   出价者会被设置为buyer，（数据库会将其添加至bidders列表）
    *   不能重复出价，即当前的buyer不能出价（如果后续有其他人出价，就可以再次出价竞拍）。
    *   资金直接进入 FundManager 托管（orderAmount，）。
*   **calcPayMoney（计算需要支付的资金）**：这是一个View类型的函数用于前端展示，如果竞拍失败`bidders.includ(user) && buyer !== user`，并且想再次竞拍时，就可以通过该函数查看自己要支付多少资金（计算方式为：`box.price - orderAmount`）。

### 3.3 售后流程 (Refund & Complete)
交易并非支付即结束，包含一个保护买家的“验货期”，申请退款也会有一个“审核期”：

1.  **Request Refund (申请退款)**: 买家在 `Paid` 状态,且在 `now < refundRequestDeadline`（未到期），若发现内容虚假，可申请退款。状态变为 `Refunding`。
2.  **Agree/Refuse Refund (处理退款)**: Minter 或 DAO 介入审核。
    *   同意退款 -> 钱退回买家，Box 变为 `Published` (既然是假的或有争议，往往意味着不再通过私密获利)。
    *   拒绝退款 -> 状态恢复为 `InSecrecy`，资金结算。
    *   如果`now > refundReviewPeriod`(超过审核期)，那么任何人都可以调用agreeRefund。

3.  **Complete Order (完成订单)**: 若无退款申请`box.status === Paid`，或买家主动确认，订单完成。状态变为 `InSecrecy`，资金在 FundManager 中进行结算分发。
    * 如果`now >= refundRequestDeadline`（超过了退款申请期限），那么任何人都可以执行完成订单，成为completer并获得奖励。

**注意**：拒绝退款功能在当前前端页面中不需要实现，因为它应该是一个DAO社区治理功能。
---

## 4. FundManager：资金流转

FundManager 负责所有“钱”的逻辑，特别是其**多币种自动兑换**特性。

```solidity
function orderAmounts(uint256 boxId_,address user_) external view returns (uint256);
function withdrawOrderAmounts(address token_,uint256[] calldata list_) external;
function withdrawRefundAmounts(address token_,uint256[] calldata list_) external;
function withdrawHelperRewards(address token_) external;
function withdrawMinterRewards(address token_) external;
```

### 4.1 支付与兑换 (Swap Integration)
*   **多币种支持**: 用户可以使用任意被 Exchange 接受的 ERC20 代币支付。
*   **自动 Swap**: 如果支付代币不是平台官方代币 (Official Token)，合约会调用外部 DEX (如 Uniswap V3 接口 `ISwapRouter`) 将其自动兑换为官方代币。
*   **汇率与滑点**: 集成 `IQuoter` 预估兑换量，确保资金能够覆盖商品价格。

### 4.2 订单金额（OrderAmount）
出售/拍卖的Box被购买/竞价时便会将资金存入FundManager合约`orderAmounts`

*   **refundPermit（退款许可）**: 当获得退款许可后，buyer可以调用`withdrawRefundAmounts`函数取回自己的退款资金。
*   **竞价失败**：`bidders.includ(user)`（属于竞拍者）, 并且`user !== buyer`, 则可以调用`withdrawOrderAmounts`函数取回自己的订单资金。

这两个函数都支持批量（boxId数组）操作，在前端的Profile页面中，会展示列表进行复选框勾选。
**注意**：但是必须是同一个token（box.acceptedToken）代币才能进行批量提款。


### 4.3 收益分配 (Allocation)
当订单完成 (`Complete Order`) 或拒绝退款时，资金会按比例分发：

1.  **Minter Reward**: 原始铸造者永远获得最大一部分版税 (即使是二手交易)。**注意**: Minter 的收益通常尽量保留为原始支付代币 (不一定全换成官方代币)，除非必须。
2.  **Seller Reward**: 当前卖家获得的收益 (如果是二手交易)。
3.  **Completer Reward**: 触发“完成订单”操作的人 (可能是第三方) 获得的微量奖励，作为执行 Gas 费的补偿。
4.  **Service Fee**: 平台收取的手续费，转入 DAO Treasury。

### 4.4 提现 (Withdraw)
资金并非自动转入用户钱包，而是记账在 `_minterRewardAmounts`, `_helperRewrdAmounts` 等映射中。用户需主动调用 `withdrawHelperRewards`, `withdrawMinterRewards`函数提取资金，这是一种 Pull-over-Push 模式，以节省 Gas 并防止重入攻击。

---

## 5. 典型生命周期示例

1.  **铸造 (Mint)**: Alice 创建一个 TruthBox，设置价格 100 USDT，保护期 15 天。状态 `Storing`。
2.  **上架 (Sell)**: Alice (Minter) 调用 `sell`。状态变为 `Selling`。
3.  **购买 (Buy)**: Peter 支付 100 USDT。状态变为 `Paid`。资金暂存 FundManager。
4.  **确认 (Complete)**: Peter 检查解密内容无误，调用 `completeOrder`。状态变为 `InSecrecy`。
    *   Alice 收到 100 USDT 减去手续费的收入。
    *   Peter 成为 Box 的 Owner。
5.  **限制期**: 在 15 天内，Peter 无法转售该 Box。
6.  **二手转售**: 15 天后，Peter 想转手。他调用 `sell`。
    *   合约检查 `deadline` 已过，允许上架。
    *   Peter 无法修改接收代币类型，且无法修改价格（沿用原价或特定逻辑）。
    *   状态变为 `Selling`，等待新的买家 Carol。
