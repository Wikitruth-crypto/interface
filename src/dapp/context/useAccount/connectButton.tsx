'use client'

import { Button, Modal } from 'antd'
import { WalletOutlined } from '@ant-design/icons'
import { WalletModalContent } from './WalletModalContent'
import { useWalletModal } from './useWalletModal'

export const ConnectButtonComponent = () => {
  const {
    address,
    displayAddress,
    isConnected,
    status,
    isModalOpen,
    openModal,
    closeModal,
    connectors,
    connectorAvailability,
    connectErrorMessage,
    switchErrorMessage,
    isConnecting,
    pendingConnectorId,
    handleConnect,
    handleDisconnect,
    disconnectStatus,
    chainsList,
    chainId,
    activeConnector,
    activeChain,
    handleSwitchChain,
    isSwitching,
    pendingSwitchId,
    walletConnectProjectIdMissing,
  } = useWalletModal()

  const buttonLabel = isConnected && displayAddress ? displayAddress : 'Connect Wallet'

  return (
    <>
      <Button
        type="primary"
        icon={<WalletOutlined />}
        loading={status === 'connecting'}
        onClick={openModal}
      >
        {buttonLabel}
      </Button>

      <Modal 
      title="Connect Wallet" 
      open={isModalOpen} 
      footer={null} 
      destroyOnHidden = {true}
      onCancel={closeModal}
      >
        <WalletModalContent
          isConnected={isConnected}
          displayAddress={displayAddress}
          address={address}
          activeConnectorName={activeConnector?.name}
          activeConnectorId={activeConnector?.id}
          activeChainName={activeChain?.name}
          connectors={connectors}
          connectorAvailability={connectorAvailability}
          isConnecting={isConnecting}
          pendingConnectorId={pendingConnectorId}
          onConnect={handleConnect}
          connectErrorMessage={connectErrorMessage}
          switchErrorMessage={switchErrorMessage}
          onDisconnect={handleDisconnect}
          disconnectStatus={disconnectStatus}
          chains={chainsList}
          currentChainId={chainId}
          onSwitchChain={handleSwitchChain}
          isSwitching={isSwitching}
          pendingSwitchId={pendingSwitchId}
          walletConnectProjectIdMissing={walletConnectProjectIdMissing}
        />
      </Modal>
    </>
  )
}




