import { describe, expect, it } from 'vitest'
import { RuntimeEvent } from '../../../../oasis-nexus/api'
import { decodeRuntimeEvents } from '../../events'
import { WIKI_TRUTH_EVENT_SIGNATURES } from '../../../../../contractsConfig/eventSignatures/wikiTruthEvents'

const CONTRACT_ADDRESS = '0xdeadbeef00000000000000000000000000c0ffee' as const
const FROM_ADDRESS = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as const
const TO_ADDRESS = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as const

const encodeAddressTopic = (address: string): `0x${string}` =>
  (`0x000000000000000000000000${address.slice(2).toLowerCase()}`) as `0x${string}`

describe('decodeRuntimeEvents', () => {
  it('decodes ERC20 Transfer logs emitted by the configured contract', () => {
    const events: RuntimeEvent[] = [
      {
        round: 1,
        timestamp: '2024-01-01T00:00:00Z',
        network: 'testnet',
        layer: 'sapphire',
        type: 'evm.log',
        body: {
          address: CONTRACT_ADDRESS,
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            encodeAddressTopic(FROM_ADDRESS),
            encodeAddressTopic(TO_ADDRESS),
            '0x00000000000000000000000000000000000000000000000000000000000003e8', // tokenId
          ],
          data: '0x',
        },
        tx_hash: '0x1234',
      },
    ]

    const decoded = decodeRuntimeEvents(events, {
      contractAddress: CONTRACT_ADDRESS,
      eventSignatures: WIKI_TRUTH_EVENT_SIGNATURES,
    })

    expect(decoded).toHaveLength(1)
    expect(decoded[0].eventName).toBe('Transfer')
    const args = decoded[0].args as Record<string, unknown>
    expect((args.from as string).toLowerCase()).toBe(FROM_ADDRESS.toLowerCase())
    expect((args.to as string).toLowerCase()).toBe(TO_ADDRESS.toLowerCase())
    expect(args.tokenId).toBe(BigInt(1000))
  })

  it('ignores events from other contracts', () => {
    const events: RuntimeEvent[] = [
      {
        round: 1,
        timestamp: '2024-01-01T00:00:00Z',
        network: 'testnet',
        layer: 'sapphire',
        type: 'evm.log',
        body: {
          address: '0x1111111111111111111111111111111111111111',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            encodeAddressTopic(FROM_ADDRESS),
            encodeAddressTopic(TO_ADDRESS),
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
          ],
          data: '0x',
        },
        tx_hash: '0x5678',
      },
    ]

    const decoded = decodeRuntimeEvents(events, {
      contractAddress: CONTRACT_ADDRESS,
      eventSignatures: WIKI_TRUTH_EVENT_SIGNATURES,
    })

    expect(decoded).toHaveLength(0)
  })
})
