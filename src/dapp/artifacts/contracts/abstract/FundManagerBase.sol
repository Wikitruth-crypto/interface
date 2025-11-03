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

// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import {Pausable} from "../openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


import {IUserId} from "../interfaces/IUserId.sol";
import {ISiweAuth} from "../interfaces/ISiweAuth.sol";
import {ITruthNFT} from "../interfaces/ITruthNFT.sol";
import {ITruthBox} from "../interfaces/ITruthBox.sol";
// import {IFundManager} from "../interfaces/IFundManager.sol";
import {IExchange} from "../interfaces/IExchange.sol";
import {Error} from "../interfaces/interfaceError.sol";
import {IAddressManager} from "../interfaces/IAddressManager.sol";
// import "../interfaces/ISwapRouter.sol";

import {FeeRate} from "./FeeRate.sol";

/**
 * @title FundManagerBase
 * @dev Fund management contract that supports multiple tokens
 * v1.6 upgraded version of FundManager, extending existing FundManager to support multi-token transactions
 */

contract FundManagerBase is FeeRate, ReentrancyGuard{

    // ====================================================================================================================
    error EnforcedPause();

    event PauseToggled(bool isPaused);

    // ====================================================================================================================
    // State Variables
    // address internal OFFICIAL_TOKEN;
    // address internal DAO_FUND_MANAGER;
    IUserId internal USER_ID;
    // address internal SWAP_CONTRACT; // uniswapV3 swap router
    ISiweAuth internal SIWE_AUTH;
    IExchange internal EXCHANGE; 
    ITruthBox internal TRUTH_BOX; 

    // =======================================================================================

    // Withdraw pause status
    bool private _paused;

    // ====================================================================================================================

    constructor() FeeRate(){}

    // ====================================================================================================================
    // Modifiers

    modifier whenNotPaused() {
        if (_paused) revert EnforcedPause();
        _;
    }

    // modifier checkSetCaller() {
    //     if (
    //         msg.sender != address(ADDR_MANAGER) &&
    //         msg.sender != ADDR_MANAGER.admin()
    //     ) {
    //         revert InvalidCaller();
    //     }
    //     _;
    // }

    // ====================================================================================================================
    // Management Functions

    /**
     * @dev Toggle withdraw pause status
     * @return Current pause status
     */
    function togglePause() public onlyAdmin returns (bool) {
        bool to = !_paused;
        _paused = to;
        emit PauseToggled(to);
        return to;
    }

    /**
     * @dev Set contract addresses
     */
    function setAddress() external checkSetCaller {
        IAddressManager addrMgr = ADDR_MANAGER;

        address truthBox = addrMgr.truthBox();
        address exchange = addrMgr.exchange();
        // address swapContract = addrMgr.swapContract();
        address userId = addrMgr.userId();
        address siweAuth = addrMgr.siweAuth();
        // address daoFundManager = addrMgr.daoFundManager();
        // address officialToken= addrMgr.officialToken();

        if (truthBox != address(0) && truthBox != address(TRUTH_BOX)) {
            TRUTH_BOX = ITruthBox(truthBox);
        }
        if (exchange != address(0) && exchange != address(EXCHANGE)) {
            EXCHANGE = IExchange(exchange);
        }
        // if (swapContract != address(0) && swapContract != address(SWAP_CONTRACT)) {
        //     SWAP_CONTRACT = swapContract;
        // }
        if (userId != address(0) && userId != address(USER_ID)) {
            USER_ID = IUserId(userId);
        }
        if (siweAuth != address(0) && siweAuth != address(SIWE_AUTH)) {
            SIWE_AUTH = ISiweAuth(siweAuth);
        }
        // if (daoFundManager != address(0) && daoFundManager != address(DAO_FUND_MANAGER)) {
        //     DAO_FUND_MANAGER = daoFundManager;
        // }
        // if (officialToken != address(0) && officialToken != address(OFFICIAL_TOKEN)) {
        //     OFFICIAL_TOKEN = officialToken;
        // }
    }

    /**
     * @dev Get withdraw pause status
     * @return Whether withdrawal is paused
     */
    function paused() external view returns (bool) {
        return _paused;
    }

    // ====================================================================================================================

}
