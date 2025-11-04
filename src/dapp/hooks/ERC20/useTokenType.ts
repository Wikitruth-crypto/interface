
import { useSupportedTokens } from '@dapp/contractsConfig';
import {
    TokenMetadata,
} from '@dapp/contractsConfig';

export const useTokenType = () => {
    const supportedTokens = useSupportedTokens();

    const getTokenType = async (
        tokenAddress: `0x${string}`, 
    ): Promise<'ERC20' | 'Secret' | undefined> => {

        try {
            // 查找代币配置
            const tokenConfig = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress
            );

            // 验证代币是否支持
            if (!tokenConfig) {
                console.error(`Token ${tokenAddress} is not supported`);
                return undefined;
            }

            return tokenConfig.types;

        } catch (error) {
            console.error("Get token type error:", error);
            return undefined;
        }
    };

    return { getTokenType };
};