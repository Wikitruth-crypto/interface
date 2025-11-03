"use client";

import { ContractFunctionParams } from './provider';

export function useProviderSiweAuth(contract: (params: ContractFunctionParams) => Promise<any>) {
    
    // function getDomainCount() external view returns (uint256);
    const getDomainCount = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "getDomainCount",
                methodType: "read_siweAuth",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("getDomainCount error:", error);
            return 0;
        }
    };
    // function getDomainByIndex(uint256 index) external view returns (string memory);
    const getDomainByIndex = async (index: number): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "getDomainByIndex",
                methodType: "read_siweAuth",
                args: [index],
            });
            return tx || '';
        } catch (error) {
            console.error("getDomainByIndex error:", error);
            return '';
        }
    };
    
    
    // function login(string memory siweMsg, SignatureRSV memory sig) external view returns (bytes);
    const login = async (siweMsg: string, sig: string): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "login",
                methodType: "read_siweAuth",
                args: [siweMsg, sig],
            });
            return tx || '';
        } catch (error) {
            console.error("login error:", error);
            return '';
        }
    };

    // function getMsgSender(bytes memory token_) external view returns (address);
    const getMsgSender = async (token: string): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "getMsgSender",
                methodType: "read_siweAuth",
                args: [token],
            });
            return tx || '';
        } catch (error) {
            console.error("getMsgSender error:", error);
            return '';
        }
    };

    // function isSessionValid(bytes memory token) external view returns (bool)
    const isSessionValid = async (token: string): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "isSessionValid",
                methodType: "read_siweAuth",
                args: [token],
            });
            return tx || false;
        } catch (error) {
            console.error("isSessionValid error:", error);
            return false;
        }
    };


    // 获取声明
    // function getStatement(bytes memory token) external view returns (string memory);
    const getStatement = async (token: string): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "getStatement",
                methodType: "read_siweAuth",
                args: [token],
            });
            return tx || '';
        } catch (error) {
            console.error("getStatement error:", error);
            return '';
        }
    };

    // 获取资源
    // function getResources(bytes memory token) external view returns (string[] memory);
    const getResources = async (token: string): Promise<string[]> => {
        try {
            const tx = await contract({
                functionName: "getResources",
                methodType: "read_siweAuth",
                args: [token],
            });
            return tx || [];
        } catch (error) {
            console.error("getResources error:", error);
            return [];
        }
    };
    

    return {
        // Admin,
        // Implementation,
        getDomainCount,
        getDomainByIndex,
        isSessionValid,
        login,
        getMsgSender,
        getStatement,
        getResources,
    };
}
