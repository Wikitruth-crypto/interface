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

    function setAddress() external;

    function getStatus(uint256 boxId_) external view returns(Status);
    function setStatus(uint256 boxId_, Status status_) external;
    // 
    function getPrice(uint256 boxId_) external view returns(uint256);
    function setPrice(uint256 boxId_, uint256 price_) external ;
    // 
    function getBasicData(uint256 boxId_) external view returns(Status, uint256, uint256);
    function getDeadline(uint256 boxId_) external view returns(uint256);
    function addDeadline(uint256 boxId_, uint256 deadline_) external;

    function setBasicData(uint256 boxId_, uint256 price_, Status status_, uint256 deadline_) external;

    // 
    function minterOf(uint256 boxId_) external view returns(address);

    function isInBlacklist(uint256 boxId_) external view returns(bool);

}
