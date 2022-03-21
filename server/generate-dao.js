const { ethers } = require('hardhat');
const fs = require('fs');
const contractCompiler = require('./solc-compiler');
const mongoose = require('mongoose');
require('./models/Dao');
require('./index');

async function tokenGenerator(body, res) {

    const { daoOwner, tName, tSymbol, dCap, tTotalSupply } = body

    // get address from ethers
    const [addr] = await ethers.provider.listAccounts()
    console.log("address from ethers: " + addr)

    const tokenData = fs.readFileSync('contracts/Token.sol');
    const [tokenAbi, tokenByte] = contractCompiler(tokenData.toString('utf8'), 'Token.sol');
    console.log("Token contract compiled!")

    const timelockData = fs.readFileSync('contracts/Timelock.sol');
    const [timelockAbi, timelockByte] = contractCompiler(timelockData.toString('utf8'), 'Timelock.sol');
    console.log("Timelock contract compiled!")

    const boxData = fs.readFileSync('contracts/Box.sol');
    const [boxAbi, boxByte] = contractCompiler(boxData.toString('utf8'), 'Box.sol');
    console.log("Box contract compiled!")

    const governanceData = fs.readFileSync('contracts/Governance.sol');
    const [governanceAbi, governanceByte] = contractCompiler(governanceData.toString('utf8'), 'Governance.sol');
    console.log("Governance contract compiled!")

    // use hardhat deployment method
    const Token = await ethers.getContractFactory(tokenAbi, tokenByte);
    const token = await Token.deploy(daoOwner, tName, tSymbol, dCap, tTotalSupply);
    console.log("Token contract successfully deployed!")
    console.log("Token address:" + token.address)

    // get governance conract address
    const nonce = await ethers.provider.getTransactionCount(addr);
    const govAdd = ethers.utils.getContractAddress({ from: addr, nonce: nonce + 1 });

    // deploy timelock contract with governance address as parameter
    const Timelock = await ethers.getContractFactory(timelockAbi, timelockByte);
    const timelock = await Timelock.deploy(govAdd, 0);
    await timelock.deployed();
    console.log("Timelock contract successfully deployed!")
    console.log("Timelock address:" + timelock.address)

    // deploy box address with timelock as agent
    const Box = await ethers.getContractFactory(boxAbi, boxByte);
    const box = await Box.deploy(timelock.address);
    await box.deployed();
    console.log("Box contract successfully deployed!")
    console.log("Box address:" + box.address)

    const Governance = await ethers.getContractFactory(governanceAbi, governanceByte);
    const governance = await Governance.deploy(timelock.address, token.address, daoOwner, tName);
    await governance.deployed();
    console.log("Governance contract successfully deployed!")
    console.log("Governance address:" + governance.address)
    // Fix from below

    console.log("Creating new instance of DAO")
    const Dao = mongoose.model('Dao');
    const dao = new Dao();
    dao.ownerAddress = daoOwner;
    dao.governanceAddress = governance.address;
    dao.tokenAddress = token.address;
    dao.timelockAddress = timelock.address;
    dao.boxAddress = box.address;
    dao.tokenName = tName;
    dao.tokenSymbol = tSymbol;
    dao.daoCapacity = dCap;
    dao.totalSupply = tTotalSupply;
    await dao.save();
    console.log("New instance of DAO for " + tName + " created")

    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json');
    // res.json(dao);
}
module.exports = tokenGenerator;