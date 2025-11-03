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


import {Error} from "./interfaces/interfaceError.sol";
import {ISiweAuth} from "./interfaces/ISiweAuth.sol";
import {IAddressManager} from "./interfaces/IAddressManager.sol";

// import {ProxyUpgrade} from "./abstract/ProxyUpgrade.sol";
import {Modifier} from "./abstract/Modifier.sol";

/**
 * @title UserId
 * @dev This contract is used to get user id
 * In WikiTruth, use user ID instead of address in event, to avoid address being broadcast, protect user privacy.
 * At the same time, you can use the user ID to query user information, so as to realize the rapid lookup of the index protocol!
 */

contract UserId is Modifier{
    error Blacklisted();
    error NotBlacklisted();

    event Blacklist(address user, bool status);

    // =====================================================================================
    // IAddressManager internal ADDR_MANAGER;

    address internal TRUTH_BOX;
    address internal FUND_MANAGER;
    address internal EXCHANGE;
    address internal SIWE_AUTH;

    mapping(address => uint256) internal _userIds;
    mapping(address => bool) internal _blacklist;
    
    uint256 internal _currentUserId;
    
    // =======================================================================================================
    constructor( ) Modifier() {
        // ADDR_MANAGER = IAddressManager(addrManager_);
        // _currentUserId = 10000;
    }

    // =====================================================================================

    /**
     * @dev The admin is managed by the ProxyUpgrade contract
     * In the production environment, the modifier will be re-enabled
     */
    // modifier onlyAdmin() {
    //     if (msg.sender != ADDR_MANAGER.admin()) revert NotAdmin();
    //     _;
    // }

    // modifier onlyAdminDAO() {
    //     if (
    //         msg.sender != ADDR_MANAGER.dao() && 
    //         msg.sender != ADDR_MANAGER.admin()
    //     ) revert NotAdminOrDAO();
    //     _;
    // }

    // modifier checkSetCaller() {
    //     if (
    //         msg.sender != address(ADDR_MANAGER) &&
    //         msg.sender != ADDR_MANAGER.admin()
    //     ) {
    //         revert InvalidCaller();
    //     }
    //     _;
    // }

    function setAddress() external checkSetCaller {
        IAddressManager addrMgr = ADDR_MANAGER;

        address truthBox = addrMgr.truthBox();
        address exchange = addrMgr.exchange();
        address fundManager = addrMgr.fundManager();
        address siweAuth = addrMgr.siweAuth();

        if (truthBox != address(0) && truthBox != TRUTH_BOX){
            TRUTH_BOX = truthBox;
        }
        if (exchange != address(0) && exchange != EXCHANGE){
            EXCHANGE = exchange;
        }
        if (fundManager != address(0) && fundManager != FUND_MANAGER){
            FUND_MANAGER = fundManager;
        }
        if (siweAuth != address(0) && siweAuth != SIWE_AUTH){
            SIWE_AUTH = siweAuth;
        }
    }

    // =====================================================================================

    /**
     * @dev Get user id
     * @param user_ The address of user
     * Only callable by the contracts in the project (access)
     */
    function getUserId(address user_) external onlyProjectContract returns (uint256) {

        if (_blacklist[user_]) revert Blacklisted();
        // Get user ID
        uint256 userId = _userIds[user_];
        if (userId == 0) {
            unchecked {
                _currentUserId++;
            }
            _userIds[user_] = _currentUserId;
            return _currentUserId; // Return new allocated ID
        }
        return userId; // Return existing ID
    }

    /**
     * @dev Get my user id
     * @param token_ SIWE token
     */
    function myUserId(bytes memory token_) public view returns (uint256) {

        address sender = msg.sender;
        if (sender == address(0)) {
            sender = ISiweAuth(SIWE_AUTH).getMsgSender(token_);
        }
        if (_blacklist[sender]) revert Blacklisted();
        return _userIds[sender];
    }

    /**
     * @dev Get my user id
     * NOTE In sapphire, you need to comment, 
     * use the myUserId(bytes memory token_) function above
     */
    // function myUserId() public view returns (uint256) {
    //     address sender = msg.sender;
    //     if (_blacklist[sender]) revert Blacklisted();
    //     return _userIds[sender];
    // }

    // =====================================================================================

    //
    function addBlacklist(address user_) external onlyAdminDAO {
        if (_blacklist[user_]) revert Blacklisted();
        _blacklist[user_] = true;
        emit Blacklist(user_, true);
    }

    function removeBlacklist(address user_) external onlyAdminDAO {
        if (!_blacklist[user_]) revert NotBlacklisted();
        _blacklist[user_] = false;
        emit Blacklist(user_, false);
    }

    function isBlacklisted(address user_) external view returns (bool) {
        return _blacklist[user_];
    }


}
