import { useMemo, useCallback, useEffect } from 'react';
import { Card, Button, List, Typography, Alert, Space } from 'antd';
import { useAccount, useChainId } from 'wagmi';
import { useEIP712_ERC20secret } from '@/dapp/hooks/EIP712';
import { PermitType, type SignPermitParams } from '@/dapp/hooks/EIP712/types_ERC20secret';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';

const { Text, Paragraph } = Typography;

export interface Eip712Requirement extends SignPermitParams {
    id?: string;
    title?: string;
    description?: string;
}

export interface RequestEip712Props {
    requirements: Eip712Requirement[];
    chainId?: number;
    address?: `0x${string}`;
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
    requirements,
    chainId,
    address,
    className,
    cardTitle = 'Signature Authorization',
    cardHint = 'To complete the subsequent operations, you need to complete the following EIP-712 authorization signature.',
    onComplete,
}) => {
    const { address: walletAddress } = useAccount();
    const activeChainId = useChainId();

    const targetAddress = address ?? (walletAddress as `0x${string}` | undefined);
    const targetChainId = chainId ?? activeChainId ?? undefined;

    const { signPermit, isLoading, error } = useEIP712_ERC20secret();
    const setEip712Permit = useSimpleSecretStore((state) => state.setEip712Permit);
    const permitsByType = useSimpleSecretStore(
        useCallback(
            (state) => {
                if (!targetAddress || targetChainId == null) {
                    return undefined;
                }
                return state.getAccountPermits(targetChainId, targetAddress);
            },
            [targetAddress, targetChainId]
        )
    );

    const pendingRequirements = useMemo(() => {
        if (!requirements.length) {
            return [];
        }
        if (!permitsByType || !targetAddress || targetChainId === undefined || targetChainId === null) {
            return requirements;
        }
        return requirements.filter((requirement) => {
            const typePermits = permitsByType[requirement.label];
            if (!typePermits) {
                return true;
            }

            const spenderKey = requirement.spender.toLowerCase();
            const existing = typePermits[spenderKey];
            if (!existing) {
                return true;
            }

            const deadline = typeof existing.deadline === 'string'
                ? Number(existing.deadline)
                : existing.deadline;
            if (!deadline || Number.isNaN(deadline) || deadline <= Math.floor(Date.now() / 1000)) {
                return true;
            }

            // 基于模式、授权对象以及金额进行匹配，避免误判
            return !(
                existing.label === requirement.label &&
                existing.spender.toLowerCase() === requirement.spender.toLowerCase() &&
                String(existing.amount) === String(requirement.amount)
            );
        });
    }, [requirements, targetAddress, targetChainId]);

    const handleSign = useCallback(async () => {
        if (!pendingRequirements.length || !targetAddress || targetChainId === undefined || targetChainId === null) {
            return;
        }

        const nextRequirement = pendingRequirements[0];
        const permit = await signPermit(nextRequirement);

        if (permit) {
            setEip712Permit(
                nextRequirement.label,
                permit.spender,
                permit,
                targetChainId,
                targetAddress
            );
        }
    }, [pendingRequirements, signPermit, setEip712Permit, targetChainId, targetAddress]);

    if (!requirements.length) {
        return null;
    }

    const allSatisfied = pendingRequirements.length === 0;

    useEffect(() => {
        if (allSatisfied) {
            onComplete?.();
        }
    }, [allSatisfied, onComplete]);

    if (allSatisfied) {
        return null;
    }

    return (
        <Card className={className} title={cardTitle}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {cardHint}
                </Paragraph>

                <List
                    size="small"
                    dataSource={pendingRequirements}
                    renderItem={(item) => (
                        <List.Item key={item.id ?? `${item.label}-${item.contractAddress}-${item.spender}`}>
                            <Space direction="vertical" size={2}>
                                <Text strong>{item.title ?? getPermitLabel(item.label)}</Text>
                                {item.description ? (
                                    <Text type="secondary">{item.description}</Text>
                                ) : (
                                    <div>
                                        <Text type="secondary">Spender: {item.spender} </Text>
                                        <Text type="secondary">Destination: {item.contractAddress} </Text>
                                        <Text type="secondary">Label: {getPermitLabel(item.label)}</Text>
                                        {item.label !== PermitType.VIEW && <Text type="secondary">Amount: {item.amount}</Text>}
                                    </div>
                                )}
                            </Space>
                        </List.Item>
                    )}
                />

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message="Signature failed!"
                        description={error.message}
                    />
                )}

                <Button
                    type="primary"
                    block
                    onClick={handleSign}
                    loading={isLoading}
                    disabled={!targetAddress || targetChainId === undefined || targetChainId === null}
                >
                    Signature
                </Button>
            </Space>
        </Card>
    );
};

export default RequestEip712;
