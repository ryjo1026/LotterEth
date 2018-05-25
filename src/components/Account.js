import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Styles for Material-UI
const styles = {
  card: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: 10,
    raised: true,
  },
};

// Current account info for MetaMask
class Account extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
        account: '',
        balance: '',
    };
  }

  // Updates current balance of account via Async web3 call
  updateCurrentBalance(account) {
    this.props.web3.eth.getBalance(account.toString()).then((newBalance) => {
      this.setState({
        balance: this.props.web3.utils.fromWei(newBalance, 'ether').toString(),
      });
    });
  }

  // Updates current account via Async web3 call
  updateCurrentAccount() {
    this.props.web3.eth.getAccounts().then((newAccount) => {
      this.updateCurrentBalance(newAccount);
      this.setState({
        account: newAccount.toString(),
      });
    });
  }

  // REACT EVENTS ----------

  componentDidMount() {
    // Update account state every second in case changed in MetaMask
    this.interval = setInterval(() => {
      this.updateCurrentAccount();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography color="textSecondary">
              Current Account:
            </Typography>
            <Typography component="p">
              {this.state.account}
            </Typography>
            <Typography color="textSecondary">
              Balance:
            </Typography>
            <Typography component="p">
              {this.state.balance} ether
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}
Account.propTypes = {
  // Necessary for Material-UI
  classes: PropTypes.object.isRequired,
};

// Export with Material-UI styles
export default withStyles(styles)(Account);
