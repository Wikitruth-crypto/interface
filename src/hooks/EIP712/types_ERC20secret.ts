
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

 */


/**
 * EIP712 permit type enum
 */
export enum PermitType {
    VIEW = 0, // balanceOfWithPermit, allowanceWithPermit
    TRANSFER = 1, // transferWithPermit
    APPROVE = 2, // approveWithPermit
}



/**
 * EIP712 signature structure
 */
export interface SignatureRSV {
    r: string;
    s: string;
    v: number;
}

/**
 * EIP712 permit structure
 */
export interface EIP712Permit {
    label: PermitType;
    owner: string; // owner of the token
    spender: string; // allowance, transfer, approve
    amount: bigint | string; // approve , transfer
    deadline: number;
    signature: SignatureRSV;
}

/**
 * EIP712 domain configuration
 * Note: The type definition must be compatible with viem's TypedDataDomain
 */
export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;  // Must be a hexadecimal string type with 0x prefix
}

/**
 * Signature request parameters
 */
export interface SignPermitParams {
    spender: string;
    amount: bigint | string;
    label: PermitType;
    contractAddress: string;
    domainName?: string;
    domainVersion?: string;
    customDeadline?: number;
}
