import { Abi, AbiEvent, Address, decodeEventLog, parseAbi } from 'viem'
import { RuntimeEvent } from '../../../oasis-nexus/api'
import { base64ToHex } from '../../utils/helpers'

export interface RuntimeEventFormatterConfig {
  /**
   * Target contract address (checksum or lower-case) whose events we care about.
   */
  contractAddress: Address
  /**
   * Full ABI definition. Provide either this or `eventSignatures`.
   */
  abi?: Abi | readonly AbiEvent[]
  /**
   * Convenience option: list of human readable event declarations used to build the ABI on the fly.
   */
  eventSignatures?: readonly string[]
  /**
   * Optional white-list of event names to decode (defaults to every event in the ABI).
   */
  allowEvents?: readonly string[]
  /**
   * By default unknown events are silently skipped. Enable to bubble decoding errors to caller.
   */
  strict?: boolean
}

export interface DecodedRuntimeEvent<TArgs = Record<string, unknown>> {
  eventName: string
  args: TArgs
  /**
   * Original event log coming from Nexus, useful for tracing.
   */
  raw: RuntimeEvent
}

const normalizeHexString = (value: string | undefined): `0x${string}` | undefined => {
  if (value === undefined || value === null) return undefined
  if (value === '') {
    return '0x'
  }
  if (value.startsWith('0x')) {
    return value as `0x${string}`
  }
  try {
    return base64ToHex(value) as `0x${string}`
  } catch (error) {
    console.debug('Failed to normalize value to hex', value, error)
    return undefined
  }
}

type HexTopics = [`0x${string}`, ...Array<`0x${string}`>]

const normalizeTopics = (topics: unknown): HexTopics | null => {
  if (!Array.isArray(topics) || topics.length === 0) return null
  const normalized: `0x${string}`[] = []
  for (const topic of topics) {
    if (typeof topic !== 'string') return null
    const hexTopic = normalizeHexString(topic)
    if (!hexTopic) return null
    normalized.push(hexTopic)
  }
  if (normalized.length === 0) return null
  const [signature, ...rest] = normalized
  return [signature, ...rest] as HexTopics
}

const normalizeData = (data: unknown): `0x${string}` | null => {
  if (typeof data !== 'string') return null
  return normalizeHexString(data) ?? null
}

const ensureAbi = (config: RuntimeEventFormatterConfig): Abi => {
  if (config.abi) {
    return config.abi as Abi
  }
  if (config.eventSignatures?.length) {
    return parseAbi(config.eventSignatures)
  }
  throw new Error('Either `abi` or `eventSignatures` must be provided')
}

/**
 * 解码指定合约的运行时事件，将 topics + data 还原成结构化参数。
 */
export function decodeRuntimeEvents<TArgs = Record<string, unknown>>(
  events: RuntimeEvent[] | undefined,
  config: RuntimeEventFormatterConfig,
): DecodedRuntimeEvent<TArgs>[] {
  if (!events?.length) return []

  const abi = ensureAbi(config)
  const allowed = config.allowEvents?.map(name => name.toString())
  const targetAddress = config.contractAddress.toLowerCase()

  const results: DecodedRuntimeEvent<TArgs>[] = []

  for (const event of events) {
    if (event.type !== 'evm.log') {
      continue
    }
    const rawAddress = event.body?.address ?? event.body?.eth_address ?? event.body?.contract_address
    const address = normalizeHexString(rawAddress) as Address | undefined
    if (!address || address.toLowerCase() !== targetAddress) {
      continue
    }

    const topics = normalizeTopics(event.body?.topics)
    const data = normalizeData(event.body?.data)
    if (!topics || data === null) {
      if (config.strict) {
        throw new Error(`Malformed log structure for event at round ${event.round}`)
      }
      continue
    }

    try {
      const decoded = decodeEventLog({
        abi,
        topics,
        data,
        strict: config.strict ?? false,
      })
      const decodedEventName = decoded.eventName
      if (!decodedEventName) {
        if (config.strict) {
          throw new Error(`Failed to resolve event name for log at round ${event.round}`)
        }
        continue
      }
      if (allowed && !allowed.includes(decodedEventName)) {
        continue
      }
      const args = (decoded.args ?? {}) as TArgs
      results.push({
        eventName: decodedEventName,
        args,
        raw: event,
      })
    } catch (err) {
      if (config.strict) {
        throw err
      }
      // eslint-disable-next-line no-console
      console.debug('Skipped undecodable event log', err)
    }
  }

  return results
}
