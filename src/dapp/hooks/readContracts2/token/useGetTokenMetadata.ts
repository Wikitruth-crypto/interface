
import { useSupportedTokens } from '@dapp/contractsConfig';
import {
    TokenMetadata,
} from '@dapp/contractsConfig';

export const useGetTokenMetadata = () => {
    const supportedTokens = useSupportedTokens();

    const getTokenMetadata = async (
        tokenAddress: `0x${string}`, 
    ): Promise<TokenMetadata | undefined> => {

        try {
            // 查找代币配置，使用toLowerCase()进行大小写不敏感匹配
            const tokenMetadata = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress.toLowerCase()
            );

            // 验证代币是否支持
            if (!tokenMetadata) {
                console.error(`Token ${tokenAddress} is not supported`);
                return undefined;
            }

            return tokenMetadata;

        } catch (error) {
            console.error("Get token type error:", error);
            return undefined;
        }
    };

    return { getTokenMetadata };
};