const HDWalletProvider = require("truffle-hdwallet-provider");

const INFURA_URL = process.env.INFURA_URL || "";
const MNEMONIC = process.env.MNEMONIC || "";

module.exports = {
  networks: {
    development: { // for ganache
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, INFURA_URL)
      },
      network_id: 3,
      gas: 4700000,
      gasPrice: 20000000000
    },
    mainnet: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 1,
      gasPrice: 20000000000
    }
  }
};
