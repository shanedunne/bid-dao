const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {

  let token, signer;
  before("deploy the contract instance first", async function () { 
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("TestToken1", "TT1", 5, 1, 10, 10000);
    await token.deployed();
    [signer] = await ethers.provider.listAccounts();

  });
  it("Should return the token name and symbol", async function () {
    

    expect(await token.name()).to.equal("TestToken1");
    expect(await token.symbol()).to.equal("TT1");
    expect(await token.daoMaxSize()).to.equal(5);
    // expect(await token.minEtherAmount()).to.equal(10**18);
    // expect(await token.maxEtherAmount()).to.equal(10**18);
    expect(await token.mintRate()).to.equal(10000);
  });
  it("Should add owner to the approved members mapping", async function () {
    // const [owner] = await ethers.getSigners();
    assert.equal(await token.owner(), signer);
    const setTokenTx = await token.addMembersToApprovedList(signer);

    // wait until the transaction is mined
    await setTokenTx.wait();
    
    // check that the owner is added to the approvedList
    expect(await token.approvedList(signer)).to.equal(true);

    // check that the owners balance is 0
    expect(await token.balances(signer)).to.equal(0);

  });

  it("Should allow signer1 to mint tokens", async function () {

    const wallet = new ethers.Wallet(signer, ethers.provider);

    const mintToken = await token.mintTokens(signer, 5);

    // wait until the transaction is mined
    await mintToken.wait();

    
  });
  
});
