const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");

const MxxConverter = artifacts.require("MxxConverter");

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

  before(() => {
    web3.eth.defaultAccount = owner;
  });

  beforeEach("Initial contract instance", async () => {
    converterInstance = await MxxConverter.new();
  });

  
});
