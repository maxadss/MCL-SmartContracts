const MxxConverterRedemption = artifacts.require("MxxConverterRedemption");

const BN = require("bignumber.js");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MxxConverterRedemption", function (accounts) {
  let instance;
  before("Initial contract instance", async () => {
    instance = await MxxConverterRedemption.deployed();
  });
  it("contract deployed", async function () {
    await MxxConverterRedemption.deployed();
    return assert.isTrue(true);
  });

  it("try redeem", async () => {
    /**
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    await instance.redeem(
      Date.now(),
      accounts[1],
      accounts[2],
      new BN("10000").shiftedBy(18).toString(),
      new BN("0.001").shiftedBy(27).toString(),
    );
    return assert.isTrue(true);
  });
});
