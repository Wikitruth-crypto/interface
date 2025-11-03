// /**
//  * Normalizr Schemas for WikiTruth Event Data
//  * 
//  * 定义数据归一化的 schema，用于处理嵌套关系
//  * 
//  * 核心思路：
//  * - 存储层：扁平化存储（避免循环引用）
//  * - 访问层：通过 denormalize 自动组装嵌套数据
//  * 
//  * @see https://github.com/paularmstrong/normalizr
//  */

//// NOTE 当前不使用 normalizr，
//// 当前的手动组装方式其实更好

// import { schema } from 'normalizr';

// // ========== 基础实体 Schema ==========

// /**
//  * Token Schema
//  * Token 是独立实体，不依赖其他实体
//  */
// export const tokenSchema = new schema.Entity('tokens');

// /**
//  * User Schema
//  * User 实体包含对 Box 的引用，但在 schema 中我们只定义基础结构
//  * 避免循环引用：User -> Box -> User
//  */
// export const userSchema = new schema.Entity('users', {
//   // 注意：这里不定义 ownedBoxes, mintedBoxes 等
//   // 这些关联会在 selector 中动态组装
// });

// /**
//  * Box Schema
//  * Box 实体包含对 User 和 Token 的引用
//  */
// export const boxSchema = new schema.Entity('boxes', {
//   // User 关联
//   minter: userSchema,
//   owner: userSchema,
//   publisher: userSchema,
//   seller: userSchema,
//   buyer: userSchema,
//   bidders: [userSchema],
//   completer: userSchema,
  
//   // Token 关联
//   acceptedToken: tokenSchema,
// });

// /**
//  * Payment Schema
//  * 支付记录关联 Box, User, Token
//  */
// export const paymentSchema = new schema.Entity('payments', {
//   box: boxSchema,
//   payer: userSchema,
//   token: tokenSchema,
// });

// /**
//  * Withdraw Schema
//  * 提现记录关联 User, Token
//  */
// export const withdrawSchema = new schema.Entity('withdraws', {
//   recipient: userSchema,
//   token: tokenSchema,
// });

// /**
//  * UserOrder Schema
//  * 用户订单关联 Box, User, Token
//  */
// export const userOrderSchema = new schema.Entity('userOrders', {
//   box: boxSchema,
//   user: userSchema,
//   token: tokenSchema,
// });

// /**
//  * RewardAmount Schema
//  * 奖励金额关联 Box, Token
//  */
// export const rewardAmountSchema = new schema.Entity('rewardAmounts', {
//   box: boxSchema,
//   token: tokenSchema,
// });

// /**
//  * UserReward Schema
//  * 用户奖励关联 User, Token
//  */
// export const userRewardSchema = new schema.Entity('userRewards', {
//   user: userSchema,
//   token: tokenSchema,
// });

// /**
//  * TokenTotalRewardAmount Schema
//  * Token 总奖励金额关联 Token
//  */
// export const tokenTotalRewardAmountSchema = new schema.Entity('tokenTotalRewardAmounts', {
//   token: tokenSchema,
// });

// /**
//  * Allowance Schema
//  * 授权记录关联 Token, User
//  */
// export const allowanceSchema = new schema.Entity('allowances', {
//   token: tokenSchema,
//   owner: userSchema,
// });

// // ========== 导出所有 Schema ==========

// export const schemas = {
//   token: tokenSchema,
//   tokens: [tokenSchema],
  
//   user: userSchema,
//   users: [userSchema],
  
//   box: boxSchema,
//   boxes: [boxSchema],
  
//   payment: paymentSchema,
//   payments: [paymentSchema],
  
//   withdraw: withdrawSchema,
//   withdraws: [withdrawSchema],
  
//   userOrder: userOrderSchema,
//   userOrders: [userOrderSchema],
  
//   rewardAmount: rewardAmountSchema,
//   rewardAmounts: [rewardAmountSchema],
  
//   userReward: userRewardSchema,
//   userRewards: [userRewardSchema],
  
//   tokenTotalRewardAmount: tokenTotalRewardAmountSchema,
//   tokenTotalRewardAmounts: [tokenTotalRewardAmountSchema],
  
//   allowance: allowanceSchema,
//   allowances: [allowanceSchema],
// };

// export default schemas;

