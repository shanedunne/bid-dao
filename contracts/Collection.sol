// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Collection {
    struct TokenCollection {
        string daoName;
        string daoTokenName;
        string daoSymbol;
        uint daoMaxSize_;
        uint minEtherAmount_;
        uint maxEtherAmount_;
        uint mintRate_;
        address daoDeployer_;
    }
    // Will store all data for each token generated 
    TokenCollection[] public tokenCollection;

    address[] public bidDaoTokenLists;
}