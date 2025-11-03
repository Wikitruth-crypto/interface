"use client";
import { ContractFunctionParams } from './provider';

export function useProviderFundManager(contract: (params: ContractFunctionParams) => Promise<any>) {

    // 费率查询

    const otherRewardRate = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "otherRewardRate",
                methodType: "read_fundManager",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("otherRewardRate error:", error);
            return 0;
        }
    };

    const serviceFeeRate = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "serviceFeeRate",
                methodType: "read_fundManager",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("serviceFeeRate error:", error);
            return 0;
        }
    };

    // 金额查询
    // function orderAmounts(uint256 boxId_, bytes memory siweToken_) external view returns (uint256);
    const orderAmounts = async (id: number | string, siweToken: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "orderAmounts",
                methodType: "read_fundManager",
                args: [id, siweToken],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("orderAmounts error:", error);
            return 0;
        }
    };
    
    // 获取铸造者奖励金额（带SIWE token）
    // function minterRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    const minterRewardAmounts = async (token: string, siweToken: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "minterRewardAmounts",
                methodType: "read_fundManager",
                args: [token, siweToken],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("minterRewardAmounts error:", error);
            return 0;
        }
    };
    
    // 获取协助者奖励金额（带SIWE token）
    // function helperRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    const helperRewardAmounts = async (token: string, siweToken: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "helperRewardAmounts",
                methodType: "read_fundManager",
                args: [token, siweToken],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("helperRewardAmounts error:", error);
            return 0;
        }
    };
    
    // 获取总奖励金额
    // function totalRewardAmounts(address token_) external view returns (uint256);
    const totalRewardAmounts = async (token: string): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "totalRewardAmounts",
                methodType: "read_fundManager",
                args: [token],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("totalRewardAmounts error:", error);
            return 0;
        }
    };
    
    // 获取滑点保护
    // function slippageProtection() external view returns (uint8);
    const slippageProtection = async (): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "slippageProtection",
                methodType: "read_fundManager",
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("slippageProtection error:", error);
            return 0;
        }
    };
    

    const isWithdrawPaused = async (): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "isWithdrawPaused",
                methodType: "read_fundManager",
            });
            return tx || false;
        } catch (error) {
            console.error("isWithdrawPaused error:", error);
            return false;
        }
    };

    // 调试函数
    // function helperRewardAmounts(address helper_, address token_) external view returns (uint256);
    
    // 获取铸造者奖励金额（调试用）
    // function minterRewardAmounts(address minter_, address token_) external view returns (uint256);

    return {
        // 费率查询
        otherRewardRate,
        serviceFeeRate,
        // 金额查询
        orderAmounts,
        minterRewardAmounts,
        helperRewardAmounts,
        // 资金池查询
        // availableServiceFees,
        // cumulativeAllocatedFunds,
        totalRewardAmounts,
        // 状态查询
        isWithdrawPaused,
        slippageProtection,
    };
}
