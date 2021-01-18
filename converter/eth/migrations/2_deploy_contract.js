const MxxConverter = artifacts.require("MxxConverter");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(MxxConverter)
};
