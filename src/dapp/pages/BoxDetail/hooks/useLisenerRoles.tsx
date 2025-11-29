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

    // 使用 selector 精确监听当前账户的 userId 变化
    const userId = useAccountStore((state) => {
        const targetChainId = chainId || CHAIN_ID;
        if (!targetChainId || !address) {
            return '';
        }

        const chainAccounts = state.accounts[targetChainId];
        if (!chainAccounts) {
            return '';
        }

        return (
            chainAccounts[address]?.userId ??
            chainAccounts[address.toLowerCase()]?.userId ??
            ''
        );
    });

    useEffect(() => {
        let roles: BoxRoleType[] = [];
        updateUserState({ roles: roles });
        if (!address || !isConnected || !box || !userId) {
            return;
        }

        if (import.meta.env.DEV) {
            console.log('userId-boxDetailPage:', userId);
        }

        // 统一转换为字符串进行比较，避免类型不匹配问题
        const userIdStr = String(userId).trim();
        const sellerId = box.sellerId ? String(box.sellerId).trim() : '';
        const buyerId = box.buyerId ? String(box.buyerId).trim() : '';
        const minterId = box.minterId ? String(box.minterId).trim() : '';
        const completerId = box.completerId ? String(box.completerId).trim() : '';
        const biddersIds = box.biddersIds || [];

        if (biddersIds.length > 0) {
            // bidders 现在是字符串数组
            const isBidder = biddersIds.some(bidderId => bidderId === userIdStr);
            if (isBidder && buyerId !== userIdStr) {
                roles.push('Bidder');
            }
        }

        const role = (): BoxRoleType[] => {

            if (accountRole === 'Admin') {
                roles.push('Admin');
            };
            if (userIdStr === minterId) {
                roles.push('Minter');
            };
            if (userIdStr === sellerId) roles.push('Seller');
            if (userIdStr === buyerId) {
                roles.push('Buyer');
            };
            if (userIdStr === completerId) roles.push('Completer');
            
            if (roles.length === 0) roles.push('Other');

            if (import.meta.env.DEV) {
                console.log('roles-boxDetailPage:', roles);
            }
            return roles;
        };
        updateUserState({ roles: role() });
    }, [address, isConnected, box, userId]);

    return {};
};

