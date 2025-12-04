// import { useQuery } from '@tanstack/react-query';
import { 
    // CHAIN_ID,
    SUPPORTED_TOKENS,
    TokenMetadata
} from '.';
import { formatUnits } from 'viem';

/**
 * Get token price 
 * 当前测试网测试组件，不使用真实数据
 * 在开发过程中，使用固定价格
 * 传入token，和数量，返回价格
 * 
 */

const TEST_PRICE = {
    'WTRC': 4.8,
    'WROSE.S': 0.005,
    'WTRC.S': 4.8,
}


const useGetTokenPrice = () => {
    const getTokenPrice = async (tokenAddress: string, amount: string | number) => {
        // 查找token配置
        const tokenMetadata = SUPPORTED_TOKENS.find(
            (tokenMetadata: TokenMetadata) => tokenMetadata.address === tokenAddress
        );
        if (!tokenMetadata) {
            throw new Error(`Token ${tokenAddress} not found`);
        }
        // 将amount转换为小数
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

