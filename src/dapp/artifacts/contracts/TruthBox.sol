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

import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";


import {TruthBoxBase} from "./abstract/TruthBoxBase.sol";

// import "./library.sol";

/**
 *  @notice TruthBox contract
 *  Implement basic TruthBox functions, including mint, publish, blacklist, etc.
 *  Also includes important transaction-related functions, including setPrice, setDeadline, addDeadline, setStatus
 */

contract TruthBox is TruthBoxBase{

    error InvalidToken();
    error EmptyKey();
    error DeadlineNotIn30days();
    error InvalidSeconds();
    
    // =====================================================================================
    event BoxInfoChanged(uint256 indexed boxId, string boxInfoCID);
    event BoxCreated(uint256 indexed boxId, uint256 indexed userId);
    event BoxStatusChanged(uint256 indexed boxId, Status status);
    event PriceChanged(uint256 indexed boxId, uint256 price);
    event DeadlineChanged(uint256 indexed boxId, uint256 deadline);
    // event DeadlineAdded(uint256 indexed boxId, uint256 times);
    event PrivateKeyPublished(uint256 boxId, bytes privateKey, uint256 indexed userId); // 20251014 add privateKey


    enum Status {Storing, Selling, Auctioning, Paid, Refunding, InSecrecy, Published, Blacklisted}
    
    struct PublicData {
        Status _status; 
        uint256 _price; 
        uint256 _deadline; 
    }

    struct SecretData {
        address _minter;
        bytes _encryptedData; // Encrypted data (private key)
        bytes32 _nonce;// Encrypted nonce, decryption required
    }

    mapping (uint256 boxId => PublicData) internal _publicData; 
    mapping (uint256 boxId => SecretData) internal _secretData;

    // ==================================================================================================
    constructor() TruthBoxBase() {

    }

    // ==========================================================================================================
    //                                                 mint Functions
    // ==========================================================================================================
    
    /**
     * @dev Set the box data
     * @param boxInfoCID_ The CID of the box info
     * @param price_ The price of the box
     * @param status_ The status of the box
     * @param deadline_ The deadline of the box
     * @param key_ The key of the box
     * @return The ID of the box
     */
    function _setBoxData(
        string calldata boxInfoCID_,
        uint256 price_,
        Status status_,
        uint256 deadline_,
        bytes memory key_
    ) internal returns(uint256){
        uint256 boxId = _nextBoxId;

        bytes32 nonce; 
        bytes memory encryptedData;

        if (key_.length != 0) {
            // Generate encrypted nonce (critical fix: save nonce for decryption)
            nonce = bytes32(Sapphire.randomBytes(32, abi.encodePacked(boxId, msg.sender)));
            
            encryptedData = Sapphire.encrypt(
                bytes32(0), // Use default key, do not use automatically generated secretKey
                nonce,
                key_,
                ""
            );
        }
        
        _publicData[boxId] = PublicData({
            _price: price_, 
            _status: status_,
            _deadline: deadline_
        });

        _secretData[boxId]= SecretData({
            _minter: msg.sender,
            _nonce: bytes32(0),
            _encryptedData: encryptedData
        });

        unchecked {
            _nextBoxId++;
        }

        emit BoxInfoChanged(boxId, boxInfoCID_);
        return boxId;
    }

    function _checkCID(string calldata tokenCID_, string calldata boxInfoCID_) internal pure {
        if (bytes(tokenCID_).length == 0) revert EmptyTokenCID();
        if (bytes(boxInfoCID_).length == 0) revert EmptyBoxInfoCID();
    }

    /**
     * @dev Create a truth box
     * @param to_ The address to mint the NFT to
     * @param tokenCID_ The CID of the token
     * @param boxInfoCID_ The CID of the box info
     * @param key_ The key of the box
     * @param price_ The price of the box
     * @return The ID of the box
     */
    function create(
        address to_,
        string calldata tokenCID_,
        string calldata boxInfoCID_,
        bytes calldata key_,
        uint256 price_
    ) external returns(uint256){
        if (key_.length == 0) revert EmptyKey();
        if (price_ == 0) revert EmptyPrice();
        _checkCID(tokenCID_, boxInfoCID_);

        uint256 deadline;

        unchecked {
            // On mainnet, the deadline is 365 days, but on testnet, the deadline is 15 days
            deadline = block.timestamp + 15 days; // NOTE 365----15
        }

        uint256 boxId = _setBoxData(boxInfoCID_, price_, Status.Storing, deadline, key_);
        
        NFT.mint(boxId, to_, tokenCID_);

        uint256 userId = USER_ID.getUserId(msg.sender);
        emit BoxCreated(boxId, userId); 
        emit PriceChanged(boxId, price_);
        emit DeadlineChanged(boxId, deadline);
        // Log the price and deadline, do not record status, because status is Storing status

        return boxId;
    }

    function createAndPublish(
        address to_,
        string calldata tokenCID_,
        string calldata boxInfoCID_
    ) external returns(uint256){
        _checkCID(tokenCID_, boxInfoCID_);

        uint256 boxId = _setBoxData(boxInfoCID_, 0, Status.Published, 0, '');

        NFT.mint(boxId, to_, tokenCID_);

        // uint256 userId = USER_ID.getUserId(msg.sender);

        emit BoxStatusChanged(boxId, Status.Published);
        return boxId;
    }

    //==================================================================================================
    //                                      Get Info Functions
    //==================================================================================================

    /**
     * @dev Get the status of a box
     * @param boxId_ The ID of the box
     * @return The status of the box
     */
    function _getStatus(uint256 boxId_) internal view returns (Status) {

        Status status = _publicData[boxId_]._status;
        // If the deadline has passed, then you need to judge the status of the box
        if (_publicData[boxId_]._deadline < block.timestamp) {
            // 1, Box in selling/auctioning, if there is no buyer, then the status is Published
            if (status == Status.Selling || status == Status.Auctioning) {
                if (EXCHANGE.buyerOf(boxId_) == address(0)) {
                    return Status.Published;
                } else {
                    // If there is a buyer, then the status is Paid
                    return Status.Paid;
                }
            } else if (status == Status.InSecrecy) {
                // 2, Box in InSecrecy status, then the status is Published
                return Status.Published;
            }
        }
        return status;
    }
    
    function getStatus(uint256 boxId_) external view returns (Status) {
        return _getStatus(boxId_);
    }

    function getPrice(uint256 boxId_) external view returns (uint256 ) {
        return _publicData[boxId_]._price;
    }

    function getDeadline(uint256 boxId_) external view returns (uint256) {
        return _publicData[boxId_]._deadline;
    }

    // ==========================================================================================================

    /**
     * @dev Get public data of a box
     * @param boxId_ The ID of the box
     * @return status The status of the box
     * @return price The price of the box
     * @return deadline The deadline of the box
     */
    function getBasicData(uint256 boxId_) external view returns (
        Status,
        uint256, 
        uint256
    ) {
        Status status = _getStatus(boxId_);
        return (
            status,
            _publicData[boxId_]._price,
            _publicData[boxId_]._deadline
        );
    }

    /**
     * @dev Get private data of a box
     * @param boxId_ The ID of the box
     * @param siweToken_ The siwe token of the user 
     * @return key The key of the box
     * siweToken_ The siwe token of the user 
     */
    function getPrivateData(uint256 boxId_, bytes memory siweToken_) external view returns (bytes memory) {

        address sender = _msgSender(siweToken_);
        if (sender == address(0)) revert InvalidToken();
        Status status = _getStatus(boxId_);

        if (
            status == Status.Storing || 
            status == Status.Selling || 
            status == Status.Auctioning
        ) {
            // The value of the status: if it is Storing, Selling, Auctioning, then check if the msg.sender is minter
            if (sender != _minterOf(boxId_)) revert InvalidCaller();
        } else if (
            status == Status.InSecrecy || 
            status == Status.Paid
        ) {
            // The value of the status: if it is InSecrecy, Paid, then check if the msg.sender is buyer
            if (sender != EXCHANGE.buyerOf(boxId_)) revert InvalidCaller();
        } 
        // The value of the status: if it is Published,Refunding, then everyone can view, no need to check

        return Sapphire.decrypt(
            bytes32(0), // Do not use secretKey, in order to keep its interface pure and stable.
            _secretData[boxId_]._nonce, 
            _secretData[boxId_]._encryptedData, 
            ""
        );
    }

    // ==================================================================================================

    function _checkStatus(uint256 boxId_, Status status_) internal view {
        if (_publicData[boxId_]._status != status_) revert InvalidStatus();
    }

    function _checkIsBlacklisted(uint256 boxId_) internal view {
        if (_publicData[boxId_]._status == Status.Blacklisted) revert InBlacklist();
    }

    // Check if the current time is within the 30 days of the deadline
    function _isDeadlineIn30days(uint256 boxId_) internal view {
        uint256 deadline = _publicData[boxId_]._deadline;
        if (
            deadline < block.timestamp ||
            deadline > block.timestamp + 3 days // NOTE 30 days----3 days
        ) {
            revert DeadlineNotIn30days();
        }
    }

    //==================================================================================================
    //                                      Setter Functions 
    //                                      Only callable by Exchange or FundManager contract
    //==================================================================================================
    function _setPrice(uint256 boxId_, uint256 price_) internal {
        // If the price_ is 0, then do not set
        if (price_ != 0 ) {
            _publicData[boxId_]._price = price_;
            emit PriceChanged(boxId_, price_);
        }
    }

    // function _safeSetPrice(uint256 boxId_, uint256 price_) internal {
    //     _checkIsBlacklisted(boxId_);
    //     _setPrice(boxId_, price_);
    // }

    function setPrice(uint256 boxId_, uint256 price_) external onlyProjectContract() {
        _setPrice(boxId_, price_);
    }

    function _setDeadline(uint256 boxId_, uint256 deadline_) internal {
        if (deadline_ > block.timestamp) {
            _publicData[boxId_]._deadline = deadline_;
            emit DeadlineChanged(boxId_, deadline_);
        } 
        // If the incoming deadline is less than the current time, then do not set
    }

    function _addDeadline(uint256 boxId_, uint256 seconds_) internal {

        if (seconds_ == 0) revert InvalidSeconds();
        uint256 newDeadline = _publicData[boxId_]._deadline + seconds_;
        _publicData[boxId_]._deadline = newDeadline;
        emit DeadlineChanged(boxId_, newDeadline);
    }

    // function _safeAddDeadline(uint256 boxId_, uint256 seconds_) internal {
    //     _checkIsBlacklisted(boxId_);
    //     _addDeadline(boxId_, seconds_);
    // }

    function addDeadline(uint256 boxId_, uint256 seconds_) external onlyProjectContract() {
        _addDeadline(boxId_, seconds_);
    }

    function _setStatus(uint256 boxId_, Status status_) internal {
        // If the incoming status is Storing status, then do not set
        if (status_ != Status.Storing) {
            // if (status_ == Status.Refunding) {
            //     address buyer = EXCHANGE.buyerOf(boxId_);
            //     uint256 userId = USER_ID.getUserId(buyer);

            //     bytes memory privateKey = Sapphire.decrypt(
            //         bytes32(0), // Do not use secretKey, in order to keep its interface pure and stable.
            //         _secretData[boxId_]._nonce, 
            //         _secretData[boxId_]._encryptedData, 
            //         ""
            //     );
            //     emit PrivateKeyPublished(boxId_, privateKey, userId);
            // }
            if (status_ == Status.InSecrecy) {
                _setDeadline(boxId_, block.timestamp + 15 days); // NOTE 365----15
            }
            _publicData[boxId_]._status = status_;
            emit BoxStatusChanged(boxId_, status_);
        }
        
    }

    // function _safeSetStatus(uint256 boxId_, Status status_) internal {
    //     _checkIsBlacklisted(boxId_);
    //     _setStatus(boxId_, status_);
    // }

    function setStatus(uint256 boxId_, Status status_) external onlyProjectContract{
        _setStatus(boxId_, status_);
    }

    function setBasicData(uint256 boxId_, uint256 price_,Status status_, uint256 deadline_) external onlyProjectContract() {
        _setPrice(boxId_, price_);
        _setStatus(boxId_, status_);
        _setDeadline(boxId_, deadline_);
    }
    
    // ==========================================================================================================
    //                                                 public Functions
    // ==========================================================================================================
    
    function _setPublished(uint256 boxId_) internal {
        _setStatus(boxId_, Status.Published);

        bytes memory privateKey = Sapphire.decrypt(
            bytes32(0), // Do not use secretKey, in order to keep its interface pure and stable.
            _secretData[boxId_]._nonce, 
            _secretData[boxId_]._encryptedData, 
            ""
        );

        uint256 userId = USER_ID.getUserId(msg.sender);
        emit BoxStatusChanged(boxId_, Status.Published);
        emit PrivateKeyPublished(boxId_, privateKey, userId);
    } 

    /**
     * @dev Publish TruthBox, which minter can call, 
     * If the minter wants to publish, it must be Storing status.
     */
    function publishByMinter(uint256 boxId_) external {
        if (msg.sender != _secretData[boxId_]._minter) revert InvalidCaller();
        _checkStatus(boxId_, Status.Storing);
        _setPublished(boxId_);
    }

    /**
     * @dev Publish TruthBox, which administrators can call, 
     * If the buyer wants to publish, it must be InSecrecy status.
     */
    function publishByBuyer(uint256 boxId_) external {
        if (msg.sender != EXCHANGE.buyerOf(boxId_)) revert NotBuyer();
        _checkStatus(boxId_, Status.InSecrecy);
        
        _setPublished(boxId_);
    }

    // ==========================================================================================================
    //                                               Blacklist Functions
    // ==========================================================================================================

    function addBoxToBlacklist(uint256 boxId_) external onlyDAO{
        _minterOf(boxId_);

        _checkIsBlacklisted(boxId_);

        // If the Box has a buyer, then set RefundPermit to true
        if (EXCHANGE.buyerOf(boxId_) != address(0)) {
            EXCHANGE.setRefundPermit(boxId_, true);
        }
        Status status = _publicData[boxId_]._status;
        // The Box in the blacklist needs to be burned, 
        // but if it is a completed transaction Box(InSecrecy status and Sold status), 
        // it cannot be burned.
        if(
            status != Status.Published && 
            status != Status.InSecrecy
        ){
            NFT.burn(boxId_);
        }
        _publicData[boxId_]._status = Status.Blacklisted;

        emit BoxStatusChanged(boxId_, Status.Blacklisted);
    }

    function isInBlacklist(uint256 boxId_) public view returns (bool) {
        return _publicData[boxId_]._status == Status.Blacklisted;
    }

    // ==========================================================================================================
    //                                                Pay fee function
    // ==========================================================================================================

    // If the caster wishes to extend the confidentiality period, they will need to verify by minter account
    function extendDeadline(uint256 boxId_ , uint256 time_) external {
        if (msg.sender != _minterOf(boxId_)) revert InvalidCaller();
        _checkStatus(boxId_, Status.Storing);
        _isDeadlineIn30days(boxId_);
        if (time_ > 15 days) revert InvalidPeriod(); // NOTE: 365----15

        _addDeadline(boxId_, time_);
    }

    function _payConfiFee(uint256 boxId_) private{
        uint256 amount = _publicData[boxId_]._price;

        FUND_MANAGER.depositConfidentialityFee(boxId_, msg.sender, amount);

        uint256 newPrice = (amount * _incrementRate) / 100;
        _setPrice(boxId_, newPrice);
        // NOTE: 365----15
        _addDeadline(boxId_, 15 days); // Here do not need to call safeAddDeadline, because the blacklist has been checked.
    }

    // Pay Confidentiality Fee
    // Safe payment, NFT must not be public and invalid
    function payConfiFee(uint256 boxId_) external {
        _checkStatus(boxId_, Status.InSecrecy);
        _isDeadlineIn30days(boxId_);
        _payConfiFee(boxId_);
    }

    // ==========================================================================================================
    //                                      Getter Functions
    // ==========================================================================================================
    function _minterOf(uint256 boxId_) internal view returns (address) {
        address minter = _secretData[boxId_]._minter;
        if (minter == address(0)) revert InvalidBoxId();
        return minter;
    }

    /**
     * @notice Check if the sender is correct.
     * @param siweToken_ The siwe token of the user 
     * @return The sender of the function
     * In sapphire, msg.sender is the zero address, so you need to get the sender through siweToken_.
     */
    function _msgSender(bytes memory siweToken_) internal view returns (address) {
        address sender = msg.sender;
        if (sender == address(0)) {
            sender = SIWE_AUTH.getMsgSender(siweToken_);
        }
        return sender;
    }

    // function minterOf(uint256 boxId_, bytes memory siweToken_) external view returns (address) {
    //     address sender = _msgSender(siweToken_);
    //     if (sender != _minterOf(boxId_)) revert InvalidCaller();

    //     return sender;
    // }

    // function minterOf(uint256 boxId_) external view returns (address) {
    //     if (
    //         msg.sender != address(EXCHANGE) && 
    //         msg.sender != address(FUND_MANAGER)
    //     ) {
    //         revert InvalidCaller();
    //     }
    //     return _minterOf(boxId_);
    // }

    // ----------------------------------------------------------------
    //                      Debugging Functions
    // ----------------------------------------------------------------

    /**
     * @notice Debugging function,
     * @dev Production environment needs to be commented, and the minterOf function above is used
     */
    // function minterOf(uint256 boxId_) external view returns (address) {
    //     return _minterOf(boxId_);
    // }

    // function getUserId(address address_) external returns (uint256) {
    //     return USER_ID.getUserId(address_);
    // }

}