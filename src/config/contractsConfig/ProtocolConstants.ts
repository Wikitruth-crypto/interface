import {
    useChainId,
} from "wagmi";
import { SupportedChainId } from "./types";


/**
 * Protocol configuration interface
 * Define various time parameters and rate parameters for the protocol
 */
export interface ProtocolConstantsType {
    initialPrivacyPeriod: number; // The initial privacy period for minting (seconds)
    saleValidityPeriod: number; // The validity period for sale (seconds)
    initialAuctionPeriod: number; // The initial auction period after setting the auction (seconds)
    bidExtensionPeriod: number; // The time added for each bid (seconds)
    postCompletionPrivacyPeriod: number; // The privacy period added after completion of the transaction (seconds)

    refundRequestPeriod: number; // The buyer's application for refund period (seconds)
    refundReviewPeriod: number; // The DAO review period for refund (seconds)
    
    deadlineExtensionWindow: number; // The time window for extending the deadline within the deadline (seconds)
    minterPrivacyExtension: number; // The maximum privacy period that the minter can extend for each unsold box (seconds)
    confidentialityFeeExtensionPeriod: number; // The privacy period that the buyer can extend by paying the confidentiality fee after the transaction (seconds)

    bidIncrementRate: number; // The bid increment rate (%)
    incrementRate: number; // The increase rate of the confidentiality fee for each time the buyer pays the confidentiality fee (%)
    serviceFeeRate: number; // The transaction fee rate (%)
    helperRewardRate: number; // The reward rate for other operators (%)
}

/**
 * Testnet protocol configuration
 */
export const SAPPHIRE_TESTNET: ProtocolConstantsType = {
    initialPrivacyPeriod: 15 * 24 * 3600,  
    saleValidityPeriod: 15 * 24 * 3600, 
    initialAuctionPeriod: 5 * 24 * 3600, 
    bidExtensionPeriod: 5 * 24 * 3600,
    postCompletionPrivacyPeriod: 5 * 24 * 3600, 

    refundRequestPeriod: 7 * 24 * 3600, 
    refundReviewPeriod: 7 * 24 * 3600,

    deadlineExtensionWindow: 3 * 24 * 3600,
    minterPrivacyExtension: 15 * 24 * 3600, 
    confidentialityFeeExtensionPeriod: 15 * 24 * 3600, 

    bidIncrementRate: 110, 
    incrementRate: 200, 
    serviceFeeRate: 3, 
    helperRewardRate: 1, 
};

/**
 * Mainnet protocol configuration
 */
export const SAPPHIRE_MAINNET: ProtocolConstantsType = {
    initialPrivacyPeriod: 365 * 24 * 3600,
    saleValidityPeriod: 365 * 24 * 3600,
    initialAuctionPeriod: 30 * 24 * 3600,
    bidExtensionPeriod: 30 * 24 * 3600,
    postCompletionPrivacyPeriod: 30 * 24 * 3600,

    refundRequestPeriod: 7 * 24 * 3600,
    refundReviewPeriod: 15 * 24 * 3600,

    deadlineExtensionWindow: 30 * 24 * 3600,
    minterPrivacyExtension: 365 * 24 * 3600,
    confidentialityFeeExtensionPeriod: 365 * 24 * 3600,

    bidIncrementRate: 110,
    incrementRate: 200,
    serviceFeeRate: 3,
    helperRewardRate: 1, 
};

export function getProtocolConstants(chainId?: number): ProtocolConstantsType {
    if (chainId === SupportedChainId.SAPPHIRE_TESTNET) return SAPPHIRE_TESTNET;
    if (chainId === SupportedChainId.SAPPHIRE_MAINNET) return SAPPHIRE_MAINNET;
    return SAPPHIRE_TESTNET;
}

// React Hook, automatically return the constants for the current network based on the wallet context
export function useProtocolConstants(): ProtocolConstantsType {
    const chainId = useChainId();
    return getProtocolConstants(chainId);
}


