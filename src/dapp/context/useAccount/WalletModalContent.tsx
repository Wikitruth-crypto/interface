'use client'

import { Alert, Button, Divider, List, Space, Tag, Typography } from 'antd'
import { CheckCircleFilled, DisconnectOutlined } from '@ant-design/icons'
import type { Connector } from 'wagmi'
import { getConnectorKey } from './useWalletModal'

interface WalletModalContentProps {
  isConnected: boolean
  displayAddress: string
  address?: string
  activeConnectorName?: string
  activeConnectorId?: string
  activeChainName?: string
  connectors: readonly Connector[]
  connectorAvailability: Record<string, boolean>
  isConnecting: boolean
  pendingConnectorId: string | null
  onConnect: (connector: Connector) => void | Promise<void>
  connectErrorMessage: string
  switchErrorMessage: string
  onDisconnect: () => void | Promise<void>
  disconnectStatus: string
  chains: ReadonlyArray<{ id: number; name: string }>
  currentChainId?: number
  onSwitchChain: (chainId: number) => void | Promise<void>
  isSwitching: boolean
  pendingSwitchId: number | null
  walletConnectProjectIdMissing: boolean
}

export const WalletModalContent = ({
  isConnected,
  displayAddress,
  address,
  activeConnectorName,
  activeConnectorId,
  activeChainName,
  connectors,
  connectorAvailability,
  isConnecting,
  pendingConnectorId,
  onConnect,
  connectErrorMessage,
  switchErrorMessage,
  onDisconnect,
  disconnectStatus,
  chains,
  currentChainId,
  onSwitchChain,
  isSwitching,
  pendingSwitchId,
  walletConnectProjectIdMissing,
}: WalletModalContentProps) => {
  const connectorItems = Array.from(connectors)
  const chainItems = Array.from(chains ?? [])

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {isConnected && address ? (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text type="secondary">Current Account</Typography.Text>
          <Typography.Text copyable={{ text: address }} strong>
            {displayAddress}
          </Typography.Text>
          {activeConnectorName ? <Tag color="blue">Via {activeConnectorName}</Tag> : null}
          {activeChainName ? (
            <Tag color="green" icon={<CheckCircleFilled />}>
              {activeChainName}
            </Tag>
          ) : null}
          <Button
            danger
            ghost
            block
            icon={<DisconnectOutlined />}
            loading={disconnectStatus === 'pending'}
            onClick={() => {
              void onDisconnect()
            }}
          >
            Disconnect
          </Button>
        </Space>
      ) : (
        <Typography.Text type="secondary">Choose a wallet to connect</Typography.Text>
      )}

      {connectErrorMessage ? <Alert type="error" showIcon message={connectErrorMessage} /> : null}
      {switchErrorMessage ? <Alert type="error" showIcon message={switchErrorMessage} /> : null}

      <List
        dataSource={connectorItems}
        rowKey={(connector) => getConnectorKey(connector)}
        renderItem={(connector) => {
          const key = getConnectorKey(connector)
          const isAvailable = connectorAvailability[key] ?? true
          const isActiveConnector = isConnected && connector.id === activeConnectorId
          const isPending = pendingConnectorId === key && isConnecting
          const disableButton = !isAvailable || isActiveConnector || (isConnecting && !isPending)

          return (
            <List.Item>
              <Button
                block
                type={isActiveConnector ? 'primary' : 'default'}
                disabled={disableButton}
                loading={isPending}
                onClick={() => {
                  void onConnect(connector)
                }}
              >
                {connector.name}
                {!isAvailable ? ' (unavailable)' : ''}
              </Button>
            </List.Item>
          )
        }}
        locale={{ emptyText: 'No available wallets' }}
      />

      {chainItems.length > 1 ? (
        <>
          <Divider style={{ margin: '8px 0' }} />
          <Typography.Text type="secondary">Switch Network</Typography.Text>
          <Space wrap>
            {chainItems.map((chain) => {
              const isActive = chain.id === currentChainId
              const isPending = pendingSwitchId === chain.id && isSwitching
              return (
                <Button
                  key={chain.id}
                  size="small"
                  type={isActive ? 'primary' : 'default'}
                  onClick={() => {
                    void onSwitchChain(chain.id)
                  }}
                  disabled={isActive || (isSwitching && !isPending)}
                  loading={isPending}
                >
                  {chain.name}
                </Button>
              )
            })}
          </Space>
        </>
      ) : null}

      {walletConnectProjectIdMissing ? (
        <Alert
          type="info"
          showIcon
          message="WalletConnect projectId is not configured. WalletConnect option is hidden."
        />
      ) : null}
    </Space>
  )
}
