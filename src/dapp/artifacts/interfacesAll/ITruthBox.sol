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

/**
 * @title ITruthBox
 * @notice TruthBox contract interface, defining all externally exposed functions and events
 * @dev This interface serves as the top-level constraint for the TruthBox contract, ensuring consistency between interface and implementation
 */
interface ITruthBox {
    
    // =====================================================================================
    //                                                  Events
    // =====================================================================================
    
    event BoxCreated(uint256 indexed boxId, uint256 indexed userId, string boxInfoCID);
    event BoxStatusChanged(uint256 indexed boxId, Status status);
    event PriceChanged(uint256 indexed boxId, uint256 price);
    event DeadlineChanged(uint256 indexed boxId, uint256 deadline);
    event PrivateKeyPublished(uint256 boxId, bytes privateKey, uint256 indexed userId);

    // =====================================================================================
    //                                          Address Management
    // =====================================================================================
    
    /**
     * @notice Set contract addresses
     * @dev Get and set related contract addresses from AddressManager
     */
    function setAddress() external;

    // =====================================================================================
    //                                          Box Creation
    // =====================================================================================
    
    /**
     * @notice Create a TruthBox
     * @param to_ Address to mint the NFT to
     * @param tokenCID_ CID of the token
     * @param boxInfoCID_ CID of the box info
     * @param key_ Key of the box
     * @param price_ Price of the box
     * @return boxId The created Box ID
     */
    function create(
        address to_,
        string calldata tokenCID_,
        string calldata boxInfoCID_,
        bytes calldata key_,
        uint256 price_
    ) external returns(uint256);

    /**
     * @notice Create and immediately publish a TruthBox
     * @param to_ Address to mint the NFT to
     * @param tokenCID_ CID of the token
     * @param boxInfoCID_ CID of the box info
     * @return boxId The created Box ID
     */
    function createAndPublish(
        address to_,
        string calldata tokenCID_,
        string calldata boxInfoCID_
    ) external returns(uint256);

    // =====================================================================================
    //                                          Getter Functions
    // =====================================================================================
    
    /**
     * @notice Get the status of a box
     * @param boxId_ Box ID
     * @return Status of the box
     */
    function getStatus(uint256 boxId_) external view returns(Status);
    
    /**
     * @notice Get the price of a box
     * @param boxId_ Box ID
     * @return Price of the box
     */
    function getPrice(uint256 boxId_) external view returns(uint256);
    
    /**
     * @notice Get the deadline of a box
     * @param boxId_ Box ID
     * @return Deadline of the box
     */
    function getDeadline(uint256 boxId_) external view returns(uint256);
    
    /**
     * @notice Get basic data of a box (status, price, deadline)
     * @param boxId_ Box ID
     * @return status Status of the box
     * @return price Price of the box
     * @return deadline Deadline of the box
     */
    function getBasicData(uint256 boxId_) external view returns(Status, uint256, uint256);
    
    /**
     * @notice Get private data of a box (key)
     * @param boxId_ Box ID
     * @param siweToken_ SIWE token of the user
     * @return key Key of the box
     */
    // function getPrivateData(uint256 boxId_, bytes memory siweToken_) external view returns(bytes memory);
    
    /**
     * @notice Get the minter address of a box
     * @param boxId_ Box ID
     * @return minter Minter address of the box
     * @dev Only callable by project contracts
     */
    function minterOf(uint256 boxId_) external view returns(address);
    
    /**
     * @notice Check if a box is in the blacklist
     * @param boxId_ Box ID
     * @return Whether the box is in the blacklist
     */
    function isInBlacklist(uint256 boxId_) external view returns(bool);

    // =====================================================================================
    //                                          Setter Functions (Project Contracts Only)
    // =====================================================================================
    
    /**
     * @notice Set the status of a box
     * @param boxId_ Box ID
     * @param status_ New status
     * @dev Only callable by project contracts
     */
    function setStatus(uint256 boxId_, Status status_) external;
    
    /**
     * @notice Set the price of a box
     * @param boxId_ Box ID
     * @param price_ New price
     * @dev Only callable by project contracts
     */
    function setPrice(uint256 boxId_, uint256 price_) external;
    
    /**
     * @notice Add deadline to a box
     * @param boxId_ Box ID
     * @param seconds_ Seconds to add
     * @dev Only callable by project contracts
     */
    function addDeadline(uint256 boxId_, uint256 seconds_) external;
    
    /**
     * @notice Set basic data of a box (price, status, deadline)
     * @param boxId_ Box ID
     * @param price_ New price
     * @param status_ New status
     * @param deadline_ New deadline
     * @dev Only callable by project contracts
     */
    function setBasicData(uint256 boxId_, uint256 price_, Status status_, uint256 deadline_) external;

    // =====================================================================================
    //                                          Public Functions
    // =====================================================================================
    
    /**
     * @notice Publish TruthBox by minter
     * @param boxId_ Box ID
     * @dev Only callable by minter, box must be in Storing status
     */
    function publishByMinter(uint256 boxId_) external;
    
    /**
     * @notice Publish TruthBox by buyer
     * @param boxId_ Box ID
     * @dev Only callable by buyer, box must be in InSecrecy status
     */
    function publishByBuyer(uint256 boxId_) external;
    
    /**
     * @notice Extend the deadline
     * @param boxId_ Box ID
     * @param time_ Time to extend (in seconds)
     * @dev Only callable by minter, box must be in Storing status and within 30 days before deadline
     */
    function extendDeadline(uint256 boxId_, uint256 time_) external;
    
    /**
     * @notice Pay confidentiality fee
     * @param boxId_ Box ID
     * @dev Box must be in InSecrecy status and within 30 days before deadline
     */
    function payConfiFee(uint256 boxId_) external;

    // =====================================================================================
    //                                          Blacklist Functions
    // =====================================================================================
    
    /**
     * @notice Add a box to the blacklist
     * @param boxId_ Box ID
     * @dev Only callable by DAO
     */
    function addBoxToBlacklist(uint256 boxId_) external;
}
