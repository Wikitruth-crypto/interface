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

enum Status {Storing, Selling, Auctioning, Paid, Refunding, InSecrecy, Published, Blacklisted}

interface ITruthBox{

    // function setAddress() external; （不建议使用）

    // ========== ==========
    function create(address to_, string calldata tokenCID_, string calldata boxInfoCID_, bytes calldata key_, uint256 price_) external returns(uint256);
    
    function createAndPublish(address to_, string calldata tokenCID_, string calldata boxInfoCID_, bytes calldata key_) external returns(uint256);
    
    // ========== ==========
    function getStatus(uint256 boxId_) external view returns(Status);
    // function setStatus(uint256 boxId_, Status status_) external; （不建议使用）
    
    // ========== ==========
    function getPrice(uint256 boxId_) external view returns(uint256);
    // function setPrice(uint256 boxId_, uint256 price_) external ; （不建议使用）
    
    // ========== ==========
    function getBasicData(uint256 boxId_) external view returns(Status, uint256, uint256);
    function getDeadline(uint256 boxId_) external view returns(uint256);
    // function addDeadline(uint256 boxId_, uint256 deadline_) external; （不建议使用）
    // function setBasicData(uint256 boxId_, uint256 price_, Status status_, uint256 deadline_) external; （不建议使用）
    
    // ========== ==========
    function getPrivateData(uint256 boxId_, bytes memory siweToken_) external view returns (bytes memory);
    
    // ========== ==========
    function publishByMinter(uint256 boxId_) external;
    
    function publishByBuyer(uint256 boxId_) external;
    
    // ========== ==========
    function addBoxToBlacklist(uint256 boxId_) external;
    function isInBlacklist(uint256 boxId_) external view returns(bool);
    
    // ========== ==========
    function payConfiFee(uint256 boxId_) external;
    
    function extendDeadline(uint256 boxId_, uint256 time_) external;
    
    // ========== ==========
    // function minterOf(uint256 boxId_) external view returns(address); // （不建议使用）
    // function getUserId(address address_) external returns (uint256); （不建议使用）

}
