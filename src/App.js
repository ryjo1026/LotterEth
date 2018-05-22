import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';

class App extends Component {
  constructor(props, context) {
    super(props);

    this.web3 = this.initWeb3();
    this.contracts = [];
    this.account = '0x0';

    this.initContract();
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

  initContract() {
    // Get pre-built JSON interface from truffle
    let contractJson = require('./build/contracts/LotterEth.json');

    let contract = require('truffle-contract');
    let LotterEth = contract(contractJson);
    LotterEth.setProvider(this.web3.currentProvider);

    LotterEth.deployed().then(function(deployed) {
      console.log('ayy');
    });
  }

  // initContract() {
  //   $.getJSON("Lottery.json", function(lottery){
  //     App.contracts.Lottery = TruffleContract(lottery);
  //     App.contracts.Lottery.setProvider(this.web3Provider)
  //   })
  // }

  render() {
    return (
        <div className="web3">
          BOI
      </div>);
  }
}

export default App;
