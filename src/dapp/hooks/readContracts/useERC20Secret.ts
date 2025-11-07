'use client';

import { EIP712Permit, SignatureRSV } from '@/dapp/hooks/EIP712';
import { useReadContractERC20 } from './useReadContractERC20';
/**
 * ERC20Secret 隐私代币合约读取 Hook
 * 
 * 支持 ERC20Secret 和 WROSEsecret 合约
 * 
 * 注意：所有函数都需要传入 token 地址，因为会有多个 ERC20Secret 合约
 * 
 * 核心功能：
 * 1. 标准 ERC20 读取函数（有隐私限制）
 * 2. 基于 EIP-712 签名的授权读取函数
 * 3. EIP-712 域信息
 * 4. 签名管理功能
 */
export function useERC20Secret() {

    const { readContractERC20 } = useReadContractERC20();

    // ==================== 标准 ERC20 读取函数 ====================
    // 注意：这些函数受隐私保护，只能查看自己的数据

    /**
     * 查询底层代币地址
     */
    const underlyingToken = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'underlyingToken');
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('underlyingToken error:', error);
            return '';
        }
    };

    // ==================== EIP-712 签名授权读取函数 ====================
    
    /**
     * 通过 EIP-712 签名查询余额
     * 这个函数可以查询任何地址的余额，只要有该地址的签名授权
     */
    const balanceOfWithPermit = async (
        tokenAddress: `0x${string}`,
        permit: EIP712Permit
    ): Promise<number> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'balanceOfWithPermit', [permit]);
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('balanceOfWithPermit error:', error);
            return 0;
        }
    };

    /**
     * 通过 EIP-712 签名查询授权额度
     */
    const allowanceWithPermit = async (
        tokenAddress: `0x${string}`,
        permit: EIP712Permit
    ): Promise<number> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'allowanceWithPermit', [permit]);
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('allowanceWithPermit error:', error);
            return 0;
        }
    };

    // ==================== EIP-712 域信息 ====================
    
    /**
     * 获取 EIP-712 域分隔符
     */
    const DOMAIN_SEPARATOR = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'DOMAIN_SEPARATOR');
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('DOMAIN_SEPARATOR error:', error);
            return '';
        }
    };

    /**
     * 获取 EIP-712 Permit 类型哈希
     */
    const EIP_PERMIT_TYPEHASH = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'EIP_PERMIT_TYPEHASH');
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('EIP_PERMIT_TYPEHASH error:', error);
            return '';
        }
    };

    // ==================== 签名管理 ====================
    
    /**
     * 检查签名是否已被使用
     */
    const isSignatureUsed = async (
        tokenAddress: `0x${string}`,
        signature: SignatureRSV
    ): Promise<boolean> => {
        try {
            const tx = await readContractERC20('secret', tokenAddress, 'isSignatureUsed', [signature]);
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isSignatureUsed error:', error);
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

