import { makeSuite, TestEnv } from "./helpers/make-suite";
import {
  DefaultReserveInterestRateStrategy,
  LendingPoolAddressesProvider,
  MToken,
} from "../types";
import { deployDefaultReserveInterestRateStrategy } from "../helpers/contracts-deployments";
import { RAY } from "../helpers/constants";
import BigNumber from "bignumber.js";

const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
makeSuite("Interest rate strategy", (testEnv: TestEnv) => {
  let _strategyInstance: DefaultReserveInterestRateStrategy;
  let _addressesProviderInstance: LendingPoolAddressesProvider;
  let baseVar: string;
  let varSlope1: string;
  let varSlope2: string;
  let stableSlope1: string;
  let stableSlope2: string;

  before("Initializing test variables", async () => {
    _addressesProviderInstance = testEnv.addressesProvider;
    baseVar = "10000000000000000000000000";
    varSlope1 = "70000000000000000000000000";
    varSlope2 = "1500000000000000000000000000";
    stableSlope1 = "60000000000000000000000000";
    stableSlope2 = "1500000000000000000000000000";
  });

  it("Deploys a new instance of a DefaultReserveInterestRateStrategy contract", async () => {
    const { dai } = testEnv;

    _strategyInstance = await deployDefaultReserveInterestRateStrategy(
      [
        dai.address,
        _addressesProviderInstance.address,
        "10000000000000000000000000",
        "70000000000000000000000000",
        "1500000000000000000000000000",
        "60000000000000000000000000",
        "1500000000000000000000000000",
      ],
      false
    );
  });

  it("Checks rates at 0% utilization rate", async () => {
    const { dai } = testEnv;
    const data: any = await _strategyInstance.calculateInterestRates(
      dai.address,
      "1000000000000000000",
      "0",
      "0",
      "0"
    );

    expect(data.currentLiquidityRate.toString()).to.be.equal(
      "0",
      "Invalid liquidity rate"
    );
    expect(data.currentStableBorrowRate.toString()).to.be.equal(
      new BigNumber(0.00000000001).times(RAY).toFixed(0),
      "Invalid stable rate"
    );
    expect(data.currentVariableBorrowRate.toString()).to.be.equal(
      baseVar,
      "Invalid variable rate"
    );
  });

  it("Checks rates at 80% utilization rate", async () => {
    const { dai } = testEnv;
    const data: any = await _strategyInstance.calculateInterestRates(
      dai.address,
      "200000000000000000",
      "0",
      "800000000000000000",
      "0"
    );

    const expectedVariableRate = new BigNumber(baseVar).plus(varSlope1);

    expect(data.currentLiquidityRate.toString()).to.be.equal(
      expectedVariableRate.times(0.8).toFixed(0),
      "Invalid liquidity rate"
    );

    expect(data.currentVariableBorrowRate.toString()).to.be.equal(
      new BigNumber(baseVar).plus(varSlope1).toFixed(0),
      "Invalid variable rate"
    );

    // expect(data.currentStableBorrowRate.toString()).to.be.equal(
    //   new BigNumber(0)
    //     .times(RAY)
    //     .plus(stableSlope1)
    //     .toFixed(0),
    //   "Invalid stable rate"
    // );
  });

  it("Checks rates at 100% utilization rate", async () => {
    const { dai } = testEnv;
    const data: any = await _strategyInstance.calculateInterestRates(
      dai.address,
      "0",
      "0",
      "1000000000000000000",
      "0"
    );

    const expectedVariableRate = new BigNumber(baseVar)
      .plus(varSlope1)
      .plus(varSlope2)
      .toFixed(0);

    expect(data.currentLiquidityRate.toString()).to.be.equal(
      expectedVariableRate,
      "Invalid liquidity rate"
    );

    expect(data.currentVariableBorrowRate.toString()).to.be.equal(
      expectedVariableRate,
      "Invalid variable rate"
    );

    expect(data.currentStableBorrowRate.toString()).to.be.equal(
      new BigNumber(0)
        .times(RAY)
        .plus(stableSlope1)
        .plus(stableSlope2)
        .toFixed(0),
      "Invalid stable rate"
    );
  });
});
