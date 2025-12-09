import React from 'react';
import { cn } from '@/lib/utils';
import ProfileRewardsPanel from '../components/ProfileRewardsPanel';

interface ProfileRewardsViewProps {
    userId: string | null;
    className?: string;
}

const ProfileRewardsView: React.FC<ProfileRewardsViewProps> = ({ userId, className }) => {
    return (
        <div className={cn('space-y-6', className)}>
            <ProfileRewardsPanel userId={userId}/>
        </div>
    );
};

export default ProfileRewardsView;
