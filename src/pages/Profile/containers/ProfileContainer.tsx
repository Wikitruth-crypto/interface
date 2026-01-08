import React, { useState } from 'react';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { Container } from '@/components/Container';
import { cn } from '@/lib/utils';
import { useGetMyUserId } from '@dapp/hooks/readContracts2/useGetMyUserId';
import ProfileViewTabs, { ProfileViewType } from '../components/ProfileViewTabs';
import ProfileRewardsView from './ProfileRewardsView';
import ProfileBoxesView from './ProfileBoxesView';

export interface ProfileContainerProps {
    className?: string;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ className }) => {
    const { address } = useWalletContext();
    const resolvedUserId = useGetMyUserId();
    const userId = resolvedUserId && resolvedUserId.trim() !== '' ? resolvedUserId.trim() : null;
    const [activeView, setActiveView] = useState<ProfileViewType>('rewards');

    return (
        <Container className={cn('space-y-6 py-6', className)}>

            <ProfileViewTabs active={activeView} onChange={setActiveView} />

            {activeView === 'rewards' ? (
                <ProfileRewardsView userId={userId} />
            ) : (
                <ProfileBoxesView address={address} userId={userId} />
            )}
        </Container>
    );
};

export default ProfileContainer;
