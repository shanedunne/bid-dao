const solc = require('solc');


const governanceCompiler = (fileBuf, name) => {
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
    case 'Governance.sol':
      res = [output.contracts.name.Token.abi, output.contracts.name.Token.evm.bytecode];
      break;
  }

  return res;
};

export {
  governanceCompiler
};