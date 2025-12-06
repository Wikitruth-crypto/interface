// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.24;

import {IWROSE} from "../interfaceERC20/IWROSE.sol";
// import {IERC20add} from "./interfaceERC20/IERC20add.sol";
// import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

import {SignatureRSV} from '@oasisprotocol/sapphire-contracts/contracts/EthereumUtils.sol';
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

import {ERC20SecretError} from "../interfaceERC20/ERC20SecretError.sol";

contract WROSEsecret is Context, IWROSE, IERC20Errors, ERC20SecretError, ReentrancyGuard {
    // encrypt related
    bytes32 private immutable _globalNonce;
    mapping(address => bytes) internal _encryptedBalances;
    // temporary add plaintext storage for debugging
    // mapping(address => uint256) internal _debugBalances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // WROSE token contract (for wrap/unwrap)
    IWROSE public immutable underlyingToken;
    
    // EIP-712 domain parameters
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 public immutable DOMAIN_SEPARATOR;

    bytes32 public constant EIP_PERMIT_TYPEHASH = keccak256(
        "EIP712Permit(uint8 label,address owner,address spender,uint256 amount,uint256 deadline)"
    );
    
    // security mechanism
    mapping(bytes32 => bool) private _usedSignatures;

    // prevent receive function interference when withdrawing
    bool private _withdrawing;
    
    
    // ==================== event definition ====================
    // note: we don't emit the standard Transfer and Approval events for privacy protection
    
    // ==================== struct definition ====================
    enum PermitLabel { VIEW, TRANSFER, APPROVE }

    struct EIP712Permit {
        PermitLabel label;
        address owner;
        address spender;
        uint256 amount;
        uint256 deadline;
        SignatureRSV signature;
    }
    
    // ==================== modifiers ====================
    
    modifier uniqueSignature(SignatureRSV memory signature) {
        bytes32 sigHash = _getHash(signature);
        if(_usedSignatures[sigHash]) revert SignatureUsed();
        _;
        _usedSignatures[sigHash] = true;
    }
    
    modifier validDeadline(uint256 deadline) {
        if(block.timestamp > deadline) revert ExpiredDeadline();
        _;
    }
    
    // ==================== constructor ====================
    
    constructor(
        address underlyingToken_
    ) {
        underlyingToken = IWROSE(underlyingToken_);

        // generate global encrypt nonce
        _globalNonce = bytes32(Sapphire.randomBytes(32, ""));
        
        // initialize EIP-712 domain separator
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            keccak256("Secret ROSE Token"),
            keccak256("1"),
            block.chainid,
            address(this)
        ));
    }
    
    // ==================== ERC20 standard interface implementation ====================
    
    function name() public view virtual returns (string memory) {
        return "Secret ROSE Token";
    }
    
    function symbol() public view virtual returns (string memory) {
        return "ROSE.S";
    }
    
    function decimals() public view virtual returns (uint8) {
        return underlyingToken.decimals();
    }
    
    function totalSupply() public view virtual returns (uint256) {
        return underlyingToken.balanceOf(address(this));
    }

    // normal data query, only view own balance.
    // only allow view own balance, if query is not own address, return 0 (privacy protection)
    function balanceOf(address account) public view virtual returns (uint256) {
        if (account != _msgSender()) {
            return 0;
        }
        return _decryptBalance(account);
    }
    // query allowance, only view own allowance.
    // only allow view own allowance, if query is not own address, return 0 (privacy protection)
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        if (owner != _msgSender() && spender != _msgSender()) {
            return 0;
        }
        return _allowances[owner][spender];
    }
    
    // ==================== Excuate function ====================

    function transfer(address to, uint256 value) public virtual returns (bool) {
        _transfer(_msgSender(), to, value);
        return true;
    }

    function approve(address spender, uint256 value) public virtual returns (bool) {
        _approve(_msgSender(), spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        _spendAllowance(from, _msgSender(), value);
        _transfer(from, to, value);
        return true;
    }
    
    // ==================== privacy encrypt function ====================
    
    function _encryptBalance(uint256 balance) internal view returns (bytes memory) {

        bytes memory data = abi.encodePacked(balance);
        return Sapphire.encrypt(
            bytes32(0),
            _globalNonce,
            data,
            ""
        );
    }
    
    function _decryptBalance(address user) internal view returns (uint256) {
        bytes memory data = _encryptedBalances[user];
        if (data.length == 0) {
            return 0;
        }

        bytes memory decryptedData = Sapphire.decrypt(
            bytes32(0),
            _globalNonce,
            data,
            ""
        );

        return abi.decode(decryptedData, (uint256));
    }
    
    function _setEncryptedBalance(address user, uint256 balance) internal {
        _encryptedBalances[user] = _encryptBalance(balance);
        // temporary add plaintext storage for debugging
        // _debugBalances[user] = balance;
    }
    
    // ==================== core transfer logic ====================
    
    function _transfer(address from, address to, uint256 value) internal {
        
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        
        uint256 fromBalance = _decryptBalance(from);
        if (fromBalance < value) {
            revert ERC20InsufficientBalance(from, fromBalance, value);
        }
        
        uint256 toBalance = _decryptBalance(to);
        
        _setEncryptedBalance(from, fromBalance - value);
        _setEncryptedBalance(to, toBalance + value);
        
        // note: we don't emit the Transfer event for privacy protection

    }
    
    function _approve(address owner, address spender, uint256 value) internal {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        
        emit Approval(address(0), spender, value);
    }
    
    function _spendAllowance(address owner, address spender, uint256 value) internal {
        uint256 currentAllowance = _allowances[owner][spender];
        if (currentAllowance < type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value);
            }
        }
    }
    
    // ==================== EIP-712 signature verification ====================
    
    function _verifySignature(
        bytes32 structHash,
        address owner,
        SignatureRSV memory rsv
    ) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            structHash
        ));
        
        return owner == ecrecover(digest, uint8(rsv.v), rsv.r, rsv.s);
    }

    function _verifyPermit(
        EIP712Permit memory permit,
        PermitLabel label_
    ) internal view validDeadline(permit.deadline) returns (bool) {
        if(label_ != permit.label) revert InvalidPermitLabel();
        if(permit.label == PermitLabel.VIEW) {
            if(permit.amount != 0) revert InvalidPermitAmount();
        }

        bytes32 structHash = keccak256(abi.encode(
            EIP_PERMIT_TYPEHASH,
            permit.label,
            permit.owner,
            permit.spender,
            permit.amount,
            permit.deadline
        ));
        
        return _verifySignature(structHash, permit.owner, permit.signature);
    }
    
    // ==================== signature authorization function ====================
    function balanceOfWithPermit(
        EIP712Permit memory permit
    ) external view returns (uint256) {
        if (!_verifyPermit(permit, PermitLabel.VIEW)) revert EIPError();
        
        return _decryptBalance(permit.owner);
    }

    function allowanceWithPermit(
        EIP712Permit memory permit
    ) external view returns (uint256) {
        if (!_verifyPermit(permit, PermitLabel.VIEW)) revert EIPError();
        return _allowances[permit.owner][permit.spender];
    }
    
    function transferWithPermit(
        EIP712Permit memory permit
    ) external 
        nonReentrant 
        uniqueSignature(permit.signature)
    {
        _checkSignatureUsed(permit.signature);
        if (!_verifyPermit(permit, PermitLabel.TRANSFER)) revert EIPError();
        
        _transfer(permit.owner, permit.spender, permit.amount);
    }
    
    function approveWithPermit(
        EIP712Permit memory permit
    ) external 
        nonReentrant 
        uniqueSignature(permit.signature)
    {
        _checkSignatureUsed(permit.signature);
        if (!_verifyPermit(permit, PermitLabel.APPROVE)) revert EIPError();
        
        _approve(permit.owner, permit.spender, permit.amount);
    }
    
    // ==================== Wrap/Unwrap function ====================
    
    function wrap(uint256 amount) external nonReentrant {
        if(amount == 0) revert ZeroAmount();
        
        // transfer underlying ERC20 token to contract
        underlyingToken.transferFrom(msg.sender, address(this), amount);
        
        // increase user's privacy token balance
        uint256 currentBalance = _decryptBalance(msg.sender);
        _setEncryptedBalance(msg.sender, currentBalance + amount);

        emit Transfer(address(0), msg.sender, amount);
    }
    
    function unwrap(uint256 amount) external nonReentrant {
        if(amount == 0) revert ZeroAmount();
        
        uint256 currentBalance = _decryptBalance(msg.sender);
        if(currentBalance < amount) revert InsufficientBalance();
        
        _setEncryptedBalance(msg.sender, currentBalance - amount);
        underlyingToken.transfer(msg.sender, amount);

        emit Transfer(msg.sender, address(0), amount);
    }

    // ==================== native ROSE token wrap function ====================
    
    /**
     * @dev deposit native ROSE token, first convert to WROSE, then get the same amount of privacy token
     */
    function deposit() external payable nonReentrant {
        _deposit();
    }

    /**
     * @dev withdraw native ROSE token, first unwrap from WROSE, then transfer to user
     * @param amount the amount of ROSE token to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        if(amount == 0) revert ZeroAmount();
        
        uint256 currentBalance = _decryptBalance(msg.sender);
        if(currentBalance < amount) revert InsufficientBalance();

        _withdrawing = true;
        _setEncryptedBalance(msg.sender, currentBalance - amount);
        // withdraw underlying ERC20 token
        underlyingToken.withdraw(amount);
        
        payable(msg.sender).transfer(amount);

        _withdrawing = false;
        emit Transfer(msg.sender, address(0), amount);
    }

    /**
     * @dev receive function for native ROSE token
     */
    receive() external payable {
        // if withdrawing, don't trigger deposit logic
        if (!_withdrawing) {
            _deposit();
        }
    }

    /**
     * @dev internal deposit function: first convert native ROSE to WROSE, then increase privacy token balance
     */
    function _deposit() internal {
        if(msg.value == 0) revert ZeroAmount();
        
        // convert native ROSE to WROSE token
        underlyingToken.deposit{value: msg.value}();
        
        uint256 currentBalance = _decryptBalance(msg.sender);
        _setEncryptedBalance(msg.sender, currentBalance + msg.value);
        
        emit Transfer(address(0), msg.sender, msg.value);
    }
    

    // ==================== utility function ====================
    
    // check if signature is used
    function isSignatureUsed(SignatureRSV memory signature) external view returns (bool) {
        return _isSignatureUsed(signature);
    }

    function _getHash(SignatureRSV memory signature) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(signature.r, signature.s, signature.v));
    }

    function _isSignatureUsed(SignatureRSV memory signature) internal view returns (bool) {
        bytes32 sigHash = _getHash(signature);
        return _usedSignatures[sigHash];
    }

    function _checkSignatureUsed(SignatureRSV memory signature) internal view returns (bool) {
        bool isUsed = _isSignatureUsed(signature);
        if(isUsed) revert InvalidSignature();
        return isUsed;
    }

    // ==================== debug function ====================

    // function getGlobalNonce() external view returns (bytes32) {
    //     return _globalNonce;
    // }
    
    // function getEncryptedBalanceRaw(address user) external view returns (bytes memory) {
    //     return _encryptedBalances[user];
    // }

    // function getDecryptBalance(address user) external view returns (uint256) {
    //     return _decryptBalance(user);
    // }
    
    // function getDebugBalance(address user) external view returns (uint256) {
    //     return _debugBalances[user];
    // }

    // function getAllowance(address owner, address spender) public view virtual returns (uint256) {
    //     return _allowances[owner][spender];
    // }
}
