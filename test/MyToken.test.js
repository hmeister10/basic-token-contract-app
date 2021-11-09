const Token = artifacts.require("./MyToken")
const BN = web3.utils.BN;
const chai = require('./setup')
const expect = chai.expect

contract("Token test", async (accounts) => {

 const [deployerAccount, receipient1, recepient2] = accounts

 // beforeEach(async () => {
  
 // })

 it("all tokens should be in the base account", async () => {
  const numberOfTokens = process.env.INITIAL_TOKENS
  const myToken = await Token.new(numberOfTokens)

  let instance = await myToken;
  let totalSupply = await instance.totalSupply();
  let balance = await instance.balanceOf(deployerAccount)
  return expect(balance).to.be.a.bignumber.equal(totalSupply);
 })

 it("is possile to send tokens between accounts", async () => {
  const sendTokens = 1;
  const numberOfTokens = process.env.INITIAL_TOKENS
  const myToken = await Token.new(numberOfTokens)

  let instance = await myToken;
  let totalSupply = await instance.totalSupply();
  await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
  await expect(instance.transfer(receipient1, sendTokens)).to.eventually.be.fulfilled;
  await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
  return expect(instance.balanceOf(receipient1)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
 })

 it("is not possile to send more tokens than available in total between accounts", async () => {
  
  const numberOfTokens = process.env.INITIAL_TOKENS
  const myToken = await Token.new(numberOfTokens)

  let instance = await myToken;
  let balanceOfDeployer = await instance.balanceOf(deployerAccount)
  let transfer = instance.transfer(receipient1, new BN(balanceOfDeployer+1))
  await expect(transfer).to.eventually.be.rejected
  return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
 })
});