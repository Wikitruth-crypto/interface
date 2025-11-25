import { useEffect } from 'react';
import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
import { BoxRoleType } from '@dapp/types/account';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useBoxContext } from '../contexts/BoxDetailContext';
import { useAccountStore } from '@/dapp/store/accountStore';

export const useLisenerRoles = () => {
    const { box } = useBoxContext();
    const { address, isConnected, accountRole} = useWalletContext() || {};

    const { 
        updateUserState, 
    } = useBoxDetailStore();

    // 调整为获取userId
    const { userId } = useAccountStore();

    useEffect(() => {
        let roles: BoxRoleType[] = [];
        updateUserState({ roles: roles });
        if (!address || !isConnected || !box) {
            return;
        }

        const sellerId = box.sellerId;
        const buyerId = box.buyerId;
        const minterId = box.minterId;
        const completerId = box.completerId;

        const biddersIds = box.biddersIds;
        if (biddersIds && biddersIds.length > 0) {
            // bidders 现在是字符串数组
            const isBidder = biddersIds.some(bidderId => bidderId?.toLowerCase() === userId?.toLowerCase());
            if (isBidder && buyerId?.toLowerCase() !== userId?.toLowerCase()) {
                roles.push('Bidder');
            }
        }

        const role = (): BoxRoleType[] => {
            const addr = address?.toLowerCase();
            if (addr && minterId && addr === minterId.toLowerCase()) {
                roles.push('Minter');
            };
            if (accountRole === 'Admin') {
                roles.push('Admin');
            };
            if (addr && sellerId && addr === sellerId.toLowerCase()) roles.push('Seller');
            if (addr && buyerId && addr === buyerId.toLowerCase()) {
                roles.push('Buyer');
            };
            if (addr && completerId && addr === completerId.toLowerCase()) roles.push('Completer');
            
            if (roles.length === 0) roles.push('Other');
            return roles;
        };
        updateUserState({ roles: role() });
    }, [address, isConnected, box, updateUserState]);

    return {};
};

