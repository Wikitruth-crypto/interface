import type { BoxRoleType } from '@dapp/types/typesDapp/account';
import type { BoxDetailData } from '../types/boxDetailData';
// import type { DeadlineCheckStateType } from '../types/stateType';
import type { ContractConfig, ContractConfigs } from '@dapp/config/contractsConfig';
import type { FunctionNameType } from '@dapp/types/typesDapp/contracts';
import type { ButtonActiveNameType } from '../hooks/useButtonActive';

export interface BoxActionContext {
  box?: BoxDetailData;
  boxId: string;
  roles: BoxRoleType[];
  // deadline: DeadlineCheckStateType;
}

export interface BoxActionWriteParams {
  contract: ContractConfig;
  functionName: FunctionNameType;
  args: any[];
}

export interface BoxActionConfig {
  id: string;
  label: string;
  description?: string;
  // The following fields are optional for buttons that only open the modal (such as buy, bid, payConfiFee, extendDeadline, viewFile)
  contract?: (configs: ContractConfigs) => ContractConfig;
  functionName?: FunctionNameType;
  pendingFunctions?: FunctionNameType[];
  getArgs?: (ctx: BoxActionContext, configs: ContractConfigs) => any[];
  needAllowance?: boolean;
  shouldCheckAllowance?: (ctx: BoxActionContext) => boolean;
  getAllowanceParams?: (ctx: BoxActionContext, configs: ContractConfigs) => { token: string; amount: number | string | bigint } | null;
  allowedRoles?: BoxRoleType[];
  isDisabled?: (ctx: BoxActionContext) => boolean;
  activeKey?: ButtonActiveNameType;
  buildWrite?: (
    ctx: BoxActionContext,
    configs: ContractConfigs,
    customArgs?: any
  ) => BoxActionWriteParams | null;
  requiresCustomArgs?: boolean;
}

export interface BoxActionController {
  label: string;
  description?: string;
  isLoading: boolean;
  isDisabled: boolean;
  isSuccessed: boolean;
  showApprove: boolean;
  error: Error | null;
  execute: (options?: { onClick?: () => void; customArgs?: any }) => Promise<void>;
}
