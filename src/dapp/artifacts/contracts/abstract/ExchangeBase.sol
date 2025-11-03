// SPDX-License-Identifier: GPL-2.0-or-later
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/ERC721.sol)

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


// import "@openzeppelin/contracts/utils/Context.sol";

import {IUserId} from "../interfaces/IUserId.sol";
import {ISiweAuth} from "../interfaces/ISiweAuth.sol";
import {ITruthNFT} from "../interfaces/ITruthNFT.sol";
import {ITruthBox} from "../interfaces/ITruthBox.sol";
import {IFundManager} from "../interfaces/IFundManager.sol";
import {IExchange} from "../interfaces/IExchange.sol";
import {Error} from "../interfaces/interfaceError.sol";
import {IAddressManager} from "../interfaces/IAddressManager.sol";

// import "../ProxyUpgrade.sol";
import {Error} from "../interfaces/interfaceError.sol";
import {Modifier} from "./Modifier.sol";


/**
 *  @notice ExchangeBase
 * 
 */

contract ExchangeBase is Modifier{

    // IAddressManager internal ADDR_MANAGER;

    ITruthBox internal TRUTH_BOX; 
    IFundManager internal FUND_MANAGER; 
    IUserId internal USER_ID;
    // ISiweAuth internal SIWE_AUTH;

    uint256 internal _refundRequestPeriod;
    uint256 internal _refundReviewPeriod; 

    uint8 internal _bidIncrementRate; 

    // ========================================================================================================

    constructor () Modifier() {

        // _bidIncrementRate = 110;
        // _refundRequestPeriod = 7 days;
        // _refundReviewPeriod = 15 days;
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

    // modifier checkSetCaller() {
    //     if (
    //         msg.sender != address(ADDR_MANAGER) &&
    //         msg.sender != ADDR_MANAGER.admin()
    //     ) {
    //         revert InvalidCaller();
    //     }
    //     _;
    // }
    // =====================================================================================
    //                                      Basic Parameter Settings
    // =====================================================================================

    function setAddress() external checkSetCaller {
        IAddressManager addrMgr = ADDR_MANAGER;

        address truthBox = addrMgr.truthBox();
        address fundM = addrMgr.fundManager();
        address userId = addrMgr.userId();

        if (truthBox != address(0) && truthBox != address(TRUTH_BOX)) {
            TRUTH_BOX = ITruthBox(truthBox);
        }
        if (fundM != address(0) && fundM != address(FUND_MANAGER)) {
            FUND_MANAGER = IFundManager(fundM);
        }
        if(userId != address(0) && userId != address(USER_ID)) {
            USER_ID = IUserId(userId);
        }
    }

    // 7~15  || 1~7
    function setRefundRequestPeriod(uint256 period_) external onlyDAO {
        if (period_ < 7 days || period_ > 15 days) revert InvalidPeriod();
        _refundRequestPeriod = period_;

        // emit RequestPeriodChanged(period_);
    }
    // 15~30  || 1~7
    function setRefundReviewPeriod(uint256 period_) external onlyDAO {
        if (period_ < 15 days || period_ > 60 days) revert InvalidPeriod();
        _refundReviewPeriod = period_;

        // emit ReviewPeriodChanged(period_);
    }

    // 110
    function setBidIncrementRate(uint8 rate_) external onlyDAO {
        if (rate_ <= 100 || rate_ > 150) revert InvalidRate();
        _bidIncrementRate = rate_;
    }

    // ========================================================================================================
    //                                           Getter function
    // ========================================================================================================

    function refundRequestPeriod() external view returns (uint256) {
        return _refundRequestPeriod;
    }
    function refundReviewPeriod() external view returns (uint256) {
        return _refundReviewPeriod;
    }

    function bidIncrementRate() external view returns (uint8) {
        return _bidIncrementRate;
    }

}
