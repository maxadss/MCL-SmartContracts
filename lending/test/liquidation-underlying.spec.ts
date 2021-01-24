import BigNumber from "bignumber.js";
import { web3 } from "hardhat";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  oneEther,
  RATEMODE_STABLE,
  RATEMODE_VARIABLE,
} from "../helpers/constants";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import {
  LendingPool,
  LendingPoolAddressesProvider,
  LendingPoolCore,
  PriceOracle,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const { expect } = require("chai");

const almostEqual: any = function (this: any, expected: any, actual: any): any {
  this.assert(
    expected.plus(new BigNumber(1)).eq(actual) ||
      expected.plus(new BigNumber(2)).eq(actual) ||
      actual.plus(new BigNumber(1)).eq(expected) ||
      actual.plus(new BigNumber(2)).eq(expected) ||
      expected.eq(actual),
    "expected #{act} to be almost equal #{exp}",
    "expected #{act} to be different from #{exp}",
    expected.toString(),
    actual.toString()
  );
};

require("chai").use(function (chai: any, utils: any) {
  chai.Assertion.overwriteMethod("almostEqual", function (original: any) {
    return function (this: any, value: any) {
      if (utils.flag(this, "bignumber")) {
        var expected = new BigNumber(value);
        var actual = new BigNumber(this._obj);
        almostEqual.apply(this, [expected, actual]);
      } else {
        original.apply(this, arguments);
      }
    };
  });
});

makeSuite(
  "LendingPool liquidation - liquidator receiving underlying asset",
  (testEnv: TestEnv) => {
    // contract(
    //   "LendingPool liquidation - liquidator receiving underlying asset",
    //   async ([deployer, ...users]) => {
    // let _testEnvProvider: ITestEnv;
    let _lendingPoolInstance: LendingPool;
    let _lendingPoolCoreInstance: LendingPoolCore;
    let _priceOracleInstance: PriceOracle;
    // let _mTokenInstances: ImTokenInstances;
    // let _tokenInstances: ITokenInstances;
    let _lendingPoolAddressesProviderInstance: LendingPoolAddressesProvider;

    let _daiAddress: string;

    // let _reservesParams: IReservesParams;

    // let _depositorAddress: string;
    // let _borrowerAddress: string;

    // let _web3: Web3;

    let _initialDepositorETHBalance: string;

    const halfEther = (0.5 * Math.pow(10, 18)).toString();

    before("Initializing LendingPool test variables", async () => {
      //_reservesParams = await getReservesParams();
      _lendingPoolInstance = testEnv.pool;
      _lendingPoolCoreInstance = testEnv.core;
      _priceOracleInstance = testEnv.oracle;
      //_mTokenInstances = mTokenInstances;
      _lendingPoolAddressesProviderInstance = testEnv.addressesProvider;
      // _tokenInstances = await getAllTokenInstances();
      _daiAddress = testEnv.dai.address;
      // _depositorAddress = await getFirstDepositorAddressOnTests();
      // _borrowerAddress = await getFirstBorrowerAddressOnTests();

      // _web3 = await getWeb3();
      _initialDepositorETHBalance = await web3.eth.getBalance(
        testEnv.users[1].address
      );
    });

    it("LIQUIDATION - Deposits ETH, borrows DAI", async () => {
      const { dai, users } = testEnv;

      const _depositorAddress = users[1];
      const _borrowerAddress = users[2];

      //mints DAI to depositor
      await dai
        .connect(_depositorAddress.signer)
        .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
          // from: _depositorAddress,
        });

      //approve protocol to access depositor wallet
      await dai
        .connect(_depositorAddress.signer)
        .approve(
          _lendingPoolCoreInstance.address,
          APPROVAL_AMOUNT_LENDING_POOL_CORE,
          {
            //from: _depositorAddress,
          }
        );

      //user 1 deposits 1000 DAI
      const amountDAItoDeposit = await convertToCurrencyDecimals(
        _daiAddress,
        "1000"
      );

      await _lendingPoolInstance
        .connect(_depositorAddress.signer)
        .deposit(_daiAddress, amountDAItoDeposit, "0", {
          // from: _depositorAddress,
        });

      //user 2 deposits 1 ETH
      const amountETHtoDeposit = await convertToCurrencyDecimals(
        ETHEREUM_ADDRESS,
        "1"
      );

      await _lendingPoolInstance
        .connect(_borrowerAddress.signer)
        .deposit(ETHEREUM_ADDRESS, amountETHtoDeposit, "0", {
          // from: _borrowerAddress,
          value: amountETHtoDeposit,
        });

      //user 2 borrows

      const userGlobalData: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );
      const daiPrice = new BigNumber(
        (await _priceOracleInstance.getAssetPrice(_daiAddress)).toString()
      );

      const amountDAIToBorrow = await convertToCurrencyDecimals(
        _daiAddress,
        new BigNumber(userGlobalData.availableBorrowsBNB.toString())
          .div(daiPrice)
          .multipliedBy(0.95)
          .toFixed(0)
      );

      await _lendingPoolInstance
        .connect(_borrowerAddress.signer)
        .borrow(_daiAddress, amountDAIToBorrow, RATEMODE_VARIABLE, "0", {
          //from: _borrowerAddress,
        });

      const userGlobalDataAfter: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      expect(
        userGlobalDataAfter.currentLiquidationThreshold.toString()
      ).to.be.bignumber.equal("80", "Invalid liquidation threshold");
    });

    it("LIQUIDATION - Drop the health factor below 1", async () => {
      const { users } = testEnv;
      const _borrowerAddress = users[2];

      const daiPrice = await _priceOracleInstance.getAssetPrice(_daiAddress);

      //halving the price of ETH - means doubling the DAIETH exchange rate

      const userGlobalDataBefore: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      await _priceOracleInstance.setAssetPrice(
        _daiAddress,
        new BigNumber(daiPrice.toString()).multipliedBy(1.15).toFixed(0)
      );

      const userGlobalData: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      expect(userGlobalData.healthFactor.toString()).to.be.bignumber.lt(
        oneEther.toFixed(0),
        "Invalid health factor"
      );
    });

    it("LIQUIDATION - Liquidates the borrow", async () => {
      const { dai: daiInstance } = testEnv;
      const { users, deployer } = testEnv;
      const _borrowerAddress = users[2];
      //mints dai to the caller

      await daiInstance.mint(
        await convertToCurrencyDecimals(daiInstance.address, "1000")
      );

      //approve protocol to access depositor wallet
      await daiInstance.approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE
      );

      const daiPrice = await _priceOracleInstance.getAssetPrice(_daiAddress);

      const userReserveDataBefore: any = await _lendingPoolInstance.getUserReserveData(
        _daiAddress,
        _borrowerAddress.address
      );

      const daiReserveDataBefore = await _lendingPoolInstance.getReserveData(
        _daiAddress
      );

      const amountToLiquidate = new BigNumber(
        userReserveDataBefore.currentBorrowBalance.toString()
      )
        .div(2)
        .toFixed(0);

      await _lendingPoolInstance.liquidationCall(
        ETHEREUM_ADDRESS,
        _daiAddress,
        _borrowerAddress.address,
        amountToLiquidate,
        false
      );

      const userReserveDataAfter: any = await _lendingPoolInstance.getUserReserveData(
        _daiAddress,
        _borrowerAddress.address
      );

      const liquidatorReserveData: any = await _lendingPoolInstance.getUserReserveData(
        ETHEREUM_ADDRESS,
        deployer.address
      );

      // const feeAddress = await _lendingPoolAddressesProviderInstance.getTokenDistributor();

      // const feeAddressBalance = await web3.eth.getBalance(feeAddress);

      expect(userReserveDataAfter.originationFee.toString()).eq(
        "0",
        "Origination fee should be repaid"
      );

      //expect(feeAddressBalance.toString()).to.be.bignumber.gt("0");

      expect(
        userReserveDataAfter.principalBorrowBalance.toString()
      ).to.be.bignumber.almostEqual(
        new BigNumber(userReserveDataBefore.currentBorrowBalance.toString())
          .minus(amountToLiquidate)
          .toFixed(0),
        "Invalid user borrow balance after liquidation"
      );
    });
  }
);
