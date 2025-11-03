import { Network } from '../../../types/network'
import { Runtime } from '../../../oasis-nexus/api'

/**
 * Nexus API base URLs per Oasis network.
 * Keep this single source of truth so both test scripts and runtime services stay in sync.
 */
export const NEXUS_BASE_URLS: Record<Network, string> = {
  mainnet: 'https://nexus.oasis.io/v1',
  testnet: 'https://testnet.nexus.oasis.io/v1',
  localnet: 'http://localhost:8008/v1',
}

export const getRuntimeApiBaseUrl = (network: Network, runtime: Runtime) =>
  `${NEXUS_BASE_URLS[network]}/${runtime}`

export const getConsensusApiBaseUrl = (network: Network) => `${NEXUS_BASE_URLS[network]}/consensus`

export const buildRuntimeEndpoint = (network: Network, runtime: Runtime, path: string) =>
  `${getRuntimeApiBaseUrl(network, runtime)}${path}`

export const buildConsensusEndpoint = (network: Network, path: string) =>
  `${getConsensusApiBaseUrl(network)}${path}`
