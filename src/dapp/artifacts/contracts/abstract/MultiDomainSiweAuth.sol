// SPDX-License-Identifier: GPL-2.0-or-later

/**
 *         ██╗    ██╗██╗██╗  ██╗██╗    ████████╗██████╗ ██╗   ██╗████████╗██╗  ██╗
 *         ██║    ██║██║██║ ██╔╝██║    ╚══██╔══╝██╔══██╗██║   ██║╚══██╔══╝██║  ██║
 *         ██║ █╗ ██║██║█████╔╝ ██║       ██║   ██████╔╝██║   ██║   ██║   ███████║
 *         ██║███╗██║██║██╔═██╗ ██║       ██║   ██╔══██╗██║   ██║   ██║   ██╔══██║
 *         ╚███╔███╔╝██║██║  ██╗██║       ██║   ██║  ██║╚██████╔╝   ██║   ██║  ██║
 *          ╚══╝╚══╝ ╚═╝╚═╝  ╚═╝╚═╝       ╚═╝   ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝   
 *
 *  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 *  ┃                        Website: https://wikitruth.eth.limo/                         ┃
 *  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 */

pragma solidity ^0.8.24;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";
import {SignatureRSV, A13e} from "@oasisprotocol/sapphire-contracts/contracts/auth/A13e.sol";
import {ParsedSiweMessage, SiweParser} from "@oasisprotocol/sapphire-contracts/contracts/SiweParser.sol";

import {Error} from "../interfaces/interfaceError.sol";
import {SiweAuthError} from "../interfaces/siweAuthError.sol";

/// @title AuthToken structure for SIWE-based authentication (Keep consistent with the official)
struct AuthToken {
    string domain; // [ scheme "://" ] domain.
    address userAddr;
    uint256 validUntil; // in Unix timestamp.
    string statement; // Human-readable statement from the SIWE message.
    string[] resources; // Resources this token grants access to.
}

/**
 * @title MultiDomainSiweAuth - 
 * Support for SIWE token verification with multiple domains
 * @dev Based on the Oasis official SiweAuth contract, extended to support SIWE authentication with multiple domains
 * 
 */
contract MultiDomainSiweAuth is Error, SiweAuthError, A13e {
    
    // =======================================================================================================
    // Event definition
    // =======================================================================================================
    
    /// @notice Domain added event
    event DomainAdded(string indexed domain);
    
    /// @notice Domain removed event
    event DomainRemoved(string indexed domain);
    
    /// @notice Main domain set event
    event PrimaryDomainSet(string indexed oldDomain, string indexed newDomain);
    
    /// @notice User login event
    event UserLogin(address indexed user, string indexed domain, uint256 expiry);
    
    /// @notice Session revoked event
    event SessionRevoked(address indexed user, bytes32 indexed tokenHash);

    // =======================================================================================================

    address internal _admin;
    
    /// @dev The supported domain list
    string[] internal _domains;
    
    /// @dev The mapping of domain to index (for quick lookup)
    mapping(string => uint256) internal _domainIndex;
    
    /// @dev The mapping of domain to validity
    mapping(string => bool) internal _validDomains;
    
    /// @dev The current main domain (for backward compatibility)
    string internal _primaryDomain;
    
    /// @dev The encryption key for the encrypted authentication token (Keep consistent with the official)
    bytes32 private _authTokenEncKey;
    
    /// @dev The default authentication token validity period, if no expiration time is provided (Keep consistent with the official)
    uint256 private constant DEFAULT_VALIDITY = 24 hours;
    

    
    // =======================================================================================================
    // Modifiers
    // =======================================================================================================
    
    modifier onlyAdmin() {
        if (msg.sender != _admin) revert NotAdmin();
        _;
    }
    
    modifier validDomain(string calldata domainName) {
        if (bytes(domainName).length == 0) revert EmptyDomain();
        if (!_validDomains[domainName]) revert InvalidDomain();
        _;
    }
    
    // =======================================================================================================
    // Constructor
    // =======================================================================================================
    
    /**
     * @notice Instantiate the contract for SIWE-based authentication, supporting multiple domains
     * @param primaryDomain The main domain associated with this contract
     * @param additionalDomains The additional supported domain list (can be empty)
     */
    constructor(string memory primaryDomain, string[] memory additionalDomains) {
        if (bytes(primaryDomain).length == 0) revert EmptyDomain();
        
        // Initialize the encryption key (Keep consistent with the official)
        _authTokenEncKey = bytes32(Sapphire.randomBytes(32, ""));
        
        _admin = msg.sender;
        _primaryDomain = primaryDomain;
        
        // Add the main domain to the domain list
        _domains.push(primaryDomain);
        _domainIndex[primaryDomain] = 0;
        _validDomains[primaryDomain] = true;
        emit DomainAdded(primaryDomain);
        
        // Add additional domains
        for (uint256 i = 0; i < additionalDomains.length; i++) {
            string memory domainName = additionalDomains[i];
            if (bytes(domainName).length > 0 && !_validDomains[domainName]) {
                _domains.push(domainName);
                _domainIndex[domainName] = _domains.length - 1;
                _validDomains[domainName] = true;
                emit DomainAdded(domainName);
            }
        }
    }
    
    // =======================================================================================================
    // Domain management functions
    // =======================================================================================================
    
    /**
     * @dev Add a new domain
     * @param domainName The domain to add
     */
    function addDomain(string calldata domainName) external onlyAdmin {
        if (bytes(domainName).length == 0) revert EmptyDomain();
        if (_validDomains[domainName]) revert DomainAlreadyExists();
        
        _domains.push(domainName);
        _domainIndex[domainName] = _domains.length - 1;
        _validDomains[domainName] = true;
        
        emit DomainAdded(domainName);
    }

    /**
     * @dev Remove a domain
     * @param domainName The domain to remove
     */
    function removeDomain(string calldata domainName) external onlyAdmin {
        if (!_validDomains[domainName]) revert DomainNotFound();
        if (keccak256(bytes(domainName)) == keccak256(bytes(_primaryDomain))) {
            revert InvalidDomain(); // Cannot remove the main domain
        }
        
        uint256 index = _domainIndex[domainName];
        uint256 lastIndex = _domains.length - 1;
        
        // If it is not the last element, use the last element to replace the current element
        if (index != lastIndex) {
            string memory lastDomain = _domains[lastIndex];
            _domains[index] = lastDomain;
            _domainIndex[lastDomain] = index;
        }
        
        // Remove the last element
        _domains.pop();
        delete _domainIndex[domainName];
        delete _validDomains[domainName];
        
        emit DomainRemoved(domainName);
    }
    
    /**
     * @dev Set the main domain
     * @param newPrimaryDomain The new main domain
     */
    function setPrimaryDomain(string calldata newPrimaryDomain) external onlyAdmin validDomain(newPrimaryDomain) {
        string memory oldDomain = _primaryDomain;
        _primaryDomain = newPrimaryDomain;
        
        emit PrimaryDomainSet(oldDomain, newPrimaryDomain);
    }
    
    // =======================================================================================================
    // SIWE authentication core functions
    // =======================================================================================================
    
    /**
     * @notice Use SIWE message and signature to login
     * @param siweMsg The signed SIWE message
     * @param sig The signature of the SIWE message
     * @return authToken_ The encrypted authentication token
     */
    function login(string calldata siweMsg, SignatureRSV calldata sig)
        external
        view
        override
        returns (bytes memory authToken_)
    {
        AuthToken memory authToken;

        // Derive the user address from the signature (Keep consistent with the official)
        bytes memory eip191msg = abi.encodePacked(
            "\x19Ethereum Signed Message:\n",
            Strings.toString(bytes(siweMsg).length),
            siweMsg
        );
        address addr = ecrecover(
            keccak256(eip191msg),
            uint8(sig.v),
            sig.r,
            sig.s
        );
        authToken.userAddr = addr;

        // Parse the SIWE message (Use the official parser)
        ParsedSiweMessage memory p = SiweParser.parseSiweMsg(bytes(siweMsg));

        // Verify the chain ID
        if (p.chainId != block.chainid) {
            revert SiweAuth_ChainIdMismatch();
        }

        // Verify the domain (check if it is in the supported domain list)
        string memory messageDomain = string(p.schemeDomain);
        if (!_validDomains[messageDomain]) {
            revert SiweAuth_DomainMismatch();
        }
        authToken.domain = messageDomain;

        // Verify the address matching
        if (p.addr != addr) {
            revert SiweAuth_AddressMismatch();
        }

        // Verify the NotBefore time
        if (
            p.notBefore.length != 0 &&
            block.timestamp <= SiweParser.timestampFromIso(p.notBefore)
        ) {
            revert SiweAuth_NotBeforeInFuture();
        }

        // Set the expiration time
        if (p.expirationTime.length != 0) {
            // Calculate the expected block number of the expiration time
            uint256 expirationTime = SiweParser.timestampFromIso(
                p.expirationTime
            );
            authToken.validUntil = expirationTime;
        } else {
            // Otherwise, use the default validity period
            authToken.validUntil = block.timestamp + DEFAULT_VALIDITY;
        }
        if (block.timestamp >= authToken.validUntil) {
            revert SiweAuth_Expired();
        }

        // Store the statement in the SIWE message
        authToken.statement = string(p.statement);

        // Store the resources in the SIWE message
        authToken.resources = new string[](p.resources.length);
        for (uint256 i = 0; i < p.resources.length; i++) {
            authToken.resources[i] = string(p.resources[i]);
        }

        // Encrypt and return the token (Keep consistent with the official)
        bytes memory encryptedToken = Sapphire.encrypt(
            _authTokenEncKey,
            0,
            abi.encode(authToken),
            ""
        );
        return encryptedToken;
    }
    
    /**
     * @notice Internal function: get the authentication address from the token (bytes calldata version)
     * @param token The authentication token
     * @return The authentication user address or zero address (if the token is empty)
     */
    function authMsgSender(bytes memory token)
        internal
        view
        virtual
        override
        checkRevokedAuthToken(token)
        returns (address)
    {
        if (token.length == 0) {
            return address(0);
        }

        AuthToken memory authToken = _decodeAndValidateToken(token);
        return authToken.userAddr;
    }

    /**
     * @notice Get the statement from the authentication token
     * @param token The authentication token
     * @return The statement string in the SIWE message
     */
    function _getStatement(bytes memory token)
        internal
        view
        checkRevokedAuthToken(token)
        returns (string memory)
    {
        if (token.length == 0) {
            return "";
        }

        AuthToken memory authToken = _decodeAndValidateToken(token);
        return authToken.statement;
    }

    /**
     * @notice Get all resources from the authentication token
     * @param token The authentication token
     * @return The resources URI array granted access to the token
     */
    function _getResources(bytes memory token)
        internal
        view
        checkRevokedAuthToken(token)
        returns (string[] memory)
    {
        if (token.length == 0) {
            return new string[](0);
        }

        AuthToken memory authToken = _decodeAndValidateToken(token);
        return authToken.resources;
    }

    /**
     * @notice Helper function: decrypt, decode and validate the token
     * @dev Execute the token decoding and domain verification
     * @param token The authentication token
     * @return The decoded and validated AuthToken structure
     */
    function _decodeAndValidateToken(bytes memory token)
        internal
        view
        virtual
        returns (AuthToken memory)
    {
        bytes memory authTokenEncoded = Sapphire.decrypt(
            _authTokenEncKey,
            0,
            token,
            ""
        );
        AuthToken memory authToken = abi.decode(authTokenEncoded, (AuthToken));

        // Verify the domain (check if it is in the supported domain list)
        if (!_validDomains[authToken.domain]) {
            revert SiweAuth_DomainMismatch();
        }

        // Verify the expiration time
        if (authToken.validUntil < block.timestamp) {
            revert SiweAuth_Expired();
        }

        return authToken;
    }
    
    // =======================================================================================================
    // Query functions
    // =======================================================================================================
    /**
     * @notice Return the domain associated with the dApp (return the main domain, keep backward compatibility)
     * @return The domain string
     */
    function domain() public view returns (string memory) {
        return _primaryDomain;
    }
    /**
     * @dev Get all supported domains
     * @return The domain array
     */
    function allDomains() external view returns (string[] memory) {
        return _domains;
    }
    
    /**
     * @dev Check if the domain is valid
     * @param domainToCheck The domain to check
     * @return Whether the domain is valid
     */
    function isDomainValid(string calldata domainToCheck) external view returns (bool) {
        return _validDomains[domainToCheck];
    }
    
    /**
     * @dev Get the domain count
     * @return The domain count
     */
    function domainCount() external view returns (uint256) {
        return _domains.length;
    }
    
    /**
     * @dev Get the domain by index
     * @param index The index
     * @return The domain
     */
    function domainByIndex(uint256 index) external view returns (string memory) {
        if(index >= _domains.length) revert IndexOutOfBounds();
        return _domains[index];
    }
    
    /**
     * @dev Get the admin address
     * @return The admin address
     */
    function admin() external view returns (address) {
        return _admin;
    }
    
    /**
     * @dev Set the new admin
     * @param newAdmin The new admin address
     */
    function setAdmin(address newAdmin) external onlyAdmin {
        if(newAdmin == address(0)) revert InvalidAddress();
        _admin = newAdmin;
    }
    

    // =======================================================================================================
    /**
     * @dev Check if the session is valid
     * @param token The authentication token
     * @return Whether the session is valid
     */
    function isSessionValid(bytes memory token) external view returns (bool) {
        if (token.length == 0) {
            return false;
        }
        try this.decodeAndValidateTokenPublic(token) returns (AuthToken memory) {
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * @dev Public token decoding and validation function (for external call)
     * @param token The authentication token
     * @return The decoded and validated AuthToken structure
     */
    function decodeAndValidateTokenPublic(bytes memory token) external view returns (AuthToken memory) {
        return _decodeAndValidateToken(token);
    }
}




