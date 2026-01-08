export * from './addressManager';
export * from './fundManager';
export * from './truthBox';
export * from './token';
export * from './exchange';

import { 
    FunctionNameType_ERC20, 
    FunctionNameType_ERC20Secret, 
    FunctionNameType_Exchange, 
    FunctionNameType_TruthBox ,
    FunctionNameType_FundManager
} from './';

export type FunctionNameType = 
FunctionNameType_ERC20 | 
FunctionNameType_ERC20Secret | 
FunctionNameType_Exchange | 
FunctionNameType_TruthBox |
FunctionNameType_FundManager |
'viewFile';
