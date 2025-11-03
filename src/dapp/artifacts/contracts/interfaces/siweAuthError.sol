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
 * @dev This interface defines the error codes for the SiweAuth contract.
 */
interface SiweAuthError {
    /// Invalid domain error
    error InvalidDomain();
    /// Domain already exists error
    error DomainAlreadyExists();
    /// Domain not found error
    error DomainNotFound();
    /// Empty domain error
    error EmptyDomain();

    /// Invalid address error
    error InvalidAddress();
    
    /// Chain ID in the SIWE message does not match the actual chain ID
    error SiweAuth_ChainIdMismatch();
    /// Domain in the SIWE message does not match the domain of a dApp
    error SiweAuth_DomainMismatch();
    /// User address in the SIWE message does not match the message signer's address
    error SiweAuth_AddressMismatch();
    /// The Not before value in the SIWE message is still in the future
    error SiweAuth_NotBeforeInFuture();
    /// Validity of the authentication token or the Expires value in the SIWE message is in the past
    error SiweAuth_Expired();
    /// Index out of bounds
    error IndexOutOfBounds();
}


