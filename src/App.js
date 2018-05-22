import React from 'react';
import Web3 from 'web3';
import './App.css';


class AccountList extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
          accounts: [],
    };
  }

  updateCurrentAccount() {
    this.props.web3.eth.getAccounts().then((newAccounts) => {
      this.setState({
        accounts: newAccounts,
        });
      });
  }

  render() {
    // Continuously update account state
    updateCurrentAccount();

    const listAccounts = this.state.accounts.map((account) =>
      <li key={account.toString()}>
        {account}
      </li>
    );
    return (<ul>{listAccounts}</ul>);
  }
}


class App extends React.Component {
  constructor(props, context) {
    super(props);

    this.web3 = this.initWeb3();
    this.contract = this.initContract();
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

    return LotterEth;
  }


  // initContract() {
  //   $.getJSON("Lottery.json", function(lottery){
  //     App.contracts.Lottery = TruffleContract(lottery);
  //     App.contracts.Lottery.setProvider(this.web3Provider)
  //   })
  // }

  render() {
    return (
      <div className="app">
          <AccountList web3={this.web3}/>
      </div>);
  }
}

export default App;
