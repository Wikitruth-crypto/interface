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

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Error} from "./interfaces/interfaceError.sol";
import {ITruthBox, Status} from "./interfaces/ITruthBox.sol";
// import "./library.sol";
import {IAddressManager} from "./interfaces/IAddressManager.sol";

import {Modifier} from "./abstract/Modifier.sol";


contract TruthNFT is ERC721, Modifier {
    
    // =====================================================================================
    
    ITruthBox internal TRUTH_BOX;
    // IAddressManager internal ADDR_MANAGER;

    string internal _network;
    string internal _uriSuffix;

    // ==================================================================================================
    uint256 internal _nextTokenId; 
    // uint256 internal _blackSupply; 
    
    // mapping (uint256 tokenId => bool) internal _blackTokenIds; 
    mapping (uint256 tokenId => string) internal _tokenCID; 

    // ==================================================================================================

    constructor() ERC721('Truth Box NFT', 'TBN') Modifier() {
    }

    // modifier onlyAdmin() {
    //     if (msg.sender != ADDR_MANAGER.admin()) revert NotAdmin();
    //     _;
    // }

    // modifier checkSetCaller() {
    //     if (
    //         msg.sender != address(ADDR_MANAGER) &&
    //         msg.sender != ADDR_MANAGER.admin()
    //     ) {
    //         revert InvalidCaller();
    //     }
    //     _;
    // }

    // 
    function setAddress() external checkSetCaller {
        address truthBox = ADDR_MANAGER.truthBox();
        if (truthBox != address(0) && truthBox != address(TRUTH_BOX)) {
            TRUTH_BOX = ITruthBox(truthBox);
        }
    }

    // =========================================================================================================
    // ==========================================================================================================
    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (TRUTH_BOX.isInBlacklist(tokenId)) revert InBlacklist();
        _requireOwned(tokenId);
        string memory tokenCID_ = _tokenCID[tokenId];

        return string(abi.encodePacked(_network, tokenCID_, _uriSuffix));
    }

    function setNetwork(string calldata network_, string calldata uri_) public onlyAdmin {
        _network = network_;
        _uriSuffix = uri_;
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    } 

    // ==========================================================================================================
    //                                         Functions
    // ==========================================================================================================
    
    function mint(
        uint256 tokenId_,
        address minter_,
        string calldata tokenCID_
    ) external {
        if (msg.sender != address(TRUTH_BOX)) revert InvalidContractCaller();
        if (bytes(tokenCID_).length == 0) revert EmptyTokenURI();

        _tokenCID[tokenId_] = tokenCID_;
        _mint(minter_, tokenId_);

        unchecked {
            _nextTokenId++;
        }

    }

    // ==========================================================================================================
    //                                                 override Functions
    // ==========================================================================================================
    /**
     * @dev Check if the token can be swapped (transferred), authorized, etc.
     * @param tokenId The ID of the token to check
     * @return Whether the token can be swapped
     * Only InSecrecy and Published status tokens can be swapped, authorized, etc.
     * This means that the transaction has been completed, and is a valid token.
     * Of course, it cannot be in the blacklist.
     */
    function _isExecuteAble(uint256 tokenId) internal view returns (bool) {
        ITruthBox truthBox = TRUTH_BOX;
        if (truthBox.isInBlacklist(tokenId)) return false;
        Status status = truthBox.getStatus(tokenId);
        if (status != Status.InSecrecy && status != Status.Published) return false;
        return true;
    }

    function isExecuteAble(uint256 tokenId) public view returns (bool) {
        return _isExecuteAble(tokenId);
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public override {
        if (!_isExecuteAble(tokenId)) revert InvalidStatus();
        _approve(to, tokenId, _msgSender());
    }

    /**
     * @dev Override the _update function to check blacklist status before any transfer operation
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Neither mint nor burn, then check if it is in the blacklist
        if (from != address(0) && to != address(0)) {
            if (!_isExecuteAble(tokenId)) revert InvalidStatus();
        }
        return super._update(to, tokenId, auth);
    }


    /**
     * @dev burn NFT
     * @param tokenId The ID of the token to burn
     */
    function burn(uint256 tokenId) public {
        if (msg.sender != address(TRUTH_BOX)) revert InvalidCaller();
        super._burn(tokenId);
    }

}