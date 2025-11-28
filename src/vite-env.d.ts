/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INFURA_API_URL_0?: string
  readonly VITE_INFURA_API_URL_1?: string
  readonly VITE_INFURA_API_URL_2?: string
  readonly VITE_INFURA_API_URL_3?: string
  readonly VITE_ALCHEMY_API_URL_0?: string
  readonly VITE_THE_GRAPH_QUERY_URL?: string
  readonly VITE_IPFS_FLEEK_MintData_clientId?: string
  readonly VITE_IPFS_FLEEK_ExchangeData_clientId?: string
  readonly VITE_IPFS_FLEEK_ResultData_clientId?: string
  // 添加其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 声明图片模块
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.webp' {
  const value: string
  export default value
}

// 声明 JSON 模块
declare module '*.json' {
  const value: any
  export default value
}

// 声明 Reown AppKit Web Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

