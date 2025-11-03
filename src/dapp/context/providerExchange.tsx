"use client";

import { ContractFunctionParams } from './provider';

export function useProviderExchange(contract: (params: ContractFunctionParams) => Promise<any>) {

    // 支付相关
    // function calcPayMoney(uint256 boxId_) external view returns (uint256);
    const calcPayMoney = async (id: number | string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "calcPayMoney",
                methodType: "read_exchange",
                args: [id],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("calcPayMoney error:", error);
            return 0;
        }
    };

    const refundPermit = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "refundPermit",
                methodType: "read_exchange",
                args: [id],
            });
            return tx || false;
        } catch (error) {
            console.error("refundPermit error:", error);
            return false;
        }
    };

    const acceptedToken = async (id: number | string): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "acceptedToken",
                methodType: "read_exchange",
                args: [id],
            });
            return tx || '';
        } catch (error) {
            console.error("acceptedToken error:", error);
            return '';
        }
    };

    // 时间戳查询
    // function refundReviewDeadline(uint256 boxId_) external view returns (uint256);
    const refundReviewDeadline = async (id: number | string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "refundReviewDeadline",
                methodType: "read_exchange",
                args: [id],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("refundReviewDeadline error:", error);
            return 0;
        }
    };

    // function refundRequestDeadline(uint256 boxId_) external view returns (uint256);
    const refundRequestDeadline = async (id: number | string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "refundRequestDeadline",
                methodType: "read_exchange",
                args: [id],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("refundRequestDeadline error:", error);
            return 0;
        }
    };

    // 状态查询
    // function isInRequestRefundDeadline(uint256 boxId_) external view returns (bool);
    const isInRequestRefundDeadline = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "inRequestRefundDeadline",
                methodType: "read_exchange",
                args: [id],
            });
            return tx || false;
        } catch (error) {
            console.error("inRequestRefundDeadline error:", error);
            return false;
        }
    };
    // function isInReviewDeadline(uint256 boxId_) external view returns (bool);

    const isInReviewDeadline = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "inReviewDeadline",
                methodType: "read_exchange",
                args: [id],
            });
            return tx || false;
        } catch (error) {
            console.error("inReviewDeadline error:", error);
            return false;
        }
    };

    


    return {
        // 角色查询
        // buyerOf,
        // completerOf,
        // sellerOf,
        refundPermit,
        acceptedToken,
        // 时间戳
        refundReviewDeadline,
        refundRequestDeadline,
        // 状态查询
        isInRequestRefundDeadline,
        isInReviewDeadline,
        // 支付相关
        calcPayMoney,

    };
}
