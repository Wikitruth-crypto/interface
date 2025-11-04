import { useContext, useEffect, useState, useCallback } from 'react';
import { ContractContext } from "../context/contractContext";
import { useAccount} from 'wagmi';
import { useAllContractConfigs, useContractAddress } from "../contractsConfig";
import { useAccountStore } from "../store/accountStore";
import { useSecretStore } from "../store/secretStore";
import { EIP712Permit } from './EIP712';

/**
 * enum PermitLabel { VIEW, TRANSFER, APPROVE }
 * function allowanceWithPermit(
        EIP712Permit memory permit
    ) external view returns (uint256)

 * function balanceOfWithPermit(
        EIP712Permit memory permit
    ) external view returns (uint256)
 * @returns 
 */

export const useReadSecretBalance = (
    eip712Permit?: EIP712Permit,
) => {
    const { allowance } = useContext(ContractContext);
    const { address } = useAccount();
    const allConfigs = useAllContractConfigs();
    const FundManagerAddress = useContractAddress('FundManager');

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