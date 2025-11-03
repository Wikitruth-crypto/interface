// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20add is IERC20 {

    // function name() external view returns (string memory);
    // function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}
