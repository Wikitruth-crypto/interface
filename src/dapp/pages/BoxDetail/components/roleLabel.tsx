// import React from 'react';

import { useBoxDetailStore } from '../store/boxDetailStore';
import { useLisenerRoles } from '../hooks/useLisenerRoles';
// import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import Paragraph from '@/components/base/paragraph';

interface Props {
    tokenId?: number,
}

const RoleContainer: React.FC<Props> = () => {
    // const { accountRole } = useWalletContext() || {}
    // const box = useQueryStore(state => state.boxes[tokenId]);
    const { roles } = useBoxDetailStore(state => state.userState);
    // const tokenId = useBoxDetailStore(state => state.tokenId);
    useLisenerRoles();

    return (

        <div className="flex flex-col items-start justify-center">
            {roles.length > 0 ? (
                <>
                    <Paragraph color="primary" size="md" weight="semibold">You are: {roles.join(', ')}</Paragraph>
                    <Paragraph color="muted-foreground" size="sm">You can do the following actions:</Paragraph>
                </>
            ) : (
                <>
                    <Paragraph color="primary" size="md" weight="semibold">You are: Guest, please login!</Paragraph>
                    <Paragraph color="muted-foreground" size="sm">Please login!</Paragraph>
                </>

            )}
        </div>
    );
}

export default RoleContainer;
