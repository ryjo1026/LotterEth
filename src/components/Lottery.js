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

    let contract = require('truffle-contract');
    this.LotterEth = contract(contractJson);
    this.LotterEth.setProvider(this.props.web3.currentProvider);
  }

  updateLotteryParticipants() {
    this.LotterEth.deployed().then((deployed) => {
      deployed.ticketsBought().then((newParticipants) => {
        this.setState({
          lotteryParticipants: newParticipants.toString(),
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
    this.LotterEth.deployed().then((deployed) => {
      deployed.buyTickets(1, {
        from: this.state.account,
        value: this.state.ticketPriceRaw}).then(console.log);
    });
    this.updateLotteryParticipants();
  }

  componentWillMount() {
    this.LotterEth.deployed().then((deployed) => {
      deployed.ticketPrice().then((price) => {
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
            {this.state.lotteryParticipants}
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
