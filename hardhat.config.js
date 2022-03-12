require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: `${process.env.ALCHEMY_RINKEBY_URL}`,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
      
    }
  },
  etherscan: {
    apiKey: "Y9KVN5AXDYYE5BNBW74VTKEUQPZMDPTA3R"
  }
};