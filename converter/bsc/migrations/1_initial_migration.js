const Migrations = artifacts.require("Migrations");

const MxxConverterRedemption = artifacts.require('MxxConverterRedemption');
const bMxx = artifacts.require('bMxx');
const DeedToken = artifacts.require('Deed'); // Deed = name of contract not file

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Migrations);
  // Use deployer to state migration tasks.
  deployer.deploy(bMxx).then(() => {
    deployer.deploy(MxxConverterRedemption, bMxx.address);
    deployer.deploy(DeedToken, accounts[0], bMxx.address);
  })
};