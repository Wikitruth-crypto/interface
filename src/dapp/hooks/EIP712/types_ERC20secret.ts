
/**
 * 
 * // EIP-712 domain parameters
 * 
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 public immutable DOMAIN_SEPARATOR;

    bytes32 public constant EIP_PERMIT_TYPEHASH = keccak256(
        "EIP712Permit(uint8 label,address owner,address spender,uint256 amount,uint256 deadline)"
    );
    
    enum PermitLabel { VIEW, TRANSFER, APPROVE }

    struct EIP712Permit {
        PermitLabel label;
        address owner;
        address spender;
        uint256 amount;
        uint256 deadline;
        SignatureRSV signature;
    }

    // function
    
 */


/**
 * EIP712 许可类型枚举
 */
export enum PermitType {
    VIEW = 0,
    TRANSFER = 1,
    APPROVE = 2
}



/**
 * EIP712 签名结构
 */
export interface SignatureRSV {
    r: string;
    s: string;
    v: number;
}

/**
 * EIP712 许可结构
 */
export interface EIP712Permit {
    label: PermitType;
    owner: string;
    spender: string;
    amount: bigint | string;
    deadline: number;
    signature: SignatureRSV;
}

/**
 * EIP712 域配置
 * 注意：类型定义必须与 viem 的 TypedDataDomain 兼容
 */
export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;  // 必须是带 0x 前缀的十六进制字符串类型
}

/**
 * 签名请求参数
 */
export interface SignPermitParams {
    spender: string;
    amount: bigint | number | string;
    mode: PermitType;
    contractAddress: string;
    domainName?: string;
    domainVersion?: string;
    customDeadline?: number;
}
