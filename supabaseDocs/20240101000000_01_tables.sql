
CREATE TABLE IF NOT EXISTS boxes (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  -- 基础标识
  id NUMERIC(78, 0) NOT NULL, -- boxId 
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  token_id NUMERIC(78, 0) NOT NULL, -- NFT tokenId，与 boxId 相同
  token_uri TEXT, -- NFT tokenURI（当前不会写入该字段，预留扩展）
  
  -- 链上数据字段
  box_info_cid TEXT, -- BoxCreated 事件中的 CID（用于关联 MetadataBox）
  private_key TEXT, 
  price NUMERIC(78, 0) NOT NULL DEFAULT 0, 
  deadline NUMERIC(78, 0) NOT NULL DEFAULT 0, 
  
  -- 用户关系
  minter_id NUMERIC(78, 0) NOT NULL, -- UserId
  owner_address TEXT NOT NULL, -- NFT owner address (钱包地址)
  publisher_id NUMERIC(78, 0), -- UserId
  seller_id NUMERIC(78, 0), -- UserId
  buyer_id NUMERIC(78, 0), -- UserId
  completer_id NUMERIC(78, 0), -- UserId 
  
  -- 状态和时间戳
  status TEXT NOT NULL CHECK (status IN (
    'Storing', 'Selling', 'Auctioning', 'Paid', 
    'Refunding', 'InSecrecy', 'Published', 'Blacklisted'
  )),
  
  -- 交易相关
  listed_mode TEXT CHECK (listed_mode IN ('Selling', 'Auctioning')), 
  accepted_token TEXT, 
  refund_permit BOOLEAN, 
  
  -- 时间戳字段
  create_timestamp NUMERIC(78, 0) NOT NULL, 
  publish_timestamp NUMERIC(78, 0), 
  listed_timestamp NUMERIC(78, 0), 
  purchase_timestamp NUMERIC(78, 0), 
  complete_timestamp NUMERIC(78, 0), 
  request_refund_deadline NUMERIC(78, 0), 
  review_deadline NUMERIC(78, 0) 
);

-- ============================================
-- 2. users 表（用户表 - UserId）
-- 事件：所有事件参数中有 userId 的都关联到该表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id NUMERIC(78, 0) NOT NULL, -- UserId 
  
  PRIMARY KEY (network, layer, id) -- 复合主键包含网络字段
);


-- ============================================
-- 11. box_bidders 表（Box 竞标者关联表）
-- 事件：BidPlaced
-- ============================================
CREATE TABLE IF NOT EXISTS box_bidders (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id NUMERIC(78, 0) NOT NULL, -- boxId
  bidder_id NUMERIC(78, 0) NOT NULL, -- UserId
  
  PRIMARY KEY (network, layer, id, bidder_id), -- 复合主键包含网络字段
  FOREIGN KEY (network, layer, id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  FOREIGN KEY (network, layer, bidder_id) REFERENCES users(network, layer, id) ON DELETE CASCADE
);


-- ============================================
-- 3. user_addresses 表（用户地址表 - User2）
-- 事件：Blacklist， Transfer(TruthNFT)
-- ============================================
CREATE TABLE IF NOT EXISTS user_addresses (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- userAddress（地址）
  
  PRIMARY KEY (network, layer, id), 
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE
);


-- ============================================
-- 4. metadata_boxes 表（MetadataBox 关联表）
-- 事件：BoxCreated
-- 只能insert，不能update
-- ============================================
-- 存储从 IPFS 获取的 MetadataBox JSON 数据，通过 id（boxId）与 boxes 表关联
CREATE TABLE IF NOT EXISTS metadata_boxes (
  -- 网络划分（与 boxes 表一致）
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id NUMERIC(78, 0) NOT NULL, -- boxId
  
  PRIMARY KEY (network, layer, id), 
  FOREIGN KEY (network, layer, id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  
  -- BoxInfo 字段
  type_of_crime TEXT, 
  label TEXT[], 
  title TEXT, 
  nft_image TEXT, 
  box_image TEXT, 
  country TEXT, 
  state TEXT, 
  description TEXT, 
  event_date DATE, 
  create_date TIMESTAMP WITH TIME ZONE, 
  timestamp BIGINT, 
  mint_method TEXT CHECK (mint_method IN ('create', 'createAndPublish')),
  
  file_list TEXT[], 
  password TEXT, 
  
  encryption_slices_metadata_cid JSONB, -- { slicesMetadataCID_encryption, slicesMetadataCID_iv }
  encryption_file_cid JSONB[], -- [{ fileCID_encryption, fileCID_iv }, ...]
  encryption_passwords JSONB, -- { password_encryption, password_iv }
  public_key TEXT
);


-- ============================================
-- 5. payments 表（支付记录表）
-- 事件：OrderAmountPaid
-- 只能insert，不能update
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- Transaction hash - log index
  box_id NUMERIC(78, 0) NOT NULL,
  user_id NUMERIC(78, 0) NOT NULL, -- UserId
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  token TEXT NOT NULL, 
  amount NUMERIC(78, 0) NOT NULL, 
  timestamp NUMERIC(78, 0) NOT NULL,
  transaction_hash BYTEA NOT NULL, 
  block_number NUMERIC(78, 0) NOT NULL
);

-- ============================================
-- 6. withdraws 表（提取记录表）
-- 事件：OrderAmountWithdraw, HelperRewrdsWithdraw, MinterRewardsWithdraw
-- 只能insert，不能update
-- ============================================
CREATE TABLE IF NOT EXISTS withdraws (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- Transaction hash - log index
  token TEXT NOT NULL, 
  box_list NUMERIC(78, 0)[] NOT NULL, -- Box ID 列表
  user_id NUMERIC(78, 0) NOT NULL, -- UserId
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  withdraw_type TEXT NOT NULL CHECK (withdraw_type IN ('Order', 'Refund', 'Helper', 'Minter')),
  amount NUMERIC(78, 0) NOT NULL,
  timestamp NUMERIC(78, 0) NOT NULL,
  transaction_hash BYTEA NOT NULL,
  block_number NUMERIC(78, 0) NOT NULL
);

-- ============================================
-- 7. rewards_addeds 表（奖励添加事件记录表）
-- 事件：RewardAmountAdded
-- 只能insert，不能update
-- ============================================
-- 记录每次 RewardAmountAdded 事件，用于事件溯源
-- 事件同步脚本将链上事件写入此表，触发器监听此表并更新聚合表
CREATE TABLE IF NOT EXISTS rewards_addeds (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- Transaction hash - log index（用于唯一标识每次事件）
  box_id NUMERIC(78, 0) NOT NULL, 
  token TEXT NOT NULL, -- Token address
  reward_type TEXT NOT NULL CHECK (reward_type IN ('Minter', 'Seller', 'Completer', 'Total')), -- 注意：包含 'Total'
  amount NUMERIC(78, 0) NOT NULL,
  timestamp NUMERIC(78, 0) NOT NULL,
  transaction_hash BYTEA NOT NULL,
  block_number NUMERIC(78, 0) NOT NULL,
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE
);

-- ============================================
-- 8. box_rewards 表（Box 总奖励金额聚合表）
-- ============================================
-- 记录每个 box 的每种奖励类型、每种代币的总奖励金额（聚合数据）
-- 监听：rewards_addeds 表 INSERT，由触发器自动累加
-- ⚠️ 禁止手动写入/更新，完全由触发器自动管理
CREATE TABLE IF NOT EXISTS box_rewards (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  id TEXT NOT NULL, -- box_id-reward_type-token 复合键
  box_id NUMERIC(78, 0) NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('Minter', 'Seller', 'Completer', 'Total')), 
  token TEXT NOT NULL, 
  PRIMARY KEY (network, layer, id),
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  UNIQUE(network, layer, box_id, reward_type, token)
);

-- ============================================
-- 9. user_rewards 表（用户奖励金额详情表）
-- ============================================
-- 记录每个用户的每种奖励类型、每种代币的总奖励金额,
-- 监听：rewards_addeds表，累加
-- ⚠️ 禁止手动写入/更新，完全由触发器自动管理
CREATE TABLE IF NOT EXISTS user_rewards (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  id TEXT NOT NULL, -- user_id-reward_type-token 复合键
  user_id NUMERIC(78, 0) NOT NULL, 
  reward_type TEXT NOT NULL CHECK (reward_type IN ('Minter', 'Seller', 'Completer')), 
  token TEXT NOT NULL, 
  PRIMARY KEY (network, layer, id),
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  UNIQUE(network, layer, user_id, reward_type, token)
);

-- ============================================
-- 10. user_withdraws 表（用户总提取金额详情表）
-- ============================================
-- 监听：withdraws表，累加
-- ⚠️ 禁止手动写入/更新，完全由触发器自动管理
CREATE TABLE IF NOT EXISTS user_withdraws (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  id TEXT NOT NULL, -- user_id-withdraw_type-token 复合键
  user_id NUMERIC(78, 0) NOT NULL, 
  withdraw_type TEXT NOT NULL CHECK (withdraw_type IN ('Helper', 'Minter')), -- 提取类型
  token TEXT NOT NULL, 
  PRIMARY KEY (network, layer, id),
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  UNIQUE(network, layer, user_id, withdraw_type, token)
);

-- ============================================
-- 12. box_user_order_amounts 表（Box 用户（buyer/bidder）每种代币的资金状态表）
-- ============================================
-- 理论上只有一种token，因为box.accepted_token是唯一的
-- 监听：payments表，累加
-- 监听：withdraws表，累减（清零处理）
-- 监听：rewards_addeds表，（将box.buyer的资金清零）
-- ⚠️ 禁止手动写入/更新，完全由触发器自动管理
CREATE TABLE IF NOT EXISTS box_user_order_amounts (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- user_id-box_id-token 复合键
  user_id NUMERIC(78, 0) NOT NULL, -- UserId
  box_id NUMERIC(78, 0) NOT NULL, -- box_id
  token TEXT NOT NULL, 
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  
  -- 唯一约束：每个用户在每个 box 的每个代币只有一条记录
  UNIQUE(network, layer, user_id, box_id, token)
);

-- ============================================
-- 13. statistical_state 表（统计状态表 - 单例）
-- 监听：boxes表，status变更时，累加和累减
-- ⚠️ 禁止手动写入/更新，完全由触发器自动管理
-- ============================================
CREATE TABLE IF NOT EXISTS statistical_state (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL DEFAULT 'statistical', -- 单例 ID
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  total_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  storing_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  selling_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  auctioning_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  paid_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  refunding_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  in_secrecy_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  published_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  blacklisted_supply NUMERIC(78, 0) NOT NULL DEFAULT 0
);

-- ============================================
-- 14. fund_manager_state 表（资金管理器状态表 - 单例）
-- ============================================
-- 注意：需要在 token_total_amounts 之前创建，因为外键依赖
CREATE TABLE IF NOT EXISTS fund_manager_state (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL DEFAULT 'fundManager', -- 单例 ID
  
  PRIMARY KEY (network, layer, id) -- 复合主键包含网络字段
);

-- ============================================
-- 15. token_total_amounts 表（代币总金额表）
-- ============================================
-- 监听：payments和withdraws表，累加
-- 监听：rewards_addeds表，累加
-- ⚠️ 禁止手动写入/更新，完全由触发器自动管理
CREATE TABLE IF NOT EXISTS token_total_amounts (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- tokenAddress-fundsType 复合键
  token TEXT NOT NULL, 
  fund_manager_id TEXT NOT NULL DEFAULT 'fundManager',
  
  PRIMARY KEY (network, layer, id), -- 复合主键包含网络字段
  FOREIGN KEY (network, layer, fund_manager_id) REFERENCES fund_manager_state(network, layer, id) ON DELETE CASCADE,
  funds_type TEXT NOT NULL CHECK (funds_type IN (
    'OrderPaid',    
    'OrderWithdraw',   
    'RefundWithdraw',  
    'RewardsAdded',    
    'HelperRewardsWithdraw',  
    'MinterRewardsWithdraw'  
  )),
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  
  -- 唯一约束（包含网络字段）
  UNIQUE(network, layer, token, funds_type)
);

-- ============================================
-- 16. sync_status 表（同步状态表 - 用于事件同步脚本）
-- ============================================
-- 每个网络有独立的同步状态
CREATE TABLE IF NOT EXISTS sync_status (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id INTEGER NOT NULL DEFAULT 1,
  last_synced_block NUMERIC(78, 0) NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (network, layer, id) -- 复合主键包含网络字段
);

-- 初始化 sync_status 记录（为每个网络创建初始记录）
INSERT INTO sync_status (network, layer, id, last_synced_block, last_synced_at)
VALUES 
  ('testnet', 'sapphire', 1, 0, NOW()),
  ('mainnet', 'sapphire', 1, 0, NOW())
ON CONFLICT (network, layer, id) DO NOTHING;

