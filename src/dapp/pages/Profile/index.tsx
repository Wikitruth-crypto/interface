"use client"

import React from 'react';
import ProfileContainer from './containers/ProfileContainer';

/**
 * Profile页面 - 用户个人资料页面
 * 
 * 架构说明：
 * - 这是一个简单的页面组件，主要职责是路由和布局
 * - 所有业务逻辑和状态管理都委托给ProfileContainer
 * - 保持页面组件的简洁性，便于维护和测试
 */
const UserProfilePage: React.FC = () => {
    return (

        <ProfileContainer
            config={{
                enableProgressiveReveal: false,
                revealDelay: 150,
                debug: process.env.NODE_ENV === 'development'
            }}
        />

    );
};

export default UserProfilePage;