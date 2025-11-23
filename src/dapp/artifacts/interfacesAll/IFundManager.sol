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
 * @title IFundManager
 * @notice FundManager contract interface, defining all externally exposed functions and events
 * @dev This interface serves as the top-level constraint for the FundManager contract, ensuring consistency between interface and implementation
 */
interface IFundManager {
    
    // =====================================================================================
    //                                                  Events
    // =====================================================================================
    
    event OrderAmountPaid(
        uint256 indexed boxId,
        uint256 indexed userId,
        address indexed token,
        uint256 amount
    );
    
    event OrderAmountWithdraw(
        uint256[] list,
        address indexed token,
        uint256 indexed userId,
        uint256 amount,
        FundsType fundsType
    );

    event RewardsAdded(
        uint256 indexed boxId,
        address indexed token,
        uint256 amount,
        RewardType rewardType
    );

    event HelperRewrdsWithdraw(
        uint256 indexed userId,
        address indexed token,
        uint256 amount
    );

    event MinterRewardsWithdraw(
        uint256 indexed userId,
        address indexed token,
        uint256 amount
    );


    // =====================================================================================
    //                                                  Enums
    // =====================================================================================
    
    enum RewardType { Minter, Seller, Completer, Total }
    enum FundsType { Order, Refund }

    // =====================================================================================
    //                                          Address Management
    // =====================================================================================
    
    /**
     * @notice Set contract addresses
     * @dev Get and set related contract addresses from AddressManager
     */
    function setAddress() external;

    // =====================================================================================
    //                                          Payment Functions (Project Contracts Only)
    // =====================================================================================
    
    /**
     * @notice Pay order amount
     * @param boxId_ TruthBox ID
     * @param buyer_ Buyer address
     * @param amount_ Amount to pay
     * @dev Only callable by project contracts
     */
    function payOrderAmount(uint256 boxId_, address buyer_, uint256 amount_) external;
    
    /**
     * @notice Pay confidentiality fee
     * @param boxId_ TruthBox ID
     * @param buyer_ Buyer address
     * @param amount_ Amount to pay
     * @dev Only callable by project contracts
     */
    function payConfidentialityFee(uint256 boxId_, address buyer_, uint256 amount_) external;
    
    /**
     * @notice Allocate rewards
     * @param boxId_ TruthBox ID
     * @dev Only callable by project contracts
     */
    function allocationRewards(uint256 boxId_) external;

    // =====================================================================================
    //                                          Withdrawal Functions
    // =====================================================================================
    
    /**
     * @notice Withdraw order amounts (for buyers who failed to participate in bidding)
     * @param token_ Token address
     * @param list_ List of TruthBox IDs
     */
    function withdrawOrderAmounts(
        address token_,
        uint256[] calldata list_
    ) external;
    
    /**
     * @notice Withdraw refund amounts
     * @param token_ Token address
     * @param list_ List of TruthBox IDs
     */
    function withdrawRefundAmounts(
        address token_,
        uint256[] calldata list_
    ) external;
    
    /**
     * @notice Withdraw helper rewards (official token only)
     * @param token_ Token address
     */
    function withdrawHelperRewards(address token_) external;
    
    /**
     * @notice Withdraw minter rewards
     * @param token_ Token address
     */
    function withdrawMinterRewards(address token_) external;

    // =====================================================================================
    //                                          Getter Functions
    // =====================================================================================
    
    /**
     * @notice Get order amount (for project contracts)
     * @param boxId_ TruthBox ID
     * @param user_ User address
     * @return Order amount
     * @dev Only callable by project contracts
     */
    function orderAmounts(
        uint256 boxId_,
        address user_
    ) external view returns (uint256);

    /**
     * @notice Get order amount
     * @param boxId_ TruthBox ID
     * @param siweToken_ User SIWE token
     * @return Order amount
     */
    // function orderAmounts(
    //     uint256 boxId_,
    //     bytes memory siweToken_
    // ) external view returns (uint256);
    
    /**
     * @notice Get minter reward amount
     * @param token_ Token address
     * @param siweToken_ User SIWE token
     * @return Minter reward amount
     */
    // function minterRewardAmounts(
    //     address token_,
    //     bytes memory siweToken_
    // ) external view returns (uint256);
    
    /**
     * @notice Get helper reward amount
     * @param token_ Token address
     * @param siweToken_ User SIWE token
     * @return Helper reward amount
     */
    // function helperRewardAmounts(
    //     address token_,
    //     bytes memory siweToken_
    // ) external view returns (uint256);
    
    /**
     * @notice Get total reward amount
     * @param token_ Token address
     * @return Total reward amount
     */
    function totalRewardAmounts(address token_) external view returns (uint256);
    
}
