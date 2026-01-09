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
    // Let Vite handle code splitting automatically to avoid export issues
    rollupOptions: {
      output: {
        // Simple chunk file naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Let Vite automatically handle code splitting
        // No manual chunks to avoid export issues
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
      'react/jsx-runtime',
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
    esbuildOptions: {
      // Ensure React is treated as a single instance
      define: {
        global: 'globalThis',
      },
    },
  },

  // Define global constants
  define: {
    // Define global variables if needed
    'process.env': JSON.stringify({}),
    'process.version': JSON.stringify('v18.0.0'), // Provide a version string for libraries that check process.version
    'process.browser': JSON.stringify(true),
    'process.platform': JSON.stringify('browser'),
  }
})
