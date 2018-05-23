import React from 'react';
import contract from 'truffle-contract';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import BigNumber from 'bignumber.js';

const styles = {
  card: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: 10,
    raised: true,
    fontFamily: 'Roboto Slab',
  },
  button: {
    margin: 'auto',
    textTransform: 'none',
  },
};

class Lottery extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
        ticketAmount: 1,
        buttonText: 'Buy a Ticket for ether',
        buttonEnabled: false,
    };

    this.updateTicketAmount = this.updateTicketAmount.bind(this);

    // Get pre-built JSON ABI TODO change to grabbing published from web
    let contractJson = require('../build/contracts/LotterEth.json');
    this.LotterEth = contract(contractJson);
    this.LotterEth.setProvider(this.props.web3.currentProvider);

    this.address = '0x1a0f0e2c3c1ad06c449b9f4f5448060a9ad48d16';
  }

  updateLotteryParticipants() {
    this.LotterEth.at(this.address).then((at) => {
      at.ticketsBought().then((newParticipants) => {
        this.setState({
          lotteryParticipants: newParticipants.toString(),
        });
      });
      at.totalTickets().then((newJackpot) => {
        this.setState({
          jackpotNeeded: newJackpot.toString(),
        });
      });
    });
  }

  updateCurrentAccount() {
    this.props.web3.eth.getAccounts().then((newAccount) => {
      this.setState({
        account: newAccount.toString(),
      });
    });
  }

  buyTicket() {
    let x = new BigNumber(this.state.ticketAmount);
    let price = this.state.ticketPriceRaw * x;
    this.props.web3.eth.sendTransaction({
      from: this.state.account,
      to: this.address,
      value: price});
    this.updateLotteryParticipants();
  }

  componentWillMount() {
    this.LotterEth.at(this.address).then((at) => {
      at.ticketPrice().then((price) => {
        let convert = this.props.web3.utils.fromWei(price.toString(), 'ether');
        this.setState({
          ticketPriceRaw: price,
          ticketPrice: convert,
          buttonText: 'Buy a Ticket for '+convert.toString()+' ether',
        });
      });
    });
    this.updateLotteryParticipants();
  }

  componentDidMount() {
    // Update account and particpant state every second
    this.interval = setInterval(() => {
      this.updateCurrentAccount();
      this.updateLotteryParticipants();
    }, 1000);
  }

  updateTicketAmount(e) {
    if (e.target.value < 0) {
      this.setState({
        ticketAmount: 1,
        buttonText: 'Buy a Ticket for '+this.state.ticketPrice+' ether',
        buttonEnabled: false,
      });
    } else if (e.target.value === '' || Number(e.target.value) === 0) {
      this.setState({
        ticketAmount: e.target.value,
        buttonText: 'Buy '+ 0
          +' Tickets for '
          + 0
          +' ether',
        buttonEnabled: true,
      });
    } else if (e.target.value % 1 !== 0) {
      this.setState({
        ticketAmount: Math.floor(e.target.value),
        buttonEnabled: false,
      });
    } else {
      let x = new BigNumber(Number(e.target.value));
      let y = new BigNumber(1000000000000000000);
      this.setState({
        ticketAmount: e.target.value,
        buttonText: 'Buy '+ e.target.value
          +' Tickets for '
          + (x/y) * this.state.ticketPriceRaw
          +' ether',
        buttonEnabled: false,
      });
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography color="textSecondary">
            Lottery contestants:
          </Typography>
          <Typography component="p">
            {this.state.lotteryParticipants} / {this.state.jackpotNeeded}
          </Typography>
          <TextField
              id="ticket-amount"
              label="Tickets to buy"
              value={this.state.ticketAmount}
              onChange={this.updateTicketAmount}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button variant="raised" color="primary" className={classes.button}
            disabled={this.state.buttonEnabled}
            onClick={ () => this.buyTicket()}>
            {this.state.buttonText}
          </Button>
        </CardActions>
      </Card>
    );
  }
}
Lottery.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lottery);
