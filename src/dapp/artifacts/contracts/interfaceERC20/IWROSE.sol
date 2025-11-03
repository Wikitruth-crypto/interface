// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/**
 * @dev Modified by WROSE to support deposit and withdraw functions.
 */
interface IWROSE is IERC20Metadata {

    // ROSE ---WROSE
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}
