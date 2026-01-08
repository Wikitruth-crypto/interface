// import React from 'react';

import { useBoxDetailStore } from '../store/boxDetailStore';
import { useLisenerRoles } from '../hooks/useLisenerRoles';
import { Alert, Button, Typography, Space } from 'antd';
import { useSiweAuth } from '@dapp/hooks/SiweAuth';

interface Props {
    tokenId?: number,
}

// const { Paragraph } = Typography;

const RoleContainer: React.FC<Props> = () => {
    const { roles } = useBoxDetailStore(state => state.userState);
    const { login, isLoading } = useSiweAuth();
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
                        type="warning"
                        showIcon={true}
                        message="You are: Guest, please login!"
                        description={

                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                {/* <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 13 }}>

                                    Please login to the website to use the Wallet Connection
                                </Paragraph> */}
                                <Button type="primary" block  loading={isLoading} onClick={() => login()}>Login</Button>
                            </Space>
                        }
                    />
                </>

            )}
        </div>
    );
}

export default RoleContainer;
