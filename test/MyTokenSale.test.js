const TokenSale = artifacts.require("./MyTokenSale")
const Token = artifacts.require("./MyToken")
const KYC = artifacts.require("./KYC")
const BN = web3.utils.BN;

const chai = require('./setup')
const expect = chai.expect

contract("Token Sale test", async (accounts) => {

 const [deployerAccount, receipient1, recepient2] = accounts

 it("should not have any tokens in the deployerAccount", async () => {
  let instance = await Token.deployed();
  let deployerAccountBalance = await instance.balanceOf(deployerAccount)
  return expect(deployerAccountBalance).to.be.a.bignumber.equal(new BN(0));
 })

 it("should have all tokens in the TokenSale Contract", async () => {
  let instance = await Token.deployed();
  let totalSupply = await instance.totalSupply();
  let TokenSaleAccountBalance = await instance.balanceOf(TokenSale.address)
  return expect(TokenSaleAccountBalance).to.be.a.bignumber.equal(totalSupply);
 })

 it("should be able to buy tokens", async () => {
  let tokenInstance = await Token.deployed();
  let tokenSaleInstance = await TokenSale.deployed();
  let kycInstance = await KYC.deployed();
  
  let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
  await expect(kycInstance.setKYCCompleted(deployerAccount)).to.eventually.be.fulfilled
  await expect(tokenSaleInstance.sendTransaction({
   from: deployerAccount,
   value: web3.utils.toWei("1", "wei")
  })).to.eventually.be.fulfilled
  return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
 })

});