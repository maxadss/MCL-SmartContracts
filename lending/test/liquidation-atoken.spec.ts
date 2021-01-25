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
import { waitForTx } from "../helpers/misc-utils";
import {
  LendingPool,
  LendingPoolAddressesProvider,
  LendingPoolCore,
  PriceOracle,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

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
  "LendingPool liquidation - liquidator receiving mToken",
  (testEnv: TestEnv) => {
    let _lendingPoolInstance: LendingPool;
    let _lendingPoolCoreInstance: LendingPoolCore;
    let _lendingPoolAddressesProviderInstance: LendingPoolAddressesProvider;
    let _priceOracleInstance: PriceOracle;
    // let _mTokenInstances: ImTokenInstances;
    // let _tokenInstances: ITokenInstances;

    //let _daiAddress: string;

    //let _reservesParams: IReservesParams;

    // let _depositorAddress: string;
    // let _borrowerAddress: string;

    let _initialDepositorETHBalance: string;

    const halfEther = (0.5 * Math.pow(10, 18)).toString();

    before("Initializing LendingPool test variables", async () => {
      //_reservesParams = await getReservesParams();
      _lendingPoolInstance = testEnv.pool;
      _lendingPoolCoreInstance = testEnv.core;
      _priceOracleInstance = testEnv.oracle;
      //_mTokenInstances = mTokenInstances;
      _lendingPoolAddressesProviderInstance = testEnv.addressesProvider;
      //_tokenInstances = await getAllTokenInstances();
      //_daiAddress = testEnv.dai.address;
      // _depositorAddress = await getFirstDepositorAddressOnTests();
      // _borrowerAddress = await getFirstBorrowerAddressOnTests();

      _initialDepositorETHBalance = await web3.eth.getBalance(
        testEnv.users[1].address
      );
    });

    it("LIQUIDATION - Deposits ETH, borrows DAI/Check liquidation fails because health factor is above 1", async () => {
      const { dai, users } = testEnv;

      const _depositorAddress = users[1];
      const _borrowerAddress = users[2];
      //mints DAI to depositor
      await dai
        .connect(_depositorAddress.signer)
        .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
          //from: _depositorAddress,
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
        dai.address,
        "1000"
      );

      await _lendingPoolInstance
        .connect(_depositorAddress.signer)
        .deposit(dai.address, amountDAItoDeposit, "0", {
          // from: _depositorAddress,
        });

      // const userGlobalDataUser1 = await _lendingPoolInstance.getUserReserveData(dai.address,
      //   _depositorAddress.address
      //   );

      // console.log("currentMTokenBalance");
      // console.log(userGlobalDataUser1.currentMTokenBalance.toString());

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

      const userGlobalData = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );
      const daiPrice = await _priceOracleInstance.getAssetPrice(dai.address);

      const amountDAIToBorrow = await convertToCurrencyDecimals(
        dai.address,
        new BigNumber(userGlobalData.availableBorrowsBNB.toString())
          .div(daiPrice.toString())
          .multipliedBy(0.95)
          .toFixed(0)
      );
      await _lendingPoolInstance
        .connect(_borrowerAddress.signer)
        .borrow(
          dai.address,
          amountDAIToBorrow.toString(),
          RATEMODE_VARIABLE,
          "0",
          {
            // from: _borrowerAddress,
          }
        );
      const userGlobalDataAfter = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      console.log("userGlobalDataAfter");
      console.log(userGlobalDataAfter);

      expect(
        userGlobalDataAfter.currentLiquidationThreshold.toString()
      ).to.be.bignumber.equal("80", "Invalid liquidation threshold");
      //user 2 tries to borrow
      // await expectRevert(
      //   _lendingPoolInstance.liquidationCall(
      //     ETHEREUM_ADDRESS,
      //     _daiAddress,
      //     _borrowerAddress.address,
      //     amountDAIToBorrow.toString(),
      //     true
      //   ),
      //   "Health factor is not below the threshold"
      // );
    });

    it("LIQUIDATION - Drop the health factor below 1", async () => {
      const { dai, users } = testEnv;
      const daiPrice = await _priceOracleInstance.getAssetPrice(dai.address);

      //halving the price of ETH - means doubling the DAIETH exchange rate

      const _borrowerAddress = users[2];
      const userGlobalDataBefore: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      await _priceOracleInstance.setAssetPrice(
        dai.address,
        new BigNumber(daiPrice.toString()).multipliedBy(1.3).toFixed(0)
      );

      const userGlobalData: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      expect(userGlobalData.healthFactor.toString()).to.be.bignumber.lt(
        oneEther.toFixed(0),
        "Invalid health factor"
      );
    });

    // it("LIQUIDATION - Tries to liquidate a different currency than the loan principal", async () => {
    //   const { users } = testEnv;
    //   const _borrowerAddress = users[2];
    //   //user 2 tries to borrow
    //   await expectRevert(
    //     _lendingPoolInstance.liquidationCall(
    //       ETHEREUM_ADDRESS,
    //       ETHEREUM_ADDRESS,
    //       _borrowerAddress.address,
    //       oneEther.toString(),
    //       true
    //     ),
    //     "User did not borrow the specified currency"
    //   );
    // });

    // it("LIQUIDATION - Tries to liquidate a different collateral than the borrower collateral", async () => {
    //   const { users, dai } = testEnv;
    //   const _borrowerAddress = users[2];
    //   //user 2 tries to borrow
    //   await expectRevert(
    //     _lendingPoolInstance.liquidationCall(
    //       dai.address,
    //       dai.address,
    //       _borrowerAddress.address,
    //       oneEther.toString(),
    //       true
    //     ),
    //     "Invalid collateral to liquidate"
    //   );
    // });

    it("LIQUIDATION1 - Liquidates the borrow", async () => {
      const { users, dai, deployer } = testEnv;
      const _borrowerAddress = users[2];

      //mints dai to the caller

      await dai
        .connect(deployer.signer)
        .mint(await convertToCurrencyDecimals(dai.address, "1000"));

      //approve protocol to access depositor wallet
      await dai
        .connect(deployer.signer)
        .approve(
          _lendingPoolCoreInstance.address,
          APPROVAL_AMOUNT_LENDING_POOL_CORE
        );

      const daiPrice = await _priceOracleInstance.getAssetPrice(dai.address);

      await _priceOracleInstance.setAssetPrice(
        dai.address,
        new BigNumber(daiPrice.toString()).multipliedBy(1.3).toFixed(0)
      );

      const userReserveDataBefore = await _lendingPoolInstance.getUserReserveData(
        dai.address,
        _borrowerAddress.address
      );

      //console.log("currentMTokenBalance ", userReserveDataBeforeeth.currentMTokenBalance.toString());
      const daiReserveDataBefore = await _lendingPoolInstance.getReserveData(
        dai.address
      );

      const amountToLiquidate = new BigNumber(
        userReserveDataBefore.currentBorrowBalance.toString()
      )
        .div(3)
        .toFixed(0);

      console.log("123456");
      console.log(
        "userReserveDataBefore.currentBorrowBalance ",
        userReserveDataBefore.currentBorrowBalance.toString()
      );
      console.log("amountToLiquidate ", amountToLiquidate.toString());

      const r = await _lendingPoolInstance
        .connect(deployer.signer)
        .liquidationCall(
          ETHEREUM_ADDRESS,
          dai.address,
          _borrowerAddress.address,
          amountToLiquidate.toString(),
          false
        );

      console.log(r);

      console.log("1234568");
      const userReserveDataAfter: any = await _lendingPoolInstance.getUserReserveData(
        dai.address,
        _borrowerAddress.address
      );

      const userGlobalDataAfter: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      const liquidatorData: any = await _lendingPoolInstance.getUserReserveData(
        ETHEREUM_ADDRESS,
        deployer.address
      );

      const daiReserveDataAfter: any = await _lendingPoolInstance.getReserveData(
        dai.address
      );

      //const feeAddress = await _lendingPoolAddressesProviderInstance.getTokenDistributor();

      //const feeAddressBalance = await web3.eth.getBalance(feeAddress);

      expect(userGlobalDataAfter.healthFactor.toString()).to.be.bignumber.gt(
        oneEther.toFixed(0),
        "Invalid health factor"
      );

      expect(userReserveDataAfter.originationFee.toString()).to.be.bignumber.eq(
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
