import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const styles = {
  card: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: 10,
    raised: true,
  },
};

class Lottery extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
        lotteryparticipants: 0,
    };
  }

  updateLotteryParticipants() {
    this.props.contract.deployed().then(function(deployed) {
      console.log(deployed.ticketsBought());
      // deployed.methods.ticketPrice().call().then(console.log);
      //   (result) => {
      //   console.log(result);
      // });
    });
    // this.props.contract.methods.ticketPrice().call().then(console.log);
    //   (result) => {
    //   console.log(result);
    // });
  }

  componentDidMount() {
    this.updateLotteryParticipants();
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
            {this.state.lotteryparticipants}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}
Lottery.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lottery);
