const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");

const MxxConverter = artifacts.require("MxxConverter");
const MockupMXX = artifacts.require("MockupMXX");

BigNumber.set({
  DECIMAL_PLACES: 48,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-48, 48],
});

contract("01_conversion", function (accounts) {
  const owner = accounts[0];
  const user = accounts[1];
  const bscUser = accounts[2];
  const burner = accounts[5];
  const MXX_DECIMAL = 8;
  const INTIAL_AVAILABLE_MXX = 415_000_000;
  let converterInstance;
  let mxxInstance;

  before(() => {
    web3.eth.defaultAccount = owner;
  });

  beforeEach("Initial contract instance", async () => {
    mxxInstance = await MockupMXX.new("Multiplier", "MXX");
    converterInstance = await MxxConverter.new(mxxInstance.address, burner);
  });

  it("should be able to deposit", async () => {
    const amountToDeposit = new BigNumber(100).shiftedBy(MXX_DECIMAL).toString();
    // ? Prepare MXX to deposit
    await mxxInstance.mint(user, amountToDeposit, {from: owner});
    // ? Approve MXX to Converter
    await mxxInstance.approve(converterInstance.address, amountToDeposit, {from: user});

    await converterInstance.depositForConversion(
      user,
      amountToDeposit,
      {
        from: user,
      }
    );
    await assert.isTrue(true, 'depositForConversion is not success');
  });

  it("should fail when amount <= 0", async () => {
    // const availableMxxAmt = (await converterInstance.availableMxxAmt()).toString()
    /**
     * @dev List params:
     * @param _toBscAddress
     * @param _amount
     */
    const deposit = converterInstance.depositForConversion(user, "0");
    await truffleAssert.reverts(deposit, "Amount cannot be 0");
  });

  it("should fail when amount > availableMxxAmt", async () => {
    // const availableMxxAmt = (await converterInstance.availableMxxAmt()).toString()
    const amountToDeposit = new BigNumber(INTIAL_AVAILABLE_MXX + 1).shiftedBy(MXX_DECIMAL).toString();
    await mxxInstance.mint(user, amountToDeposit, {from: owner});
    await mxxInstance.approve(converterInstance.address, amountToDeposit, {from: user});
    /**
     * @dev List params:
     * @param _toBscAddress
     * @param _amount
     */
    const deposit = converterInstance.depositForConversion(
      user,
      amountToDeposit,
      {
        from: user,
      }
    );
    await truffleAssert.reverts(deposit, "Amount exceeded");
  });

  it("should emit valid event NewConversion when deposit", async () => {
    // const availableMxxAmt = (await converterInstance.availableMxxAmt()).toString()
    const amountToDeposit = new BigNumber(100).shiftedBy(MXX_DECIMAL).toString();
    await mxxInstance.mint(user, amountToDeposit, {from: owner});
    await mxxInstance.approve(converterInstance.address, amountToDeposit, {from: user});
    /**
     * @dev List params:
     * @param _toBscAddress
     * @param _amount
     */
    const deposit = await converterInstance.depositForConversion(
      bscUser,
      amountToDeposit,
      {
        from: user,
      }
    );
    truffleAssert.eventEmitted(deposit, 'NewConversion', (event) => {
      const { index, from, to, amount, feePcnt } = event;
      const indexValid = Boolean(index);
      const fromValid = from === user;
      const toValid = to === bscUser;
      const amountValid = new BigNumber(amount).eq(amountToDeposit);
      const feeValid = Boolean(feePcnt);

      return [indexValid, fromValid, toValid, amountValid, feeValid].every(validator => !!validator);
    });
  });

  
  it("should deduct availableMxxAmt after deposit", async () => {
    const availableMxxAmtBefore = await converterInstance.availableMxxAmt();
    // ? Deposít 100 MXX
    const amountToDeposit = new BigNumber(100).shiftedBy(MXX_DECIMAL).toString();
    // ? Prepare MXX to deposit
    await mxxInstance.mint(user, amountToDeposit, {from: owner});
    // ? Approve MXX to Converter
    await mxxInstance.approve(converterInstance.address, amountToDeposit, {from: user});

    await converterInstance.depositForConversion(
      user,
      amountToDeposit,
      {
        from: user,
      }
    );

    const availableMxxAmtAfter = await converterInstance.availableMxxAmt();

    const availableMxxAmtDiff = new BigNumber(availableMxxAmtAfter).minus(availableMxxAmtBefore).shiftedBy(-8).toNumber();

    assert.equal(availableMxxAmtDiff, -100, 'Invalid availableMxxAmt')
  });

  
  it("should increase index after deposit", async () => {
    const indexBefore = await converterInstance.index();
    const amountToDeposit = new BigNumber(100).shiftedBy(MXX_DECIMAL).toString();
    // ? Prepare MXX to deposit
    await mxxInstance.mint(user, amountToDeposit, {from: owner});
    // ? Approve MXX to Converter
    await mxxInstance.approve(converterInstance.address, amountToDeposit, {from: user});

    await converterInstance.depositForConversion(
      user,
      amountToDeposit,
      {
        from: user,
      }
    );

    const indexAfter = await converterInstance.index();

    const indexDiff = new BigNumber(indexAfter).minus(indexBefore).toNumber();

    assert.equal(indexDiff, 1, 'Invalid availableMxxAmt')
  });
});
