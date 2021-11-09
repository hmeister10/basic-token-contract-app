import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KYC from "./contracts/KYC.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, tokenSaleAddress: "", userTokens:0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      const deployedNetwork = MyToken.networks[networkId];
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[networkId] && MyToken.networks[networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KYC.abi,
        KYC.networks[networkId] && KYC.networks[networkId].address,
      );
      
      const kycStatus = await this.kycInstance.methods.kycCompleted(this.accounts[0]).call()
      const kycOwner = await this.kycInstance.methods.owner().call()
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.listenToTokenTransfer()
      this.setState({
        loaded: true, 
        tokenSaleAddress: MyTokenSale.networks[networkId].address,
        kycStatus,
        isKycOwner: this.accounts[0] === kycOwner
      }, this.updateUserTokens)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type == "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  
  handleAddToWhitelist = async () => {
    this.kycInstance.methods.setKYCCompleted(this.state.kycAddress).send({
      from: this.accounts[0]
    })

  }

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods
      .buyTokens(this.accounts[0])
      .send({
        from: this.accounts[0], 
        value: this.web3.utils.toWei("1", "wei")
      })
  }

  listenToTokenTransfer = async () => {
    this.tokenInstance.events.Transfer({
      to: this.accounts[0]
    }).on("data", this.updateUserTokens)
  }

  updateUserTokens = async () => {
     try {
        console.log(typeof this.accounts[0])
        console.log(this.tokenInstance.methods);

        let userTokens = await this.tokenInstance.methods
          .balanceOf(this.accounts[0])
          .call()
        console.log({userTokens})
        this.setState({userTokens})
        // console.log({kycObj})
      } catch(err) {
        console.log({err})
      }
  }

  getOwnerData = () => {
    if(this.state.isKycOwner) {
    return (
      <div>
        <h2>KYC Whitelisting</h2>
        <div>
          <label>Address to allow:</label> <input 
            type="text" 
            name="kycAddress" 
            value={ this.state.kycAddress}
            onChange={this.handleInputChange}/>
          <button onClick={this.handleAddToWhitelist}>Add to whitelist</button>
        </div>
      </div>)
    } else {
      return (<></>)
    }
  }

  kycStatus = () => {
    console.log(this.state.kycStatus)
    if(!this.state.kycStatus) {
      return (
        <div>
          <p>KYC hasnt been completed yet</p>
          <p>Ask the admin to complete the KYC for your address</p>
          <p>Address: {this.accounts[0]}</p>

        </div>
      )
    } else {
      return (
      <div>
          <h2>Buy Tokens</h2>
          <div>
            <p>You currently have {this.state.userTokens} CAPPU tokens</p>
          </div>
          <div>
            <p>Token Sale Address: {this.state.tokenSaleAddress} </p>
            <button onClick={this.handleBuyTokens}>Buy 1 token</button>
          </div>
        </div>
      )
    }
  }

  render() {
    if (!this.web3 && !this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappuchino Sale</h1>
        <p>Get your tokens now.</p>
        {this.getOwnerData()}
        
        {this.kycStatus()}
        

      </div>
    );
  }
}

export default App;
