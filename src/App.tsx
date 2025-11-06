import { Routes, Route } from 'react-router-dom'
// import { AntdThemeProvider } from '@/components/providers/antdTheme' // 已弃用
import ConditionalLayout from '@/components/ConditionalLayout'

// 主站页面
import HomePage from '@/pages/Home'
import BlogPage from '@/pages/Blog'
import DocsPage from '@/pages/Docs'
import EventsPage from '@/pages/Events'
import TeamPage from '@/pages/Team'
import UseCasePage from '@/pages/UseCase'
import TruthBoxEventsApp from '@/dapp/oasisQuery/TruthBoxEventsApp'


// DApp 页面
import DappLayout from '@/pages/app/DappLayout'
import MarketplacePage from '@/pages/app/Marketplace'
import CreatePage from '@/pages/app/Create'
import StakingPage from '@/pages/app/Staking'
import DaoPage from '@/pages/app/Dao'
import TokenPage from '@/pages/app/Token'
import ProfilePage from '@/pages/app/Profile'
import BoxDetailPage from '@/pages/app/BoxDetail'
import TestsPage from '@/dapp/pages/Tests'

function App() {
  return (
    // <AntdThemeProvider>
      <ConditionalLayout>
        <Routes>
          {/* 主站路由 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/useCase" element={<UseCasePage />} />
          <Route path="/oasisQuery" element={<TruthBoxEventsApp />} />

          {/* DApp 路由 - 使用嵌套路由 */}
          <Route path="/app" element={<DappLayout />}>
            <Route index element={<MarketplacePage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="staking" element={<StakingPage />} />
            <Route path="dao" element={<DaoPage />} />
            <Route path="token" element={<TokenPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="boxDetail/:tokenId" element={<BoxDetailPage />} />
            <Route path="tests" element={<TestsPage />} />
          </Route>
        </Routes>
      </ConditionalLayout>
    // </AntdThemeProvider>
  )
}

export default App

