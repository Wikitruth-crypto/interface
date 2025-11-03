"use client";

import { ContractFunctionParams } from './provider';

export function useProviderERC20(contract: (params: ContractFunctionParams) => Promise<any>) {
    // 代币授权相关
    const allowance = async (owner: string, spender: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "allowance",
                methodType: "read_ERC20",
                args: [owner, spender],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("allowance error:", error);
            return 0;
        }
    };

    const balanceOf = async (account: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "balanceOf",
                methodType: "read_ERC20",
                args: [account],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("balanceOf error:", error);
            return 0;
        }
    };

    // 代币基本信息
    const decimals = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "decimals",
                methodType: "read_ERC20",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("decimals error:", error);
            return 0;
        }
    };

    const name = async (): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "name",
                methodType: "read_ERC20",
            });
            return tx || '';
        } catch (error) {
            console.error("name error:", error);
            return '';
        }
    };

    const symbol = async (): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "symbol",
                methodType: "read_ERC20",
            });
            return tx || '';
        } catch (error) {
            console.error("symbol error:", error);
            return '';
        }
    };

    const totalSupply = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "totalSupply",
                methodType: "read_ERC20",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("totalSupply error:", error);
            return 0;
        }
    };

    // 铸造相关, 这个函数只有特殊的合约才有，所以需要进行判断
    const mintDate = async (address: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "mintDate",
                methodType: "read_ERC20",
                args: [address],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("mintDate error:", error);
            return 0;
        }
    };
    // 这个两个函数可以作为常量定义，不需要进行查询
    // const mintPeriod = async (): Promise<number> => {
    //     try {
    //         const tx = await contract({
    //             functionName: "mintPeriod",
    //             methodType: "read_ERC20",
    //         });
    //         return tx ? parseInt(tx.toString()) : 0;
    //     } catch (error) {
    //         console.error("mintPeriod error:", error);
    //         return 0;
    //     }
    // };

    // const mintAmount = async (): Promise<number> => {
    //     try {
    //         const tx = await contract({
    //             functionName: "mintAmount",
    //             methodType: "read_ERC20",
    //         });
    //         return tx ? parseInt(tx.toString()) : 0;
    //     } catch (error) {
    //         console.error("mintAmount error:", error);
    //         return 0;
    //     }
    // };

    return {
        // 代币授权相关
        allowance,
        balanceOf,
        // 代币基本信息
        decimals,
        name,
        symbol,
        totalSupply,
        // 铸造相关
        mintDate,
        // mintPeriod,
        // mintAmount,
    };
}
