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


import {IAddressManager} from "../interfaces/IAddressManager.sol";

import {ProxyUpgrade} from "./ProxyUpgrade.sol";

/**
 * @title Modifier
 * @dev This contract is used to manage modifiers
 */

contract Modifier is ProxyUpgrade{

    IAddressManager internal ADDR_MANAGER;

    // =======================================================================================================
    constructor() {
        // ADDR_MANAGER = IAddressManager(addrManager_);
    }

    function setAddressManager(address addrManager_) external onlyAdmin {
        ADDR_MANAGER = IAddressManager(addrManager_);
    }

    // =====================================================================================

    /**
     * @dev The admin is managed by the ProxyUpgrade contract
     * The modifier will be re-enabled in the production environment
     */
    // modifier onlyAdmin() {
    //     if (msg.sender != ADDR_MANAGER.admin()) revert NotAdmin();
    //     _;
    // }

    modifier onlyDAO() {
        if (msg.sender != ADDR_MANAGER.dao()) revert NotDAO();
        _;
    }

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

    modifier onlyProjectContract() {
        if (!ADDR_MANAGER.isProjectContract(msg.sender)) {
            revert InvalidCaller();
        }
        _;
    }

    // =====================================================================================

    
    modifier onlyAdminDAO() {
        if (
            msg.sender != ADDR_MANAGER.dao() && 
            msg.sender != admin()
        ) revert NotAdminOrDAO();
        _;
    }

    modifier checkSetCaller() {
        if (
            msg.sender != address(ADDR_MANAGER) &&
            msg.sender != admin()
        ) {
            revert InvalidCaller();
        }
        _;
    }


}