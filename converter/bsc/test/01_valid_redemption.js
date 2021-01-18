const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");

const MxxConverterRedemption = artifacts.require("MxxConverterRedemption");
const BMxx = artifacts.require("bMXX"); // bMXX = name of contract not file
const DeedToken = artifacts.require("Deed"); // Deed = name of contract not file

BigNumber.set({
  DECIMAL_PLACES: 48,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-48, 48],
});

contract("01_valid_redemption", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const MXX_DECIMAL = 8;
  const BMXX_DECIMAL = 18;
  const PERCENTAGE_DECIMAL = 8;
  const CONVERTER_FEE = 0.01;
  const CONVERT_RATIO = 0.01;
  const INTIAL_AVAILABLE_BMXX = 4_150_000;
  let converterInstance;
  let bMxxInstance;
  let deedInstance;

  before(() => {
    web3.eth.defaultAccount = owner;
  });

  beforeEach("Initial contract instance", async () => {
    bMxxInstance = await BMxx.new();
    deedInstance = await DeedToken.new(owner, bMxxInstance.address);
    converterInstance = await MxxConverterRedemption.new(bMxxInstance.address);
    await bMxxInstance.setupConverter(
      converterInstance.address,
      deedInstance.address
    );
    // await bMxxInstance.mint(
    //   converterInstance.address,
    //   new BigNumber(INTIAL_AVAILABLE_BMXX).shiftedBy(18).toString()
    // );
  });

  it("should send bMXX to user (no fee)", async () => {
    const mxxToConvert = 100;
    const expectedBMXXReceiveUnshifted = mxxToConvert * CONVERT_RATIO;
    const expectedBMXXReceive = new BigNumber(
      expectedBMXXReceiveUnshifted
    ).shiftedBy(BMXX_DECIMAL);

    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    await converterInstance.redeem(
      Date.now(),
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(0).shiftedBy(PERCENTAGE_DECIMAL)
    );
    const receiverBalanceAfter = (
      await bMxxInstance.balanceOf(user2)
    ).toString();
    const balanceDiff = expectedBMXXReceive
      .minus(receiverBalanceAfter)
      .toNumber();

    const converterAvailableBMxx = (
      await converterInstance.availablebMxxAmt()
    ).toString();

    const expectedAvailableBMxx = new BigNumber(INTIAL_AVAILABLE_BMXX)
      .minus(mxxToConvert * CONVERT_RATIO)
      .shiftedBy(BMXX_DECIMAL);
    const availableBMxxDiff = expectedAvailableBMxx
      .minus(converterAvailableBMxx)
      .toNumber();

    // console.debug({
    //   converterAvailableBMxx,
    //   expectedConverterBalance: expectedAvailableBMxx.toString()
    // })

    assert.equal(balanceDiff, 0, "user2 balance is incorrect");
    assert.equal(
      availableBMxxDiff,
      0,
      "converter available BMXX after redeem is incorrect"
    );
  });

  it("should send bMXX to user (1% fee deducted)", async () => {
    const mxxToConvert = 100;
    const expectedBMXXReceiveUnshifted =
      mxxToConvert * CONVERT_RATIO * (1 - CONVERTER_FEE);
    const expectedBMXXReceive = new BigNumber(
      expectedBMXXReceiveUnshifted
    ).shiftedBy(BMXX_DECIMAL);

    // const balanceBefore = (
    //   await bMxxInstance.balanceOf(user2)
    // ).toString();

    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    await converterInstance.redeem(
      Date.now(),
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL)
    );
    const balanceAfter = (await bMxxInstance.balanceOf(user2)).toString();
    const balanceDiff = expectedBMXXReceive.minus(balanceAfter).toNumber();

    // console.debug({
    //   balanceBefore,
    //   balanceAfter,
    //   expectedBMXXReceive: expectedBMXXReceive.toString()
    // })

    const converterAvailableBMxx = (
      await converterInstance.availablebMxxAmt()
    ).toString();

    const expectedAvailableBMxx = new BigNumber(INTIAL_AVAILABLE_BMXX)
      .minus(mxxToConvert * CONVERT_RATIO)
      .shiftedBy(BMXX_DECIMAL);
    const availableBMxxDiff = expectedAvailableBMxx
      .minus(converterAvailableBMxx)
      .toNumber();

    // console.debug({
    //   converterAvailableBMxx,
    //   expectedConverterBalance: expectedAvailableBMxx.toString()
    // })

    assert.equal(balanceDiff, 0, "user2 balance is incorrect");
    assert.equal(
      availableBMxxDiff,
      0,
      "converter available BMXX after redeem is incorrect"
    );
  });


  it("should be able to convert == MAX_AVAIL_BMXX_FOR_CONVERSION", async () => {
    const mxxToConvert = INTIAL_AVAILABLE_BMXX;
    const expectedBMXXReceiveUnshifted =
      mxxToConvert * CONVERT_RATIO * (1 - CONVERTER_FEE);
    const expectedBMXXReceive = new BigNumber(
      expectedBMXXReceiveUnshifted
    ).shiftedBy(BMXX_DECIMAL);

    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    await converterInstance.redeem(
      Date.now(),
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL)
    );
    const balanceAfter = (await bMxxInstance.balanceOf(user2)).toString();
    const balanceDiff = expectedBMXXReceive.minus(balanceAfter).toNumber();

    // console.debug({
    //   balanceBefore,
    //   balanceAfter,
    //   expectedBMXXReceive: expectedBMXXReceive.toString()
    // })

    const converterAvailableBMxx = (
      await converterInstance.availablebMxxAmt()
    ).toString();

    const expectedAvailableBMxx = new BigNumber(INTIAL_AVAILABLE_BMXX)
      .minus(mxxToConvert * CONVERT_RATIO)
      .shiftedBy(BMXX_DECIMAL);
    const availableBMxxDiff = expectedAvailableBMxx
      .minus(converterAvailableBMxx)
      .toNumber();

    // console.debug({
    //   converterAvailableBMxx,
    //   expectedConverterBalance: expectedAvailableBMxx.toString()
    // })

    assert.equal(balanceDiff, 0, "user2 balance is incorrect");
    assert.equal(
      availableBMxxDiff,
      0,
      "converter available BMXX after redeem is incorrect"
    );
  });


  it("should emit event RedeemedSuccess", async () => {
    const mxxToConvert = 100;
    const _id = Date.now();
    const expectedbMxxAmt = new BigNumber(mxxToConvert * CONVERT_RATIO)
      .shiftedBy(BMXX_DECIMAL)
      .toString();
    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    const result = await converterInstance.redeem(
      _id,
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL)
    );
    truffleAssert.eventEmitted(result, "RedeemedSuccess", (event) => {
      const idValid = event.index == _id;
      const fromAddressValid = event.from === user1;
      const bscAddressValid = event.to === user2;
      const bMxxAmtValid = event.amtbMxx.toString() === expectedbMxxAmt;

      const validators = [
        idValid,
        fromAddressValid,
        bscAddressValid,
        bMxxAmtValid,
      ];

      // console.debug(validators);

      return validators.every((valid) => valid);
    });
    // truffleAssert.prettyPrintEmittedEvents(result);
  });
});
