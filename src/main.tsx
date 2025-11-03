import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './styles'

// 导入全局样式
import '@/styles/globals.css'
import '@/dapp/components/Loader/loader.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider { ...{
      currentThemeName: 'purple', // 当前项目定义一个风格：暗黑模式，紫色主题。
      isDarkMode: true,
    } }>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)

