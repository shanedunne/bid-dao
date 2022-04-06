const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");
const resolvePath = require("path-resolve");
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const paths = resolvePath({
  "ERC20.sol": "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
  "ERC20Permit.sol": "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol",
  "GSN/Context.sol": "../node_modules/@openzeppelin/contracts/GSN/Context.sol",
  "ERC20Votes.sol": "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol",
  "Governor.sol": "../node_modules/@openzeppelin/contracts/governance/Governor.sol",
  "GovernorSettings.sol": "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorSettings.sol",
  "GovernorCountingSimple.sol": "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol",
  "GovernorVotes.sol": "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotes.sol",
  "GovernorVotesQuorumFraction.sol": "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol",
  "GovernorTimelockControl.sol": "../node_modules/@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol",
  "TimelockController.sol": "../node_modules/@openzeppelin/contracts/governance/TimelockController.sol",
  "Ownable.sol": "../node_modules/@openzeppelin/contracts/access/Ownable.sol"
});

function contractCompiler(contractData, name) {
  const input = {
    language: "Solidity",
    sources: {
      "name": {
        content: contractData,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  
  function findImports(path) {
    if (paths[path]) return { contents: paths[path] };
    else return { error: "File not found" };
  }
  
  const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImports })
  ).contracts;
  
  fs.ensureDirSync(buildPath);
  
  for (let contract in output) {
    fs.outputJSONSync(
      path.resolve(buildPath, contract.replace(":", "") + ".json"),
  
      output[contract]
    );
  }

  let res;

  switch(name) {
    case 'TokenOZ.sol':
      res = [output.contracts.name.Token.abi, output.contracts.name.Token.evm.bytecode];
      break;
    case 'TimelockOZ.sol':
      res = [output.contracts.name.Timelock.abi, output.contracts.name.Timelock.evm.bytecode];
      break;
      case 'BoxOZ.sol':
      res = [output.contracts.name.Box.abi, output.contracts.name.Box.evm.bytecode];
      break;
    case 'GovernanceOZ.sol':
      res = [output.contracts.name.Governance.abi, output.contracts.name.Governance.evm.bytecode];
      break;
  }

  return res;
};

module.exports = contractCompiler;