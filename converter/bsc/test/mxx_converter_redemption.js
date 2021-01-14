const MxxConverterRedemption = artifacts.require("MxxConverterRedemption");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MxxConverterRedemption", function (/* accounts */) {
  it("should assert true", async function () {
    await MxxConverterRedemption.deployed();
    return assert.isTrue(true);
  });
});
