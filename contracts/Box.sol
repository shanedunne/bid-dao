//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Box {
    address admin;
    address payable financialController;

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint amount);

    constructor(address _admin, address payable _financialController) {
        admin = _admin;
        financialController = _financialController;
    }

    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) external {
        require(msg.sender == financialController);
        require(amount >= address(this).balance);
        financialController.transfer(amount);

        emit Withdraw(financialController, amount);
    }
}