// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Token is ERC20, ERC20Permit, ERC20Votes {

    // string private name;
    // string private symbol;
    uint daoMaxSize;
    uint daoCounter;
    mapping(address => bool) approvedList;
    mapping(address => uint) balances;
    address owner;

    // set the max and min investment amount of the DAO
    uint minEtherAmount;
    uint maxEtherAmount;

    // Tokens per 1 ether
    uint mintRate;
    AggregatorV3Interface internal priceFeed;

    constructor(string memory _name_, string memory _symbol_, uint _daoMaxSize, uint _minEtherAmount, uint _maxEtherAmount, uint _mintRate) 
    ERC20(_name_, _symbol_)
    ERC20Permit(_name_) {
        daoCounter = 0;
        daoMaxSize = _daoMaxSize;
        minEtherAmount = (_minEtherAmount * 10**18);
        maxEtherAmount = (_maxEtherAmount * 10**18);
        mintRate = _mintRate;
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        
    }

    // Events

    event newMember(address _member, uint contribution);

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }


    // Modifiers
    // check if in approvedList mapping
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier isApproved(address _checkAddress) {
        require(approvedList[_checkAddress] == true);
        _;
    }

    // check if has already minted
    modifier eligableToMint(address _checkAddress) {
        require(balances[_checkAddress] == 0);
        _;
    }

    // Functionality to handle approved members list
    function addMembersToApprovedList(address _newMember) external isOwner() {
        require(daoCounter < daoMaxSize);
        approvedList[_newMember] = true;
        balances[_newMember] = 0;
        daoCounter++;

    }

    // removes member from approved list
    function removeMembersFromApprovedList(address _member) external isOwner() {
        approvedList[_member] = false;
        daoCounter--;
        
        
    }

    // minting mechanism
    function mintTokens (address _member) external payable isApproved(_member) eligableToMint(_member) {
        require(msg.value <= maxEtherAmount);
        require(msg.value >= minEtherAmount);
        uint weiAmount = msg.value;
        uint tokenAmount = (weiAmount / 10**18) * mintRate;


        _mint(_member, tokenAmount);
        emit newMember(msg.sender, tokenAmount);
    }


}