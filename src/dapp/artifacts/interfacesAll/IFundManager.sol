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


interface IFundManager{

    // function setAddress() external; （不建议使用）

    // ==========  ==========
    // function depositOrderAmount(uint256 boxId_, address buyer_, uint256 amount_) external; （不建议使用）
    
    // function depositConfidentialityFee(uint256 boxId_, address buyer_, uint256 amount_) external; （不建议使用）

    // ==========  ==========
    // function allocationRewards(uint256 boxId_) external; （不建议使用）
    
    // ==========  ==========
    function withdrawOrderAmounts(address token_, uint256[] calldata list_) external;
    
    function withdrawRefundAmounts(address token_, uint256[] calldata list_) external;
    
    function withdrawHelperRewards(address token_) external;
    
    function withdrawMinterRewards(address token_) external;
    
    // ==========  ==========
    function orderAmounts(uint256 boxId_, bytes memory siweToken_) external view returns (uint256);
    
    function minterRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    
    function helperRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    
    function totalRewardAmounts(address token_) external view returns (uint256);
    
    // function slippageProtection() external view returns (uint8);
    
    // ========== ==========
    // function setSlippageProtection(uint8 slippageProtection_) external; （不建议使用）
    
    // ==========  ==========
    function orderAmounts(uint256 boxId_, address user_) external view returns (uint256);
    
    function helperRewardAmounts(address helper_, address token_) external view returns (uint256);
    
    function minterRewardAmounts(address minter_, address token_) external view returns (uint256);
}
