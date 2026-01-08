import { useMemo, useCallback, useEffect } from 'react';
import { Button, Typography, Alert, Space } from 'antd';
import { useEIP712Permit } from '@dapp/hooks/EIP712/useEIP712Permit';
import { PermitType, type SignPermitParams } from '@dapp/hooks/EIP712/types_ERC20secret';
import { useSimpleSecretStore } from '@dapp/store/simpleSecretStore';
import { formatAddress } from '@dapp/utils/formatAddress';

const { Text, Paragraph } = Typography;

export interface Eip712Requirement extends SignPermitParams {
    id?: string;
    title?: string;
    description?: string;
}

export interface RequestEip712Props {
    requirement?: Eip712Requirement;
    className?: string;
    cardTitle?: string;
    cardHint?: string;
    onComplete?: () => void;
}

const getPermitLabel = (label: PermitType): string => {
    switch (label) {
        case PermitType.VIEW:
            return 'View';
        case PermitType.TRANSFER:
            return 'Transfer';
        case PermitType.APPROVE:
            return 'Approve';
        default:
            return `Label: ${label}`;
    }
};

export const RequestEip712: React.FC<RequestEip712Props> = ({
    requirement,
    className,
    cardTitle = 'Signature Authorization',
    cardHint = 'To complete the subsequent operations, you need to complete the following EIP-712 authorization signature.',
    onComplete,
}) => {
    const { getValidPermit, isExpired, isLoading, error } = useEIP712Permit();
    
    // Use zustand selector to subscribe to store changes, ensure responsive update
    // The underlying will automatically handle chainId and address
    const existingPermit = useSimpleSecretStore(
        useCallback(
            (state) => {
                if (!requirement) {
                    return null;
                }
                return state.getEip712Permit(
                    requirement.label,
                    requirement.spender,
                    requirement.contractAddress
                );
            },
            [requirement]
        )
    );

    // Check if a single requirement is satisfied
    const isSatisfied = useMemo(() => {
        if (!requirement) {
            return true;
        }

        if (!existingPermit) {
            return false;
        }

        // Check if it is expired
        if (isExpired(existingPermit)) {
            return false;
        }

        // Match based on mode, authorized object, and amount to avoid misjudgment
        return (
            existingPermit.label === requirement.label &&
            existingPermit.spender.toLowerCase() === requirement.spender.toLowerCase() &&
            String(existingPermit.amount) === String(requirement.amount)
        );
    }, [requirement, existingPermit, isExpired]);

    const handleSign = useCallback(async () => {
        if (!requirement) {
            return;
        }

        try {
            // Use getValidPermit to automatically handle get/generate/save
            // If it exists and is not expired, return; otherwise generate a new signature and save
            await getValidPermit(requirement);
        } catch (err) {
            // Error is handled by useEIP712Permit, here only log the error
            console.error('[RequestEip712] Failed to get valid permit:', err);
        }
    }, [requirement, getValidPermit]);

    useEffect(() => {
        if (isSatisfied) {
            onComplete?.();
        }
    }, [isSatisfied, onComplete]);

    if (!requirement || isSatisfied) {
        return null;
    }

    return (
        <Alert
            type="warning"
            showIcon
            message={cardTitle}
            description={
                <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 8 }}>
                    <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 13 }}>
                        {cardHint}
                    </Paragraph>

                    <div>
                        <Text strong>Type: {requirement.title ?? getPermitLabel(requirement.label)}</Text>
                        {requirement.description ? (
                            <div >
                                <Text type="secondary" style={{ fontSize: 13 }}>{requirement.description}</Text>
                            </div>
                        ) : (
                            <div >
                                <div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        Spender: {formatAddress(requirement.spender)}
                                    </Text>
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        Destination: {formatAddress(requirement.contractAddress)}
                                    </Text>
                                </div>
                                {requirement.label !== PermitType.VIEW && (
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Amount: {requirement.amount}</Text>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            message="Signature failed!"
                            description={error.message}
                            style={{ marginTop: 8 }}
                        />
                    )}

                    <Button
                        type="primary"
                        block
                        onClick={handleSign}
                        loading={isLoading}
                        disabled={!requirement}
                    >
                        Signature
                    </Button>
                </Space>
            }
            className={className}
            style={{ maxWidth: 400 }}
        />
    );
};

export default RequestEip712;
