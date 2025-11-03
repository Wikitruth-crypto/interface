/**
 * Selectors for WikiTruth Query Store
 *
 * 鎻愪緵鏅鸿兘閫夋嫨鍣紝鑷姩缁勮宓屽鏁版嵁
 *
 * 鏍稿績浼樺娍锛? * 1. 瀛樺偍灞傛墎骞冲寲锛堥伩鍏嶅惊鐜紩鐢級
 * 2. 璁块棶灞傚祵濂楀寲锛堝儚 The Graph 涓€鏍蜂究鎹凤級
 * 3. 鎸夐渶鍔犺浇鍏宠仈鏁版嵁
 * 4. 鑷姩缂撳瓨鍜屾€ц兘浼樺寲
 *
 * 鏋舵瀯璇存槑锛? * - Store 涓瓨鍌ㄧ殑鏄墎骞冲寲鐨?*Stored 绫诲瀷锛堝彧鍖呭惈 ID 寮曠敤锛? * - Selector 杩斿洖鐨勬槸宓屽鐨勮闂被鍨嬶紙鍖呭惈瀹屾暣瀵硅薄锛? * - 鎵嬪姩缁勮鍏宠仈鏁版嵁锛岄伩鍏嶅惊鐜紩鐢? *
 * 浣跨敤绀轰緥锛? * ```typescript
 * const box = useQueryStore(selectBox(tokenId));
 * console.log(box.minter.id); // 鑷姩缁勮鐨勫祵濂楁暟鎹? * ```
 */

import type {
  Box,
  BoxStored,
  User,
  UserStored,
  Token,
  TokenStored,
  Payment,
  PaymentStored,
  Withdraw,
  WithdrawStored,
  UserOrder,
  UserOrderStored,
  UserReward,
  UserRewardStored,
  RewardAmount,
  RewardAmountStored,
  Allowance,
  AllowanceStored,
} from './types';
import type { QueryState, EntityState } from './useQueryStore';

// ========== 缂撳瓨宸ュ叿 ==========

const reconcileArray = <T>(previous: T[] | undefined, next: T[]): T[] => {
  if (!previous || previous.length !== next.length) {
    return next;
  }
  for (let index = 0; index < next.length; index += 1) {
    if (previous[index] !== next[index]) {
      return next;
    }
  }
  return previous;
};

interface CacheEntry<Stored, Value> {
  storedRef: Stored;
  value: Value;
  deps?: Record<string, unknown>;
}

const tokenLightCache = new Map<string, CacheEntry<TokenStored, Token>>();
const userLightCache = new Map<string, CacheEntry<UserStored, User>>();
const userWithBoxesCache = new Map<string, CacheEntry<UserStored, User>>();
const boxLightCache = new Map<string, CacheEntry<BoxStored, Omit<Box, 'paymentLogs' | 'userOrders' | 'rewardAmounts'>>>();
const paymentCache = new Map<string, CacheEntry<PaymentStored, Payment>>();
const withdrawCache = new Map<string, CacheEntry<WithdrawStored, Withdraw>>();
const userOrderCache = new Map<string, CacheEntry<UserOrderStored, UserOrder>>();
const rewardAmountCache = new Map<string, CacheEntry<RewardAmountStored, RewardAmount>>();
const userRewardCache = new Map<string, CacheEntry<UserRewardStored, UserReward>>();
const allowanceCache = new Map<string, CacheEntry<AllowanceStored, Allowance>>();
const boxCache = new Map<string, CacheEntry<BoxStored, Box>>();
const boxesSelectorCache = new WeakMap<string[], { entitiesRef: QueryState['boxes']['entities']; result: Box[] }>();
let allBoxesCache:
  | {
      entitiesRef: QueryState['boxes']['entities'];
      ids: string[];
      result: Box[];
    }
  | undefined;

// ========== 杈呭姪鍑芥暟 ==========

/**
 * 鑾峰彇杞婚噺绾?Token锛堜笉鍖呭惈鍏宠仈鏁版嵁锛? */
const selectTokenLight = (tokenId: string | undefined) => (state: QueryState): Token | undefined => {
  if (!tokenId) return undefined;
  const tokenStored = state.tokens.entities[tokenId];
  if (!tokenStored) return undefined;

  const cached = tokenLightCache.get(tokenId);
  if (cached && cached.storedRef === tokenStored) {
    return cached.value;
  }

  const value: Token = {
    ...tokenStored,
    allowances: [],
    acceptedInBoxes: [],
    totalRewardAmounts: [],
    userOrders: [],
    rewardAmounts: [],
    userRewards: [],
    payments: [],
    withdraws: [],
  };

  tokenLightCache.set(tokenId, {
    storedRef: tokenStored,
    value,
  });

  return value;
};

/**
 * 鑾峰彇杞婚噺绾?User锛堜笉鍖呭惈 Box 鏁扮粍锛岄伩鍏嶅惊鐜紩鐢級
 */
const selectUserLight = (userId: string | undefined) => (state: QueryState): User | undefined => {
  if (!userId) return undefined;
  const userStored = state.users.entities[userId];
  if (!userStored) return undefined;

  const cached = userLightCache.get(userId);
  if (cached && cached.storedRef === userStored) {
    return cached.value;
  }

  const value: User = {
    ...userStored,
    ownedBoxes: [],
    mintedBoxes: [],
    soldBoxes: [],
    boughtBoxes: [],
    bidBoxes: [],
    completedBoxes: [],
    publishedBoxes: [],
    allowances: [],
    paymentLogs: [],
    withdrawLogs: [],
    userOrders: [],
    rewards: [],
  };

  userLightCache.set(userId, {
    storedRef: userStored,
    value,
  });

  return value;
};

/**
 * 鑾峰彇杞婚噺绾?Box锛堜笉鍖呭惈鍏宠仈鏁扮粍锛岄伩鍏嶅惊鐜紩鐢級
 * 鐢ㄤ簬鍦?Payment銆乁serOrder 绛夊疄浣撲腑寮曠敤 Box
 */
const selectBoxLight = (boxId: string | undefined) => (state: QueryState): Omit<Box, 'paymentLogs' | 'userOrders' | 'rewardAmounts'> | undefined => {
  if (!boxId) return undefined;
  const boxStored = state.boxes.entities[boxId];
  if (!boxStored) return undefined;

  const cached = boxLightCache.get(boxId);
  const minter = selectUserLight(boxStored.minterId)(state)!;
  const owner = selectUserLight(boxStored.ownerId)(state)!;
  const publisher = boxStored.publisherId ? selectUserLight(boxStored.publisherId)(state) : undefined;
  const seller = boxStored.sellerId ? selectUserLight(boxStored.sellerId)(state) : undefined;
  const buyer = boxStored.buyerId ? selectUserLight(boxStored.buyerId)(state) : undefined;
  const nextBidders = boxStored.bidderIds.map(id => selectUserLight(id)(state)).filter(Boolean) as User[];
  const bidders = reconcileArray(cached?.deps?.bidders as User[] | undefined, nextBidders);
  const completer = boxStored.completerId ? selectUserLight(boxStored.completerId)(state) : undefined;
  const acceptedToken = boxStored.acceptedTokenId ? selectTokenLight(boxStored.acceptedTokenId)(state) : undefined;

  if (
    cached &&
    cached.storedRef === boxStored &&
    cached.deps?.minter === minter &&
    cached.deps?.owner === owner &&
    cached.deps?.publisher === publisher &&
    cached.deps?.seller === seller &&
    cached.deps?.buyer === buyer &&
    cached.deps?.bidders === bidders &&
    cached.deps?.completer === completer &&
    cached.deps?.acceptedToken === acceptedToken
  ) {
    return cached.value;
  }

  const value: Omit<Box, 'paymentLogs' | 'userOrders' | 'rewardAmounts'> = {
    ...boxStored,
    minter,
    owner,
    publisher,
    seller,
    buyer,
    bidders,
    completer,
    acceptedToken,
  };

  boxLightCache.set(boxId, {
    storedRef: boxStored,
    value,
    deps: { minter, owner, publisher, seller, buyer, bidders, completer, acceptedToken },
  });

  return value;
};


// ========== 瀹炰綋 Selectors ==========

/**
 * 鑾峰彇 Payment锛堟敮浠樿褰曪級
 */
export const selectPayment = (paymentId: string) => (state: QueryState): Payment | undefined => {
  const paymentStored = state.payments.entities[paymentId];
  if (!paymentStored) return undefined;

  const box = selectBoxLight(paymentStored.boxId)(state);
  if (!box) return undefined;

  const payer = selectUserLight(paymentStored.payerId)(state)!;
  const token = selectTokenLight(paymentStored.tokenId)(state)!;
  const cached = paymentCache.get(paymentId);

  if (
    cached &&
    cached.storedRef === paymentStored &&
    cached.deps?.box === box &&
    cached.deps?.payer === payer &&
    cached.deps?.token === token
  ) {
    return cached.value;
  }

  const value: Payment = {
    id: paymentStored.id,
    timestamp: paymentStored.timestamp,
    transactionHash: paymentStored.transactionHash,
    blockNumber: paymentStored.blockNumber,
    box: box as Box,
    payer,
    token,
    amount: paymentStored.amount,
    paymentType: paymentStored.paymentType,
  };

  paymentCache.set(paymentId, {
    storedRef: paymentStored,
    value,
    deps: { box, payer, token },
  });

  return value;
};


/**
 * 鑾峰彇 Withdraw锛堟彁鐜拌褰曪級
 */
export const selectWithdraw = (withdrawId: string) => (state: QueryState): Withdraw | undefined => {
  const withdrawStored = state.withdraws.entities[withdrawId];
  if (!withdrawStored) return undefined;

  const token = selectTokenLight(withdrawStored.tokenId)(state)!;
  const recipient = selectUserLight(withdrawStored.recipientId)(state)!;
  const cached = withdrawCache.get(withdrawId);

  if (
    cached &&
    cached.storedRef === withdrawStored &&
    cached.deps?.token === token &&
    cached.deps?.recipient === recipient
  ) {
    return cached.value;
  }

  const value: Withdraw = {
    id: withdrawStored.id,
    timestamp: withdrawStored.timestamp,
    transactionHash: withdrawStored.transactionHash,
    blockNumber: withdrawStored.blockNumber,
    token,
    boxList: withdrawStored.boxList,
    recipient,
    amount: withdrawStored.amount,
    withdrawType: withdrawStored.withdrawType,
  };

  withdrawCache.set(withdrawId, {
    storedRef: withdrawStored,
    value,
    deps: { token, recipient },
  });

  return value;
};

/**
 * 鑾峰彇 UserOrder锛堢敤鎴疯鍗曪級
 */
export const selectUserOrder = (userOrderId: string) => (state: QueryState): UserOrder | undefined => {
  const userOrderStored = state.userOrders.entities[userOrderId];
  if (!userOrderStored) return undefined;

  const box = selectBoxLight(userOrderStored.boxId)(state);
  if (!box) return undefined;

  const user = selectUserLight(userOrderStored.userId)(state)!;
  const token = selectTokenLight(userOrderStored.tokenId)(state)!;
  const cached = userOrderCache.get(userOrderId);

  if (
    cached &&
    cached.storedRef === userOrderStored &&
    cached.deps?.box === box &&
    cached.deps?.user === user &&
    cached.deps?.token === token
  ) {
    return cached.value;
  }

  const value: UserOrder = {
    id: userOrderStored.id,
    box: box as Box,
    user,
    token,
    amount: userOrderStored.amount,
    timestamp: userOrderStored.timestamp,
  };

  userOrderCache.set(userOrderId, {
    storedRef: userOrderStored,
    value,
    deps: { box, user, token },
  });

  return value;
};

/**
 * 鑾峰彇 RewardAmount锛堝鍔遍噾棰濓級
 */
export const selectRewardAmount = (rewardAmountId: string) => (state: QueryState): RewardAmount | undefined => {
  const rewardAmountStored = state.rewardAmounts.entities[rewardAmountId];
  if (!rewardAmountStored) return undefined;

  const box = selectBoxLight(rewardAmountStored.boxId)(state);
  if (!box) return undefined;

  const token = selectTokenLight(rewardAmountStored.tokenId)(state)!;
  const cached = rewardAmountCache.get(rewardAmountId);

  if (
    cached &&
    cached.storedRef === rewardAmountStored &&
    cached.deps?.box === box &&
    cached.deps?.token === token
  ) {
    return cached.value;
  }

  const value: RewardAmount = {
    id: rewardAmountStored.id,
    box: box as Box,
    token,
    amount: rewardAmountStored.amount,
    rewardType: rewardAmountStored.rewardType,
    timestamp: rewardAmountStored.timestamp,
  };

  rewardAmountCache.set(rewardAmountId, {
    storedRef: rewardAmountStored,
    value,
    deps: { box, token },
  });

  return value;
};

/**
 * 鑾峰彇 UserReward锛堢敤鎴峰鍔憋級
 */
export const selectUserReward = (userRewardId: string) => (state: QueryState): UserReward | undefined => {
  const userRewardStored = state.userRewards.entities[userRewardId];
  if (!userRewardStored) return undefined;

  const user = selectUserLight(userRewardStored.userId)(state)!;
  const token = selectTokenLight(userRewardStored.tokenId)(state)!;
  const cached = userRewardCache.get(userRewardId);

  if (
    cached &&
    cached.storedRef === userRewardStored &&
    cached.deps?.user === user &&
    cached.deps?.token === token
  ) {
    return cached.value;
  }

  const value: UserReward = {
    id: userRewardStored.id,
    user,
    token,
    totalRewards: userRewardStored.totalRewards,
    helperRewards: userRewardStored.helperRewards,
    lastWithdrawTimestamp: userRewardStored.lastWithdrawTimestamp,
  };

  userRewardCache.set(userRewardId, {
    storedRef: userRewardStored,
    value,
    deps: { user, token },
  });

  return value;
};

/**
 * 鑾峰彇 Allowance锛堟巿鏉冭褰曪級
 */
export const selectAllowance = (allowanceId: string) => (state: QueryState): Allowance | undefined => {
  const allowanceStored = state.allowances.entities[allowanceId];
  if (!allowanceStored) return undefined;

  const token = selectTokenLight(allowanceStored.tokenId)(state)!;
  const owner = selectUserLight(allowanceStored.ownerId)(state)!;
  const cached = allowanceCache.get(allowanceId);

  if (
    cached &&
    cached.storedRef === allowanceStored &&
    cached.deps?.token === token &&
    cached.deps?.owner === owner
  ) {
    return cached.value;
  }

  const value: Allowance = {
    id: allowanceStored.id,
    token,
    owner,
    spender: allowanceStored.spender,
    amount: allowanceStored.amount,
    lastUpdated: allowanceStored.lastUpdated,
  };

  allowanceCache.set(allowanceId, {
    storedRef: allowanceStored,
    value,
    deps: { token, owner },
  });

  return value;
};

// ========== Box Selectors ==========

/**
 * 鑾峰彇甯﹀畬鏁村叧鑱旀暟鎹殑 Box
 *
 * 鑷姩缁勮锛? * - minter: User
 * - owner: User
 * - buyer: User
 * - bidders: User[]
 * - acceptedToken: Token
 * - paymentLogs: Payment[]
 * - userOrders: UserOrder[]
 * - rewardAmounts: RewardAmount[]
 *
 * @param boxId - Box ID
 * @returns 瀹屾暣鐨?Box 瀵硅薄锛屽鏋滀笉瀛樺湪鍒欒繑鍥?undefined
 */
export const selectBox = (boxId: string) => (state: QueryState): Box | undefined => {
  const boxStored = state.boxes.entities[boxId];
  if (!boxStored) return undefined;

  const cached = boxCache.get(boxId);

  const minter = selectUserLight(boxStored.minterId)(state)!;
  const owner = selectUserLight(boxStored.ownerId)(state)!;
  const publisher = boxStored.publisherId ? selectUserLight(boxStored.publisherId)(state) : undefined;
  const seller = boxStored.sellerId ? selectUserLight(boxStored.sellerId)(state) : undefined;
  const buyer = boxStored.buyerId ? selectUserLight(boxStored.buyerId)(state) : undefined;
  const nextBidders = boxStored.bidderIds.map(id => selectUserLight(id)(state)).filter(Boolean) as User[];
  const bidders = reconcileArray(cached?.deps?.bidders as User[] | undefined, nextBidders);
  const completer = boxStored.completerId ? selectUserLight(boxStored.completerId)(state) : undefined;
  const acceptedToken = boxStored.acceptedTokenId ? selectTokenLight(boxStored.acceptedTokenId)(state) : undefined;
  const nextPaymentLogs = boxStored.paymentLogIds.map(id => selectPayment(id)(state)).filter(Boolean) as Payment[];
  const paymentLogs = reconcileArray(cached?.deps?.paymentLogs as Payment[] | undefined, nextPaymentLogs);
  const nextUserOrders = boxStored.userOrderIds.map(id => selectUserOrder(id)(state)).filter(Boolean) as UserOrder[];
  const userOrders = reconcileArray(cached?.deps?.userOrders as UserOrder[] | undefined, nextUserOrders);
  const nextRewardAmounts = boxStored.rewardAmountIds.map(id => selectRewardAmount(id)(state)).filter(Boolean) as RewardAmount[];
  const rewardAmounts = reconcileArray(cached?.deps?.rewardAmounts as RewardAmount[] | undefined, nextRewardAmounts);

  if (
    cached &&
    cached.storedRef === boxStored &&
    cached.deps?.minter === minter &&
    cached.deps?.owner === owner &&
    cached.deps?.publisher === publisher &&
    cached.deps?.seller === seller &&
    cached.deps?.buyer === buyer &&
    cached.deps?.bidders === bidders &&
    cached.deps?.completer === completer &&
    cached.deps?.acceptedToken === acceptedToken &&
    cached.deps?.paymentLogs === paymentLogs &&
    cached.deps?.userOrders === userOrders &&
    cached.deps?.rewardAmounts === rewardAmounts
  ) {
    return cached.value;
  }

  const value: Box = {
    ...boxStored,
    minter,
    owner,
    publisher,
    seller,
    buyer,
    bidders,
    completer,
    acceptedToken,
    paymentLogs,
    userOrders,
    rewardAmounts,
  };

  boxCache.set(boxId, {
    storedRef: boxStored,
    value,
    deps: {
      minter,
      owner,
      publisher,
      seller,
      buyer,
      bidders,
      completer,
      acceptedToken,
      paymentLogs,
      userOrders,
      rewardAmounts,
    },
  });

  return value;
};

/**
 * 鑾峰彇澶氫釜 Box锛堟壒閲忔煡璇級
 *
 * @param boxIds - Box ID 鏁扮粍
 * @returns Box 鏁扮粍
 */
export const selectBoxes = (boxIds: string[]) => (state: QueryState): Box[] => {
  const cached = boxesSelectorCache.get(boxIds);
  const entitiesRef = state.boxes.entities;

  if (cached && cached.entitiesRef === entitiesRef) {
    return cached.result;
  }

  const next = boxIds
    .map(id => selectBox(id)(state))
    .filter(Boolean) as Box[];

  const result = reconcileArray(cached?.result, next);
  boxesSelectorCache.set(boxIds, { entitiesRef, result });

  return result;
};

/**
 * 鑾峰彇鎵€鏈?Box
 *
 * @returns 鎵€鏈?Box 鐨勬暟缁? */
export const selectAllBoxes = () => (state: QueryState): Box[] => {
  const entitiesRef = state.boxes.entities;

  if (allBoxesCache && allBoxesCache.entitiesRef === entitiesRef) {
    return allBoxesCache.result;
  }

  const ids = Object.keys(entitiesRef);
  const nextResult = selectBoxes(ids)(state);
  const result = reconcileArray(allBoxesCache?.result, nextResult);

  allBoxesCache = {
    entitiesRef,
    ids,
    result,
  };

  return result;
};

/**
 * 鑾峰彇甯﹀畬鏁村叧鑱旀暟鎹殑 User
 *
 * 鈿狅笍 娉ㄦ剰锛氫负閬垮厤寰幆寮曠敤锛孶ser 涓殑 Box 鏁扮粍涓虹┖
 * 濡傞渶瀹屾暣鐨?Box 鏁版嵁锛岃浣跨敤 selectUserWithBoxes
 *
 * @param userId - User ID
 * @returns 瀹屾暣鐨?User 瀵硅薄锛屽鏋滀笉瀛樺湪鍒欒繑鍥?undefined
 */
export const selectUser = (userId: string) => (state: QueryState): User | undefined => {
  return selectUserLight(userId)(state);
};

/**
 * 鑾峰彇甯﹀畬鏁?Box 鏁版嵁鐨?User
 *
 * 浼氳嚜鍔ㄧ粍瑁?User 鐨勬墍鏈?Box 鍏宠仈鍜屽叾浠栧叧鑱旀暟鎹? *
 * @param userId - User ID
 * @returns 甯﹀畬鏁?Box 鏁版嵁鐨?User
 */
export const selectUserWithBoxes = (userId: string) => (state: QueryState): User | undefined => {
  const userStored = state.users.entities[userId];
  if (!userStored) return undefined;

  const cached = userWithBoxesCache.get(userId);
  const base = selectUserLight(userId)(state);
  if (!base) return undefined;

  const ownedBoxes = selectBoxes(userStored.ownedBoxIds)(state);
  const mintedBoxes = selectBoxes(userStored.mintedBoxIds)(state);
  const soldBoxes = selectBoxes(userStored.soldBoxIds)(state);
  const boughtBoxes = selectBoxes(userStored.boughtBoxIds)(state);
  const bidBoxes = selectBoxes(userStored.bidBoxIds)(state);
  const completedBoxes = selectBoxes(userStored.completedBoxIds)(state);
  const publishedBoxes = selectBoxes(userStored.publishedBoxIds)(state);

  const allowancesList = userStored.allowanceIds.map(id => selectAllowance(id)(state)).filter(Boolean) as Allowance[];
  const paymentLogsList = userStored.paymentLogIds.map(id => selectPayment(id)(state)).filter(Boolean) as Payment[];
  const withdrawLogsList = userStored.withdrawLogIds.map(id => selectWithdraw(id)(state)).filter(Boolean) as Withdraw[];
  const userOrdersList = userStored.userOrderIds.map(id => selectUserOrder(id)(state)).filter(Boolean) as UserOrder[];
  const rewardsList = userStored.rewardIds.map(id => selectUserReward(id)(state)).filter(Boolean) as UserReward[];

  const allowances = reconcileArray(cached?.deps?.allowances as Allowance[] | undefined, allowancesList);
  const paymentLogs = reconcileArray(cached?.deps?.paymentLogs as Payment[] | undefined, paymentLogsList);
  const withdrawLogs = reconcileArray(cached?.deps?.withdrawLogs as Withdraw[] | undefined, withdrawLogsList);
  const userOrders = reconcileArray(cached?.deps?.userOrders as UserOrder[] | undefined, userOrdersList);
  const rewards = reconcileArray(cached?.deps?.rewards as UserReward[] | undefined, rewardsList);

  if (
    cached &&
    cached.storedRef === userStored &&
    cached.deps?.ownedBoxes === ownedBoxes &&
    cached.deps?.mintedBoxes === mintedBoxes &&
    cached.deps?.soldBoxes === soldBoxes &&
    cached.deps?.boughtBoxes === boughtBoxes &&
    cached.deps?.bidBoxes === bidBoxes &&
    cached.deps?.completedBoxes === completedBoxes &&
    cached.deps?.publishedBoxes === publishedBoxes &&
    cached.deps?.allowances === allowances &&
    cached.deps?.paymentLogs === paymentLogs &&
    cached.deps?.withdrawLogs === withdrawLogs &&
    cached.deps?.userOrders === userOrders &&
    cached.deps?.rewards === rewards
  ) {
    return cached.value;
  }

  const value: User = {
    ...base,
    ownedBoxes,
    mintedBoxes,
    soldBoxes,
    boughtBoxes,
    bidBoxes,
    completedBoxes,
    publishedBoxes,
    allowances,
    paymentLogs,
    withdrawLogs,
    userOrders,
    rewards,
  };

  userWithBoxesCache.set(userId, {
    storedRef: userStored,
    value,
    deps: {
      ownedBoxes,
      mintedBoxes,
      soldBoxes,
      boughtBoxes,
      bidBoxes,
      completedBoxes,
      publishedBoxes,
      allowances,
      paymentLogs,
      withdrawLogs,
      userOrders,
      rewards,
    },
  });

  return value;
};

/**
 * 鑾峰彇 Token
 *
 * @param tokenId - Token ID (address)
 * @returns Token 瀵硅薄
 */
export const selectToken = (tokenId: string) => (state: QueryState): Token | undefined => {
  return selectTokenLight(tokenId)(state);
};

/**
 * 鑾峰彇鎵€鏈?Token
 *
 * @returns 鎵€鏈?Token 鐨勬暟缁? */
export const selectAllTokens = () => (state: QueryState): Token[] => {
  return Object.values(state.tokens.entities).map(tokenStored => selectTokenLight(tokenStored.id)(state)).filter(Boolean) as Token[];
};

// ========== 楂樼骇 Selectors ==========

/**
 * 鏍规嵁鐘舵€佺瓫閫?Box
 *
 * @param status - Box 鐘舵€? * @returns 绗﹀悎鏉′欢鐨?Box 鏁扮粍
 */
export const selectBoxesByStatus = (status: string) => (state: QueryState): Box[] => {
  return Object.values(state.boxes.entities)
    .filter(box => box.status === status)
    .map(box => selectBox(box.id)(state))
    .filter(Boolean) as Box[];
};

/**
 * 鑾峰彇鐢ㄦ埛鎷ユ湁鐨?Box
 *
 * @param userId - User ID
 * @returns 鐢ㄦ埛鎷ユ湁鐨?Box 鏁扮粍
 */
export const selectUserOwnedBoxes = (userId: string) => (state: QueryState): Box[] => {
  return Object.values(state.boxes.entities)
    .filter(box => box.ownerId === userId)
    .map(box => selectBox(box.id)(state))
    .filter(Boolean) as Box[];
};

/**
 * 鑾峰彇鐢ㄦ埛閾搁€犵殑 Box
 *
 * @param userId - User ID
 * @returns 鐢ㄦ埛閾搁€犵殑 Box 鏁扮粍
 */
export const selectUserMintedBoxes = (userId: string) => (state: QueryState): Box[] => {
  return Object.values(state.boxes.entities)
    .filter(box => box.minterId === userId)
    .map(box => selectBox(box.id)(state))
    .filter(Boolean) as Box[];
};

// ========== 瀵煎嚭鎵€鏈?Selectors ==========

export const selectors = {
  // 瀹炰綋 Selectors
  selectPayment,
  selectWithdraw,
  selectUserOrder,
  selectRewardAmount,
  selectUserReward,
  selectAllowance,

  // Box Selectors
  selectBox,
  selectBoxes,
  selectAllBoxes,
  selectBoxesByStatus,

  // User Selectors
  selectUser,
  selectUserWithBoxes,
  selectUserOwnedBoxes,
  selectUserMintedBoxes,

  // Token Selectors
  selectToken,
  selectAllTokens,
};

export default selectors;












