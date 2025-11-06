'use client'

import { useMemo, useState } from 'react'
import { Alert, Button, Divider, List, Modal, Space, Tag, Typography } from 'antd'
import { CheckCircleFilled, DisconnectOutlined, WalletOutlined } from '@ant-design/icons'
import {
  useAccount,
  useChainId,
  useChains,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import type { Connector } from 'wagmi'

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

export const ConnectButtonComponent = () => {
  const { address, status, isConnected, connector: activeConnector } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  const { connectAsync, connectors, status: connectStatus, error: connectError, reset } = useConnect()
  const { disconnectAsync, status: disconnectStatus } = useDisconnect()
  const { switchChainAsync, status: switchStatus, error: switchError } = useSwitchChain()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)

  const activeChain = useMemo(() => chains.find((item) => item.id === chainId), [chains, chainId])
  const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

  const handleConnect = async (connector: Connector) => {
    try {
      if (!connector.ready || connector.id === activeConnector?.id) return
      setPendingConnectorId(connector.id)
      await connectAsync({ connector })
      setIsModalOpen(false)
    } catch (error) {
      console.error('connect wallet failed', error)
    } finally {
      setPendingConnectorId(null)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectAsync()
      setIsModalOpen(false)
    } catch (error) {
      console.error('disconnect wallet failed', error)
    }
  }

  const handleSwitchChain = async (targetChainId: number) => {
    if (targetChainId === chainId) return
    try {
      await switchChainAsync({ chainId: targetChainId })
    } catch (error) {
      console.error('switch chain failed', error)
    }
  }

  const connectErrorMessage = extractErrorMessage(connectError)
  const switchErrorMessage = extractErrorMessage(switchError)

  const availableConnectors = connectors ? Array.from(connectors) : []
  const isConnecting = connectStatus === 'pending' && pendingConnectorId !== null
  const isSwitching = switchStatus === 'pending'

  return (
    <>
      <Button
        type="primary"
        icon={<WalletOutlined />}
        loading={status === 'connecting'}
        onClick={() => setIsModalOpen(true)}
      >
        {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
      </Button>

      <Modal
        title="Connect Wallet"
        open={isModalOpen}
        footer={null}
        destroyOnHidden={true}
        onCancel={() => {
          setIsModalOpen(false)
          reset()
        }}
        width={600}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {isConnected && address ? (
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Typography.Text type="secondary">Current Account</Typography.Text>
              <Typography.Text copyable={{ text: address }} strong>
                {formatAddress(address)}
              </Typography.Text>
              {activeConnector ? <Tag color="blue">Via {activeConnector.name}</Tag> : null}
              {activeChain ? (
                <Tag color="green" icon={<CheckCircleFilled />}>
                  {activeChain.name}
                </Tag>
              ) : null}
              <Button
                danger
                ghost
                block
                icon={<DisconnectOutlined />}
                loading={disconnectStatus === 'pending'}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </Space>
          ) : (
            <Typography.Text type="secondary">Choose a wallet to connect</Typography.Text>
          )}

          {connectErrorMessage ? (
            <Alert type="error" showIcon message={connectErrorMessage} />
          ) : null}

          {switchErrorMessage ? (
            <Alert type="error" showIcon message={switchErrorMessage} />
          ) : null}

          <List
            dataSource={availableConnectors}
            rowKey={(connector) => connector.id}
            renderItem={(connector) => {
              const isCurrentConnector = connector.id === activeConnector?.id
              return (
                <List.Item>
                  <Button
                    block
                    type={isCurrentConnector ? 'primary' : 'default'}
                    disabled={!connector.ready || isCurrentConnector || isConnecting}
                    loading={pendingConnectorId === connector.id && isConnecting}
                    onClick={() => handleConnect(connector)}
                  >
                    {connector.name}
                    {!connector.ready ? ' (unavailable)' : ''}
                  </Button>
                </List.Item>
              )
            }}
            locale={{ emptyText: 'No available wallets' }}
          />

          {chains.length > 1 ? (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Text type="secondary">Switch Network</Typography.Text>
              <Space wrap>
                {chains.map((chain) => (
                  <Button
                    key={chain.id}
                    size="small"
                    type={chain.id === chainId ? 'primary' : 'default'}
                    onClick={() => handleSwitchChain(chain.id)}
                    loading={isSwitching && chain.id !== chainId}
                  >
                    {chain.name}
                  </Button>
                ))}
              </Space>
            </>
          ) : null}

          {!walletConnectProjectId ? (
            <Alert
              type="info"
              showIcon
              message="WalletConnect projectId is not configured. WalletConnect option is hidden."
            />
          ) : null}
        </Space>
      </Modal>
    </>
  )
}
