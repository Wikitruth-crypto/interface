"use client"

import React from 'react';
import ProfileContainer from './containers/ProfileContainer';
import UserIdAlert from '@/dapp/components/userIdAlert';

const UserProfilePage: React.FC = () => {
    return (
        <>
            <UserIdAlert />
        
            <ProfileContainer
                config={{
                    enableProgressiveReveal: false,
                    revealDelay: 150,
                    debug: process.env.NODE_ENV === 'development'
                }}
            />
        </>

    );
};

export default UserProfilePage;