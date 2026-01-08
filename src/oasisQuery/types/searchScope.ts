import { getNetworkNames, Network } from './network'
import { HasScope, Layer, Runtime } from '../oasis-nexus/api'
import { TFunction } from 'i18next'
import { specialScopeNames } from '../config'

const getLayerLabels = (t: TFunction): Record<Layer, string> => ({
  sapphire: t('common.sapphire'),
  consensus: t('common.consensus'),
})

export interface SearchScope {
  network: Network
  layer: Layer
}

// This is just like SearchScope, but we know that it's not consensus
export interface RuntimeScope {
  network: Network
  layer: Runtime
}

// This is just like SearchScope, but we know it's consensus
export interface ConsensusScope {
  network: Network
  layer: 'consensus'
}

// Removed MainnetEmerald - only Sapphire is supported now

export const getNameForScope = (t: TFunction, scope: SearchScope) =>
  specialScopeNames[scope.network]?.[scope.layer] ??
  `${getLayerLabels(t)[scope.layer]} ${getNetworkNames(t)[scope.network]}`

export const getKeyForScope: (scope: SearchScope) => string = ({ network, layer }) => `${network}.${layer}`

export const isItemInScope = (item: HasScope, scope: SearchScope): boolean =>
  item.network === scope.network && item.layer === scope.layer

export const getFilterForScope = (scope: SearchScope) => (item: HasScope) => isItemInScope(item, scope)
export const getInverseFilterForScope = (scope: SearchScope) => (item: HasScope) =>
  !isItemInScope(item, scope)
