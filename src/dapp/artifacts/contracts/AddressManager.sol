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

import {IUserId} from "./interfaces/IUserId.sol";
import {ISiweAuth} from "./interfaces/ISiweAuth.sol";
import {ITruthNFT} from "./interfaces/ITruthNFT.sol";
import {ITruthBox} from "./interfaces/ITruthBox.sol";
import {IFundManager} from "./interfaces/IFundManager.sol";
import {IExchange} from "./interfaces/IExchange.sol";
import {Error} from "./interfaces/interfaceError.sol";

// Import ProxyUpgrade contract
import {ProxyUpgrade} from "./abstract/ProxyUpgrade.sol";


/**
 * @title AddressManager
 * @dev Address management contract, also responsible for token registration
 */

contract AddressManager is ProxyUpgrade {


    error TokenIsActive();
    error TokenIsNotActive();
    error InvalidAddress();
    error RemoveError();
    error InvalidIndex();
    error CannotRemoveOfficialToken();

    /**
     * @dev The admin is managed by the ProxyUpgrade contract
     * The variable will be re-enabled in the production environment
     */
    // address public admin; 

    // DAO governance related contracts
    address public dao;
    address public governance;
    address public daoFundManager;

    // User registration related contracts
    address public userId;
    address public siweAuth;

    // Core trading contracts
    address public truthBox;
    address public truthNFT;
    address public fundManager;
    address public exchange;

    // Uniswap V3 SwapRouter contract
    address public swapContract; 
    address public quoter;

    // Reserved contract addresses

    address[] internal _reservedList;

    // Project contract addresses
    // Used for white list check of project contracts
    mapping(address contracts => bool) internal _isProjectContract;


    // Other supported token addresses
    address[] internal _tokenList;
    /**
     * @dev Enumerate token status
     * @param UnExsited Not added to the token array, does not support the token.
     * @param Active Added to the array, supports the token.
     * @param Inactive Added to the array, exists, but not activated.
     */
    enum TokenEnum { UnExsited, Active, Inactive }
    mapping(address token => TokenEnum) internal _tokenStatus;


    // =======================================================================================================
    constructor() {
        // admin = msg.sender;
    }

    // =====================================================================================

    /**
     * @dev Only the admin can call
     * The admin is managed by the ProxyUpgrade contract
     * The admin is managed by the ProxyUpgrade contract
     * The modifier will be re-enabled in the production environment
     */
    // modifier onlyAdmin() {
    //     if (msg.sender != admin) revert NotAdmin();
    //     _;
    // }
    // =====================================================================================

    /**
     * @dev Set addresses
     * @param list_ Address list
     * [
        dao, 
        governance, 
        daoFundManager, 
        userId, 
        siweAuth, 
        truthBox, 
        truthNFT, 
        exchange, 
        fundManager, 
        swapContract,
        quoter
        ]
     */
    function setAddressList(
        address[] memory list_
    ) external onlyAdmin {
        // DAO contract
        if (list_[0] != address(0)) {
            if(_setProjectContract(dao, list_[0])){
                dao = list_[0];
            }
        }
        if (list_[1] != address(0)) {
            if(_setProjectContract(governance, list_[1])){
                governance = list_[1];
            }
        }
        if (list_[2] != address(0)) {
            if(_setProjectContract(daoFundManager, list_[2])){
                daoFundManager = list_[2];
            }
        }
        // Identity verification contracts
        if (list_[3] != address(0)) {
            if(_setProjectContract(userId, list_[3])){
                userId = list_[3];
            }
        }
        if (list_[4] != address(0)) {
            if(_setProjectContract(siweAuth, list_[4])){
                siweAuth = list_[4];
            }
        }
        
        // Trading contracts
        if (list_[5] != address(0)) {
            if(_setProjectContract(truthBox, list_[5])){
                truthBox = list_[5];
            }
        }
        if (list_[6] != address(0)) {
            if(_setProjectContract(truthNFT, list_[6])){
                truthNFT = list_[6];
            }
        }
        if (list_[7] != address(0)) {
            if(_setProjectContract(exchange, list_[7])){
                exchange = list_[7];
            }
        }
        if (list_[8] != address(0)) {
            if(_setProjectContract(fundManager, list_[8])){
                fundManager = list_[8];
            }
        }

        // Uniswap V3 SwapRouter contract
        // This is not needed to set, because swapContract is the contract address of other projects
        if (list_[9] != address(0)) {
            swapContract = list_[9];
        }
        if (list_[10] != address(0)) {
            quoter = list_[10];
        }
    }

    /**
     * @dev Update the project contract mapping
     * @param old_ Old contract address
     * @param new_ New contract address
     * @return Whether to update
     */
    function _setProjectContract(address old_, address new_) internal returns (bool) {
        if (old_ == address(0)) {
            _isProjectContract[new_] = true;
            return true;
        } 
        if (old_ == new_) {
            return false;
        }
        _isProjectContract[old_] = false;
        _isProjectContract[new_] = true;
        return true;

    }

    /**
     * Set all contract addresses
     */
    function setAllAddress() external onlyAdmin {
        IExchange(exchange).setAddress();
        IFundManager(fundManager).setAddress();
        ITruthBox(truthBox).setAddress();
        ITruthNFT(truthNFT).setAddress();
        IUserId(userId).setAddress();
        // ISiweAuth(siweAuth).setAddress();
    }


    /**
     * @dev Add reserved address
     * The reserved address can only be added, cannot be deleted, to avoid unnecessary impact.
     */
    function addReservedAddress(address reservedAddress_) external onlyAdmin {
        if (reservedAddress_ == address(0)) revert InvalidAddress();
        _reservedList.push(reservedAddress_);
    }

    /**
     * @dev Set admin
     * The admin is managed by the ProxyUpgrade contract
     * The function will be re-enabled in the production environment
     */
    // function setAdmin(address newAdmin_) external onlyAdmin {
    //     if (newAdmin_ == address(0)) revert InvalidAddress();
    //     admin = newAdmin_;
    // }

    // =================================== Token management ==================================================

    /**
     * @dev Set official token
     * Actually it is tokens[0]
     */
    function setOfficialToken(address token_) external onlyAdmin {
        address oldToken = _tokenList[0];
        if (token_ == address(0) || token_ == oldToken) revert InvalidAddress();

        TokenEnum status = _tokenStatus[token_];

        if (oldToken != address(0)) {
            // If the new token is in the array, then move the old token to that position
            // If the new token is not in the array, then move the old token to the end of the array.
            if ( status != TokenEnum.UnExsited ) {
                for (uint256 i = 1; i < _tokenList.length; i++) {
                    if (_tokenList[i] == token_) {
                        _tokenList[i] = oldToken;
                        break;
                    }
                }
            } else {
                _tokenList.push(oldToken);
            }
            _tokenStatus[oldToken] = TokenEnum.Inactive;
        } 
        
        if (status != TokenEnum.Active) {
            _tokenStatus[token_] = TokenEnum.Active;
        }
        _tokenList[0] = token_;
    }

    function addToken(address token_) external onlyAdmin {
        if (token_ == address(0)) revert InvalidAddress();
        // Check if the token is in the list
        if (_tokenStatus[token_] == TokenEnum.Active) revert TokenIsActive();
        if (_tokenStatus[token_] == TokenEnum.UnExsited) {
            _tokenList.push(token_);
        }
        _tokenStatus[token_] = TokenEnum.Active;
    }

    function _removeToken(address token_) internal {
        if (_tokenStatus[token_] != TokenEnum.Active) revert TokenIsNotActive();
        if (token_ == _tokenList[0]) revert CannotRemoveOfficialToken();
        _tokenStatus[token_] = TokenEnum.Inactive;
    }

    /**
     * @dev Remove token: set the token status to Inactive
     * @param token_ Token contract address
     */
    function removeToken(address token_) external onlyAdmin {
        _removeToken(token_);
    }

    // =================================== getters Token ==================================================

    function isProjectContract(address contract_) external view returns (bool) {
        return _isProjectContract[contract_];
    }
    
    function getTokenList() external view returns (address[] memory) {
        return _tokenList;
    }

    function officialToken() external view returns (address) {
        return _tokenList[0];
    }

    /**
     * @dev Check if the token is supported
     * @param token_ Token contract address
     * @return Whether the token is supported
     */
    function isTokenSupported(address token_) external view returns (bool) {
        return _tokenStatus[token_] == TokenEnum.Active;
    }

    /**
     * @dev Check if the token is official token
     */
    function isOfficialToken(address token_) external view returns (bool) {
        if (token_ == address(0)) revert InvalidAddress();
        return token_ == _tokenList[0];
    }

    /**
     * @dev Get token address by index
     * @param index_ Token index value
     * @return Token contract address
     * If the index value is out of range, then return the token address of the 0 index.
     */
    function getTokenByIndex(uint256 index_) external view returns (address) {
        if (index_ >= _tokenList.length) return _tokenList[0];
        return _tokenList[index_];
    }

    // ----------------------------------- Reserved address management --------------------------------------------------

    function reservedList() external view returns (address[] memory) {
        return _reservedList;
    }

    function getAddressFromIndex(uint256 index_) external view returns (address) {
        if(index_ >= _reservedList.length) revert InvalidIndex();
        return _reservedList[index_];
    }





}
