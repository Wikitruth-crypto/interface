import '@ant-design/v5-patch-for-react-19' // must be at the top
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import { ThemeProvider } from './styles'

import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider {...{
      currentThemeName: 'purple',
      isDarkMode: true,
    }}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)

