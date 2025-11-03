"use client";

import { ContractFunctionParams } from './provider';
import { EIP712Permit, SignatureRSV } from '@/dapp/hooks/EIP712';

/**
 * ERC20 隐私代币 Provider
 * 支持 ERC20Secret 和 WROSEsecret 合约
 * 
 * 核心功能：
 * 1. 标准 ERC20 读取函数（有隐私限制）
 * 2. 基于 EIP-712 签名的授权读取函数
 * 3. Wrap/Unwrap 功能
 * 4. 签名管理功能
 * 
 * 注意：EIP712Permit 和 SignatureRSV 类型已从 @/dapp/hooks/EIP712 统一导入
 */

export function useProviderERC20secret(contract: (params: ContractFunctionParams) => Promise<any>) {
    // ==================== 标准 ERC20 读取函数 ====================
    // 注意：这些函数受隐私保护，只能查看自己的数据

    /**
     * 查询底层代币地址
     */
    const underlyingToken = async (): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "underlyingToken",
                methodType: "read_ERC20secret",
            });
            return tx || '';
        } catch (error) {
            console.error("underlyingToken error:", error);
            return '';
        }
    };

    // ==================== EIP-712 签名授权读取函数 ====================
    
    /**
     * 通过 EIP-712 签名查询余额
     * 这个函数可以查询任何地址的余额，只要有该地址的签名授权
     */
    const balanceOfWithPermit = async (permit: EIP712Permit): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "balanceOfWithPermit",
                methodType: "read_ERC20secret",
                args: [permit],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("balanceOfWithPermit error:", error);
            return 0;
        }
    };

    /**
     * 通过 EIP-712 签名查询授权额度
     */
    const allowanceWithPermit = async (permit: EIP712Permit): Promise<number> => {
        try {
            const tx = await contract({
                functionName: "allowanceWithPermit",
                methodType: "read_ERC20secret",
                args: [permit],
            });
            return tx ? parseInt(tx.toString()) : 0;
        } catch (error) {
            console.error("allowanceWithPermit error:", error);
            return 0;
        }
    };

    // ==================== EIP-712 域信息 ====================
    
    /**
     * 获取 EIP-712 域分隔符
     */
    const DOMAIN_SEPARATOR = async (): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "DOMAIN_SEPARATOR",
                methodType: "read_ERC20secret",
            });
            return tx || '';
        } catch (error) {
            console.error("DOMAIN_SEPARATOR error:", error);
            return '';
        }
    };

    /**
     * 获取 EIP-712 Permit 类型哈希
     */
    const EIP_PERMIT_TYPEHASH = async (): Promise<string> => {
        try {
            const tx = await contract({
                functionName: "EIP_PERMIT_TYPEHASH",
                methodType: "read_ERC20secret",
            });
            return tx || '';
        } catch (error) {
            console.error("EIP_PERMIT_TYPEHASH error:", error);
            return '';
        }
    };

    // ==================== 签名管理 ====================
    /**
     * 检查签名是否已被使用
     */
    const isSignatureUsed = async (signature: SignatureRSV): Promise<boolean> => {
        try {
            const tx = await contract({
                functionName: "isSignatureUsed",
                methodType: "read_ERC20secret",
                args: [signature],
            });
            return tx || false;
        } catch (error) {
            console.error("isSignatureUsed error:", error);
            return false;
        }
    };

    return {
        underlyingToken,
        // ==================== EIP-712 签名授权读取 ====================
        balanceOfWithPermit,
        allowanceWithPermit,
        // ==================== EIP-712 域信息 ====================
        DOMAIN_SEPARATOR,
        EIP_PERMIT_TYPEHASH,
        // ==================== 签名管理 ====================
        isSignatureUsed,
    };
}
