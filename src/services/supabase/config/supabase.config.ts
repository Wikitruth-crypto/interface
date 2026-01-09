
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export function createSupabaseClient(): SupabaseClient<Database> {
    return createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    });
}

export const supabase = createSupabaseClient();

/**
 * Supabase Database Type Definitions
 * 
 * Includes Row, Insert, Update type definitions for all tables
 * And Args and Returns type definitions for all functions
 * 
 * Row: Represents row data of query result
 * Insert and Update type definitions
 * 
 */
export interface Database {
    public: {
        Tables: {
            boxes: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    token_id: string;
                    token_uri: string | null;
                    box_info_cid: string | null;
                    private_key: string | null;
                    price: string;
                    deadline: string;
                    minter_id: string;
                    owner_address: string;
                    publisher_id: string | null;
                    seller_id: string | null;
                    buyer_id: string | null;
                    completer_id: string | null;
                    status: string;
                    listed_mode: string | null;
                    accepted_token: string | null;
                    refund_permit: boolean | null;
                    create_timestamp: string;
                    publish_timestamp: string | null;
                    listed_timestamp: string | null;
                    purchase_timestamp: string | null;
                    complete_timestamp: string | null;
                    request_refund_deadline: string | null;
                    review_deadline: string | null;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string;
                    token_id: string;
                    token_uri?: string | null;
                    box_info_cid: string | null;
                    private_key?: string | null;
                    price?: string;
                    deadline?: string;
                    minter_id: string;
                    owner_address: string;
                    publisher_id?: string | null;
                    seller_id?: string | null;
                    buyer_id?: string | null;
                    completer_id?: string | null;
                    status: string;
                    listed_mode?: string | null;
                    accepted_token?: string | null;
                    refund_permit?: boolean | null;
                    create_timestamp: string;
                    publish_timestamp?: string | null;
                    listed_timestamp?: string | null;
                    purchase_timestamp?: string | null;
                    complete_timestamp?: string | null;
                    request_refund_deadline?: string | null;
                    review_deadline?: string | null;
                };
                // ⚠️ Allow update: Multiple events will update boxes table
                // - BoxStatusChanged: Update status
                // - PriceChanged: Update price
                // - DeadlineChanged: Update deadline
                // - PrivateKeyPublished: Update private_key
                // - BoxPurchased: Update buyer_id, purchase_timestamp
                // - CompleterAssigned: Update completer_id
                // Trigger will listen to status update to update statistical_state
                Update: {
                    network?: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id?: string;
                    token_id?: string;
                    token_uri?: string | null;
                    box_info_cid?: string | null;
                    private_key?: string | null;
                    price?: string;
                    deadline?: string;
                    minter_id?: string;
                    owner_address?: string;
                    publisher_id?: string | null;
                    seller_id?: string | null;
                    buyer_id?: string | null;
                    completer_id?: string | null;
                    status?: string;
                    listed_mode?: string | null;
                    accepted_token?: string | null;
                    refund_permit?: boolean | null;
                    create_timestamp?: string;
                    publish_timestamp?: string | null;
                    listed_timestamp?: string | null;
                    purchase_timestamp?: string | null;
                    complete_timestamp?: string | null;
                    request_refund_deadline?: string | null;
                    review_deadline?: string | null;
                };
            };
            metadata_boxes: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    type_of_crime: string | null;
                    label: string[] | null;
                    title: string | null;
                    nft_image: string | null;
                    box_image: string | null;
                    country: string | null;
                    state: string | null;
                    description: string | null;
                    event_date: string | null;
                    create_date: string | null;
                    timestamp: number | null;
                    mint_method: string | null;
                    file_list: string[] | null;
                    password: string | null;
                    encryption_slices_metadata_cid: Record<string, unknown> | null;
                    encryption_file_cid: Record<string, unknown>[] | null;
                    encryption_passwords: Record<string, unknown> | null;
                    public_key: string | null;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string; // boxId (BIGINT)
                    type_of_crime: string | null;
                    label: string[] | null;
                    title: string | null;
                    nft_image: string | null;
                    box_image: string | null;
                    country: string | null;
                    state: string | null;
                    description: string | null;
                    event_date: string | null;
                    create_date: string | null;
                    timestamp: number | null;
                    mint_method: string | null;
                    file_list: string[] | null;
                    password?: string | null;
                    encryption_slices_metadata_cid?: Record<string, unknown> | null;
                    encryption_file_cid?: Record<string, unknown>[] | null;
                    encryption_passwords?: Record<string, unknown> | null;
                    public_key?: string | null;
                };
                Update: never; // Subsequent updates prohibited
            };
            users: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string;
                }; 
                Update: never; // Subsequent updates prohibited
            };
            user_addresses: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    is_blacklisted: boolean;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string;
                    is_blacklisted?: boolean;
                };
                // ⚠️ Allow update: Blacklist event will update is_blacklisted field
                Update: {
                    network?: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id?: string;
                    is_blacklisted?: boolean;
                };
            };
            box_bidders: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string; // boxId (part of primary key, corresponds to boxes.id)
                    bidder_id: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string; // boxId
                    bidder_id: string;
                };
                Update: never; // Subsequent updates prohibited
            };
            payments: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    box_id: string;
                    user_id: string;
                    token: string;
                    amount: string;
                    timestamp: string;
                    transaction_hash: Uint8Array;
                    block_number: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string;
                    box_id: string;
                    user_id: string;
                    token: string;
                    amount: string;
                    timestamp: string;
                    transaction_hash: Uint8Array;
                    block_number: string;
                };
                Update: never; // Subsequent updates prohibited
            };
            withdraws: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    token: string;
                    box_list: string[];
                    user_id: string;
                    amount: string;
                    timestamp: string;
                    withdraw_type: 'Order' | 'Refund' | 'Helper' | 'Minter';
                    transaction_hash: Uint8Array;
                    block_number: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string;
                    token: string;
                    box_list: string[];
                    user_id: string;
                    amount: string;
                    timestamp: string;
                    withdraw_type: 'Order' | 'Helper' | 'Minter' | 'Refund';
                    transaction_hash: Uint8Array;
                    block_number: string;
                };
                Update: never; // Subsequent updates prohibited
            };
            rewards_addeds: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    box_id: string;
                    token: string;
                    amount: string;
                    reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
                    timestamp: string;
                    transaction_hash: Uint8Array;
                    block_number: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id: string;
                    box_id: string;
                    token: string;
                    amount: string;
                    reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
                    timestamp: string;
                    transaction_hash: Uint8Array;
                    block_number: string;
                };
                Update: never; // Subsequent updates prohibited
            };
            box_rewards: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    box_id: string;
                    reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
                    token: string;
                    amount: string;
                };
                // ⚠️ Manual write prohibited: This table is automatically managed by triggers
                // If rewards need to be added, insert into rewards_addeds table
                Insert: never;
                Update: never;
            };
            user_rewards: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    user_id: string;
                    reward_type: 'Minter' | 'Seller' | 'Completer';
                    token: string;
                    amount: string;
                };
                // ⚠️ Manual write prohibited: This table is automatically managed by triggers
                // user_rewards does not contain Total type, only records rewards assigned to specific roles
                Insert: never;
                Update: never;
            };
            user_withdraws: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    user_id: string;
                    withdraw_type: 'Helper' | 'Minter';
                    token: string;
                    amount: string;
                };
                // ⚠️ Manual write prohibited: This table is automatically managed by triggers
                Insert: never;
                Update: never;
            };
            
            box_user_order_amounts: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    user_id: string;
                    box_id: string;
                    token: string;
                    amount: string;
                };
                // ⚠️ Manual write prohibited: This table is automatically managed by triggers
                // Fund changes should be triggered via payments, withdraws and rewards_addeds tables
                Insert: never;
                Update: never;
            };
            statistical_state: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    total_supply: string;
                    storing_supply: string;
                    selling_supply: string;
                    auctioning_supply: string;
                    paid_supply: string;
                    refunding_supply: string;
                    in_secrecy_supply: string;
                    published_supply: string;
                    blacklisted_supply: string;
                };
                // ⚠️ Manual write prohibited: This table is automatically managed by triggers
                // Statistical data changes should be triggered via boxes table insertions and status updates
                Insert: never;
                //  TODO  In tests, do not use this update, it will be removed in production
                Update: {
                    total_supply?: string;
                    storing_supply?: string;
                    selling_supply?: string;
                    auctioning_supply?: string;
                    paid_supply?: string;
                    refunding_supply?: string;
                    in_secrecy_supply?: string;
                    published_supply?: string;
                    blacklisted_supply?: string;
                    network?: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id?: string;
                };
            };
            fund_manager_state: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id?: string;
                };
                Update: never; // Subsequent updates prohibited
            };
            token_total_amounts: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    token: string;
                    fund_manager_id: string;
                    funds_type: 'OrderPaid' | 'OrderWithdraw' | 'RefundWithdraw' | 'RewardsAdded' | 'HelperRewardsWithdraw' | 'MinterRewardsWithdraw';
                    amount: string;
                };
                // ⚠️ Manual write prohibited: This table is automatically managed by triggers
                // Total amount changes should be triggered via business tables (payments, withdraws, box_rewards)
                Insert: never;
                Update: never;
            };
            sync_status: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    last_synced_block: string;
                    last_synced_at: string;
                };
                Insert: {
                    network: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id?: string;
                    last_synced_block?: string;
                    last_synced_at?: string;
                };
                // ⚠️ Allow update: Event sync script needs to update sync status
                Update: {
                    network?: 'testnet' | 'mainnet';
                    layer?: 'sapphire';
                    id?: string;
                    last_synced_block?: string;
                    last_synced_at?: string;
                };
            };
        };
        Functions: {
            search_boxes: {
                Args: {
                    network_filter: 'testnet' | 'mainnet';
                    layer_filter?: 'sapphire';
                    search_query?: string | null;
                    status_filter?: string[] | null;
                    type_of_crime_filter?: string[] | null;
                    country_filter?: string[] | null;
                    accepted_token_filter?: string[] | null;
                    label_filter?: string[] | null;
                    min_price?: number | null;
                    max_price?: number | null;
                    min_timestamp?: number | null;
                    max_timestamp?: number | null;
                    sort_by?: 'relevance' | 'price' | 'event_date' | 'box_id';
                    sort_direction?: 'asc' | 'desc';
                    limit_count?: number;
                    offset_count?: number;
                };
                Returns: {
                    id: string;
                    token_id: string;
                    title: string | null;
                    description: string | null;
                    type_of_crime: string | null;
                    country: string | null;
                    state: string | null;
                    label: string[] | null;
                    status: string;
                    price: string;
                    nft_image: string | null;
                    box_image: string | null;
                    event_date: string | null;
                    create_timestamp: string;
                    accepted_token: string | null;
                    deadline:string | null;
                    buyer_id:string | null;
                    relevance: number;
                }[];
            };
        };
    };
}

