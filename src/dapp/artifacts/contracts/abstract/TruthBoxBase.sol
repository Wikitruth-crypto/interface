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


import {IUserId} from "../interfaces/IUserId.sol";
import {ISiweAuth} from "../interfaces/ISiweAuth.sol";
import {ITruthNFT} from "../interfaces/ITruthNFT.sol";
import {ITruthBox} from "../interfaces/ITruthBox.sol";
import {IFundManager} from "../interfaces/IFundManager.sol";
import {IExchange} from "../interfaces/IExchange.sol";
import {Error} from "../interfaces/interfaceError.sol";
import {IAddressManager} from "../interfaces/IAddressManager.sol";

// import "./library.sol";
import {Modifier} from "./Modifier.sol";
/**
 *  @notice TruthBoxBase
 * 
 */

contract TruthBoxBase is Modifier{

    // address internal ADMIN; 
    // address internal DAO;
    // IAddressManager internal ADDR_MANAGER;
    IUserId internal USER_ID;
    ISiweAuth internal SIWE_AUTH;
    ITruthNFT internal NFT;
    IExchange internal EXCHANGE;
    IFundManager internal FUND_MANAGER;

    uint8 internal _incrementRate; // 2.0 * 100

    // ==================================================================================================
    uint256 internal _nextBoxId;

    // ==================================================================================================
    constructor() Modifier() {
        // ADDR_MANAGER = IAddressManager(addrManager_);
        // _incrementRate = 200;
    }
    // ==================================================================================================

    // modifier onlyAdmin() {
    //     if (msg.sender != ADDR_MANAGER.admin()) revert NotAdmin();
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

    // modifier onlyDAO() {
    //     if (msg.sender != ADDR_MANAGER.dao()) revert NotDAO();
    //     _;
    // }

    // ==========================================================================================================
    function setAddress() external checkSetCaller {
        IAddressManager addrMgr = ADDR_MANAGER;

        address nft = addrMgr.truthNFT();
        address exchange = addrMgr.exchange();
        address fundManager = addrMgr.fundManager();
        // address dao = addrMgr.dao();
        address siwe = addrMgr.siweAuth();
        address userId = addrMgr.userId();

        if (nft != address(0) && nft != address(NFT)) {
            NFT = ITruthNFT(nft);
        }
        if (exchange != address(0) && exchange != address(EXCHANGE)) {
            EXCHANGE = IExchange(exchange);
        }
        if (fundManager != address(0) && fundManager != address(FUND_MANAGER)) {
            FUND_MANAGER = IFundManager(fundManager);
        }
        // if (dao != address(0) && dao != DAO) {
        //     DAO = dao;
        // }
        if (siwe != address(0) && siwe != address(SIWE_AUTH)) {
            SIWE_AUTH = ISiweAuth(siwe);
        }
        if (userId != address(0) && userId != address(USER_ID)) {
            USER_ID = IUserId(userId);
        }
    }

    /**
     * @dev Set the increment rate
     * @param rate_ The increment rate
     * Default: 200 (200%)
     */
    function setIncrementRate(uint8 rate_) external onlyDAO {
        if (rate_ == 0 || rate_ > 200) revert InvalidRate();
        _incrementRate = rate_;
    }

    // ==========================================================================================================
    //                                      Getter Functions
    // ==========================================================================================================

    function incrementRate() external view returns (uint8) {
        return _incrementRate;
    }

    function nextBoxId() external view returns (uint256) {
        return _nextBoxId;
    }

    /**
     * @dev Get user id
     * @param user_ The address of user
     * @return The user id
     */
    // function getUserId(address user_) external returns (uint256) {
    //     uint256 userId = USER_ID.getUserId(user_);
    //     return userId;
    // }

}