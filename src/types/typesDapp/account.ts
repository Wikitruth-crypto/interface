

export const RoleDetail = [
    'Admin',
    'Minter',
    'Seller',
    'Buyer',
    'Bidder',
    'Completer',
    'Other',
    null,
] as const;

export type BoxRoleType = typeof RoleDetail[number];

export type AccountRoleType = 'Admin' | 'User' | null;

