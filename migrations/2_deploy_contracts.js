var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");
var MyKYC = artifacts.require("./KYC");
require("dotenv").config({path:"../.env"})

module.exports = async function(deployer) {

  let address = await web3.eth.getAccounts()
  const numberOfTokens = process.env.INITIAL_TOKENS
  await deployer.deploy(MyToken, numberOfTokens);
  await deployer.deploy(MyKYC);
  await deployer.deploy(MyTokenSale, 1, address[0], MyToken.address, MyKYC.address);

  let instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, numberOfTokens)
};
