let LotterEth = artifacts.require('./LotterEth.sol');

module.exports = function(deployer) {
  deployer.deploy(LotterEth);
};
