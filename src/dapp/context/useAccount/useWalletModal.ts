'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  useChainId,
  useChains,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import type { Connector } from 'wagmi'

type ConnectorAvailability = Record<string, boolean>

const formatAddress = (value?: string) => {
  if (!value) return ''
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

const extractErrorMessage = (error: unknown) => {
  if (!error) return ''
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (
    typeof error === 'object' &&
    error !== null &&
    'shortMessage' in (error as { shortMessage?: unknown }) &&
    typeof (error as { shortMessage?: unknown }).shortMessage === 'string'
  ) {
    return (error as { shortMessage: string }).shortMessage
  }
  return 'Unknown error'
}

export const getConnectorKey = (connector: Connector) => connector.uid ?? connector.id

export const useWalletModal = () => {
  const { address, status, isConnected, connector: activeConnector } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  const { connectAsync, connectors, status: connectStatus, error: connectError, reset } = useConnect()
  const { disconnectAsync, status: disconnectStatus } = useDisconnect()
  const { switchChainAsync, status: switchStatus, error: switchError } = useSwitchChain()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)
  const [pendingSwitchId, setPendingSwitchId] = useState<number | null>(null)
  const [availability, setAvailability] = useState<ConnectorAvailability>({})

  const walletConnectProjectIdMissing = !import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

  const connectorsList = useMemo(() => Array.from(connectors ?? []), [connectors])

  useEffect(() => {
    let cancelled = false
    const detectAvailability = async () => {
      const entries = await Promise.all(
        connectorsList.map(async (connector) => {
          if (connector.type === 'injected') {
            try {
              const provider = await connector.getProvider()
              return [getConnectorKey(connector), Boolean(provider)] as const
            } catch {
              return [getConnectorKey(connector), false] as const
            }
          }
          return [getConnectorKey(connector), true] as const
        }),
      )
      if (cancelled) return
      setAvailability((prev) => {
        const next = Object.fromEntries(entries) as ConnectorAvailability
        const keys = Object.keys(next)
        if (keys.length === Object.keys(prev).length && keys.every((key) => prev[key] === next[key])) {
          return prev
        }
        return next
      })
    }

    detectAvailability()
    return () => {
      cancelled = true
    }
  }, [connectorsList])

  const activeChain = useMemo(() => chains.find((item) => item.id === chainId), [chains, chainId])
  const displayAddress = useMemo(() => formatAddress(address), [address])
  const chainsList = useMemo(
    () => chains.map(({ id, name }) => ({ id, name })),
    [chains],
  )

  const connectErrorMessage = useMemo(() => extractErrorMessage(connectError), [connectError])
  const switchErrorMessage = useMemo(() => extractErrorMessage(switchError), [switchError])

  const isConnecting = connectStatus === 'pending' && pendingConnectorId !== null
  const isSwitching = switchStatus === 'pending' && pendingSwitchId !== null

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setPendingConnectorId(null)
    setPendingSwitchId(null)
    reset()
  }, [reset])

  const handleConnect = useCallback(
    async (connector: Connector) => {
      if (isConnected && connector.id === activeConnector?.id) {
        return
      }
      try {
        setPendingConnectorId(getConnectorKey(connector))
        await connectAsync({ connector })
        setIsModalOpen(false)
      } catch (error) {
        console.error('connect wallet failed', error)
      } finally {
        setPendingConnectorId(null)
      }
    },
    [activeConnector?.id, connectAsync, isConnected],
  )

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectAsync()
      setIsModalOpen(false)
      setPendingConnectorId(null)
      setPendingSwitchId(null)
      reset()
    } catch (error) {
      console.error('disconnect wallet failed', error)
    }
  }, [disconnectAsync, reset])

  const handleSwitchChain = useCallback(
    async (targetChainId: number) => {
      if (targetChainId === chainId) return
      try {
        setPendingSwitchId(targetChainId)
        await switchChainAsync({ chainId: targetChainId })
      } catch (error) {
        console.error('switch chain failed', error)
      } finally {
        setPendingSwitchId(null)
      }
    },
    [chainId, switchChainAsync],
  )

  return {
    address,
    displayAddress,
    isConnected,
    status,
    isModalOpen,
    openModal,
    closeModal,
    connectors: connectorsList,
    connectorAvailability: availability,
    connectErrorMessage,
    switchErrorMessage,
    isConnecting,
    pendingConnectorId,
    handleConnect,
    handleDisconnect,
    disconnectStatus,
    chains,
    chainsList,
    chainId,
    activeConnector,
    activeChain,
    handleSwitchChain,
    isSwitching,
    pendingSwitchId,
    walletConnectProjectIdMissing,
  }
}

export type WalletModalState = ReturnType<typeof useWalletModal>
