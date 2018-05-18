import React, {Component} from 'react';
import './App.css';

class App extends Component {
  render() {
    App.web3Provider = web3.currentProvider();
    web3 = new Web3(web3.currentProvider);
    return (
      <div className="App">
        <h1> Hi </h1>
      </div>
    );
  }
}

export default App;
