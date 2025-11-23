import { Routes, Route } from 'react-router-dom'
import ConditionalLayout from '@/components/ConditionalLayout'
// 启动IPFS网关轮询
import { startIpfsGatewayPolling } from '@/config/ipfsUrl/sync'
startIpfsGatewayPolling()


// 主站页面
import HomePage from '@/pages/Home'
import BlogPage from '@/pages/Blog'
import DocsPage from '@/pages/Docs'
import EventsPage from '@/pages/Events'
import TeamPage from '@/pages/Team'
import UseCasePage from '@/pages/UseCase'


// DApp 组件
import Dapp from '@/dapp/pages/dapp';

function App() {
  return (
      <ConditionalLayout>
        <Routes>
          {/* 主站路由 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/useCase" element={<UseCasePage />} />

          {/* DApp 路由 - 使用嵌套路由 */}
          <Route path="/app/*" element={<Dapp />}>
          </Route>
        </Routes>
      </ConditionalLayout>
  )
}

export default App

