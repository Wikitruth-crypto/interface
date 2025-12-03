import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 支持 React 19 的新特性
      babel: {
        plugins: [
          // 如果需要的话可以添加 babel 插件
        ]
      }
    })
  ],
  envPrefix: ['VITE_', 'REACT_APP_'],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dapp': path.resolve(__dirname, './src/dapp'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@Create': path.resolve(__dirname, './src/dapp/pages/Create'),
      '@Marketplace': path.resolve(__dirname, './src/dapp/pages/Marketplace'),
      '@BoxDetail': path.resolve(__dirname, './src/dapp/pages/BoxDetail'),
      '@Profile': path.resolve(__dirname, './src/dapp/pages/Profile'),
      '@Token': path.resolve(__dirname, './src/dapp/pages/Token'),
      '@Staking': path.resolve(__dirname, './src/dapp/pages/Staking'),
      '@Dao': path.resolve(__dirname, './src/dapp/pages/Dao'),
      '@supabaseDocs': path.resolve(__dirname, './supabaseDocs'),
    }
  },

  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
    open: true,
  },

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型依赖分离到单独的 chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'web3-vendor': ['wagmi', 'viem', 'ethers', ],
          'ui-vendor': ['antd', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'wagmi',
      '@wagmi/core',
      'viem',
      'ethers',
      '@tanstack/react-query',
      '@tanstack/query-core',
      'antd',
      'zustand',
    ],
    exclude: [
      // 排除不需要预构建的依赖
    ]
  },

  // 定义全局常量
  define: {
    // 如果需要的话可以定义全局变量
    'process.env': {}
  }
})
