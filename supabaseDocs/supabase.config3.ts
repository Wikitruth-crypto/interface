
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// const supabaseConfig = {
//     url: import.meta.env.VITE_SUPABASE_URL || '',
//     anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
//     // serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
// };

// // 验证配置
// if (!supabaseConfig.url || !supabaseConfig.anonKey) {
//     throw new Error('缺少 Supabase 配置，请检查环境变量 SUPABASE_URL 和 SUPABASE_ANON_KEY');
// }


// export function createSupabaseClient(): SupabaseClient<Database> {
//     return createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
//         auth: {
//             persistSession: true,
//             autoRefreshToken: true,
//         },
//     });
// }

// export const supabase = createSupabaseClient();


// /**
//  * Supabase 数据库类型定义
//  * 
//  * 包含所有表的 Row、Insert、Update 类型定义
//  * 以及所有函数的 Args 和 Returns 类型定义
//  * 
//  * Row: 表示查询结果的行数据
//  * Insert和Update类型定义
//  * 
//  */
// export interface Database {
//     public: {
//         Tables: {
//             boxes: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     token_id: string;
//                     token_uri: string | null;
//                     box_info_cid: string | null;
//                     private_key: string | null;
//                     price: string;
//                     deadline: string;
//                     minter_id: string;
//                     owner_address: string;
//                     publisher_id: string | null;
//                     seller_id: string | null;
//                     buyer_id: string | null;
//                     completer_id: string | null;
//                     status: string;
//                     listed_mode: string | null;
//                     accepted_token: string | null;
//                     refund_permit: boolean | null;
//                     create_timestamp: string;
//                     publish_timestamp: string | null;
//                     listed_timestamp: string | null;
//                     purchase_timestamp: string | null;
//                     complete_timestamp: string | null;
//                     request_refund_deadline: string | null;
//                     review_deadline: string | null;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string;
//                     token_id: string;
//                     token_uri?: string | null;
//                     box_info_cid: string | null;
//                     private_key?: string | null;
//                     price?: string;
//                     deadline?: string;
//                     minter_id: string;
//                     owner_address: string;
//                     publisher_id?: string | null;
//                     seller_id?: string | null;
//                     buyer_id?: string | null;
//                     completer_id?: string | null;
//                     status: string;
//                     listed_mode?: string | null;
//                     accepted_token?: string | null;
//                     refund_permit?: boolean | null;
//                     create_timestamp: string;
//                     publish_timestamp?: string | null;
//                     listed_timestamp?: string | null;
//                     purchase_timestamp?: string | null;
//                     complete_timestamp?: string | null;
//                     request_refund_deadline?: string | null;
//                     review_deadline?: string | null;
//                 };
//                 Update: {
//                     network?: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id?: string;
//                     token_id?: string;
//                     token_uri?: string | null;
//                     box_info_cid?: string | null;
//                     private_key?: string | null;
//                     price?: string;
//                     deadline?: string;
//                     minter_id?: string;
//                     owner_address?: string;
//                     publisher_id?: string | null;
//                     seller_id?: string | null;
//                     buyer_id?: string | null;
//                     completer_id?: string | null;
//                     status?: string;
//                     listed_mode?: string | null;
//                     accepted_token?: string | null;
//                     refund_permit?: boolean | null;
//                     create_timestamp?: string;
//                     publish_timestamp?: string | null;
//                     listed_timestamp?: string | null;
//                     purchase_timestamp?: string | null;
//                     complete_timestamp?: string | null;
//                     request_refund_deadline?: string | null;
//                     review_deadline?: string | null;
//                 };
//             };
//             metadata_boxes: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     type_of_crime: string | null;
//                     label: string[] | null;
//                     title: string | null;
//                     nft_image: string | null;
//                     box_image: string | null;
//                     country: string | null;
//                     state: string | null;
//                     description: string | null;
//                     event_date: string | null;
//                     create_date: string | null;
//                     timestamp: number | null;
//                     mint_method: string | null;
//                     file_list: string[] | null;
//                     password: string | null;
//                     encryption_slices_metadata_cid: Record<string, unknown> | null;
//                     encryption_file_cid: Record<string, unknown>[] | null;
//                     encryption_passwords: Record<string, unknown> | null;
//                     public_key: string | null;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string; // boxId (BIGINT)
//                     type_of_crime: string | null;
//                     label: string[] | null;
//                     title: string | null;
//                     nft_image: string | null;
//                     box_image: string | null;
//                     country: string | null;
//                     state: string | null;
//                     description: string | null;
//                     event_date: string | null;
//                     create_date: string | null;
//                     timestamp: number | null;
//                     mint_method: string | null;
//                     file_list: string[] | null;
//                     password?: string | null;
//                     encryption_slices_metadata_cid?: Record<string, unknown> | null;
//                     encryption_file_cid?: Record<string, unknown>[] | null;
//                     encryption_passwords?: Record<string, unknown> | null;
//                     public_key?: string | null;
//                 };
//                 Update: never; // 禁止后续更新
//             };
//             users: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string;
//                 }; 
//                 Update: never; // 禁止后续更新
//             };
//             user_addresses: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     is_blacklisted: boolean;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string;
//                     is_blacklisted?: boolean;
//                 };
//                 // ⚠️ 允许更新：Blacklist 事件会更新 is_blacklisted 字段
//                 Update: {
//                     network?: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id?: string;
//                     is_blacklisted?: boolean;
//                 };
//             };
//             box_bidders: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string; // boxId（主键的一部分，对应 boxes.id）
//                     bidder_id: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string; // boxId
//                     bidder_id: string;
//                 };
//                 Update: never; // 禁止后续更新
//             };
//             payments: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     box_id: string;
//                     user_id: string;
//                     token: string;
//                     amount: string;
//                     timestamp: string;
//                     transaction_hash: Uint8Array;
//                     block_number: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string;
//                     box_id: string;
//                     user_id: string;
//                     token: string;
//                     amount: string;
//                     timestamp: string;
//                     transaction_hash: Uint8Array;
//                     block_number: string;
//                 };
//                 Update: never; // 禁止后续更新
//             };
//             withdraws: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     token: string;
//                     box_list: string[];
//                     user_id: string;
//                     amount: string;
//                     timestamp: string;
//                     withdraw_type: 'Order' | 'Refund' | 'Helper' | 'Minter';
//                     transaction_hash: Uint8Array;
//                     block_number: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string;
//                     token: string;
//                     box_list: string[];
//                     user_id: string;
//                     amount: string;
//                     timestamp: string;
//                     withdraw_type: 'Order' | 'Helper' | 'Minter' | 'Refund';
//                     transaction_hash: Uint8Array;
//                     block_number: string;
//                 };
//                 Update: never; // 禁止后续更新
//             };
//             rewards_addeds: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     box_id: string;
//                     token: string;
//                     amount: string;
//                     reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
//                     timestamp: string;
//                     transaction_hash: Uint8Array;
//                     block_number: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id: string;
//                     box_id: string;
//                     token: string;
//                     amount: string;
//                     reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
//                     timestamp: string;
//                     transaction_hash: Uint8Array;
//                     block_number: string;
//                 };
//                 Update: never; // 禁止后续更新
//             };
//             box_rewards: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     box_id: string;
//                     reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
//                     token: string;
//                     amount: string;
//                 };
//                 // ⚠️ 禁止手动写入：此表由触发器自动管理
//                 // 如果需要添加奖励，应该插入 rewards_addeds 表
//                 Insert: never;
//                 Update: never;
//             };
//             user_rewards: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     user_id: string;
//                     reward_type: 'Minter' | 'Seller' | 'Completer';
//                     token: string;
//                     amount: string;
//                 };
//                 // ⚠️ 禁止手动写入：此表由触发器自动管理
//                 // user_rewards 中不包含 Total 类型，只记录分配给具体角色的奖励
//                 Insert: never;
//                 Update: never;
//             };
//             user_withdraws: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     user_id: string;
//                     withdraw_type: 'Helper' | 'Minter';
//                     token: string;
//                     amount: string;
//                 };
//                 // ⚠️ 禁止手动写入：此表由触发器自动管理
//                 Insert: never;
//                 Update: never;
//             };
            
//             box_user_order_amounts: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     user_id: string;
//                     box_id: string;
//                     token: string;
//                     amount: string;
//                 };
//                 // ⚠️ 禁止手动写入：此表由触发器自动管理
//                 // 资金变化应该通过 payments、withdraws 和 rewards_addeds 表来触发
//                 Insert: never;
//                 Update: never;
//             };
//             statistical_state: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     total_supply: string;
//                     storing_supply: string;
//                     selling_supply: string;
//                     auctioning_supply: string;
//                     paid_supply: string;
//                     refunding_supply: string;
//                     in_secrecy_supply: string;
//                     published_supply: string;
//                     blacklisted_supply: string;
//                 };
//                 // ⚠️ 禁止手动写入：此表由触发器自动管理
//                 // 统计数据变化应该通过 boxes 表的插入和 status 更新来触发
//                 Insert: never;
//                 //  TODO  In tests, do not use this update, it will be removed in production
//                 Update: {
//                     total_supply?: string;
//                     storing_supply?: string;
//                     selling_supply?: string;
//                     auctioning_supply?: string;
//                     paid_supply?: string;
//                     refunding_supply?: string;
//                     in_secrecy_supply?: string;
//                     published_supply?: string;
//                     blacklisted_supply?: string;
//                     network?: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id?: string;
//                 };
//             };
//             fund_manager_state: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id?: string;
//                 };
//                 Update: never; // 禁止后续更新
//             };
//             token_total_amounts: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     token: string;
//                     fund_manager_id: string;
//                     funds_type: 'OrderPaid' | 'OrderWithdraw' | 'RefundWithdraw' | 'RewardsAdded' | 'HelperRewardsWithdraw' | 'MinterRewardsWithdraw';
//                     amount: string;
//                 };
//                 // ⚠️ 禁止手动写入：此表由触发器自动管理
//                 // 总金额变化应该通过业务表（payments、withdraws、box_rewards）来触发
//                 Insert: never;
//                 Update: never;
//             };
//             sync_status: {
//                 Row: {
//                     network: 'testnet' | 'mainnet';
//                     layer: 'sapphire';
//                     id: string;
//                     last_synced_block: string;
//                     last_synced_at: string;
//                 };
//                 Insert: {
//                     network: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id?: string;
//                     last_synced_block?: string;
//                     last_synced_at?: string;
//                 };
//                 // ⚠️ 允许更新：事件同步脚本需要更新同步状态
//                 Update: {
//                     network?: 'testnet' | 'mainnet';
//                     layer?: 'sapphire';
//                     id?: string;
//                     last_synced_block?: string;
//                     last_synced_at?: string;
//                 };
//             };
//         };
//         Functions: {
//             search_boxes: {
//                 Args: {
//                     network_filter: 'testnet' | 'mainnet';
//                     layer_filter?: 'sapphire';
//                     search_query?: string | null;
//                     status_filter?: string[] | null;
//                     type_of_crime_filter?: string[] | null;
//                     country_filter?: string[] | null;
                    
//                     label_filter?: string[] | null;
//                     min_price?: number | null;
//                     max_price?: number | null;
//                     min_timestamp?: number | null;
//                     max_timestamp?: number | null;
//                     sort_by?: 'relevance' | 'price' | 'event_date' | 'box_id';
//                     sort_direction?: 'asc' | 'desc';
//                     limit_count?: number;
//                     offset_count?: number;
//                 };
//                 Returns: {
//                     id: string;
//                     title: string | null;
//                     description: string | null;
//                     type_of_crime: string | null;
//                     country: string | null;
//                     state: string | null;
//                     label: string[] | null;
//                     status: string;
//                     price: string;
//                     nft_image: string | null;
//                     box_image: string | null;
//                     event_date: string | null;
//                     create_timestamp: string;
//                     relevance: number;
//                 }[];
//             };
//         };
//     };
// }

