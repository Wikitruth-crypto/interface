import { useChainId } from "wagmi";
import { ContractName, TokenMetadata } from "./types";
import { useEffect } from "react";
import { getChainConfig, sapphireTestnet } from "./chains";

import { 
    getSupportedTokens_WithChainId, 
    getOfficialTokenConfig_WithChainId 
} from "./tokens";
import { getProtocolConstants, ProtocolConstantsType, SAPPHIRE_TESTNET_CONSTANTS } from "./ProtocolConstants";
import { ABIS } from "./chain-23295/abis";

export let CHAIN_ID = 23295;
export let CHAIN_CONFIG = sapphireTestnet;
export let SUPPORTED_TOKENS: TokenMetadata[] = [];
export let OFFICIAL_TOKEN_CONFIG: TokenMetadata = {
    index: 0,
    name: 'WikiTruth Coin',
    symbol: 'WTRC',
    precision: 3,
    decimals: 18,
    address: '0x990DE401CD0103a0107D27F82283db60F4844203',
    mappingAddress: '0x449e2CD61F0328Ae68f4A530170C892B45b4B269',
    types: 'ERC20',
    contractName: ContractName.OFFICIAL_TOKEN,
    abi: ABIS[ContractName.OFFICIAL_TOKEN],
}

export let PROTOCOL_CONSTANTS: ProtocolConstantsType = SAPPHIRE_TESTNET_CONSTANTS;

/**
 * 监听当前链的变化, 
 * 被顶层组件调用, 用于获取当前链配置
 */
export function useSetCurrentChainConfig() {
    const chainId = useChainId();
    useEffect(() => {
        if (chainId) {
            console.log('chainId:', chainId);
            const chainConfig = getChainConfig(chainId);
            if (chainConfig) {
                // if(import.meta.env.DEV) {
                //   console.log('currentChainConfig:', chainConfig);
                // }
                CHAIN_CONFIG = chainConfig;
            }
            CHAIN_ID = chainId;
            SUPPORTED_TOKENS = getSupportedTokens_WithChainId(chainId);
            OFFICIAL_TOKEN_CONFIG = getOfficialTokenConfig_WithChainId(chainId);
            PROTOCOL_CONSTANTS = getProtocolConstants(chainId);
        }

    }, [chainId]);

}

