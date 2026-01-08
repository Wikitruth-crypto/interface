import React, { useState } from 'react';
import { 
    // FloatButton, 
    Space, 
    // theme 
} from 'antd';
// import { SafetyCertificateOutlined, CloseOutlined, LoginOutlined } from '@ant-design/icons';
import RequestEip712 from '@dapp/components/secret/requestEip712';
import RequestSiwe from '@dapp/components/secret/requestSiwe';
import type { Eip712Requirement } from '@dapp/components/secret/requestEip712';
import FloatButtonV2 from '@/components/base/floatButtonV2';

// const { useToken } = theme;

export interface FloatSignatureButtonProps {
    eip712Requirement?: Eip712Requirement;
    needSiwe?: boolean;
    eip712Title?: string;
    eip712Hint?: string;
    /** SIWE hint text */
    isOpen?: boolean;
    siweHint?: string;
    siweButtonText?: string;
    /** SIWE expired hint text */
    siweExpiredText?: string;
    onEip712Complete?: () => void;
    onSiweComplete?: () => void;
    className?: string;
}

/**
 * Floating signature button component
 * 
 * Function:
 * - Display floating button in the middle right position
 * - Click the button to display/hide the signature component (EIP712 and/or SIWE)
 * - Signature component fixed on the right side
 * - Support displaying multiple signature requests at the same time
 */
const FloatSignatureButton: React.FC<FloatSignatureButtonProps> = ({
    eip712Requirement,
    needSiwe = false,
    eip712Title,
    eip712Hint,
    siweHint,
    isOpen = false,
    siweButtonText,
    siweExpiredText,
    onEip712Complete,
    onSiweComplete,
    className,
}) => {
    const [open, setOpen] = useState(isOpen);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleEip712Complete = () => {
        onEip712Complete?.();
    };

    const handleSiweComplete = () => {
        onSiweComplete?.();
    };

    // If there is no EIP712 requirement and no SIWE required, do not display the button
    const hasSignatureRequest = eip712Requirement || needSiwe;
    if (!hasSignatureRequest) {
        return null;
    }


    return (
        <>
            <FloatButtonV2 
                isActive={!open} 
                onClick={handleToggle} 
                className={className} 
            />
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        right: 80,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1000,
                        maxWidth: 400,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {needSiwe && (
                            <RequestSiwe
                                hint={siweHint}
                                buttonText={siweButtonText}
                                expiredText={siweExpiredText}
                                onComplete={handleSiweComplete}
                            />
                        )}
                        {eip712Requirement && (
                            <RequestEip712
                                requirement={eip712Requirement}
                                cardTitle={eip712Title}
                                cardHint={eip712Hint}
                                onComplete={handleEip712Complete}
                            />
                        )}
                    </Space>
                </div>
            )}
        </>
    );
};

export default FloatSignatureButton;