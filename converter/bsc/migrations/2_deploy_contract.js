const MxxConverterRedemption = artifacts.require("MxxConverterRedemption");
const bMxx = artifacts.require("bMXX");
const DeedToken = artifacts.require("Deed"); // Deed = name of contract not file

module.exports = function (deployer, network, accounts) {
  // Use deployer to state migration tasks.
  deployer
    .deploy(bMxx)
    .then(() => bMxx.deployed())
    .then((_bMxx) => {
      return deployer.deploy(MxxConverterRedemption, _bMxx.address).then(() => {
        return deployer.deploy(DeedToken, accounts[0], _bMxx.address);
      });
    });
};
