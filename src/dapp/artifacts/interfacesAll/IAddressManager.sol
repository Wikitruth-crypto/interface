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
 * @title IAddressManager
 * @notice AddressManager contract interface, defining all externally exposed functions
 * @dev This interface serves as the top-level constraint for the AddressManager contract, ensuring consistency between interface and implementation
 */
interface IAddressManager {

    // =====================================================================================
    //                                          Address Getters
    // =====================================================================================
    
    /**
     * @notice Get admin address
     * @return Admin address
     */
    // function admin() external view returns (address);
    
    /**
     * @notice Get DAO address
     * @return DAO address
     */
    function dao() external view returns (address);
    
    /**
     * @notice Get governance address
     * @return Governance address
     */
    function governance() external view returns (address);
    
    /**
     * @notice Get DAO fund manager address
     * @return DAO fund manager address
     */
    function daoFundManager() external view returns (address);
    
    /**
     * @notice Get TruthBox contract address
     * @return TruthBox contract address
     */
    function truthBox() external view returns (address);
    
    /**
     * @notice Get Exchange contract address
     * @return Exchange contract address
     */
    function exchange() external view returns (address);
    
    /**
     * @notice Get TruthNFT contract address
     * @return TruthNFT contract address
     */
    function truthNFT() external view returns (address);
    
    /**
     * @notice Get FundManager contract address
     * @return FundManager contract address
     */
    function fundManager() external view returns (address);
    
    /**
     * @notice Get swap contract address
     * @return Swap contract address
     */
    function swapContract() external view returns (address);
    
    /**
     * @notice Get quoter contract address
     * @return Quoter contract address
     */
    function quoter() external view returns (address);

    /**
     * @notice Get UserId contract address
     * @return UserId contract address
     */
    function userId() external view returns (address);
    
    /**
     * @notice Get SIWE Auth contract address
     * @return SIWE Auth contract address
     */
    function siweAuth() external view returns (address);

    // =====================================================================================
    //                                          Address Management Functions (Admin Only)
    // =====================================================================================
    
    /**
     * @notice Set addresses list
     * @param list_ Address list [dao, governance, daoFundManager, userId, siweAuth, truthBox, truthNFT, exchange, fundManager, swapContract, quoter]
     * @dev Only callable by admin
     */
    function setAddressList(address[] memory list_) external;
    
    /**
     * @notice Set all contract addresses
     * @dev Only callable by admin, calls setAddress() on all project contracts
     */
    function setAllAddress() external;
    
    /**
     * @notice Add reserved address
     * @param reservedAddress_ Reserved address to add
     * @dev Only callable by admin, reserved addresses can only be added, cannot be deleted
     */
    function addReservedAddress(address reservedAddress_) external;

    // =====================================================================================
    //                                          Token Management Functions (Admin Only)
    // =====================================================================================
    
    /**
     * @notice Set official token
     * @param token_ Official token address
     * @dev Only callable by admin, actually sets tokens[0]
     */
    function setOfficialToken(address token_) external;
    
    /**
     * @notice Add token to supported list
     * @param token_ Token address to add
     * @dev Only callable by admin
     */
    function addToken(address token_) external;
    
    /**
     * @notice Remove token from supported list
     * @param token_ Token address to remove
     * @dev Only callable by admin, sets token status to Inactive
     */
    function removeToken(address token_) external;

    // =====================================================================================
    //                                          Getter Functions
    // =====================================================================================
    
    /**
     * @notice Check if address is a project contract
     * @param contract_ Contract address to check
     * @return Whether the address is a project contract
     */
    function isProjectContract(address contract_) external view returns (bool);
    
    /**
     * @notice Get official token address
     * @return Official token address (tokens[0])
     */
    function officialToken() external view returns (address);
    
    /**
     * @notice Check if token is supported
     * @param token_ Token address to check
     * @return Whether the token is supported (Active status)
     */
    function isTokenSupported(address token_) external view returns (bool);
    
    /**
     * @notice Check if token is official token
     * @param token_ Token address to check
     * @return Whether the token is the official token
     */
    function isOfficialToken(address token_) external view returns (bool);
    
    /**
     * @notice Get token list
     * @return Array of all token addresses
     */
    function getTokenList() external view returns (address[] memory);
    
    /**
     * @notice Get token address by index
     * @param index_ Token index
     * @return Token address (returns tokens[0] if index out of range)
     */
    function getTokenByIndex(uint256 index_) external view returns (address);
    
    /**
     * @notice Get reserved address list
     * @return Array of reserved addresses
     */
    function reservedList() external view returns (address[] memory);
    
    /**
     * @notice Get reserved address by index
     * @param index_ Index in reserved list
     * @return Reserved address
     */
    function getAddressFromIndex(uint256 index_) external view returns (address);
}