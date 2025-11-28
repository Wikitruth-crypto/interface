import clsx from 'clsx'
import type { ReactNode } from 'react'
import type { Chain } from 'viem'
import type { Connector } from 'wagmi'
import { formatAddress, formatBalance } from './controller'
import { XIcon } from 'lucide-react'

interface ModalShellProps {
  title: string
  subtitle?: string
  banner?: string | null
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

const ModalShell = ({ title, subtitle, banner, onClose, footer, children }: ModalShellProps) => (
  <div className="wt-modal" aria-modal="true" role="dialog">
    <div className="wt-modal__overlay" onClick={onClose} />
    <div className="wt-modal__dialog">
      <header className="wt-modal__header">
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          {subtitle && <small style={{ color: '#8a8a8a' }}>{subtitle}</small>}
        </div>
        <button className="wt-link" onClick={onClose} aria-label="Close modal">
          <XIcon className="wt-modal__close-icon" />
        </button>
      </header>
      <section className="wt-modal__body">
        {banner && <div className="wt-banner">{banner}</div>}
        {children}
      </section>
      <footer className="wt-modal__footer">
        {footer ?? <small style={{ color: '#7a7a7a' }}>WikiTruth Connect ... Powered by wagmi v2</small>}
      </footer>
    </div>
  </div>
)

interface ConnectModalProps {
  filteredConnectors: readonly Connector[]
  isConnecting: boolean
  pendingConnectorId: string | null
  search: string
  onSearchChange: (value: string) => void
  onSelectConnector: (id: string) => void
  banner?: string | null
  connectError?: Error | null
  onClose: () => void
}

export const ConnectModal = ({
  filteredConnectors,
  isConnecting,
  pendingConnectorId,
  search,
  onSearchChange,
  onSelectConnector,
  banner,
  connectError,
  onClose
}: ConnectModalProps) => (
  <ModalShell
    title="Connect Wallet"
    subtitle="Support Sapphire Wallet"
    banner={banner ?? connectError?.message}
    onClose={onClose}
  >
    <div className="wt-search">
      <input
        placeholder="Search wallet (500+)"
        value={search}
        onChange={event => onSearchChange(event.target.value)}
      />
    </div>
    <div className="wt-wallet-list">
      {filteredConnectors.map(connector => (
        <button
          key={connector.id}
          className="wt-wallet-item"
          onClick={() => onSelectConnector(connector.id)}
          disabled={isConnecting && pendingConnectorId !== connector.id}
        >
          <div className="wt-wallet-item__info">
            <div className="wt-wallet-item__icon">{connector.name.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{connector.name}</div>
              <small style={{ color: '#9b9b9b' }}>{connector.id}</small>
            </div>
          </div>
          <div className="wt-wallet-item__tags">
            {!connector.ready && <span className="wt-status-badge wt-status-badge--warning">INSTALL</span>}
            {connector.id.toLowerCase().includes('walletconnect') && (
              <span className="wt-status-badge wt-status-badge--info">QR CODE</span>
            )}
            {connector.ready && connector.id === 'injected-sapphire' ? (
              <span className="wt-status-badge wt-status-badge--success">READY</span>
            ): null}
            {isConnecting && pendingConnectorId === connector.id && (
              <span className="wt-status-badge wt-status-badge--info">...</span>
            )}
          </div>
        </button>
      ))}
    </div>
    <p style={{ marginTop: 12, fontSize: 12, color: '#7a7a7a' }}>
      Not supported / Please install the wallet and login to the wallet
    </p>
  </ModalShell>
)

interface AccountModalProps {
  address?: string
  chain?: Chain
  balanceFormatted?: string
  balanceSymbol?: string
  onSwitchNetwork: () => void
  onDisconnect: () => void
  onClose: () => void
  banner?: string | null
}

export const AccountModal = ({
  address,
  chain,
  balanceFormatted,
  balanceSymbol,
  onSwitchNetwork,
  onDisconnect,
  onClose,
  banner
}: AccountModalProps) => (
  <ModalShell title="Account" onClose={onClose} banner={banner}>
    <div className="wt-account-summary">
      <div className="wt-avatar" aria-hidden>
        {(chain?.name ?? 'W').charAt(0)}
      </div>
      <div style={{ marginTop: 8, fontWeight: 600 }}>{formatAddress(address)}</div>
      <div style={{ fontSize: 13, color: '#9b9b9b' }}>{chain?.name ?? 'Unknown'}</div>
      <div className="wt-account-summary__balance">
        {formatBalance(balanceFormatted, balanceSymbol)}
      </div>
      {chain?.blockExplorers?.default.url && (
        <a className="wt-link" href={chain.blockExplorers.default.url} target="_blank" rel="noreferrer">
          View on explorer
        </a>
      )}
    </div>
    <div className="wt-action-list">
      <button className="wt-action-item" onClick={onSwitchNetwork}>
        <div className="wt-action-item__info">
          <div className="wt-wallet-item__icon">?</div>
          <div>
            <div style={{ fontWeight: 600 }}>Switch Network</div>
            <small style={{ color: '#9b9b9b' }}>{chain?.name ?? 'Unknown'}</small>
          </div>
        </div>
        <span>?</span>
      </button>
      {/*  这里暂时不需要支持fund和send功能
      <button className="wt-action-item" onClick={() => alert('Cannot fund wallet')}>
        <div className="wt-action-item__info">
          <div className="wt-wallet-item__icon">$</div>
          <div>
            <div style={{ fontWeight: 600 }}>Fund wallet</div>
            <small style={{ color: '#9b9b9b' }}>Fund wallet</small>
          </div>
        </div>
        <span>?</span>
      </button> 
      <button className="wt-action-item" onClick={() => alert('Cannot send to address')}>
        <div className="wt-action-item__info">
          <div className="wt-wallet-item__icon">💰</div>
          <div>
            <div style={{ fontWeight: 600 }}>Send</div>
            <small style={{ color: '#9b9b9b' }}>Send to address</small>
          </div>
        </div>
        <span>?</span>
      </button>
      */}
      <button className={clsx('wt-action-item', 'wt-action-item--danger')} onClick={onDisconnect}>
        <div className="wt-action-item__info">
          <div className="wt-wallet-item__icon">?</div>
          <div>
            <div style={{ fontWeight: 600 }}>Disconnect</div>
            <small style={{ color: '#9b9b9b' }}>Disconnect wallet</small>
          </div>
        </div>
        <span>?</span>
      </button>
    </div>
  </ModalShell>
)

interface NetworkModalProps {
  chains: ReadonlyArray<Chain>
  currentChainId?: number
  search: string
  onSearchChange: (value: string) => void
  onSelectChain: (id: number) => void
  isSwitching: boolean
  banner?: string | null
  onClose: () => void
}

export const NetworkModal = ({
  chains,
  currentChainId,
  search,
  onSearchChange,
  onSelectChain,
  isSwitching,
  banner,
  onClose
}: NetworkModalProps) => (
  <ModalShell title="Choose Network" onClose={onClose} banner={banner}>
    <div className="wt-search">
      <input placeholder="Search network" value={search} onChange={event => onSearchChange(event.target.value)} />
    </div>
    <div className="wt-network-list">
      {chains.map(chain => (
        <button
          key={chain.id}
          className="wt-network-item"
          onClick={() => onSelectChain(chain.id)}
          disabled={isSwitching}
        >
          <div className="wt-network-item__info">
            <div className="wt-network-item__icon">{chain.name.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{chain.name}</div>
              <small style={{ color: '#9b9b9b' }}>{chain.nativeCurrency?.symbol ?? ''}</small>
            </div>
          </div>
          {chain.id === currentChainId && <span className="wt-status-badge wt-status-badge--success">Connected</span>}
        </button>
      ))}
    </div>
    <p style={{ marginTop: 12, fontSize: 12, color: '#7a7a7a' }}>
      Wallet may not support all networks, please confirm in the wallet
    </p>
  </ModalShell>
)
