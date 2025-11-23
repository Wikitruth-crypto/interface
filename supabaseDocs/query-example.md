# 数据库查询示例文档

本文档提供基于 `marketplace-queries.md` 需求的前端场景数据库查询示例。

**注意**：所有查询都需要指定 `network` 和 `layer` 参数来区分不同网络的数据。

---

## 1. TypeScript 查询示例

### 1.1 使用 Supabase Client 查询

```typescript
import { supabase } from './config/supabase.config';

// Marketplace 统计数据
const getMarketplaceStats = async (network: 'testnet' | 'mainnet') => {
    const { data, error } = await supabase
        .from('statistical_state')
        .select('*')
        .eq('network', network)
        .eq('layer', 'sapphire')
        .eq('id', 'statistical')
        .single();
    
    if (error) throw error;
    return data;
};

// Marketplace 列表（普通查询方式 - 只返回列表卡片需要的字段）
// 列表卡片需要的字段：
// - Box: id, token_id, price, status, deadline, box_info_cid
// - metadataBox: title, description, nft_image, box_image, country, state, event_date, type_of_crime
const getMarketplaceList = async (
    network: 'testnet' | 'mainnet',
    filters: {
        status?: string[];
        country?: string;
        state?: string;
        minPrice?: string;
        maxPrice?: string;
        search?: string;  // 如果有搜索需求，建议使用 search_boxes 函数
    },
    sort: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'id_asc' | 'id_desc' = 'date_desc',
    limit: number = 20,
    offset: number = 0
) => {
    // 只选择列表卡片需要的字段，避免返回全部数据影响性能
    let query = supabase
        .from('boxes')
        .select(`
            id,
            token_id,
            price,
            status,
            deadline,
            box_info_cid,
            create_timestamp,
            metadata_boxes!inner (
                title,
                description,
                nft_image,
                box_image,
                country,
                state,
                event_date,
                type_of_crime
            )
        `)
        .eq('network', network)
        .eq('layer', 'sapphire');
    
    // 应用筛选
    if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
    }
    if (filters.country) {
        query = query.eq('metadata_boxes.country', filters.country);
    }
    if (filters.state) {
        query = query.eq('metadata_boxes.state', filters.state);
    }
    if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
    }
    
    // 应用排序（数据库层面排序）
    // 注意：Supabase Client 的 .order() 方法会在数据库层面生成 ORDER BY 子句
    // 排序和分页都在数据库层面完成，不会在应用层处理
    switch (sort) {
        case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
        case 'date_asc':
            // 注意：event_date 在关联表 metadata_boxes 中，需要使用外键关系排序
            // Supabase PostgREST 支持通过外键关系对关联表字段排序
            query = query.order('metadata_boxes.event_date', { ascending: true, nullsFirst: false });
            break;
        case 'date_desc':
            query = query.order('metadata_boxes.event_date', { ascending: false, nullsFirst: false });
            break;
        case 'id_asc':
            // 使用 id（boxId）而不是 token_id
            // id 是 TEXT 类型，PostgreSQL 会按字符串排序，对于数字字符串需要特殊处理
            // 如果 id 是纯数字字符串，可以使用 CAST 转换为数字排序
            // 但 Supabase Client 不支持直接 CAST，所以这里使用 id 的字符串排序
            // 如果需要数字排序，建议使用 search_boxes 函数的 box_id 排序
            query = query.order('id', { ascending: true });
            break;
        case 'id_desc':
            query = query.order('id', { ascending: false });
            break;
    }
    
    // 分页也在数据库层面完成（使用 LIMIT 和 OFFSET）
    query = query.range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

// Marketplace 列表（使用 search_boxes 函数 - 适用于需要全文搜索的场景）
// search_boxes 函数返回的字段已足够满足列表卡片渲染需求
// 返回字段：id, token_id, title, description, type_of_crime, country, state, 
//          label, status, price, nft_image, box_image, create_timestamp, relevance
// 
// ⚠️ 重要：search_boxes 函数在数据库层面实现了分页（使用 LIMIT 和 OFFSET）
// 它不会返回所有数据，只会返回指定页的数据，性能高效
// 
// ✅ 支持排序：search_boxes 函数现在支持多种排序方式
// - sort_by: 'relevance' | 'price' | 'event_date' | 'box_id'
//   - 'relevance': 相关性排序（适用于有搜索查询时）
//   - 'price': 价格排序
//   - 'event_date': 事件日期排序（来自 metadata_boxes.event_date）
//   - 'box_id': Box ID 排序（即 boxes.id）
// - sort_direction: 'asc' | 'desc'
const getMarketplaceListWithSearch = async (
    network: 'testnet' | 'mainnet',
    filters: {
        status?: string[];
        country?: string[];
        state?: string;
        typeOfCrime?: string[];
        label?: string[];
        minPrice?: string;
        maxPrice?: string;
        minTimestamp?: number;
        maxTimestamp?: number;
        search?: string;  // 全文搜索关键词
    },
    sort: 'relevance' | 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'id_asc' | 'id_desc' = 'relevance',
    limit: number = 20,
    offset: number = 0
) => {
    // 解析排序参数
    let sort_by: 'relevance' | 'price' | 'event_date' | 'box_id' = 'relevance';
    let sort_direction: 'asc' | 'desc' = 'desc';
    
    switch (sort) {
        case 'relevance':
            sort_by = 'relevance';
            sort_direction = 'desc';
            break;
        case 'price_asc':
            sort_by = 'price';
            sort_direction = 'asc';
            break;
        case 'price_desc':
            sort_by = 'price';
            sort_direction = 'desc';
            break;
        case 'date_asc':
            sort_by = 'event_date';  // 使用 event_date 而不是 create_timestamp
            sort_direction = 'asc';
            break;
        case 'date_desc':
            sort_by = 'event_date';  // 使用 event_date 而不是 create_timestamp
            sort_direction = 'desc';
            break;
        case 'id_asc':
            sort_by = 'box_id';  // 使用 box_id 而不是 token_id
            sort_direction = 'asc';
            break;
        case 'id_desc':
            sort_by = 'box_id';  // 使用 box_id 而不是 token_id
            sort_direction = 'desc';
            break;
    }
    
    // search_boxes 函数在数据库层面使用 LIMIT 和 OFFSET 进行分页
    // 只会返回 limit 条数据，不会返回所有匹配的数据
    // 排序也在数据库层面完成，性能高效
    const { data, error } = await supabase.rpc('search_boxes', {
        network_filter: network,
        layer_filter: 'sapphire',
        search_query: filters.search || null,
        status_filter: filters.status || null,
        type_of_crime_filter: filters.typeOfCrime || null,
        country_filter: filters.country || null,
        label_filter: filters.label || null,
        min_price: filters.minPrice ? parseFloat(filters.minPrice) : null,
        max_price: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        min_timestamp: filters.minTimestamp || null,
        max_timestamp: filters.maxTimestamp || null,
        sort_by: sort_by,              // 排序字段
        sort_direction: sort_direction, // 排序方向
        limit_count: limit,             // 数据库层面限制返回数量
        offset_count: offset            // 数据库层面跳过前面的数据
    });
    
    if (error) throw error;
    
    // 注意：search_boxes 函数在数据库层面完成排序和分页
    // - 如果有搜索查询且 sort_by = 'relevance'，会按相关性排序
    // - 如果没有搜索查询，relevance 为 0，会按指定的 sort_by 字段排序
    // - 'event_date' 排序使用 metadata_boxes.event_date（事件日期）
    // - 'box_id' 排序使用 boxes.id（Box ID）
    // - 次要排序确保结果稳定（当主要排序字段值相同时）
    return data;
};

// Box 详情（包含所有关联数据 + 当前用户关联数据）
const getBoxDetail = async (
    network: 'testnet' | 'mainnet',
    boxId: string,
    currentUserId?: string,  // 当前登录用户的 userId
    currentUserAddress?: string  // 当前登录用户的 address
) => {
    // 1. 查询 Box 的所有关联数据
    const { data: boxData, error: boxError } = await supabase
        .from('boxes')
        .select(`
            *,
            metadata_boxes (*),
            box_reward_amounts (*),
            payments (*),
            box_bidders (
                bidder_id,
                users!box_bidders_bidder_id_fkey (*)
            )
        `)
        .eq('network', network)
        .eq('layer', 'sapphire')
        .eq('id', boxId)
        .single();
    
    if (boxError) throw boxError;
    
    // 2. 查询当前用户在该 Box 中的关联数据
    let userRelatedData: any = {};
    
    if (currentUserId) {
        // 查询当前用户的资金信息
        const { data: userFunds } = await supabase
            .from('box_funds')
            .select('*')
            .eq('network', network)
            .eq('layer', 'sapphire')
            .eq('user_id', currentUserId)
            .eq('box_id', boxId);
        
        // 查询当前用户的支付记录
        const { data: userPayments } = await supabase
            .from('payments')
            .select('*')
            .eq('network', network)
            .eq('layer', 'sapphire')
            .eq('box_id', boxId)
            .eq('payer_id', currentUserId);
        
        // 查询当前用户是否参与竞拍
        const { data: isBidder } = await supabase
            .from('box_bidders')
            .select('bidder_id')
            .eq('network', network)
            .eq('layer', 'sapphire')
            .eq('box_id', boxId)
            .eq('bidder_id', currentUserId)
            .maybeSingle();
        
        userRelatedData = {
            funds: userFunds || [],
            payments: userPayments || [],
            isBidder: !!isBidder
        };
    }
    
    return {
        ...boxData,
        userRelated: userRelatedData
    };
};

// Profile 用户 Box 列表
const getUserBoxes = async (
    network: 'testnet' | 'mainnet',
    userId: string,
    userAddress: string,
    tab: 'all' | 'owned' | 'minted' | 'sold' | 'bought' | 'bade' | 'completed' | 'published',
    status?: string,
    orderBy: 'boxId' | 'price' | 'createTimestamp' = 'createTimestamp',
    orderDirection: 'asc' | 'desc' = 'desc',
    limit: number = 20,
    offset: number = 0
) => {
    // 只选择列表卡片需要的字段 + 资金和奖励信息
    let query = supabase
        .from('boxes')
        .select(`
            id,
            token_id,
            price,
            status,
            deadline,
            box_info_cid,
            create_timestamp,
            listed_mode,
            accepted_token,
            refund_permit,
            owner_address,
            minter_id,
            seller_id,
            buyer_id,
            completer_id,
            publisher_id,
            metadata_boxes!inner (
                title,
                description,
                nft_image,
                box_image,
                country,
                state,
                event_date,
                type_of_crime
            ),
            box_funds!box_funds_box_id_fkey (
                fund_type,
                token,
                amount
            ),
            box_reward_amounts (
                reward_type,
                token,
                amount
            )
        `)
        .eq('network', network)
        .eq('layer', 'sapphire');
    
    // 根据 Tab 应用筛选
    switch (tab) {
        case 'owned':
            query = query.eq('owner_address', userAddress);
            break;
        case 'minted':
            query = query.eq('minter_id', userId);
            break;
        case 'sold':
            query = query.eq('seller_id', userId);
            break;
        case 'bought':
            query = query.eq('buyer_id', userId);
            break;
        case 'bade':
            // 需要单独查询 box_bidders
            const { data: bidBoxes } = await supabase
                .from('box_bidders')
                .select('box_id')
                .eq('network', network)
                .eq('layer', 'sapphire')
                .eq('bidder_id', userId);
            const boxIds = bidBoxes?.map(b => b.box_id) || [];
            query = query.in('id', boxIds);
            break;
        case 'completed':
            query = query.eq('completer_id', userId);
            break;
        case 'published':
            query = query.eq('publisher_id', userId);
            break;
        case 'all':
        default:
            // 查询所有相关的 Box
            query = query.or(`owner_address.eq.${userAddress},minter_id.eq.${userId},seller_id.eq.${userId},buyer_id.eq.${userId},completer_id.eq.${userId},publisher_id.eq.${userId}`);
            break;
    }
    
    // 状态筛选
    if (status) {
        query = query.eq('status', status);
    }
    
    // 排序（数据库层面排序）
    // 注意：Supabase Client 的 .order() 方法会在数据库层面生成 ORDER BY 子句
    // 排序和分页都在数据库层面完成，不会在应用层处理
    switch (orderBy) {
        case 'boxId':
            // 使用 id（boxId）而不是 token_id
            // id 是 TEXT 类型，PostgreSQL 会按字符串排序
            // 如果需要数字排序，建议使用 search_boxes 函数的 box_id 排序
            query = query.order('id', { ascending: orderDirection === 'asc' });
            break;
        case 'price':
            query = query.order('price', { ascending: orderDirection === 'asc' });
            break;
        case 'createTimestamp':
            // 使用 event_date（事件日期）而不是 create_timestamp
            // event_date 在关联表 metadata_boxes 中，需要使用外键关系排序
            query = query.order('metadata_boxes.event_date', { 
                ascending: orderDirection === 'asc',
                nullsFirst: false 
            });
            break;
    }
    
    // 分页也在数据库层面完成（使用 LIMIT 和 OFFSET）
    query = query.range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
};
```

---

## 6. 注意事项

1. **网络参数**：所有查询都必须指定 `network` 和 `layer` 参数
2. **类型转换**：`NUMERIC(78, 0)` 类型在 TypeScript 中返回为字符串，需要手动转换
3. **分页**：使用 `LIMIT` 和 `OFFSET` 进行分页，注意性能优化
4. **索引**：确保查询字段都有对应的索引，以提高查询性能
5. **关联查询**：使用 `LEFT JOIN` 避免丢失数据，使用 `INNER JOIN` 确保数据完整性
6. **全文搜索**：使用 `search_boxes` 函数进行全文搜索，性能更好
7. **资金计算**：`box_funds` 表的 `amount` 字段可能为 0，需要过滤掉
8. **列表查询优化**：
   - **普通查询**：使用 `getMarketplaceList`，只选择列表卡片需要的字段，避免返回全部数据
   - **全文搜索**：使用 `getMarketplaceListWithSearch`（基于 `search_boxes` 函数），适用于需要全文搜索的场景
   - 两种方式都只返回列表卡片渲染所需的字段，提高加载性能

---

## 7. 性能优化建议

1. **使用索引**：确保查询字段都有索引
2. **避免全表扫描**：始终使用 `network` 和 `layer` 过滤
3. **限制返回字段**：只查询需要的字段，避免 `SELECT *`
4. **使用聚合函数**：在数据库层面进行聚合计算，而不是在应用层
5. **分页查询**：始终使用 `LIMIT` 和 `OFFSET`，避免一次性查询大量数据
6. **使用函数**：对于复杂查询，使用数据库函数可以提高性能
7. **列表查询优化**：使用 `search_boxes` 函数而不是直接查询表，可以利用全文搜索索引和相关性排序

-------


解释 Supabase 的分页和排序机制：


## Supabase 的分页和排序机制

### 1. **两种查询方式**

#### **方式 A：表查询（使用 Supabase Client 方法链）**

```typescript
// 这些方法都在数据库层面执行
const { data } = await supabase
    .from('boxes')
    .select('*')
    .eq('network', 'testnet')
    .order('price', { ascending: true })  // ✅ 数据库层面：生成 ORDER BY price ASC
    .range(0, 19);                        // ✅ 数据库层面：生成 LIMIT 20 OFFSET 0
```

生成的 SQL：
```sql
SELECT * FROM boxes 
WHERE network = 'testnet' 
ORDER BY price ASC 
LIMIT 20 OFFSET 0;
```

#### **方式 B：函数查询（使用 RPC 调用）**

```typescript
// 函数参数在数据库函数定义中声明
const { data } = await supabase.rpc('search_boxes', {
    network_filter: 'testnet',
    sort_by: 'price',           // ✅ 函数参数
    sort_direction: 'asc',      // ✅ 函数参数
    limit_count: 20,            // ✅ 函数参数
    offset_count: 0             // ✅ 函数参数
});
```

### 2. **为什么 `supabase.config.ts` 中只有函数有参数？**

`supabase.config.ts` 中的类型定义：

```typescript
export interface Database {
    public: {
        Tables: {
            boxes: {
                Row: { ... },      // 表结构定义
                Insert: { ... },   // 插入类型定义
                Update: { ... }    // 更新类型定义
            }
        },
        Functions: {
            search_boxes: {
                Args: { ... },     // ✅ 函数参数需要在这里定义
                Returns: { ... }   // 函数返回类型
            }
        }
    }
}
```

原因：
- `Tables`：只定义表结构（Row、Insert、Update），不包含查询方法
- `Functions`：需要定义函数参数（Args）和返回