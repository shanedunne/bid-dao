// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function deployToken() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');



  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy("0x2767CD05FdC45389aDb55e016358003227CfeBA5", "Funky Dao", "FUNKY", 10, 10000);

  await token.deployed();

  console.log("TestToken2 deployed to:", token.address);

  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = await Governance.deploy("0x2111A38EC807498bC529F2528F55422B98854b0d", token.address, "0x2767CD05FdC45389aDb55e016358003227CfeBA5", "Funky Dao");
  await governance.deployed();
  console.log('Governance Address: ' + governance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
