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

interface IAddressManager {

    function admin() external view returns (address);
    function dao() external view returns (address);
    function governance() external view returns (address);
    function daoFundManager() external view returns (address);
    
    function truthBox() external view returns (address);
    function exchange() external view returns (address);
    function truthNFT() external view returns (address);
    function fundManager() external view returns (address);
    
    function swapContract() external view returns (address);
    function quoter() external view returns (address);
    // function encryptionService() external view returns (address);

    function userId() external view returns (address);
    function siweAuth() external view returns (address);

    function reservedList() external view returns (address[] memory);
    function getAddressFromIndex(uint256 index_) external view returns (address);
    
    function isProjectContract(address contract_) external view returns (bool);
    function officialToken() external view returns (address);
    function isTokenSupported(address token_) external view returns (bool);
    function isOfficialToken(address token_) external view returns (bool);

}