import { useEffect, useState } from 'react';
import AlertCustom from './base/alertCustom';
import { useGetMyUserId } from '@dapp/hooks/readContracts2/useGetMyUserId';

const UserIdAlert: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const userId = useGetMyUserId();

    useEffect(() => {
        if (userId) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [userId]);
    return (
        <>
            {isOpen &&
                <AlertCustom
                    showIcon={true}
                    message="You need to login to the website to use the function"
                    description="You need to login to the website to use the function"
                    type="warning"
                    enablePulse={true}
                />
            }
        </>
    )
};

export default UserIdAlert;