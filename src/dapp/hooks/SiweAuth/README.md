# SIWE 认证 Hook

## 概述

SIWE (Sign-In with Ethereum) 认证 Hook，用于实现基于以太坊钱包的去中心化身份认证。

## 核心功能

- ✅ 生成符合 EIP-4361 标准的 SIWE 消息
- ✅ 使用钱包签名（ERC-191 personal_sign）
- ✅ 调用智能合约获取加密认证 token
- ✅ 会话管理（本地存储）
- ✅ 会话有效性验证
- ✅ 自动过期处理

## 快速开始

```typescript
import { useSiweAuth } from '@dapp/hooks/SiweAuth';

function LoginButton() {
  const { login, logout, session, isLoading } = useSiweAuth();
  
  const handleLogin = async () => {
    const result = await login();
    if (result) {
      console.log('登录成功！Token:', result.token);
    }
  };
  
  if (session.isLoggedIn) {
    return (
      <div>
        <p>已登录: {session.address}</p>
        <button onClick={logout}>登出</button>
      </div>
    );
  }
  
  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? '登录中...' : '使用钱包登录'}
    </button>
  );
}
```

## API 参考

### useSiweAuth()

#### 返回值

```typescript
interface UseSiweAuthResult {
  // 登录方法
  login: (params?: Partial<SiweMessageParams>) => Promise<LoginResult | null>;
  
  // 登出方法
  logout: () => void;
  
  // 验证会话
  validateSession: () => Promise<boolean>;
  
  // 会话信息
  session: SessionInfo;
  
  // 加载状态
  isLoading: boolean;
  
  // 错误信息
  error: Error | null;
  
  // 重置状态
  reset: () => void;
}
```

### login(params?)

登录并获取认证 token。

#### 参数（可选）

```typescript
interface SiweMessageParams {
  domain?: string;              // 域名，默认: wikitruth.eth.limo
  statement?: string;           // 声明文本，默认: 'I accept the WikiTruth Terms of Service'
  uri?: string;                 // URI，默认: https://{domain}
  resources?: string[];         // 资源列表，默认: []
  nonce?: string;              // 随机数，默认: 自动生成
  expirationTime?: Date;       // 过期时间，默认: 24小时后
  notBefore?: Date;            // 生效时间，默认: 立即
  issuedAt?: Date;            // 签发时间，默认: 当前时间
}
```

#### 返回值

```typescript
interface LoginResult {
  token: string;              // 加密的认证 token
  message: string;            // SIWE 消息原文
  signature: SignatureRSV;    // 签名数据
  expiresAt: Date;           // 过期时间
}
```

### session

会话信息对象。

```typescript
interface SessionInfo {
  isLoggedIn: boolean;           // 是否已登录
  token: string | null;          // 认证 token
  expiresAt: Date | null;        // 过期时间
  address: `0x${string}` | null; // 用户地址
}
```

## 使用示例

### 基础登录

```typescript
const { login, session } = useSiweAuth();

const handleLogin = async () => {
  const result = await login();
  if (result) {
    console.log('登录成功');
  }
};
```

### 自定义消息

```typescript
const { login } = useSiweAuth();

const handleLogin = async () => {
  const result = await login({
    statement: '我同意访问私密数据',
    resources: [
      'https://api.example.com/private',
      'https://api.example.com/user'
    ],
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
  });
};
```

### 验证会话

```typescript
const { validateSession, session } = useSiweAuth();

useEffect(() => {
  const checkSession = async () => {
    if (session.token) {
      const isValid = await validateSession();
      if (!isValid) {
        console.log('会话已失效，请重新登录');
      }
    }
  };
  
  checkSession();
}, [session.token]);
```

### 使用 token 调用受保护的合约方法

```typescript
const { session } = useSiweAuth();
const { getMsgSender } = useContext(ContractContext);

const callProtectedMethod = async () => {
  if (!session.token) {
    alert('请先登录');
    return;
  }
  
  // 将 token 传递给合约方法
  const authenticatedAddress = await getMsgSender(session.token);
  console.log('认证地址:', authenticatedAddress);
};
```

## 工作流程

### 1. 登录流程

```
用户点击登录
  ↓
生成 SIWE 消息
  ↓
钱包签名（ERC-191）
  ↓
调用合约 login(message, signature)
  ↓
合约验证并返回加密 token
  ↓
保存 token 到本地存储
  ↓
更新会话状态
```

### 2. 会话验证流程

```
检查本地过期时间
  ↓
调用合约 isSessionValid(token)
  ↓
返回验证结果
```

### 3. 使用 token 访问合约

```
读取本地 token
  ↓
调用合约方法，传入 token
  ↓
合约解密并验证 token
  ↓
返回结果或执行操作
```

## 本地存储

Hook 会在本地存储中保存以下信息：

- `siwe_auth_token`: 认证 token
- `siwe_auth_expires_at`: 过期时间
- `siwe_auth_address`: 用户地址

⚠️ **注意**：token 已经过合约加密，但仍建议不要在公共计算机上使用。

## 网络配置

目前支持的网络：

### Sapphire Testnet (23294)
```typescript
{
  chainId: 23294,
  version: '1',
  defaultStatement: 'I accept the WikiTruth Terms of Service',
  defaultExpirationHours: 24
}
```

### Sapphire Mainnet (23295)
```typescript
{
  chainId: 23295,
  version: '1',
  defaultStatement: 'I accept the WikiTruth Terms of Service',
  defaultExpirationHours: 24
}
```

## 错误处理

```typescript
const { login, error } = useSiweAuth();

const handleLogin = async () => {
  const result = await login();
  
  if (!result) {
    // 检查错误
    if (error) {
      console.error('登录失败:', error.message);
      
      if (error.message.includes('钱包未连接')) {
        alert('请先连接钱包');
      } else if (error.message.includes('用户拒绝')) {
        alert('签名被拒绝');
      } else {
        alert('登录失败，请重试');
      }
    }
  }
};
```

## 常见问题

### 1. 签名被拒绝

**现象**：钱包弹窗点击"拒绝"

**处理**：捕获错误并提示用户

```typescript
try {
  await login();
} catch (err) {
  console.log('用户取消签名');
}
```

### 2. 会话过期

**现象**：token 过期后调用失败

**处理**：重新登录

```typescript
const callMethod = async () => {
  const isValid = await validateSession();
  if (!isValid) {
    // 会话过期，请求重新登录
    await login();
  }
};
```

### 3. 合约验证失败

**可能原因**：
- 域名不在合约支持的列表中
- chainId 不匹配
- 签名地址与消息中的地址不一致

**解决方法**：
- 检查域名配置
- 确保在正确的网络
- 确认钱包地址正确

## 安全注意事项

1. **Token 加密**：token 已由合约使用 Sapphire 加密，安全存储
2. **过期时间**：建议设置合理的过期时间（默认24小时）
3. **会话验证**：重要操作前应验证会话有效性
4. **私密操作**：不要在公共计算机上保持登录状态

## 与合约集成

### 读取用户数据

```typescript
const { session } = useSiweAuth();

// 获取认证地址
const address = await getMsgSender(session.token);

// 获取声明
const statement = await getStatement(session.token);

// 获取资源列表
const resources = await getResources(session.token);
```

### 撤销 token

```typescript
const { session } = useSiweAuth();

// 计算 token hash
const tokenHash = keccak256(session.token);

// 调用合约撤销
await removeAuthToken(tokenHash);

// 本地登出
logout();
```

## 相关文件

- Hook: `src/dapp/hooks/SiweAuth/useSiweAuth.tsx`
- 类型: `src/dapp/hooks/SiweAuth/types.ts`
- 合约: `src/dapp/artifacts/contracts/SiweAuthWikiTruth.sol`
- Provider: `src/dapp/context/providerSiweAuth.tsx`

## 依赖库

- `siwe`: SIWE 消息生成和验证
- `wagmi`: 钱包连接和签名
- `viem`: 以太坊交互

## 更新日志

- 2025-10-12: 初始版本，基于 wagmi v2 和 viem

