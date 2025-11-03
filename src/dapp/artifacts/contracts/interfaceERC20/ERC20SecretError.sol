// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.24;

interface ERC20SecretError {
    /// Invalid permit label
    error InvalidPermitLabel();
    /// Invalid permit amount
    error InvalidPermitAmount();
    /// EIP error
    error EIPError();
    /// Zero amount
    error ZeroAmount();
    /// Signature used
    error SignatureUsed();
    /// Insufficient balance
    error InsufficientBalance();
    /// Expired deadline
    error ExpiredDeadline();

    /// Invalid signature
    error InvalidSignature();


}