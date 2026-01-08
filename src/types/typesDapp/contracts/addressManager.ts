
// enum TokenEnum { UnExsited, Active, Inactive }
export const tokenEnum = [
    'UnExsited',
    'Active',
    'Inactive',
] as const;

export type TokenEnum = typeof tokenEnum[number];


// import { TokenEnum } from '@/dapp/types/contractData/addressManager';
// TokenEnum.UnExsited