const solc = require('solc');


const tokenCompiler = (fileBuf, name) => {
  const input = {
    language: 'Solidity',
    sources: {
      "name": {
        content: fileBuf
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
  const output = JSON.parse(solc.compiler(JSON.stringify(input)));

  let res;

  switch(name) {
    case 'Token.sol':
      res = [output.contracts.name.Token.abi, output.contracts.name.Token.evm.bytecode];
      break;
    case 'Timelock.sol':
      res = [output.contracts.name.Timelock.abi, output.contracts.name.Timelock.evm.bytecode];
      break;
  }

  return res;
};

export {
  tokenCompiler
};