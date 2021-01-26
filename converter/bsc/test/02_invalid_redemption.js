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

contract("02_invalid_redemption", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const MXX_DECIMAL = 8;
  const PERCENTAGE_DECIMAL = 8;
  const CONVERTER_FEE = 0.01;
  const CONVERT_RATIO = 0.01;
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
  });

  it("should throw if amount > availablebMxxAmt", async () => {
    const availablebMxxAmt = (await converterInstance.availablebMxxAmt()).toString();
    const mxxToConvert = new BigNumber(availablebMxxAmt).plus(1).div(CONVERT_RATIO).toString();
    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    const redeem = converterInstance.redeem(
      Date.now(),
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL)
    );
    await truffleAssert.reverts(redeem, 'Amount exceeded');
  });

  it("should throw when user is not owner", async () => {
    const mxxToConvert = 100;
    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    const redeem = converterInstance.redeem(
      Date.now(),
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL),
      {
        from: user1,
      }
    );
    await truffleAssert.reverts(redeem, );
  });

  it("should throw when id existed", async () => {
    const mxxToConvert = 100;
    const id = Date.now();
    /**
     * @dev List params:
     * @param _id
     * @param _fromAddress
     * @param _toBscAddress
     * @param _mxxAmt
     * @param _feePcnt
     */
    await converterInstance.redeem(
      id,
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL),
    );

    const redeem = converterInstance.redeem(
      id,
      user1,
      user2,
      new BigNumber(mxxToConvert).shiftedBy(MXX_DECIMAL).toString(),
      new BigNumber(CONVERTER_FEE).shiftedBy(PERCENTAGE_DECIMAL),
    );
    await truffleAssert.reverts(redeem, 'Already exist', 'should fail when tx_id existed');
  });
});
