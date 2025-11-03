import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { NEXUS_BASE_URLS } from '../app/services/nexus/endpoints'

const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`)

const resolveBaseUrl = (network: 'mainnet' | 'testnet' | 'localnet'): string => {
  const envKey =
    network === 'mainnet'
      ? import.meta.env.REACT_APP_API
      : network === 'testnet'
        ? import.meta.env.REACT_APP_TESTNET_API
        : import.meta.env.REACT_APP_LOCALNET_API

  return ensureTrailingSlash(envKey ?? NEXUS_BASE_URLS[network])
}

export const replaceNetworkWithBaseURL = <T>(
  config: AxiosRequestConfig,
  requestOverrides?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  if (!config.url) {
    throw new Error('Expected request URL to be defined')
  }

  if (config.url.startsWith('/mainnet/')) {
    config.url = config.url.replace('/mainnet/', resolveBaseUrl('mainnet'))
  } else if (config.url.startsWith('/testnet/')) {
    config.url = config.url.replace('/testnet/', resolveBaseUrl('testnet'))
  } else if (config.url.startsWith('/localnet/')) {
    config.url = config.url.replace('/localnet/', resolveBaseUrl('localnet'))
  } else {
    throw new Error(`Expected URL to be prefixed with network: ${config.url}`)
  }

  return axios({ ...config, ...requestOverrides })
}

export default replaceNetworkWithBaseURL
