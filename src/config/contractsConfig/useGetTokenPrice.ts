// import { useQuery } from '@tanstack/react-query';
import { 
    // CHAIN_ID,
    SUPPORTED_TOKENS,
    TokenMetadata
} from '.';
import { formatUnits } from 'viem';

/**
 * Get token price 
 * Current testnet test component, does not use real data
 * During development, use fixed prices
 * Pass in token and quantity, return price
 */

const TEST_PRICE = {
    'WTRC': 4.8,
    'WROSE.S': 0.005,
    'WTRC.S': 4.8,
}


const useGetTokenPrice = () => {
    const getTokenPrice = async (tokenAddress: string, amount: string | number) => {
        // Find token configuration
        const tokenMetadata = SUPPORTED_TOKENS.find(
            (tokenMetadata: TokenMetadata) => tokenMetadata.address === tokenAddress
        );
        if (!tokenMetadata) {
            throw new Error(`Token ${tokenAddress} not found`);
        }
        // Convert amount to decimal
        const amount_decimal = Number(formatUnits(BigInt(amount), tokenMetadata.decimals));
        const price = TEST_PRICE[tokenMetadata.symbol as keyof typeof TEST_PRICE];
        if (import.meta.env.DEV) {
            console.log('price:', price, 'amount_decimal:', amount_decimal);
        }
        return price * amount_decimal;

    }
    return { getTokenPrice };
};

export default useGetTokenPrice;

