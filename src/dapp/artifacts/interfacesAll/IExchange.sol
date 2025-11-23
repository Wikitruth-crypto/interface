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

/**
 * @title IExchange
 * @notice Exchange contract interface, defining all externally exposed functions and events
 * @dev This interface serves as the top-level constraint for the Exchange contract, ensuring consistency between interface and implementation
 */
interface IExchange {
    
    // =====================================================================================
    //                                                  Events
    // =====================================================================================
    
    event BoxListed(uint256 indexed boxId, uint256 indexed userId, address acceptedToken);
    event BoxPurchased(uint256 indexed boxId, uint256 indexed userId);
    event BidPlaced(uint256 indexed boxId, uint256 indexed userId);
    event CompleterAssigned(uint256 indexed boxId, uint256 indexed userId);
    event RequestDeadlineChanged(uint256 indexed boxId, uint256 deadline);
    event ReviewDeadlineChanged(uint256 indexed boxId, uint256 deadline);
    event RefundPermitChanged(uint256 indexed boxId, bool permission);

    // =====================================================================================
    //                                          Address Management
    // =====================================================================================
    
    /**
     * @notice Set contract addresses
     * @dev Get and set related contract addresses from AddressManager
     */
    function setAddress() external;

    // =====================================================================================
    //                                          Listing Functions
    // =====================================================================================
    
    /**
     * @notice List a box for sale
     * @param boxId_ Box ID
     * @param acceptedToken_ Accepted token address (address(0) means official token)
     * @param price_ Sale price
     */
    function sell(
        uint256 boxId_,
        address acceptedToken_,
        uint256 price_
    ) external;
    
    /**
     * @notice List a box for auction
     * @param boxId_ Box ID
     * @param acceptedToken_ Accepted token address (address(0) means official token)
     * @param price_ Starting price
     */
    function auction(
        uint256 boxId_,
        address acceptedToken_,
        uint256 price_
    ) external;

    // =====================================================================================
    //                                          Buying Functions
    // =====================================================================================
    
    /**
     * @notice Buy a box
     * @param boxId_ Box ID
     */
    function buy(uint256 boxId_) external;
    
    /**
     * @notice Place a bid on an auction
     * @param boxId_ Box ID
     */
    function bid(uint256 boxId_) external;
    
    /**
     * @notice Calculate payment amount for a bid
     * @param boxId_ Box ID
     * @return Payment amount required
     */
    function calcPayMoney(uint256 boxId_) external view returns (uint256);

    // =====================================================================================
    //                                          Refund Functions
    // =====================================================================================
    
    /**
     * @notice Request a refund
     * @param boxId_ Box ID
     * @dev Only buyer can call, box must be in Paid status
     */
    function requestRefund(uint256 boxId_) external;
    
    /**
     * @notice Cancel a refund request
     * @param boxId_ Box ID
     * @dev Only buyer can call, box must be in Refunding status
     */
    function cancelRefund(uint256 boxId_) external;
    
    /**
     * @notice Agree to a refund request
     * @param boxId_ Box ID
     * @dev Only minter or DAO can call within review deadline, box must be in Refunding status
     */
    function agreeRefund(uint256 boxId_) external;
    
    /**
     * @notice Refuse a refund request
     * @param boxId_ Box ID
     * @dev Only DAO can call within review deadline, box must be in Refunding status
     */
    function refuseRefund(uint256 boxId_) external;

    // =====================================================================================
    //                                          Order Completion Functions
    // =====================================================================================
    
    /**
     * @notice Complete an order
     * @param boxId_ Box ID
     * @dev Buyer can call anytime, others can call after refund deadline
     */
    function completeOrder(uint256 boxId_) external;

    // =====================================================================================
    //                                          Getter Functions
    // =====================================================================================
    
    /**
     * @notice Get buyer address
     * @param boxId_ Box ID
     * @return Buyer address
     * @dev Only callable by project contracts
     */
    function buyerOf(uint256 boxId_) external view returns(address);
    
    /**
     * @notice Get seller address
     * @param boxId_ Box ID
     * @return Seller address (address(0) means minter is the seller)
     * @dev Only callable by project contracts
     */
    function sellerOf(uint256 boxId_) external view returns(address);
    
    /**
     * @notice Get completer address
     * @param boxId_ Box ID
     * @return Completer address
     * @dev Only callable by project contracts
     */
    function completerOf(uint256 boxId_) external view returns(address);
    
    /**
     * @notice Get accepted token address
     * @param boxId_ Box ID
     * @return Accepted token address
     */
    function acceptedToken(uint256 boxId_) external view returns (address);
    
    /**
     * @notice Get refund permit status
     * @param boxId_ Box ID
     * @return Whether refund is permitted
     */
    function refundPermit(uint256 boxId_) external view returns (bool);
    
    /**
     * @notice Get refund request deadline
     * @param boxId_ Box ID
     * @return Refund request deadline timestamp
     */
    function refundRequestDeadline(uint256 boxId_) external view returns (uint256);
    
    /**
     * @notice Get refund review deadline
     * @param boxId_ Box ID
     * @return Refund review deadline timestamp
     */
    function refundReviewDeadline(uint256 boxId_) external view returns (uint256);
    
    /**
     * @notice Check if box is within refund request deadline
     * @param boxId_ Box ID
     * @return Whether box is within refund request deadline
     */
    function isInRequestRefundDeadline(uint256 boxId_) external view returns (bool);
    
    /**
     * @notice Check if box is within refund review deadline
     * @param boxId_ Box ID
     * @return Whether box is within refund review deadline
     */
    function isInReviewDeadline(uint256 boxId_) external view returns (bool);

    // =====================================================================================
    //                                          Setter Functions (Project Contracts Only)
    // =====================================================================================
    
    /**
     * @notice Set refund permit status
     * @param boxId_ Box ID
     * @param permission_ Refund permit status
     * @dev Only callable by project contracts
     */
    function setRefundPermit(uint256 boxId_, bool permission_) external;
}
