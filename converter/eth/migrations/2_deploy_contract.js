const MxxConverter = artifacts.require("MxxConverter");
const MockupMXX = artifacts.require('MockupMXX');

module.exports = function (deployer, network, accounts) {
  // Use deployer to state migration tasks.
  deployer.deploy(MockupMXX, 'Multiplier', 'MXX')
    .then(() => MockupMXX.deployed())
    .then((_Mxx) => {
      return deployer.deploy(MxxConverter, _Mxx.address, accounts[5]);
    })
};
