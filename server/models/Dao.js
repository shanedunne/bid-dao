const mongoose = require("mongoose");

const Dao = new mongoose.Schema({
  ownerAddress: String,
  governanceAddress: String,
  tokenAddress: String,
  timelockAddress: String,
  boxAddress: String,
  tokenName: String,
  tokenSymbol: String,
  daoCapacity: Number,
  totalSupply: Number,

});

const Model = mongoose.model('Dao', Dao, 'daos');

module.exports = Model;
