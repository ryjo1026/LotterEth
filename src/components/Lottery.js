import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';


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
        ticketPrice: 1,
        account: '',
    };

    // Get pre-built JSON interface from truffle
    let contractJson = require('../build/contracts/LotterEth.json');
    //
    let contract = require('truffle-contract');
    this.LotterEth = contract(contractJson);
    this.LotterEth.setProvider(this.props.web3.currentProvider);

    // this.address = '0x533e7693b92e0c77cd6c148dcbcc92f47ebbf980';
    this.address = '0x1a0f0e2c3c1ad06c449b9f4f5448060a9ad48d16'

    // this.LotterEth = new this.props.web3.eth.Contract(contractJson.abi,
    //   '0x533e7693b92e0c77cd6c148dcbcc92f47ebbf980');
    // this.LotterEth.methods.ticketsBought().call().then((result)=>console.log(result));

    this.LotterEth.at(this.address).then((at) => {
      at.ticketsBought().then((newParticipants) => {
        console.log(newParticipants);
        this.setState({
          lotteryParticipants: newParticipants.toString(),
        });
      });
    });
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
    this.props.web3.eth.sendTransaction({
      from: this.state.account,
      to: this.address,
      value: this.state.ticketPriceRaw});
    this.updateLotteryParticipants();
  }

  componentWillMount() {
    this.LotterEth.at(this.address).then((at) => {
      at.ticketPrice().then((price) => {
        this.setState({
          ticketPriceRaw: price,
          ticketPrice: this.props.web3.utils.fromWei(price.toString(), 'ether'),
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
        </CardContent>
        <CardActions>
          <Button variant="raised" color="primary" className={classes.button}
          onClick={ () => this.buyTicket()}>
            Buy a Ticket for {this.state.ticketPrice} ether
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
