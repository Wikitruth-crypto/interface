"use client";

import { ContractFunctionParams } from './provider';

export function useProviderUserId(contract: (params: ContractFunctionParams) => Promise<any>) {

    // function myUserId(bytes memory token_) external view returns (uint256);
    const myUserId = async (siweToken: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "myUserId",
                methodType: "read_userId",
                args: [siweToken],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("myUserId error:", error);
            return 0;
        }
    };
    
    // function isBlacklisted(address user_) external view returns (bool);
    const isBlacklisted = async (user: string): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "isBlacklisted",
                methodType: "read_userId",
                args: [user],
            });
            return tx || false;
        } catch (error) {
            console.error("isBlacklisted error:", error);
            return false;
        }
    };


    return {
        // Admin,
        // Implementation,
        myUserId,
        isBlacklisted,
    };
}
