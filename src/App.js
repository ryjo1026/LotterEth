import React from 'react';
import Web3 from 'web3';
import Account from './components/Account.js';
import Lottery from './components/Lottery.js';
import Typography from '@material-ui/core/Typography';

class App extends React.Component {
  constructor(props, context) {
    super(props);

    // Initialize the web3 connection
    this.renderAccount = true;
    this.web3 = this.initWeb3();
  }

  initWeb3() {
    let web3 = window.web3;
    if (typeof web3 !== 'undefined') {
      // Check for injected web3 instance (MetaMask)
      web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ropsten.
      web3 = new Web3(new web3.providers.HttpProvider('https://ropsten.infura.io'));
      // Do not attempt to render account info without MetaMask
      this.renderAccount = false;
    }
    return web3;
  }

  // render Lottery and Account React components dependant on conditions
  render() {
    let AppAccount = (
      <div className="app">
          <Typography variant="display3" color="primary" align="center">
            LotterEth
          </Typography>
          <Account web3={this.web3}/>
          <Lottery web3={this.web3}/>
      </div>);
    let AppNoAccount = (
      <div className="app">
          <Typography variant="display3" color="primary" align="center">
            LotterEth
          </Typography>
          <Account web3={this.web3}/>
          <Lottery web3={this.web3}/>
      </div>);


    // Only render account info if we are using MetaMask
    if (this.renderAccount) {
      return AppAccount;
    }
    return AppNoAccount;
  }
}

export default App;
