import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
  }
  
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players, balance});
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting for the transacion success...'});
    
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have been entered!'});
  }

  pickWinner = async (event) => {
    const accounts = await web3.eth.getAccounts()

    this.setState({message: 'Waiting for the transaction success...'});
    
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message: 'A winner has been picked!'});
  } 
  
  render() {
    return (
      <div>
        <h1>Lottery Contract</h1>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people 
          entering to compete to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.
        </p>

        <hr />

        <h3>Want to try your luck?</h3>
        <form onSubmit={this.onSubmit}>
          <label>Amount of ether to enter </label>
          <input
            value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}
          />
          <button>
            Enter
          </button>
        </form>

        <hr />
          <h4>Time to pick a winner?</h4>
          <button onClick={this.pickWinner}>Pick a Winner!</button>

        <hr />

        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
