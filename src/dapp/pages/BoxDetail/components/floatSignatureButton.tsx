import React, { useState, useEffect, useCallback } from 'react';
import FloatSignatureButton from '@/dapp/components/floatSignatureButton';
import type { Eip712Requirement } from '@/dapp/components/secret/requestEip712';
import { PermitType } from '@/dapp/hooks/EIP712/types_ERC20secret';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useEIP712Permit } from '@/dapp/hooks/EIP712/useEIP712Permit';
import { useSiweAuth } from '@/dapp/hooks/SiweAuth';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';
import { useChainId } from 'wagmi';

/**
 * 悬浮签名按钮组件
 * 
 * 功能：
 * - 在右侧中间位置显示悬浮按钮
 * - 点击按钮显示/隐藏签名组件（EIP712 和/或 SIWE）
 * - 签名组件固定在右侧显示
 * - 支持同时显示多个签名请求
 * 
 * 流程：检查当前是否存在有效签名，如果存在，则不显示按钮，如果不存在，则显示按钮
 * 
 */
const FloatSignatureButtonBoxDetail: React.FC = () => {
    const { isExpired } = useEIP712Permit();
    const { session, validateSession } = useSiweAuth();
    const getEip712Permit = useSimpleSecretStore((state) => state.getEip712Permit);
    
    const [isValidEIP712, setIsValidEIP712] = useState(false);
    const [isValidSIWE, setIsValidSIWE] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const allConfigs = useAllContractConfigs();
    const { address } = useWalletContext();
    const chainId = useChainId();

    /**
     * 检查 EIP712 Permit 是否有效
     */
    const checkEIP712Permit = useCallback((): boolean => {
        if (!address || !chainId) {
            return false;
        }

        try {
            const permit = getEip712Permit(
                PermitType.VIEW,
                allConfigs.FundManager.address,
                chainId,
                address
            );

            if (!permit) {
                return false;
            }

            // 检查是否过期
            return !isExpired(permit);
        } catch (error) {
            console.error('[FloatSignatureButton] 检查 EIP712 permit 失败:', error);
            return false;
        }
    }, [address, chainId, allConfigs.FundManager.address, getEip712Permit, isExpired]);

    /**
     * 检查 SIWE Session 是否有效
     */
    const checkSiweSession = useCallback(async (): Promise<boolean> => {
        if (!address) {
            return false;
        }

        try {
            // 验证会话（调用合约验证）
            const isValid = await validateSession();
            return isValid;
        } catch (error) {
            console.error('[FloatSignatureButton] Check SIWE session failed:', error);
            return false;
        }
    }, [address, session, validateSession]);

    /**
     * 执行签名有效性检查
     */
    const performCheck = useCallback(async () => {
        if (!address || isChecking) {
            return;
        }

        setIsChecking(true);

        try {
            // 检查 EIP712 Permit
            const eip712Valid = checkEIP712Permit();
            setIsValidEIP712(eip712Valid);

            // 检查 SIWE Session
            const siweValid = await checkSiweSession();
            setIsValidSIWE(siweValid);

        } catch (error) {
            console.error('[FloatSignatureButton] Signature check failed:', error);
            // 出错时显示按钮，让用户手动处理
            setIsValidEIP712(false);
            setIsValidSIWE(false);
        } finally {
            setIsChecking(false);
        }
    }, [address, isChecking, checkEIP712Permit, checkSiweSession]);

    /**
     * 每5秒检查一次签名有效性
     */
    useEffect(() => {
        if (!address) {
            setIsValidEIP712(false);
            setIsValidSIWE(false);
            return;
        }

        // 立即执行一次检查
        void performCheck();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chainId]); 

    /**
     * 当签名完成时，立即检查一次
     */
    const handleEip712Complete = useCallback(() => {
        // 延迟一点时间，确保签名已保存到 store
        setTimeout(() => {
            performCheck();
        }, 500);
    }, [performCheck]);

    const handleSiweComplete = useCallback(() => {
        // 延迟一点时间，确保会话已保存
        setTimeout(() => {
            performCheck();
        }, 500);
    }, [performCheck]);

    if (!address) return null;

    const eip712Requirement: Eip712Requirement = {
        label: PermitType.VIEW,
        spender: allConfigs.FundManager.address,
        amount: BigInt(0),
        contractAddress: allConfigs.OfficialTokenSecret.address,
    };

    // 如果两个签名都有效，不显示按钮
    // 如果任一签名无效或不存在，显示按钮
    const shouldShowButton = !isValidEIP712 || !isValidSIWE;

    return (
        <>
            {shouldShowButton && (
                <FloatSignatureButton
                    eip712Requirement={eip712Requirement}
                    needSiwe={true}
                    onEip712Complete={handleEip712Complete}
                    onSiweComplete={handleSiweComplete}
                />
            )}
        </>
    );
};

export default FloatSignatureButtonBoxDetail;