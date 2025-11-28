// import React from 'react';

import { useBoxDetailStore } from '../store/boxDetailStore';
import { useLisenerRoles } from '../hooks/useLisenerRoles';
import { Alert } from 'antd';

interface Props {
    tokenId?: number,
}

const RoleContainer: React.FC<Props> = () => {
    const { roles } = useBoxDetailStore(state => state.userState);
    useLisenerRoles();

    return (

        <div className="flex flex-col items-start justify-center">
            {roles.length > 0 ? (
                <>
                    <Alert
                        showIcon={true}
                        message={`You are: ${roles.join(', ')}`}
                        description="You can do the following actions:"
                        type="info"
                    />
                </>
            ) : (
                <>
                    <Alert
                        showIcon={true}
                        message="You are: Guest, please login!"
                        description="Please login to the website to use the Wallet Connection"
                        type="warning"
                    />
                </>

            )}
        </div>
    );
}

export default RoleContainer;
