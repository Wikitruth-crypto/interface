export * from './addressManager';
export * from './fundManager';
export * from './truthBox';
export * from './token';
export * from './exchange';

import { 
    FunctionNameType_ERC20, 
    FunctionNameType_ERC20Secret, 
    FunctionNameType_Exchange, 
    FunctionNameType_TruthBox 
} from '@/dapp/types/contracts';

// 将多个类型合并为一个联合类型
export type FunctionNameType = 
FunctionNameType_ERC20 | 
FunctionNameType_ERC20Secret | 
FunctionNameType_Exchange | 
FunctionNameType_TruthBox ;
