const SampleContract = artifacts.require("SampleContract");
const {
  expectEvent,  // Assertions for emitted events
} = require('@openzeppelin/test-helpers');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("SimpleContract", function (/* accounts */) {
  it("should assert true", async function () {
    const contract = await SampleContract.new();
    const tx = await contract.Foo(100);
    // console.log(tx);
    await expectEvent.inTransaction(tx.tx, contract, 'Test', { val: '100' });
  });
});
