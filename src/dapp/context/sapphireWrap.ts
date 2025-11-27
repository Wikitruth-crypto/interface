import type { WalletClient } from 'viem'
import type { EIP2696_EthereumProvider } from '@oasisprotocol/sapphire-paratime'
import { SupportedChainId } from '@/dapp/contractsConfig/types'
import { wrapEthereumProvider } from '@oasisprotocol/sapphire-paratime'
import { wrapWalletClient } from '@oasisprotocol/sapphire-viem-v2'
import { sapphire, sapphireTestnet } from 'viem/chains'

const wrappedWalletClients = new WeakSet<WalletClient>()

function isEip1193Provider(provider: any): provider is EIP2696_EthereumProvider {
  return Boolean(provider && typeof provider.request === 'function')
}

function getSapphireChain(chainId?: number) {
  if (!chainId) return undefined
  switch (chainId) {
    case SupportedChainId.SAPPHIRE_MAINNET:
      return sapphire
    case SupportedChainId.SAPPHIRE_TESTNET:
      return sapphireTestnet
    default:
      return undefined
  }
}

export function isSapphireNetwork(chainId: number | undefined): boolean {
  if (!chainId) return false
  return (
    chainId === SupportedChainId.SAPPHIRE_TESTNET || chainId === SupportedChainId.SAPPHIRE_MAINNET
  )
}

export function wrapSapphireProvider(provider: any, chainId?: number): any {
  if (typeof window === 'undefined' || !provider) {
    return provider
  }

  if (chainId !== undefined && !isSapphireNetwork(chainId)) {
    return provider
  }

  try {
    if (!isEip1193Provider(provider)) {
      console.warn('Sapphire wrap skipped: provider missing request() method')
      return provider
    }
    return wrapEthereumProvider(provider)
  } catch (error) {
    console.error('Failed to wrap Sapphire provider:', error)
    return provider
  }
}

export function initializeSapphireWrap(chainId?: number): void {
  if (typeof window === 'undefined' || !window.ethereum) {
    return
  }

  if (chainId !== undefined && !isSapphireNetwork(chainId)) {
    return
  }

  try {
    if (!isEip1193Provider(window.ethereum)) {
      console.warn('Sapphire initialization skipped: window.ethereum lacks request()')
      return
    }
    window.ethereum = wrapEthereumProvider(window.ethereum)
    console.log('Sapphire provider wrapped successfully')
  } catch (error) {
    console.error('Failed to initialize Sapphire wrap:', error)
  }
}

export async function ensureSapphireWalletClient(
  client?: WalletClient | null,
  chainId?: number
): Promise<WalletClient | null> {
  if (!client) {
    return null
  }

  const resolvedChainId = client.chain?.id ?? chainId
  if (!resolvedChainId || !isSapphireNetwork(resolvedChainId)) {
    return client
  }

  if (wrappedWalletClients.has(client)) {
    return client
  }

  try {
    if (!client.chain) {
      const viemChain = getSapphireChain(resolvedChainId)
      if (viemChain) {
        ;(client as any).chain = viemChain
      } else {
        console.warn('Sapphire wallet wrap skipped: unresolved chain config', resolvedChainId)
        return client
      }
    }

    const wrapped = await wrapWalletClient(client)
    wrappedWalletClients.add(client)
    console.log('[Sapphire] Wallet client wrapped for chain', resolvedChainId)
    return wrapped
  } catch (error) {
    console.error('Failed to wrap Sapphire wallet client:', error)
    return client
  }
}
