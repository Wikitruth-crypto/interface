import { keccak256 } from 'viem'
import { stringToBytes } from 'viem/utils'
import { base64ToHex } from './helpers'

/**
 * Normalizes an EVM log signature to the format expected by Nexus API (hex string without 0x prefix).
 *
 * Supports three input formats:
 * 1. Event declaration string: "event Transfer(address,address,uint256)"
 *    - Extracts event name and parameters, computes keccak256 hash
 *    - Uses the same logic as buildSignatureIndex in runtimeAccountFetcher.ts
 * 2. Hex signature (with or without 0x): "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" or "0xddf252..."
 *    - Removes 0x prefix if present
 * 3. Base64 topic0: "3fJSrRviyJtpwrBo/DeNqpUrp/FjxKEWKPVaTfUjs+8="
 *    - Converts from base64 to hex, removes 0x prefix
 *
 * @param input - The signature in any of the supported formats
 * @returns Hex string without 0x prefix, or undefined if input is invalid/empty
 *
 * @example
 * ```ts
 * normalizeEvmLogSignature("event Transfer(address,address,uint256)")
 * // => "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
 *
 * normalizeEvmLogSignature("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
 * // => "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
 *
 * normalizeEvmLogSignature("3fJSrRviyJtpwrBo/DeNqpUrp/FjxKEWKPVaTfUjs+8=")
 * // => hex string without 0x prefix
 * ```
 */
export function normalizeEvmLogSignature(input: string | undefined | null): string | undefined {
    if (!input || !input.trim()) {
        return undefined
    }

    const trimmed = input.trim()

    // Case 1: Event declaration string (e.g., "event Transfer(address,address,uint256)")
    if (trimmed.toLowerCase().startsWith('event ')) {
        try {
            // Extract event name and parameters using the same regex as buildSignatureIndex
            // This matches: "event EventName(params)"
            const match = /^event\s+(\w+)\s*\((.*)\)\s*;?\s*$/i.exec(trimmed)
            if (!match) {
                console.warn('[normalizeEvmLogSignature] Invalid event declaration format:', trimmed)
                return undefined
            }

            const [, name, params] = match
            // Use the full params string (including indexed and parameter names)
            // This matches the behavior of buildSignatureIndex in runtimeAccountFetcher.ts
            // viem's keccak256 calculation handles the canonicalization correctly
            const signature = `${name}(${params})`
            const hash = keccak256(stringToBytes(signature))
            // Remove 0x prefix for Nexus API (they expect hex without prefix)
            return hash.startsWith('0x') ? hash.slice(2) : hash
        } catch (error) {
            console.error('[normalizeEvmLogSignature] Error processing event declaration:', error, trimmed)
            return undefined
        }
    }

    // Case 2: Try base64 first (before hex, because hex strings are also valid base64-like)
    // Base64 topic0 typically has padding and specific length
    // Check if it looks like base64 (contains base64 characters and possibly padding)
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
    // Base64-encoded 32-byte hash will be 44 characters (with padding) or 43 without
    if (base64Pattern.test(trimmed) && (trimmed.length === 44 || trimmed.length === 43 || trimmed.length === 32)) {
        try {
            const hex = base64ToHex(trimmed)
            // Verify it's a valid 32-byte hex (64 hex chars = 32 bytes)
            const hexWithoutPrefix = hex.startsWith('0x') ? hex.slice(2) : hex
            if (/^[0-9a-fA-F]{64}$/i.test(hexWithoutPrefix)) {
                return hexWithoutPrefix.toLowerCase()
            }
            // If base64 decodes to invalid hex, fall through to hex handling
        } catch (error) {
            // If base64 decoding fails, fall through to hex handling
            // Silent fallthrough - hex handling will validate
        }
    }

    // Case 3: Hex signature (with or without 0x prefix)
    // Remove 0x prefix if present
    const hexWithoutPrefix = trimmed.startsWith('0x') || trimmed.startsWith('0X') ? trimmed.slice(2) : trimmed

    // Validate hex format (should be 64 characters for a keccak256 hash = 32 bytes)
    if (!/^[0-9a-fA-F]{64}$/i.test(hexWithoutPrefix)) {
        console.warn('[normalizeEvmLogSignature] Invalid signature format (not event declaration, base64, or valid hex):', trimmed)
        return undefined
    }

    return hexWithoutPrefix.toLowerCase()
}

