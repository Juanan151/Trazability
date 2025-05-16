require("@nomicfoundation/hardhat-toolbox");

  module.exports = {
    solidity: {
      version: "0.8.24",
      settings: {
        evmVersion: "london"
      },
    },
    networks: {
      besu: {
        url: "http://localhost:8545",
        chainId: 1982, 
        accounts: ['0x0709c36acb5a539568840291e2a2ffadf92ac09189ed4eb5b64ef33d2f60c237'],
      }
    }
    
  };
