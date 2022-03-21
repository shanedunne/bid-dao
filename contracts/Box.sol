//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Box {
    address admin;

    constructor(address _admin) {
        admin = _admin;
    }
}