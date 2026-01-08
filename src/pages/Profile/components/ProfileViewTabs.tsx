import React from 'react';
import { cn } from '@/lib/utils';
import { Radio } from 'antd';

export type ProfileViewType = 'rewards' | 'boxes';

interface ProfileViewTabsProps {
    active: ProfileViewType;
    onChange: (view: ProfileViewType) => void;
    className?: string;
}

const TABS: { key: ProfileViewType; label: string; description: string }[] = [
    { key: 'rewards', label: 'MyRewards', description: 'Helper & Minter earnings' },
    { key: 'boxes', label: 'MyBoxes', description: 'All boxes linked to me' },
];

const ProfileViewTabs: React.FC<ProfileViewTabsProps> = ({ active, onChange, className }) => {
    return (
        <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
            <Radio.Group buttonStyle='solid' size='large' onChange={(e) => onChange(e.target.value)} defaultValue={active}>
                {TABS.map((tab) => (
                    <Radio.Button
                        key={tab.key}
                        value={tab.key}
                    >
                        {tab.label}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </div>
    );
};

export default ProfileViewTabs;
