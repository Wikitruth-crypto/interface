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


// import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";
import {MultiDomainSiweAuth} from "./abstract/MultiDomainSiweAuth.sol";
import {IAddressManager} from "./interfaces/IAddressManager.sol";


contract SiweAuthWikiTruth is MultiDomainSiweAuth{

    // IAddressManager internal ADDR_MANAGER;

    
    // =======================================================================================================
    constructor(
        string memory primaryDomain, 
        string[] memory domains
    ) MultiDomainSiweAuth(primaryDomain, domains) {

        // ADDR_MANAGER = IAddressManager(addrManager_);
    }

    // =====================================================================================
    
    // =====================================================================================

    /**
     * @notice Public getMsgSender function
     * @param token Authentication token
     * @return address Returns the address of the authenticated user
     */
    function getMsgSender(bytes memory token)
        external
        view
        returns (address)
    {
        return authMsgSender(token);
    }

    /**
     * @notice Test revoke authentication token
     * @param token Authentication token
     *
     * Note: revokeAuthToken is not a traditional meaning of revocation,
     * It is a recording function, recording which tokens have been revoked, so they cannot be used again.
     * Normal state: the token hash is not in the _revokedAuthTokens mapping
     * Revoked state: the token hash is added to the _revokedAuthTokens mapping, and the value is true
     */
    function removeAuthToken(bytes32 token) external {
        return revokeAuthToken(token);
    }

    /**
     * @notice Test get statement
     * @param token Authentication token
     * @return statement Returns the statement
     *
     * Statement is the information that the user declares when logging in.
     * For example: I agree to the terms and authorize this specific action
     * 
     * This can also be ignored, because it is unrelated to encryption.
     */
    function getStatement(bytes memory token) 
        external 
        view 
        returns (string memory) 
    {
        return _getStatement(token);
    }

    /**
     * @notice Test get resources
     * @param token Authentication token
     * @return resources Returns the resources
     *
     * Different from statement, resource is the information that the user declares when logging in.
     * For example: https://example.com/api/resource1
     * 
     * This can also be ignored, because it is unrelated to encryption.
     */
    function getResources(bytes memory token) 
        external 
        view 
        returns (string[] memory) 
    {
        return _getResources(token);
    }

    /**
     * @notice Test statement verification
     * @param token Authentication token
     * @param expectedStatement Expected statement
     * @return If the statement matches, return true
     * 
     * If you need to control permissions in the contract, you can call this function.
     * For example:
     * 1. If you need to control permissions in the contract, you can call this function.
     */
    function testStatementVerification(bytes memory token, string calldata expectedStatement) 
        external 
        view 
        returns (bool) 
    {
        string memory actualStatement = _getStatement(token);
        if (keccak256(bytes(actualStatement)) == keccak256(bytes(expectedStatement))) {
            return true;
        }
        return false;
    }

    /**
     * @notice Test resource access permission
     * @param token Authentication token
     * @param resource Resource URI
     * @return If the token grants access to the specified resource, return true
     *
     * Note: testHasResourceAccess is not a traditional meaning of access permission,
     * It is a check function, checking if the token grants access to the specified resource.
     * Normal state: token grants access to the specified resource
     * Non-normal state: token does not grant access to the specified resource
     * Generally, resource can be built-in or parameter-passed.
     */
    function testHasResourceAccess(bytes memory token, string calldata resource) 
        external 
        view 
        returns (bool) 
    {
        string[] memory tokenResources = _getResources(token);
        for (uint256 i = 0; i < tokenResources.length; i++) {
            if (keccak256(bytes(tokenResources[i])) == keccak256(bytes(resource))) {
                return true;
            }
        }
        return false;
    }

}




