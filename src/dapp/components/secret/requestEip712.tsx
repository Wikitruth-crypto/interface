import { useMemo, useCallback, useEffect } from 'react';
import { Card, Button, List, Typography, Alert, Space } from 'antd';
import { useAccount, useChainId } from 'wagmi';
import { useEIP712_ERC20secret } from '@/dapp/hooks/EIP712';
import { PermitType, type SignPermitParams } from '@/dapp/hooks/EIP712/types_ERC20secret';
import { useSecretStore } from '@/dapp/store/secretStore';

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

const getPermitLabel = (mode: PermitType): string => {
    switch (mode) {
        case PermitType.VIEW:
            return '查看授权';
        case PermitType.TRANSFER:
            return '转账授权';
        case PermitType.APPROVE:
            return '批准授权';
        default:
            return `授权类型 ${mode}`;
    }
};

export const RequestEip712: React.FC<RequestEip712Props> = ({
    requirements,
    chainId,
    address,
    className,
    cardTitle = '签名授权',
    cardHint = '为了完成后续操作，需要先完成以下 EIP-712 授权签名。',
    onComplete,
}) => {
    const { address: walletAddress } = useAccount();
    const activeChainId = useChainId();

    const targetAddress = address ?? (walletAddress as `0x${string}` | undefined);
    const targetChainId = chainId ?? activeChainId ?? undefined;

    const { signPermit, isLoading, error } = useEIP712_ERC20secret();
    const setEip712Permit = useSecretStore((state) => state.setEip712Permit);
    const secretPermits = useSecretStore(
        useCallback(
            (state) => {
                if (!targetAddress || targetChainId === undefined || targetChainId === null) {
                    return undefined;
                }
                return state.secrets[targetChainId]?.[targetAddress.toLowerCase()]?.eip712 ?? {};
            },
            [targetAddress, targetChainId]
        )
    );

    const pendingRequirements = useMemo(() => {
        if (!requirements.length) {
            return [];
        }
        if (!secretPermits || !targetAddress || targetChainId === undefined || targetChainId === null) {
            return requirements;
        }
        return requirements.filter((requirement) => {
            const typePermits = secretPermits[requirement.mode];
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
                existing.label === requirement.mode &&
                existing.spender.toLowerCase() === requirement.spender.toLowerCase() &&
                String(existing.amount) === String(requirement.amount)
            );
        });
    }, [requirements, secretPermits, targetAddress, targetChainId]);

    const handleSign = useCallback(async () => {
        if (!pendingRequirements.length || !targetAddress || targetChainId === undefined || targetChainId === null) {
            return;
        }

        const nextRequirement = pendingRequirements[0];
        const permit = await signPermit(nextRequirement);

        if (permit) {
            setEip712Permit(
                nextRequirement.mode,
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
        <Card className={className} title={cardTitle} bordered>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {cardHint}
                </Paragraph>

                <List
                    size="small"
                    dataSource={pendingRequirements}
                    renderItem={(item) => (
                        <List.Item key={item.id ?? `${item.mode}-${item.contractAddress}-${item.spender}`}>
                            <Space direction="vertical" size={2}>
                                <Text strong>{item.title ?? getPermitLabel(item.mode)}</Text>
                                {item.description ? (
                                    <Text type="secondary">{item.description}</Text>
                                ) : (
                                    <Text type="secondary">
                                        授权地址 {item.spender} 在 {item.contractAddress} 上执行 {getPermitLabel(item.mode)}
                                    </Text>
                                )}
                            </Space>
                        </List.Item>
                    )}
                />

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message="签名失败"
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
                    开始签名
                </Button>
            </Space>
        </Card>
    );
};

export default RequestEip712;
