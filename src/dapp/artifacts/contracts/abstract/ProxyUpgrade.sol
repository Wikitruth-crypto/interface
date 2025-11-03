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


import "../library/StorageSlot.sol";
import {Error} from "../interfaces/interfaceError.sol";


/**
 * @title ProxyUpgrade
 * @dev Proxy upgrade contract
 * Used to manage the upgrade permissions and operations of the upgradeable contracts
 * Support the upgrade management function of the Oasis Sapphire privacy network
 * 
 * The upgradeable contracts are only used in the test environment, for easy upgrade of the contract and testing,
 * The upgradeable contracts are not used in the production environment
 */

contract ProxyUpgrade is Error {
    
    // =======================================================================================================

    bytes32 internal constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 internal constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    // =====================================================================================

    constructor() {
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = msg.sender;
    }

    function implementation() public view returns (address) {
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    function upgrade(address newImplementation_) external onlyAdmin {
        if (newImplementation_.code.length == 0) revert InvalidImplementation();
        StorageSlot
            .getAddressSlot(IMPLEMENTATION_SLOT)
            .value = newImplementation_;
    }

    function admin() public view returns (address) {
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    function setAdmin(address newAdmin_) public onlyAdmin {
        if (newAdmin_ == address(0)) revert ZeroAddress();
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = newAdmin_;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin()) revert NotAdmin();
        _;
    }

}



