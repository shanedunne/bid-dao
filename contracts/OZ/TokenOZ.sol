// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract Token is ERC20, ERC20Permit, ERC20Votes {

    string public daoName;
    string public localName;
    string public localSymbol;
    uint public daoMaxSize;
    uint public daoCounter;

    // Used to iterate over balances to display on ui
    address[] public members;
    mapping(address => bool) public approvedList;
    mapping(address => uint) public balances;
    address public owner;
    ERC20 stable;
    
    // Test coin for minting instead of a stable coin

    // set the max and min investment amount of the DAO
    // uint public minStableAmount;
    // uint public maxStableAmount;

    // Tokens per 1 ether
    // uint public mintRate;

    // total supply which is not predetermined but dynamically created
    uint public tokenTotalSupply;

    // Initilising supply to allow owner access to dashboard to add members to list
    uint constant _initial_supply = 100000 * (10**18);

    constructor(address _owner, string memory _name_, string memory _symbol_, uint _daoMaxSize, uint _tokenTotalSupply) 
    ERC20(_name_, _symbol_)
    ERC20Permit(_name_) payable {
        localName = _name_;
        localSymbol = _symbol_;
        // change back to zero for deployment
        daoCounter = 4;
        daoMaxSize = _daoMaxSize;
        owner = _owner;
        members.push(owner);
        approvedList[owner] = true;

        // Testing UI Purposes
        members.push(0x0a4A683e62d14B85fd174E5428730515a907b658);
        members.push(0xDCfF5f2C56Cf1926db33487ddc790dC045b85F93);
        members.push(0xd410c9b2CcB1113b8Dcf3A64C56ef75c72Ad38E5);

        tokenTotalSupply = _tokenTotalSupply * 1000000000000000000;
        _mint(owner, _tokenTotalSupply);
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
        members.push(_newMember);
        daoCounter++;

    }

    // removes member from approved list
    function removeMembersFromApprovedList(address _member) external isOwner() {
        require(approvedList[_member] = true);
        approvedList[_member] = false;
        // members[_member] = members[members.length - 1];
        // members.pop();
        daoCounter--;
        
        
    }

    /* minting mechanism
    function mintTokens () external payable isApproved(msg.sender) eligableToMint(msg.sender) {
        require(msg.value <= maxStableAmount);
        require(msg.value >= minStableAmount);
        uint tokenAmount = msg.value  * mintRate;
        tokenTotalSupply += tokenAmount;


        _mint(msg.sender, tokenAmount);
        emit newMember(msg.sender, tokenAmount);
    }
    */

    function getMembersArray() public view returns (address[] memory) {
        return members;
    }

    function spacesLeft() public view returns (uint) {
        return daoMaxSize - daoCounter;
    }

    // Override transfer function to make token non-transferrable

    // Terminate DAO an distribute balances
    
    // remove items from array 

    
}