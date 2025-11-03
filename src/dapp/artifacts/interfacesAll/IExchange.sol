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

interface IExchange{

    // function setAddress() external; （不建议使用）
    
    // ====================
    function sell(uint256 boxId_, address acceptedToken_, uint256 price_) external;
    function auction(uint256 boxId_, address acceptedToken_, uint256 price_) external;
    function buy(uint256 boxId_) external;
    function bid(uint256 boxId_) external;
    function calcPayMoney(uint256 boxId_) external view returns (uint256);
    
    // ========== refund ==========
    function requestRefund(uint256 boxId_) external;
    
    function cancelRefund(uint256 boxId_) external;
    
    function agreeRefund(uint256 boxId_) external;
    
    function refuseRefund(uint256 boxId_) external;
    
    // ====================
    function completeOrder(uint256 boxId_) external;
    
    // ====================
    // function buyerOf(uint256 boxId_) external view returns(address); （不建议使用）

    // function sellerOf(uint256 boxId_) external view returns(address); （不建议使用）
    
    // function completerOf(uint256 boxId_) external view returns(address); （不建议使用）

    function setRefundPermit(uint256 boxId_,bool permission_) external;

    function refundPermit(uint256 boxId_) external view returns (bool);

    function acceptedToken(uint256 boxId_) external view returns (address);
    
    function refundReviewDeadline(uint256 boxId_) external view returns (uint256);
    
    function refundRequestDeadline(uint256 boxId_) external view returns (uint256);
    
    function isInRequestRefundDeadline(uint256 boxId_) external view returns (bool);
    
    function isInReviewDeadline(uint256 boxId_) external view returns (bool);
}
