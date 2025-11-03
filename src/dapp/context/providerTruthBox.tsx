"use client";

import { ContractFunctionParams } from './provider';

export function useProviderTruthBox(contract: (params: ContractFunctionParams) => Promise<any>) {

    // function getStatus(uint256 boxId_) external view returns(Status);
    const getStatus = async (id: number | string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "getStatus",
                methodType: "read_truthBox",
                args: [id],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("getStatus error:", error);
            return 0;
        }
    };

    // function getBasicData(uint256 boxId_) external view returns(Status, uint256, uint256);
    const getBasicData = async (id: number | string): Promise<[number, number, number]> => {
        try {
            const tx = await contract({
                functionName: "getBasicData",
                methodType: "read_truthBox",
                args: [id],
            });
            return tx ? [parseInt(tx[0].toString()), parseInt(tx[1].toString()), parseInt(tx[2].toString())] : [0, 0, 0];
        } catch (error) {
            console.error("getBasicData error:", error);
            return [0, 0, 0];
        }
    };

    const getDeadline = async (id: number | string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "getDeadline",
                methodType: "read_truthBox",
                args: [id],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("getDeadline error:", error);
            return 0;
        }
    };

    // function getPrivateData(uint256 boxId_, bytes memory siweToken_) external view returns (bytes memory);
    const getPrivateData = async (id: number | string, siweToken: string): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "getPrivateData",
                methodType: "read_truthBox",
                args: [id, siweToken],
            });
            return tx || '';
        } catch (error) {
            console.error("getPrivateData error:", error);
            return '';
        }
    };


    const getPrice = async (id: number | string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "getPrice",
                methodType: "read_truthBox",
                args: [id],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("getPrice error:", error);
            return 0;
        }
    };

    const blacklistSupply = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "blacklistSupply",
                methodType: "read_truthBox",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("blacklistSupply error:", error);
            return 0;
        }
    };

    const completeCounts = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "completeCounts",
                methodType: "read_truthBox",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("completeCounts error:", error);
            return 0;
        }
    };

    // 状态查询
    const isInBlacklist = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "isInBlacklist",
                methodType: "read_truthBox",
                args: [id],
            });
            return tx || false;
        } catch (error) {
            console.error("isInBlacklist error:", error);
            return false;
        }
    };



    return {
        // NFT信息
        getBasicData,
        getStatus,
        getDeadline,
        getPrice,
        // 所有权相关
        getPrivateData,
        // 统计相关
        blacklistSupply,
        completeCounts,
        // 状态查询
        isInBlacklist,
    };
}
