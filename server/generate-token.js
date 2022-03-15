const { ethers } = require('hardhat');
const fs = require('fs');
const { tokenCompiler } = require('./solc-token');

export default async function tokenGenerator(req, res) {

    const {owner, tName, tSymbol, dCap, mnEth, mxEth, mRate, vQuorum} = req.body;
    // get address from ethers
    const addr = await ethers.provider.listAccounts()

    const tokenData = fs.readFileSync('contracts/Token.sol');
    const [tokenAbi, tokenByte] = compile(tokenData.toString('utf8'), 'Token.sol');

    // const timelockData = fs.readFileSync('contracts/Timelock.sol');
    // const [abiTm, byteCodeTm] = compile(timelockData.toString('utf8'), 'Timelock.sol');

    // use hardhat deployment method
    const Token = await ethers.getContractFactory(tokenAbi, tokenByte);
    const token = await Token.deploy(owner, tName, tSymbol, dCap, mnEth, mxEth, mRate);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
}