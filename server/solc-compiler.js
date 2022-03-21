const solc = require('solc');


function contractCompiler(contractData, name) {
  var input = {
    language: 'Solidity',
    sources: {
      "name": {
        content: contractData
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  



  let res;

  switch(name) {
    case 'Token.sol':
      res = [output.contracts.name.Token.abi, output.contracts.name.Token.evm.bytecode];
      break;
    case 'Timelock.sol':
      res = [output.contracts.name.Timelock.abi, output.contracts.name.Timelock.evm.bytecode];
      break;
      case 'Box.sol':
      res = [output.contracts.name.Box.abi, output.contracts.name.Box.evm.bytecode];
      break;
    case 'Governance.sol':
      res = [output.contracts.name.Governance.abi, output.contracts.name.Governance.evm.bytecode];
      break;
  }

  return res;
};

module.exports = contractCompiler;