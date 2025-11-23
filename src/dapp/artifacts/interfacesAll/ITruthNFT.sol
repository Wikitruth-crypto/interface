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
 * @title ITruthNFT
 * @notice TruthNFT contract interface, defining all externally exposed functions
 * @dev This interface serves as the top-level constraint for the TruthNFT contract, ensuring consistency between interface and implementation
 * Note: This interface extends ERC721 standard, so standard ERC721 functions like tokenURI, approve, etc. are inherited
 */
interface ITruthNFT {
    
    // =====================================================================================
    //                                          Address Management
    // =====================================================================================
    
    /**
     * @notice Set contract addresses
     * @dev Get and set related contract addresses from AddressManager
     */
    function setAddress() external;

    // =====================================================================================
    //                                          NFT Management Functions
    // =====================================================================================
    
    /**
     * @notice Mint a new NFT
     * @param boxId_ Box ID (used as token ID)
     * @param minter_ Address to mint the NFT to
     * @param tokenCID_ Token CID for metadata
     * @dev Only callable by TruthBox contract
     */
    function mint(uint256 boxId_, address minter_, string calldata tokenCID_) external;
    
    /**
     * @notice Burn an NFT
     * @param tokenId Token ID to burn
     * @dev Only callable by TruthBox contract
     */
    function burn(uint256 tokenId) external;

    // =====================================================================================
    //                                          Getter Functions
    // =====================================================================================
    
    /**
     * @notice Get total supply of NFTs
     * @return Total number of NFTs minted
     */
    function totalSupply() external view returns(uint256);
    
    /**
     * @notice Check if token can be executed (transferred, approved, etc.)
     * @param tokenId Token ID to check
     * @return Whether the token can be executed
     * @dev Only InSecrecy and Published status tokens can be executed, and must not be in blacklist
     */
    function isExecuteAble(uint256 tokenId) external view returns (bool);

    // =====================================================================================
    //                                          Configuration Functions (Admin Only)
    // =====================================================================================
    
    /**
     * @notice Set network and URI suffix for token URI
     * @param network_ Network prefix for token URI
     * @param uri_ URI suffix for token URI
     * @dev Only callable by admin
     */
    function setNetwork(string calldata network_, string calldata uri_) external;
}


