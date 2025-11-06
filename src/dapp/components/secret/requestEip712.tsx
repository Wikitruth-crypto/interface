import { useMemo, useCallback, useEffect } from 'react';
import { Button, Typography, Alert, Space } from 'antd';
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
    requirement?: Eip712Requirement;
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

/**
 * 格式化地址显示，省略中间部分
 * @param address 地址字符串
 * @param startLength 开头显示的长度（默认6）
 * @param endLength 结尾显示的长度（默认4）
 * @returns 格式化后的地址，如 "0x1234...5678"
 */
const formatAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
    if (!address || address.length <= startLength + endLength) {
        return address;
    }
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export const RequestEip712: React.FC<RequestEip712Props> = ({
    requirement,
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

    // 检查单个 requirement 是否已满足
    const isSatisfied = useMemo(() => {
        if (!requirement) {
            return true;
        }
        if (!permitsByType || !targetAddress || targetChainId === undefined || targetChainId === null) {
            return false;
        }

        const typePermits = permitsByType[requirement.label];
        if (!typePermits) {
            return false;
        }

        const spenderKey = requirement.spender.toLowerCase();
        const existing = typePermits[spenderKey];
        if (!existing) {
            return false;
        }

        const deadline = typeof existing.deadline === 'string'
            ? Number(existing.deadline)
            : existing.deadline;
        if (!deadline || Number.isNaN(deadline) || deadline <= Math.floor(Date.now() / 1000)) {
            return false;
        }

        // 基于模式、授权对象以及金额进行匹配，避免误判
        return (
            existing.label === requirement.label &&
            existing.spender.toLowerCase() === requirement.spender.toLowerCase() &&
            String(existing.amount) === String(requirement.amount)
        );
    }, [requirement, permitsByType, targetAddress, targetChainId]);

    const handleSign = useCallback(async () => {
        if (!requirement || !targetAddress || targetChainId === undefined || targetChainId === null) {
            return;
        }

        const permit = await signPermit(requirement);

        if (permit) {
            setEip712Permit(
                requirement.label,
                permit.spender,
                permit,
                targetChainId,
                targetAddress
            );
        }
    }, [requirement, signPermit, setEip712Permit, targetChainId, targetAddress]);

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
                        disabled={!targetAddress || targetChainId === undefined || targetChainId === null}
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
