import React, { useState } from 'react';
import FloatSignatureButton from '@/dapp/components/floatSignatureButton';
import type { Eip712Requirement } from '@/dapp/components/secret/requestEip712';
import { PermitType } from '@/dapp/hooks/EIP712/types_ERC20secret';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';

/**
 * 悬浮签名按钮组件
 * 
 * 功能：
 * - 在右侧中间位置显示悬浮按钮
 * - 点击按钮显示/隐藏签名组件（EIP712 和/或 SIWE）
 * - 签名组件固定在右侧显示
 * - 支持同时显示多个签名请求
 */
const FloatSignatureButtonBoxDetail: React.FC = () => {

    const [eip712Completed, setEip712Completed] = useState(false);
    const [siweCompleted, setSiweCompleted] = useState(false);

    const allConfigs = useAllContractConfigs();
    const { address } = useWalletContext();

    if (!address) return null;

    const eip712Requirement: Eip712Requirement = {
        label: PermitType.VIEW,
        spender: allConfigs.FundManager.address,
        amount: 0,
        contractAddress: allConfigs.OfficialTokenSecret.address,
    };

    const handleEip712Complete = () => {
        setEip712Completed(true);
    };

    const handleSiweComplete = () => {
        setSiweCompleted(true);
    };


    return (
        <>{
            (!eip712Completed || !siweCompleted) && (
            <FloatSignatureButton
                eip712Requirement={eip712Requirement}
                needSiwe={true}
                address={address as `0x${string}` || ''}
                // eip712Title={eip712Title}
                // eip712Hint={eip712Hint}
                // siweTitle={siweTitle}
                // siweHint={siweHint}
                // siweButtonText={siweButtonText}
                // siweExpiredText={siweExpiredText}
                onEip712Complete={handleEip712Complete}
                onSiweComplete={handleSiweComplete}
            />
        )}
        </>
    );
};

export default FloatSignatureButtonBoxDetail;