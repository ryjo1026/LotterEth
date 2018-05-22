import Loading from './Loading.js';
import {drizzleConnect} from 'drizzle-react';

const mapStateToProps = (state) => {
  return {
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  };
};

const LoadingContainer = drizzleConnect(Loading, mapStateToProps);

export default LoadingContainer;
