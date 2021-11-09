const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider")
const AccountIndex = 1
require("dotenv").config({path:"./.env"})

console.log({mnemonic: process.env.MNEMONIC})
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://goerli.infura.io/v3/dca8ae6adf11425e8e709b01a56ab26d",
          AccountIndex
        )
      },
      network_id: 5
    },
    
    ropsten_infura: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          privateKeys:[process.env.ROPSTEN_ACCOUNT_KEY],
          providerOrUrl: "https://ropsten.infura.io/v3/dca8ae6adf11425e8e709b01a56ab26d",
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/",
        }),
      network_id: '3',
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
