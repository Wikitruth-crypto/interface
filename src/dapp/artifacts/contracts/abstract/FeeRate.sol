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

// import "./openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


// import {IExchange} from "../interfaces/IExchange.sol";
// import {ITruthBox} from "../interfaces/ITruthBox.sol";
import {IAddressManager} from "../interfaces/IAddressManager.sol";
import {Modifier} from "./Modifier.sol";
// import "./ProxyUpgrade.sol";
import {Error} from "../interfaces/interfaceError.sol";

    
contract FeeRate is Modifier{

    event BuyerRefundRateAdded(uint256 boxId, uint8 rate);
    event DaoFeeRateAdded(uint256 boxId, uint8 rate);
    // =====================================================================================
    // IAddressManager internal ADDR_MANAGER;
    
    // rate / 1000 = %
    /**
     * @dev The official service fee rate
    */
    uint8 internal _serviceFeeRate; 
    /**
     * @dev The ecosystem participant reward rate
    */
    uint8 internal _helperRewardRate;

    // =====================================================================================
    constructor() Modifier() {
        
        // ADDR_MANAGER = IAddressManager(addrManager_);
        // _serviceFeeRate = 30; // 30
        // _helperRewardRate = 10; // 10
    }

    // =====================================================================================

    // modifier onlyDAO() {
    //     if (msg.sender != ADDR_MANAGER.dao()) revert NotDAO();
    //     _;
    // }

    // modifier onlyAdmin() {
    //     if (msg.sender != ADDR_MANAGER.admin()) revert NotAdmin();
    //     _;
    // }
    
    // =====================================================================================================

    // ==========================================================================================================

    /**
     * @dev Set service fee rate
     * @param Rate_ The service fee rate
     * Can be set to 0-50
     */
    function setServiceFeeRate(uint8 Rate_) external onlyDAO {
        if (Rate_ > 50) revert InvalidRate();
        _serviceFeeRate = Rate_;
    }
    
    /**
     * @dev Set helper reward rate
     * @param Rate_ The helper reward rate
     * Can be set to 0-30
     */
    function setHelperRewardRate(uint8 Rate_) external onlyDAO {
        if (Rate_ > 30) revert InvalidRate();
        _helperRewardRate = Rate_;
    }

    // ==========================================================================================================
    //                                         get fee rate
    // ==========================================================================================================

    // change name
    function helperRewardRate() external view returns(uint8) {
        return _helperRewardRate;
    }

    function serviceFeeRate() external view returns (uint8) {
        return _serviceFeeRate;
    }

}