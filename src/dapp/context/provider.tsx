//// @ts-nocheck
"use client";
import React, {
    ReactNode,
    // useEffect, 
    // useState ,
} from "react";
// import { getApiUrl } from "./useAccount/apiUrl";
// import {
    // RainbowKitProvider,
    // getDefaultWallets,
    // midnightTheme,
    // useAddRecentTransaction,
    // useConnectModal,
// } from "@rainbow-me/rainbowkit";
import {
    // State,
    // WagmiProvider,
    useAccount,
    usePublicClient,
    // useWalletClient,
} from "wagmi";
import {
    useContractConfig,
    ContractName,
} from "@dapp/contractsConfig";
import { ContractContext } from "./contractContext";
// import {
    // formatEther,
    // createPublicClient,
    // http,
    // getContract,
    // recoverMessageAddress 
// } from "viem";
// import axios from "axios";
import { useProviderFundManager } from "./providerFundManager";
import { useProviderExchange } from "./providerExchange";
import { useProviderTruthBox } from "./providerTruthBox";
import { useProviderTruthNFT } from "./providerTruthNFT";
import { useProviderUserId } from "./providerUserId";
import { useProviderERC20 } from "./providerERC20";
import { useProviderSiweAuth } from "./providerSiweAuth";
import { useProviderAddressManager } from "./providerAddressManager";
import { useProviderERC20secret } from "./providerERC20secret";

export interface ContractFunctionParams {
    functionName: string; 
    methodType: string; 
    args?: any; 
    TokenAddress?: `0x${string}`;
    values?: bigint; 
}

// ContractProvider组件，用于与合约交互
export function ContractProvider({ children }: { children: ReactNode }) {
    const publicClient = usePublicClient(); 
    // const { data: walletClient } = useWalletClient(); 
    const { address: currentAddress } = useAccount(); 
    // const addRecentTransaction = useAddRecentTransaction(); 
    const Config_TruthBox = useContractConfig(ContractName.TRUTH_BOX);
    const Config_Exchange = useContractConfig(ContractName.EXCHANGE);
    const Config_TruthNFT = useContractConfig(ContractName.TRUTH_NFT);
    const Config_FundManager = useContractConfig(ContractName.FUND_MANAGER);
    const Config_AddressManager = useContractConfig(ContractName.ADDRESS_MANAGER);
    const Config_SiweAuth = useContractConfig(ContractName.SIWE_AUTH);
    const Config_UserId = useContractConfig(ContractName.USER_ID);
    const Config_OfficialToken = useContractConfig(ContractName.OFFICIAL_TOKEN);
    const Config_ERC20Secret = useContractConfig(ContractName.ERC20_SECRET);

    // console.log('publicClient', publicClient, 'walletClient', walletClient, 'currentAddress', currentAddress);
    
    const contractFunction = async ({
        functionName,
        methodType,
        args = [],
        TokenAddress = Config_OfficialToken.address, // 默认使用官方代币地址
        // values = BigInt(0), // 指定在调用智能合约函数时发送的以太币（或其他原生代币）数量
    }: ContractFunctionParams) => {
        let contract;
        if (methodType === "read_truthBox") {
            contract = await publicClient?.readContract({
                address: Config_TruthBox.address,
                abi: Config_TruthBox.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_exchange") {
            contract = await publicClient?.readContract({
                address: Config_Exchange.address,
                abi: Config_Exchange.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_truthNFT") {
            contract = await publicClient?.readContract({
                address: Config_TruthNFT.address,
                abi: Config_TruthNFT.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        }else if (methodType === "read_fundManager") {
            contract = await publicClient?.readContract({
                address: Config_FundManager.address,
                abi: Config_FundManager.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_addressManager") {
            contract = await publicClient?.readContract({
                address: Config_AddressManager.address,
                abi: Config_AddressManager.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_siweAuth") {
            contract = await publicClient?.readContract({
                address: Config_SiweAuth.address,
                abi: Config_SiweAuth.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_userId") {
            contract = await publicClient?.readContract({
                address: Config_UserId.address,
                abi: Config_UserId.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_ERC20") {
            contract = await publicClient?.readContract({
                address: TokenAddress, // 自定义代币地址
                abi: Config_OfficialToken.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        } else if (methodType === "read_ERC20secret") {
            contract = await publicClient?.readContract({
                address: TokenAddress, // 自定义代币地址
                abi: Config_ERC20Secret.abi,
                functionName: functionName,
                account: currentAddress,
                args: args,
            });
        }
        
        /*else if (methodType === "write_truthBox") {
            contract = await walletClient?.writeContract({
                abi: ABI_TruthBox,
                address: Proxy_TruthBox,
                functionName: functionName,
                args: args,
                account: currentAddress,
                value: values,
            });

            // 添加最近的交易
            addRecentTransaction({
                hash: contract!.toString(),
                description: `write ${functionName} to contract`,
            });
        } else if (methodType === "write_exchange") {
            contract = await walletClient?.writeContract({
                abi: ABI_Exchange,
                address: Proxy_Exchange,
                functionName: functionName,
                args: args,
                account: currentAddress,
                value: values,
            });

            // 添加最近的交易
            addRecentTransaction({
                hash: contract!.toString(),
                description: `write ${functionName} to contract`,
            });
        } else if (methodType === "write_fundManager") {
            contract = await walletClient?.writeContract({
                abi: ABI_FundManager,
                address: Proxy_FundManager,
                functionName: functionName,
                args: args,
                account: currentAddress,
                value: values,
            });

            // 添加最近的交易
            addRecentTransaction({
                hash: contract!.toString(),
                description: `write ${functionName} to contract`,
            });
        } else if (methodType === "write_confidFee") {
            contract = await walletClient?.writeContract({
                abi: ABI_ConfidentialityFee,
                address: Proxy_ConfidentialityFee,
                functionName: functionName,
                args: args,
                account: currentAddress,
                value: values,
            });

            // 添加最近的交易
            addRecentTransaction({
                hash: contract!.toString(),
                description: `write ${functionName} to contract`,
            });
        } else if (methodType === "write_officialToken") {
            contract = await walletClient?.writeContract({
                abi: ABI_officialToken,
                address: OfficialToken,
                functionName: functionName,
                args: args,
                account: currentAddress,
                value: values,
            });

            // 添加最近的交易
            addRecentTransaction({
                hash: contract!.toString(),
                description: `write ${functionName} to contract`,
            });
            
        } 
            */
        return contract; // 返回合约响应
    };

    const readTurthNFT = useProviderTruthNFT(contractFunction);
    const readFundManager = useProviderFundManager(contractFunction);
    const readExchange = useProviderExchange(contractFunction);
    const readTruthBox = useProviderTruthBox(contractFunction);
    const readAddressManager = useProviderAddressManager(contractFunction);
    const readSiweAuth = useProviderSiweAuth(contractFunction);
    const readUserId = useProviderUserId(contractFunction);
    const readERC20 = useProviderERC20(contractFunction);
    const readERC20secret = useProviderERC20secret(contractFunction);

    // 用 useMemo 包裹 context value
    const contextValue = React.useMemo(() => ({
        contract: contractFunction,
        ...readTurthNFT,
        ...readFundManager,
        ...readExchange,
        ...readTruthBox,
        ...readAddressManager,
        ...readSiweAuth,
        ...readUserId,
        ...readERC20,
        ...readERC20secret,
    }), [
        contractFunction,
        readTurthNFT,
        readFundManager,
        readExchange,
        readTruthBox,
        readAddressManager,
        readSiweAuth,
        readUserId,
        readERC20,
        readERC20secret,
    ]);

    return (
        <ContractContext.Provider
        value={contextValue}
        >
            {children}
        </ContractContext.Provider>
    );
}