"use client";
import { ContractFunctionParams } from './provider';

export function useProviderAddressManager(contract: (params: ContractFunctionParams) => Promise<any>) {

    // function getTokenList() external view returns (address[] memory);
    const getTokenList = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "getTokenList",
                methodType: "read_addressManager",
                args: [],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("getTokenList error:", error);
            return 0;
        }
    };

    // function getTokenByIndex(uint256 index_) external view returns (address);
    const getTokenByIndex = async (index: number): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "getTokenByIndex",
                methodType: "read_addressManager",
                args: [index],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("getTokenByIndex error:", error);
            return 0;
        }
    };


    // function officialToken() external view returns (address);
    const officialToken = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "officialToken",
                methodType: "read_addressManager",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("officialToken error:", error);
            return 0;
        }
    };
    // function isTokenSupported(address token_) external view returns (bool);
    const isTokenSupported = async (token: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "isTokenSupported",
                methodType: "read_addressManager",
                args: [token],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("isTokenSupported error:", error);
            return 0;
        }
    };
    // function isOfficialToken(address token_) external view returns (bool);
    const isOfficialToken = async (token: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "isOfficialToken",
                methodType: "read_addressManager",
                args: [token],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("isOfficialToken error:", error);
            return 0;
        }
    };


    return {
        // 基本信息
        // Admin,
        // Implementation,
        getTokenList,
        getTokenByIndex,
        officialToken,
        isTokenSupported,
        isOfficialToken,
    };
}
