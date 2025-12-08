import { useMemo, useState } from 'react'
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useConfig,
  useDisconnect,
  useSwitchChain
} from 'wagmi'

export type ModalView = 'connect' | 'account' | 'network' | null

export const formatAddress = (addr?: string | null) =>
  addr ? `${addr.slice(0, 4)}...${addr.slice(-3)}` : ''

export const formatBalance = (value?: string, symbol?: string) => {
  if (!value) return '0.000'
  const [whole, decimal = '000'] = value.split('.')
  return `${whole}.${decimal.substring(0, 3)} ${symbol ?? ''}`.trim()
}

export const formatString = (value?: string) => {
  if (!value) return ''
  return value.slice(0, 3) + '...' + value.slice(-7)
}

export function useConnectController() {
  const {
    address,
    status: accountStatus // 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  } = useAccount()
  const chainId = useChainId()
  const config = useConfig()
  
  // 只有在真正连接时才使用地址（避免在连接过程中使用未确认的地址）
  const connectedAddress = accountStatus === 'connected' ? address : undefined
  const { data: balanceData } = useBalance({
    address: connectedAddress,
    chainId,
    query: { enabled: Boolean(connectedAddress) }
  })

  const {
    connectors,        // 所有可用的钱包连接器列表
    connectAsync,      // 异步连接方法
    status: connectStatus, // 连接状态：'idle' | 'pending' | 'error' | 'success'
    error: connectError   // 连接错误信息
  } = useConnect()
  
  // 断开连接方法
  const { disconnectAsync } = useDisconnect()
  
  // 切换网络相关（切换方法、切换状态、切换错误）
  const { 
    switchChainAsync,      // 异步切换网络方法
    status: switchStatus,  // 切换状态：'idle' | 'pending' | 'error' | 'success'
    error: switchError     // 切换错误信息
  } = useSwitchChain()

  // ==================== 本地状态管理 ====================
  // 模态框显示状态：控制显示哪个模态框（连接/账户/网络切换）
  const [modalView, setModalView] = useState<ModalView>(null)
  
  // 钱包搜索关键词：用于过滤钱包列表
  const [walletSearch, setWalletSearch] = useState('')
  
  // 网络搜索关键词：用于过滤网络列表
  const [networkSearch, setNetworkSearch] = useState('')
  
  // 正在连接的钱包 ID：用于显示哪个钱包正在连接中
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)
  
  // 横幅提示信息：用于显示错误或成功消息
  const [banner, setBanner] = useState<string | null>(null)

  // ==================== 计算属性 ====================
  // 根据当前链 ID 查找对应的链配置信息
  const currentChain = useMemo(() => config.chains.find(chain => chain.id === chainId), [config.chains, chainId])

  // 根据搜索关键词过滤钱包连接器列表
  // 支持按钱包名称或 ID 进行搜索（不区分大小写）
  const filteredConnectors = useMemo(() => {
    const keyword = walletSearch.trim().toLowerCase()
    if (!keyword) return connectors
    return connectors.filter(connector =>
      connector.name.toLowerCase().includes(keyword) || connector.id.toLowerCase().includes(keyword)
    )
  }, [connectors, walletSearch])

  // 根据搜索关键词过滤网络列表
  // 支持按网络名称进行搜索（不区分大小写）
  const filteredChains = useMemo(() => {
    const keyword = networkSearch.trim().toLowerCase()
    if (!keyword) return config.chains
    return config.chains.filter(chain => chain.name.toLowerCase().includes(keyword))
  }, [config.chains, networkSearch])

  // ==================== 状态判断 ====================
  // 是否已连接钱包
  const isConnected = accountStatus === 'connected'
  
  // 是否正在重连（自动重连场景）
  const isReconnecting = accountStatus === 'reconnecting'
  
  // 是否正在连接中（包括：等待用户确认、连接进行中、有连接器正在处理）
  const isConnecting =
    connectStatus === 'pending' || accountStatus === 'connecting' || Boolean(pendingConnectorId)
  
  // 是否正在切换网络
  const isSwitching = switchStatus === 'pending'

  // ==================== 模态框控制方法 ====================
  /**
   * 打开模态框
   * 打开指定类型的模态框，并清除之前的横幅提示
   * 
   * @param view - 要打开的模态框类型（'connect' | 'account' | 'network'）
   */
  const openModal = (view: Exclude<ModalView, null>) => {
    setBanner(null)
    setModalView(view)
  }

  /**
   * 关闭模态框
   * 关闭当前模态框，并重置所有相关状态（搜索关键词、横幅提示等）
   */
  const closeModal = () => {
    setModalView(null)
    setWalletSearch('')
    setNetworkSearch('')
    setBanner(null)
  }

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find(item => item.id === connectorId)
    if (!connector) return
    try {
      setBanner(null) // 清除之前的错误提示
      setPendingConnectorId(connector.id) // 标记当前正在连接的钱包
      await connectAsync({ connector }) // 执行连接操作
      closeModal() // 连接成功后关闭模态框
    } catch (error: any) {
      // 连接失败时显示错误信息
      setBanner(error?.shortMessage ?? error?.message ?? 'Failed to connect wallet')
    } finally {
      setPendingConnectorId(null) // 清除待处理状态
    }
  }

  const handleDisconnect = async () => {
    if (!connectedAddress) return
    const confirmed = window.confirm(
      `Are you sure you want to disconnect ${formatAddress(connectedAddress)}?`
    )
    if (!confirmed) return
    await disconnectAsync()
    closeModal()
  }

  const handleSwitchChain = async (targetChainId: number) => {
    if (!switchChainAsync) return
    // 如果目标网络已是当前网络，直接切换到账户视图
    if (targetChainId === chainId) {
      setModalView('account')
      return
    }

    try {
      setBanner(null) // 清除之前的错误提示
      await switchChainAsync({ chainId: targetChainId }) // 执行网络切换
      setModalView('account') // 切换成功后显示账户视图
    } catch (error: any) {
      // 切换失败时显示错误信息
      setBanner(error?.shortMessage ?? error?.message ?? 'Failed to switch chain')
    }
  }

  return {
    // 账户信息
    address: connectedAddress,        // 当前连接的钱包地址（仅在已连接时有效）
    balanceData,                      // 余额数据（包含 formatted、symbol 等）
    chainId,                          // 当前链 ID
    currentChain,                     // 当前链的完整配置信息
    
    // 连接器信息
    connectors,                        // 所有可用的钱包连接器列表
    filteredConnectors,               // 根据搜索关键词过滤后的钱包列表
    
    // 网络信息
    filteredChains,                   // 根据搜索关键词过滤后的网络列表
    
    // 状态标志
    isConnected,                      // 是否已连接钱包
    isConnecting,                     // 是否正在连接中
    isSwitching,                      // 是否正在切换网络
    isReconnecting,                   // 是否正在重连
    
    // 错误信息
    connectError,                     // 连接错误（如果有）
    switchError,                      // 切换网络错误（如果有）
    
    // 模态框状态
    modalView,                        // 当前显示的模态框类型
    walletSearch,                     // 钱包搜索关键词
    networkSearch,                    // 网络搜索关键词
    banner,                           // 横幅提示信息（错误或成功消息）
    pendingConnectorId,               // 正在连接的钱包 ID
    
    // 操作方法
    openModal,                        // 打开指定类型的模态框
    closeModal,                       // 关闭模态框并重置状态
    setWalletSearch,                  // 设置钱包搜索关键词
    setNetworkSearch,                 // 设置网络搜索关键词
    handleConnect,                    // 处理钱包连接
    handleDisconnect,                 // 处理钱包断开连接
    handleSwitchChain                 // 处理网络切换
  }
}
