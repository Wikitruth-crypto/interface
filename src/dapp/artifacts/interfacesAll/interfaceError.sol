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
 * @title Error Interface
 * @dev Defines standard error types used across the protocol
 */
interface Error {
    // =====================================================================================
    // Permission and Administration Errors
    // =====================================================================================
    
    /// @dev Thrown when a function is called by a non-admin account
    error NotAdmin(); 
    
    /// @dev Thrown when a function requires admin or DAO permissions
    error NotAdminOrDAO(); 
    
    /// @dev Thrown when an account is not the minter of a token
    error NotMinter();
    
    /// @dev Thrown when caller is not the buyer of a token
    error NotBuyer();
    
    /// @dev Thrown when an account is not the DAO
    error NotDAO();
    
    // error NotOwner();  // Commented out but kept for reference
    
    // =====================================================================================
    // Contract Interaction Errors
    // =====================================================================================
    
    /// @dev Thrown when a zero address is provided where a valid address is required
    error ZeroAddress();
    
    /// @dev Thrown when implementation address is invalid
    error InvalidImplementation();
    
    /// @dev Thrown when caller is not authorized to call a function
    error InvalidCaller();

    /// @dev Thrown when a deadline is invalid
    error InvalidDeadline();
    
    /// @dev Thrown when a contract caller is not authorized
    error InvalidContractCaller();
    
    // =====================================================================================
    // State and Validation Errors
    // =====================================================================================
    
    /// @dev Thrown when operation is performed in an invalid status
    error InvalidStatus();

    /// @dev The box not exists
    error InvalidBoxId();
    
    /// @dev Thrown when a token is in blacklist
    error InBlacklist();
    
    /// @dev Thrown when a token ID does not exist in blacklist
    error BlackTokenIdNotExist();

    /// @dev Thrown when a box is already in blacklist
    error BoxAlreadyInBlacklist();
    
    /// @dev Thrown when a box does not exist
    error BoxNotExists();
    
    /// @dev Thrown when token is not in secrecy state
    error NotInSecrecy();
    
    // =====================================================================================
    // Parameter and Data Errors
    // =====================================================================================
    
    /// @dev Thrown when provided rate is invalid
    error InvalidRate();
    
    /// @dev Thrown when token info is empty or not properly provided during token creation or update
    error EmptyTokenCID();
    
    /// @dev Thrown when price is empty or zero
    error EmptyPrice();
    
    /// @dev Thrown when token URI is empty
    error EmptyTokenURI();
    
    /// @dev Thrown when box info CID is empty
    error EmptyBoxInfoCID();
    
    /// @dev Thrown when period parameter is invalid
    error InvalidPeriod();
    
    // =====================================================================================
    // Transaction and Business Logic Errors
    // =====================================================================================
    
    /// @dev Thrown when auction is already over
    error AuctionOver();
    
    /// @dev Thrown when deadline is not over yet
    error DeadlineNotOver();
    
    /// @dev Thrown when deadline is already over
    error DeadlineIsOver();
    
    /// @dev Thrown when buyer is available for a token
    error AvailableBuyer();
    
    /// @dev Thrown when public time is not ended
    error PublicTimeNotEnd();

    // =====================================================================================
    // v1.6 Errors
    // =====================================================================================

    /// @dev Thrown when an invalid or incompatible contract address is provided
    error InvalidContractAddress();

    /// @dev Thrown when attempting to register a token that already exists in the system
    error TokenAlreadyExists();

    /// @dev Thrown when a contract does not implement the required ERC20 interface
    error InvalidERC20Interface();

    // /// @dev Thrown when attempting to remove an office token that should be preserved
    // error CannotRemoveOfficeToken();

    /// @dev Thrown when attempting to interact with a token that doesn't exist in the registry
    error TokenNotExists();

    // /// @dev Thrown when the exchange rate is outside acceptable bounds
    // error InvalidExchangeRate();

    // /// @dev Thrown when an operation requires an exchange rate but none is set
    // error ExchangeRateNotSet();

    // =====================================================================================
    // v1.6 FundManager Errors
    // =====================================================================================

    // /// @dev Thrown when the exchange functionality is currently paused
    // error ExchangeIsPaused();

    // /// @dev Thrown when ETH is sent directly to the contract outside of designated functions
    // error DirectETHTransferNotAllowed();

    // /// @dev Thrown when calling a function with invalid parameters or in an invalid context
    // error InvalidFunctionCall();

    // /// @dev Thrown when attempting to add an adapter that already exists
    // error AdapterAlreadyExists();

    // /// @dev Thrown when adapter name does not match expected value
    // error AdapterNameMismatch();

    // /// @dev Thrown when an adapter does not implement the required interface
    // error InvalidAdapterInterface();

    // /// @dev Thrown when attempting to use an adapter that doesn't exist
    // error AdapterNotExists();

    // /// @dev Thrown when slippage tolerance exceeds maximum allowed value
    // error SlippageToleranceTooHigh();

    // /// @dev Thrown when a token transfer operation fails
    // error TransferFailed();

    // /// @dev Thrown when attempting to swap a token for itself
    // error SameTokenSwap();

    /// @dev Thrown when an amount parameter is zero or empty
    error AmountIsZero();

    // /// @dev Thrown when no suitable swap path can be found between tokens
    // error NoSuitableSwapPath();

    // /// @dev Thrown when a swap operation fails during execution
    // error SwapExecutionFailed();

    // /// @dev Thrown when the output amount is less than required minimum
    // error InsufficientOutputAmount();

    // /// @dev Thrown when a function is called that has not been implemented yet
    // error NotImplemented();

    /// @dev Thrown when attempting to use a token that is not supported by the protocol
    error TokenNotSupported();
}


