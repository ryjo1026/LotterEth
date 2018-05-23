import React from 'react';
import Web3 from 'web3';
import Account from './components/Account.js';
import Lottery from './components/Lottery.js';
import Typography from '@material-ui/core/Typography';

class App extends React.Component {
  constructor(props, context) {
    super(props);

    this.web3 = this.initWeb3();
  }

  initWeb3() {
    let web3 = window.web3;
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ganache.
      web3 = new Web3(new web3.providers.HttpProvider('http://130.235.88.206:8500'));
    }
    return web3;
  }

  render() {
    return (
      <div className="app">
          <Typography variant="display3" color="primary" align="center">
            LotterEth
          </Typography>
          <Account web3={this.web3}/>
          <Lottery web3={this.web3}/>
      </div>);
  }
}

export default App;
