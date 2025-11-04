import { useEffect } from 'react';
import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
import { BoxRoleType } from '@dapp/types/account';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useBoxContext } from '../contexts/BoxContext';

export const useLisenerRoles = () => {
    const { boxId, box } = useBoxContext();

    const { 
        updateUserState, 
    } = useBoxDetailStore();

    const { address, isConnected, accountRole} = useWalletContext() || {};

    useEffect(() => {
        let roles: BoxRoleType[] = [];
        updateUserState({ roles: roles });
        if (!address || !isConnected || !box) {
            return;
        }
        // console.log('box:', box); 
        // console.log('address:', address); // 0xb01a88A4A4Ebb7F8F32848fed0D2de3c8413CCd1

        const seller = box.seller?.id;
        const buyer = box.buyer?.id;
        const minter = box.minter?.id; // 0xb01a88a4a4ebb7f8f32848fed0d2de3c8413ccd1
        const completer = box.completer?.id;

        const bidders = box.bidders;
        if (bidders && bidders.length > 0) {
            const bidder = bidders.find(bidder => bidder.id === address);
            if (bidder && bidder.id !== buyer) {
                roles.push('Bidder');
            }
        }

        const role = (): BoxRoleType[] => {
            const addr = address?.toLowerCase();
            if (addr === minter?.toLowerCase()) {
                roles.push('Minter');
            };
            if (accountRole === 'Admin') {
                roles.push('Admin');
            };
            if (addr === seller?.toLowerCase()) roles.push('Seller');
            if (addr === buyer?.toLowerCase()) {
                roles.push('Buyer');
            };
            if (addr === completer?.toLowerCase()) roles.push('Completer');
            
            if (roles.length === 0) roles.push('Other');
            return roles;
        };
        updateUserState({ roles: role() });
    }, [address, isConnected, box, updateUserState]);

    return {};
};

