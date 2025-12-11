import { useEffect, useMemo, useState, useRef } from 'react';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import { useWriteCustormV2 } from '@/dapp/hooks/useWriteCustormV2';
import { useButtonActive } from './useButtonActive';
import type { BoxActionConfig, BoxActionController, BoxActionContext, BoxActionWriteParams } from '../actions/types';
import type { FunctionNameType } from '@/dapp/types/contracts';

export const useBoxActionController = (config: BoxActionConfig): BoxActionController => {
  const allConfigs = useAllContractConfigs();
  const { box, boxId } = useBoxDetailContext();
  const roles = useBoxDetailStore((state) => state.userState.roles);
  const { functionWriting} = useButtonInteractionStore();
  const { writeCustormV2, error, isLoading , isSuccessed} = useWriteCustormV2(boxId);
  const isActiveByHook = config.activeKey ? useButtonActive(config.activeKey) : true;

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

  const pendingFns = config.pendingFunctions ?? [config.functionName];
  const isActionPending = pendingFns.includes((functionWriting ?? '') as FunctionNameType);
  const blockedByOtherAction =
    functionWriting !== null && !pendingFns.includes((functionWriting ?? '') as FunctionNameType);

  const lacksRole = config.allowedRoles ? !config.allowedRoles.some((role) => roles.includes(role)) : false;
  const customDisabled = config.isDisabled ? config.isDisabled(ctx) : false;
  const noDefaultWrite = !defaultWrite && !config.requiresCustomArgs;

  const isDisabled =
    blockedByOtherAction ||
    isActionPending ||
    lacksRole ||
    customDisabled ||
    !isActiveByHook ||
    noDefaultWrite;

  const prevFunctionWriting = useRef<string | null>(null);
  useEffect(() => {
    prevFunctionWriting.current = functionWriting;
  }, [functionWriting]);

  const execute: BoxActionController['execute'] = async (options) => {

    const writeParams = buildWrite(options?.customArgs);
    if (!writeParams) {
      return;
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
    isLoading: isActionPending || isLoading,
    isDisabled,
    isSuccessed,
    showApprove: false,
    error,
    execute,
  };
};

