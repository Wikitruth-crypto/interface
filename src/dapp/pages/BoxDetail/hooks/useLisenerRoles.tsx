import { useEffect } from 'react';
import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
import { BoxRoleType } from '@dapp/types/account';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useAccountStore } from '@/dapp/store/accountStore';
import { CHAIN_ID } from '@/dapp/contractsConfig';

export const useLisenerRoles = () => {
    const { box } = useBoxDetailContext();
    const { address, isConnected, accountRole, chainId} = useWalletContext() || {};

    const { 
        updateUserState, 
    } = useBoxDetailStore();

    // 调整为获取userId
    const userId = useAccountStore((state) => state.accounts[chainId || CHAIN_ID]?.[address?.toLowerCase() || '']?.userId);

    useEffect(() => {
        let roles: BoxRoleType[] = [];
        updateUserState({ roles: roles });
        if (!address || !isConnected || !box || !userId) {
            return;
        }

        const sellerId = box.sellerId;
        const buyerId = box.buyerId;
        const minterId = box.minterId;
        const completerId = box.completerId;

        const biddersIds = box.biddersIds;
        if (biddersIds.length > 0) {
            // bidders 现在是字符串数组
            const isBidder = biddersIds.some(bidderId => bidderId === userId);
            if (isBidder && buyerId !== userId) {
                roles.push('Bidder');
            }
        }

        const role = (): BoxRoleType[] => {

            if (userId && minterId && userId === minterId) {
                roles.push('Minter');
            };
            if (accountRole === 'Admin') {
                roles.push('Admin');
            };
            if (userId === sellerId) roles.push('Seller');
            if (userId === buyerId) {
                roles.push('Buyer');
            };
            if (userId === completerId) roles.push('Completer');
            
            if (roles.length === 0) roles.push('Other');
            return roles;
        };
        updateUserState({ roles: role() });
    }, [address, isConnected, box, userId]);

    return {};
};

