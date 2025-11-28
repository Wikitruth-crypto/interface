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
  const { address, status: accountStatus } = useAccount()
  const chainId = useChainId()
  const config = useConfig()
  const { data: balanceData } = useBalance({
    address,
    chainId,
    query: { enabled: Boolean(address) }
  })

  const {
    connectors,
    connectAsync,
    status: connectStatus,
    error: connectError
  } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { switchChainAsync, status: switchStatus, error: switchError } = useSwitchChain()

  const [modalView, setModalView] = useState<ModalView>(null)
  const [walletSearch, setWalletSearch] = useState('')
  const [networkSearch, setNetworkSearch] = useState('')
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const currentChain = useMemo(() => config.chains.find(chain => chain.id === chainId), [config.chains, chainId])

  const filteredConnectors = useMemo(() => {
    const keyword = walletSearch.trim().toLowerCase()
    if (!keyword) return connectors
    return connectors.filter(connector =>
      connector.name.toLowerCase().includes(keyword) || connector.id.toLowerCase().includes(keyword)
    )
  }, [connectors, walletSearch])

  const filteredChains = useMemo(() => {
    const keyword = networkSearch.trim().toLowerCase()
    if (!keyword) return config.chains
    return config.chains.filter(chain => chain.name.toLowerCase().includes(keyword))
  }, [config.chains, networkSearch])

  const isConnected = accountStatus === 'connected' && Boolean(address)
  const isConnecting = connectStatus === 'pending' || Boolean(pendingConnectorId)
  const isSwitching = switchStatus === 'pending'

  const openModal = (view: Exclude<ModalView, null>) => {
    setBanner(null)
    setModalView(view)
  }

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
      setBanner(null)
      setPendingConnectorId(connector.id)
      await connectAsync({ connector })
      closeModal()
    } catch (error: any) {
      setBanner(error?.shortMessage ?? error?.message ?? 'Failed to connect wallet')
    } finally {
      setPendingConnectorId(null)
    }
  }

  const handleDisconnect = async () => {
    if (!address) return
    const confirmed = window.confirm(`Are you sure you want to disconnect ${formatAddress(address)}?`)
    if (!confirmed) return
    await disconnectAsync()
    closeModal()
  }

  const handleSwitchChain = async (targetChainId: number) => {
    if (!switchChainAsync) return
    if (targetChainId === chainId) {
      setModalView('account')
      return
    }

    try {
      setBanner(null)
      await switchChainAsync({ chainId: targetChainId })
      setModalView('account')
    } catch (error: any) {
      setBanner(error?.shortMessage ?? error?.message ?? 'Failed to switch chain')
    }
  }

  return {
    address,
    balanceData,
    chainId,
    currentChain,
    connectors,
    filteredConnectors,
    filteredChains,
    isConnected,
    isConnecting,
    isSwitching,
    connectError,
    switchError,
    modalView,
    walletSearch,
    networkSearch,
    banner,
    pendingConnectorId,
    openModal,
    closeModal,
    setWalletSearch,
    setNetworkSearch,
    handleConnect,
    handleDisconnect,
    handleSwitchChain
  }
}
