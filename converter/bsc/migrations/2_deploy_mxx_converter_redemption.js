const MxxConverterRedemption = artifacts.require('MxxConverterRedemption');
const bMxx = artifacts.require('bMxx');
const DeedToken = artifacts.require('Deed'); // Deed = name of contract not file

module.exports = function(deployer, network, accounts) {
  // Use deployer to state migration tasks.
  deployer.deploy(bMxx).then(() => bMxx.deployed()).then(_bMxx => {
    deployer.deploy(MxxConverterRedemption, _bMxx.address);
    deployer.deploy(DeedToken, accounts[0], _bMxx.address);
  })
};