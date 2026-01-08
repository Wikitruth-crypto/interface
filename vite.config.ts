import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Support new features of React 19
      babel: {
        plugins: [
          // Add babel plugins if needed
        ]
      }
    })
  ],
  envPrefix: ['VITE_', 'REACT_APP_'],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dapp': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@Create': path.resolve(__dirname, './src/pages/Create'),
      '@Marketplace': path.resolve(__dirname, './src/pages/Marketplace'),
      '@BoxDetail': path.resolve(__dirname, './src/pages/BoxDetail'),
      '@Profile': path.resolve(__dirname, './src/pages/Profile'),
      '@Token': path.resolve(__dirname, './src/pages/Token'),
      '@Staking': path.resolve(__dirname, './src/pages/Staking'),
      '@Dao': path.resolve(__dirname, './src/pages/Dao'),
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Enable compression optimization - use terser to remove console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console in production
        drop_debugger: true,
      },
    },
    // Code splitting optimization
    rollupOptions: {
      output: {
        // Optimize chunk file naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Intelligent code splitting
        manualChunks: (id) => {
          // Exclude nested node_modules (under oasisQuery directory)
          if (id.includes('oasisQuery') && id.includes('node_modules')) {
            return null; // Do not package nested dependencies separately
          }
          
          // Handle dependencies in node_modules
          if (id.includes('node_modules')) {
            // React related
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Web3 related
            if (id.includes('wagmi') || id.includes('viem') || id.includes('ethers') || 
                id.includes('@rainbow-me') || id.includes('@oasisprotocol') ||
                id.includes('@walletconnect')) {
              return 'web3-vendor';
            }
            // UI related
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'ui-vendor';
            }
            // Query related
            if (id.includes('@tanstack/react-query') || id.includes('@tanstack/query-core')) {
              return 'query-vendor';
            }
            // Chart/Flowchart
            if (id.includes('@xyflow')) {
              return 'flow-vendor';
            }
            // Database
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            // Wallet related
            if (id.includes('metamask') || id.includes('@metamask') || 
                id.includes('siwe')) {
              return 'wallet-vendor';
            }
            // Utility libraries
            if (id.includes('lodash') || id.includes('date-fns') || 
                id.includes('dayjs') || id.includes('zod')) {
              return 'utils-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          
          // Split by page - separate code for different pages
          if (id.includes('/pages/')) {
            const pageMatch = id.match(/\/pages\/([^/]+)/);
            if (pageMatch) {
              const pageName = pageMatch[1].toLowerCase();
              // Exclude index files as they will be included in the main entry
              if (!id.includes('/index.')) {
                return `page-${pageName}`;
              }
            }
          }
        },
      },
    },
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 1000,
  },

  // Optimize dependency pre-bundling
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
      '@rainbow-me/rainbowkit',
    ],
    exclude: [
      // Exclude nested node_modules (dependencies under oasisQuery directory)
      // Note: esbuild does not support ** wildcards, need to use single asterisks or specific paths
      // 'src/oasisQuery/**', // This syntax is not supported
    ],
    // Force pre-bundling of these dependencies (optional, initial build will be slower)
    force: false,
  },

  // Define global constants
  define: {
    // Define global variables if needed
    'process.env': {}
  }
})
