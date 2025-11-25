import {  useEffect, useState, useCallback } from 'react';
import { useERC20Secret, useERC20 } from '../index';
import { useAccount} from 'wagmi';
import { useAllContractConfigs, useContractAddress } from '@/dapp/contractsConfig';

import { EIP712Permit } from '@/dapp/hooks/EIP712';
import { ContractName } from '@/dapp/contractsConfig';

export const useReadSecretBalance = (
    eip712Permit?: EIP712Permit,
) => {
    const { balanceOfWithPermit: balanceOfWithPermitSecret } = useERC20Secret();
    const { balanceOf } = useERC20();
    const { address } = useAccount();
    const allConfigs = useAllContractConfigs();
    const FundManagerAddress = useContractAddress(ContractName.FUND_MANAGER);

    const balanceOfWithPermit = async (permit: EIP712Permit): Promise<number> => {
        if (typeof allowance !== 'function') {
            throw new Error('allowance 函数未初始化，请检查合约上下文');
        }
        return allowance(permit);
    }

    const allowanceWithPermit = async (permit: EIP712Permit): Promise<number> => {
        if (typeof allowance !== 'function') {
            throw new Error('allowance 函数未初始化，请检查合约上下文');
        }
        return allowance(permit);
    }


    return allowance;
}