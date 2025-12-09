'use client';

import './connectWallet.css';

import clsx from 'clsx';
import type { ReactNode } from 'react';
import { ModalPortal } from './ModalPortal';
import { AccountModal, ConnectModal, NetworkModal } from './modals';
import { useConnectController} from './controller';

interface ConnectButtonProps {
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'rounded';
  style?: React.CSSProperties;
  className?: string;
  prefixIcon?: ReactNode;
}

export const ConnectButtonComponent = ({
  size = 'md',
  shape = 'pill',
  style,
  className,
  prefixIcon
}: ConnectButtonProps) => {
  const {
    address,
    balanceData,
    chainId,
    currentChain,
    connectors,
    filteredConnectors,
    filteredChains,
    isConnected,
    isConnecting,
    isReconnecting,
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
  } = useConnectController();

  const formatAddress = (addr?: string | null) =>
    addr ? `${addr.slice(0, 0)}...${addr.slice(-4)}` : ''
  
  const formatString = (value?: string) => {
    if (!value) return ''
    return value.slice(0, 0) + '...' + value.slice(-7)
  }

  const networkAppearance = (() => {
    if (!currentChain) return { label: 'Unknown Network', theme: '' };
    if (currentChain.testnet) {
      return { label: 'Oasis Sapphire Testnet', theme: 'wt-connect-button--theme-testnet' };
    }
    return { label: 'Oasis Sapphire Mainnet', theme: 'wt-connect-button--theme-mainnet' };
  })();

  const buttonClass = clsx(
    'wt-connect-button',
    `wt-connect-button--${size}`,
    shape === 'rounded' && 'wt-connect-button--rounded',
    isConnected && ['wt-connect-button--connected', networkAppearance.theme],
    className
  );

  const chainIcon = prefixIcon ?? (
    <div className="wt-connect-button__icon">{(currentChain?.name ?? 'W').charAt(0)}</div>
  );

  return (
    <>
      <button
        className={buttonClass}
        onClick={() => (isConnected ? openModal('account') : openModal('connect'))}
        disabled={isConnecting}
        style={style}
      >
        {isConnected ? (
          <>
            {chainIcon}
            <div className="wt-connect-button__text">
              <span>{formatAddress(address)}</span>
              <span>{formatString(networkAppearance.label)}</span>
            </div>
          </>
        ) : isConnecting ? (
          'Connecting...'
        ) : isReconnecting ? (
          <>
            {chainIcon}
            <span>Reconnecting...</span>
          </>
        ) : (
          <>
            {chainIcon}
            <span>Connect</span>
          </>
        )}
      </button>

      {modalView === 'connect' && (
        <ModalPortal>
          <ConnectModal
            filteredConnectors={filteredConnectors}
            isConnecting={isConnecting}
            pendingConnectorId={pendingConnectorId}
            search={walletSearch}
            onSearchChange={setWalletSearch}
            onSelectConnector={handleConnect}
            banner={banner}
            connectError={connectError}
            onClose={closeModal}
          />
        </ModalPortal>
      )}

      {modalView === 'account' && (
        <ModalPortal>
          <AccountModal
            address={address}
            chain={currentChain}
            balanceFormatted={balanceData?.formatted}
            balanceSymbol={balanceData?.symbol}
            onSwitchNetwork={() => openModal('network')}
            onDisconnect={handleDisconnect}
            onClose={closeModal}
            banner={banner}
          />
        </ModalPortal>
      )}

      {modalView === 'network' && (
        <ModalPortal>
          <NetworkModal
            chains={filteredChains}
            currentChainId={chainId}
            search={networkSearch}
            onSearchChange={setNetworkSearch}
            onSelectChain={handleSwitchChain}
            isSwitching={isSwitching}
            banner={banner ?? switchError?.message}
            onClose={closeModal}
          />
        </ModalPortal>
      )}
    </>
  );
};
