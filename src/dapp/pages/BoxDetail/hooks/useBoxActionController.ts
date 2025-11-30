import { useEffect, useMemo, useState } from 'react';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useAllowance_BoxDetail } from '../hooks/useAllowanceBoxDetail';
import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import { useWriteCustormV2 } from '@/dapp/hooks/useWritCustormV2';
import { useButtonActive } from './useButtonActive';
import type { BoxActionConfig, BoxActionController, BoxActionContext, BoxActionWriteParams } from '../actions/types';
import type { FunctionNameType } from '@/dapp/types/contracts';

export const useBoxActionController = (config: BoxActionConfig): BoxActionController => {
  const allConfigs = useAllContractConfigs();
  const { box, boxId } = useBoxDetailContext();
  const roles = useBoxDetailStore((state) => state.userState.roles);
  const { checkAllowance_BoxDetail, isEnough } = useAllowance_BoxDetail();
  const { functionWriting} = useButtonInteractionStore();
  const { writeCustormV2, error } = useWriteCustormV2(boxId);
  const disabledByHook = config.activeKey ? useButtonActive(config.activeKey) : false;

  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [allowanceChecked, setAllowanceChecked] = useState(!config.needAllowance);

  const ctx: BoxActionContext = useMemo(() => ({ box, boxId, roles}), [box, boxId, roles]);

  const buildWrite = useMemo(() => {
    return (customArgs?: any): BoxActionWriteParams | null => {
      if (config.buildWrite) {
        return config.buildWrite(ctx, allConfigs, customArgs);
      }

      if (!box) {
        return null;
      }

      return {
        contract: config.contract(allConfigs),
        functionName: config.functionName,
        args: config.getArgs(ctx, allConfigs),
      };
    };
  }, [config, ctx, allConfigs, box]);

  const defaultWrite = useMemo(() => buildWrite(undefined), [buildWrite]);

  const shouldCheckAllowance = Boolean(
    config.needAllowance && (config.shouldCheckAllowance ? config.shouldCheckAllowance(ctx) : true)
  );

  useEffect(() => {
    setAllowanceChecked(!shouldCheckAllowance);
  }, [shouldCheckAllowance]);

  const pendingFns = config.pendingFunctions ?? [config.functionName];
  const isActionPending = pendingFns.includes((functionWriting ?? '') as FunctionNameType);
  const blockedByOtherAction =
    functionWriting !== null && !pendingFns.includes((functionWriting ?? '') as FunctionNameType);

  const lacksRole = config.allowedRoles ? !config.allowedRoles.some((role) => roles.includes(role)) : false;
  const customDisabled = config.isDisabled ? config.isDisabled(ctx) : false;
  const noDefaultWrite = !defaultWrite && !config.requiresCustomArgs;

  const isDisabled =
    blockedByOtherAction ||
    isCheckingAllowance ||
    isActionPending ||
    lacksRole ||
    customDisabled ||
    disabledByHook ||
    noDefaultWrite;

  const showApprove = shouldCheckAllowance && allowanceChecked && config.needAllowance && !isEnough;

  const execute: BoxActionController['execute'] = async (options) => {
    if (!box) return;
    if (isDisabled) {
      return;
    }

    const writeParams = buildWrite(options?.customArgs);
    if (!writeParams) {
      return;
    }

    if (shouldCheckAllowance && config.getAllowanceParams) {
      const allowanceParams = config.getAllowanceParams(ctx, allConfigs);
      if (!allowanceParams) {
        return;
      }

      setIsCheckingAllowance(true);
      const result = await checkAllowance_BoxDetail(allowanceParams.token as `0x${string}`, allowanceParams.amount);
      setIsCheckingAllowance(false);
      setAllowanceChecked(true);

      if (!result?.isEnough) {
        return;
      }
    }

    options?.onClick?.();

    await writeCustormV2({
      contract: writeParams.contract,
      functionName: writeParams.functionName,
      args: writeParams.args,
    });
  };

  return {
    label: config.label,
    description: config.description,
    isLoading: isCheckingAllowance || isActionPending,
    isDisabled,
    showApprove: showApprove ?? false,
    error,
    execute,
  };
};
